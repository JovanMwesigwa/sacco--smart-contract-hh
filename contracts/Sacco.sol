// contracts/OurToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol';
import 'hardhat/console.sol';
// DYNAMIC WORKFLOW ---> // 1. Create a sacco group

// GENERAL WORK FLOW
// 1. Set join fee
// 2. Pay to join
// 3. Collect funds every week
// 4. Pay out a member every week according to their number

error NotEnoughEthEntered();
error Sacco__NotpaydayTime();
error Sacco__PayoutFailed();
error Sacco__UpkeepNotNeeded();
error Sacco__NotPermitted();
error Sacco__WrongFeeAmount();
error Sacco__MemberHasNotContributed();
error Sacco__AlreadyContributed();
error Sacco__RequestNotPermitted();

contract Sacco is KeeperCompatibleInterface {
    uint256 private immutable i_joinFee;
    address private i_admin;
    uint256 private s_balances;
    uint256 private s_membersCount;
    uint256 private immutable i_interval;

    address payable[] private s_members;
    mapping(address => uint256) private s_memberBalance;
    mapping(address => uint256) private s_memberNumber;
    uint256 private s_num_gettingPaid;

    // Sacco time base state
    uint256 private s_lastTimeStamp;

    // events
    event MemberPaidOut(address indexed user, uint256 indexed amount);
    event NewPlayerEntered(address indexed player);
    event Deposit(address indexed member, uint256 indexed amount);

    // Keepers verified addresses
    address private immutable i_KEEPERS_REGISTERY;

    // struct
    struct Member {
        uint256 memberNumber;
        address memberAddress;
        uint256 memberBalance;
        bool getsPaidNext;
        bool hasContributed;
    }

    Member[] private s_memberList;
    mapping(address => Member) private s_membersInfo;

    constructor(
        uint256 joinFee,
        uint256 interval,
        address keepersRegistryAddress
    ) {
        i_joinFee = joinFee;
        i_admin = msg.sender;
        s_balances = 0;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
        s_num_gettingPaid = 1;
        i_KEEPERS_REGISTERY = keepersRegistryAddress;
    }

    // Main functions
    function join() public payable {
        if (msg.value < i_joinFee) {
            revert NotEnoughEthEntered();
        }
        s_membersCount++;

        s_members.push(payable(msg.sender));

        // Update the balance
        s_memberBalance[msg.sender] += 0;
        s_memberNumber[msg.sender] = s_membersCount;
        // Set the balance
        s_balances += msg.value;

        s_memberList.push(
            Member(
                s_membersCount,
                msg.sender,
                s_memberBalance[msg.sender],
                false,
                true
            )
        );

        s_membersInfo[msg.sender] = Member(
            s_membersCount,
            msg.sender,
            s_memberBalance[msg.sender],
            false,
            true
        );

        emit NewPlayerEntered(msg.sender);
    }

    function payoutMembers() external {
        // if (msg.sender != i_KEEPERS_REGISTERY) {
        //     revert Sacco__RequestNotPermitted();
        // }

        bool hasMembers = (s_membersCount > 0);
        bool hasBalance = (s_balances > 0);
        bool upkeepNeeded = (hasBalance && hasMembers);

        if (!upkeepNeeded) {
            revert Sacco__UpkeepNotNeeded();
        }

        s_lastTimeStamp = block.timestamp;

        if (s_num_gettingPaid > s_membersCount) {
            s_num_gettingPaid = 1;
        }

        uint256 currentContractBal_ = address(this).balance;

        // Pay out users
        for (uint256 i = 0; i < s_members.length; i++) {
            // Get every member number
            address payable memberAddress = s_members[i];
            // Get the user getting paid address
            address payable memberGettingPaidAddress = s_members[
                s_num_gettingPaid - 1
            ];

            if (memberAddress == memberGettingPaidAddress) {
                // Verify to see if the member has contributed lately

                bool contributed = s_membersInfo[memberAddress].hasContributed;

                // If the user has not contirbuted recently we skip him from getting the payout
                if (contributed) {
                    // revert Sacco__MemberHasNotContributed();

                    // pay the user
                    (bool success, ) = memberGettingPaidAddress.call{
                        value: address(this).balance
                    }('');

                    if (!success) {
                        revert Sacco__PayoutFailed();
                    }

                    // Update the member balance in the contract
                    s_memberBalance[
                        memberGettingPaidAddress
                    ] += currentContractBal_;

                    s_membersInfo[msg.sender]
                        .memberBalance = currentContractBal_;

                    // Update the  balance in the contract
                    uint256 contractBal_ = address(this).balance;
                    s_balances = contractBal_;

                    emit MemberPaidOut(memberAddress, currentContractBal_);
                }
            }

            // reset all members contributed status to false after payout
            s_membersInfo[memberAddress].hasContributed = false;
        }

        s_num_gettingPaid++;

        if (s_num_gettingPaid > s_membersCount) {
            s_num_gettingPaid = 1;
        }
    }

    receive() external payable {
        if (msg.value != i_joinFee) {
            revert Sacco__WrongFeeAmount();
        }

        bool contributed = s_membersInfo[msg.sender].hasContributed;

        if (contributed) {
            revert Sacco__AlreadyContributed();
        }

        s_membersInfo[msg.sender].hasContributed = true;
        s_balances += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    fallback() external payable {}

    function clearSacco() public {
        if (msg.sender != i_admin) {
            revert Sacco__NotPermitted();
        }

        s_membersCount = 0;
        delete s_members;
        delete s_memberList;
        s_num_gettingPaid = 1;
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool hasMembers = (s_membersCount > 0);
        bool hasBalance = (s_balances > 0);
        bool weekPassed = (block.timestamp - s_lastTimeStamp) > i_interval;
        upkeepNeeded = (weekPassed && hasBalance && hasMembers);
        return (upkeepNeeded, '0x0');
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep(' ');
        if (!upkeepNeeded) {
            revert Sacco__NotpaydayTime();
        }

        s_lastTimeStamp = block.timestamp;

        if (s_num_gettingPaid > s_membersCount) {
            s_num_gettingPaid = 0;
        }

        uint256 currentContractBal_ = address(this).balance;

        // Pay out users
        for (uint256 i = 0; i < s_members.length; i++) {
            // Get every member number
            address payable memberAddress = s_members[i];
            // Get the user getting paid address
            address payable memberGettingPaidAddress = s_members[
                s_num_gettingPaid
            ];

            // console.log(memberGettingPaidAddress);
            if (memberAddress == memberGettingPaidAddress) {
                // pay the user
                (bool success, ) = memberGettingPaidAddress.call{
                    value: address(this).balance
                }('');

                if (!success) {
                    revert Sacco__PayoutFailed();
                }

                // Update the member balance in the contract
                s_memberBalance[
                    memberGettingPaidAddress
                ] += currentContractBal_;

                // Update the  balance in the contract
                uint256 contractBal_ = address(this).balance;
                s_balances = contractBal_;

                emit MemberPaidOut(memberAddress, currentContractBal_);
            }
        }

        s_num_gettingPaid++;
    }

    // Pure function
    function getNextPaid() public view returns (address) {
        return s_members[s_num_gettingPaid];
    }

    function getMemberIndex(uint256 index_) public view returns (address) {
        return s_members[index_];
    }

    function getNumberGettingPaid() public view returns (uint256) {
        return s_num_gettingPaid;
    }

    function getMemberBalance(address memberAddress)
        public
        view
        returns (uint256)
    {
        return s_memberBalance[memberAddress];
    }

    function getMemberNumber(address memberAddress)
        public
        view
        returns (uint256)
    {
        return s_memberNumber[memberAddress];
    }

    function getAdmin() public view returns (address) {
        return i_admin;
    }

    function getMemberCount() public view returns (uint256) {
        return s_membersCount;
    }

    function getBalance() public view returns (uint256) {
        return s_balances;
    }

    function getJoinFee() public view returns (uint256) {
        return i_joinFee;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getLastTimestamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getMembersList() public view returns (Member[] memory) {
        return s_memberList;
    }

    function getMembersDetails(address memberAddress_)
        public
        view
        returns (Member memory)
    {
        return s_membersInfo[memberAddress_];
    }
}
