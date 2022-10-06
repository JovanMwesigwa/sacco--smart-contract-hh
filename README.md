# Sacco smart (Savings) contract

This is a self automated user pay out contract that allows users to pay and enter the contract,
The contract will then collect weekly fees from each user, and payout each member respectively after every week..

### The smart contract
Using Solidity version 0.8.7 using ```@chainlink/contracts/KeeperCompatible``` to trigger the funds distribution after 30seconds

##### Note: Chainlink has since the updated the KeeperCompatible to AutomationCompatible although no breaking changes found

### Deploy and mocks
No mocks involed, just deploy with ```npx hardhat deploy```

### Unit Test
Run your test with ```npx hardhat test``` 

In-order to jump to a specific test, use ```npx hardhat test --grep "<Enter the test title here>"```

Try running some of the following tasks:
### This contract

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
