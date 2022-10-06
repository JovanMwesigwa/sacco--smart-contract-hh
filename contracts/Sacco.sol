// contracts/OurToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol';

// DYNAMIC WORKFLOW ---> // 1. Create a sacco group

// GENERAL WORK FLOW
// 1. Set join fee
// 2. Pay to join
// 3. Collect funds every week
// 4. Pay out a member every week according to their number

error NotEnoughEthEntered();
error Sacco__NotpaydayTime();
error Sacco__PayoutFailed();

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
    event Payout(address indexed user, uint256 indexed amount);
    event NewPlayerEntered(address indexed player);

    constructor(uint256 joinFee, uint256 interval) {
        i_joinFee = joinFee;
        i_admin = msg.sender;
        s_balances = 0;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
        s_num_gettingPaid = 0;
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

        emit NewPlayerEntered(msg.sender);
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
        bool weekPassed = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasMembers = (s_membersCount > 0);
        bool hasBalance = (s_balances > 0);
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

        // Pay out users
        for (uint256 i = 0; i < s_members.length; i++) {
            // Get every member number
            address memberAddress = s_members[i];
            // Get the user getting paid address
            address memberGettingPaidAddress = s_members[s_num_gettingPaid];

            if (memberAddress == memberGettingPaidAddress) {
                // pay the user
                (bool success, ) = memberAddress.call{
                    value: address(this).balance
                }('');

                if (!success) {
                    revert Sacco__PayoutFailed();
                }

                // emit Payout(memberAddress, address(this).balance);
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
}
