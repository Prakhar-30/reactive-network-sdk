# Reactive Contracts SDK User Guide

This guide walks you through the process of using the Reactive Contracts SDK to create, customize, and deploy reactive smart contracts for the Reactive Network.

## Table of Contents

1. [Installation](#installation)
2. [Project Setup](#project-setup)
3. [Creating a Reactive Contract](#creating-a-reactive-contract)
4. [Common Use Cases](#common-use-cases)
5. [Advanced Configuration](#advanced-configuration)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installing the SDK

```bash
# Using npm
npm install reactive-contracts-sdk

# Using yarn
yarn add reactive-contracts-sdk
```

## Project Setup

Create a new directory for your project and initialize it:

```bash
mkdir my-reactive-contract
cd my-reactive-contract
npm init -y
```

Create a JavaScript file (e.g., `generate.js`) to use the SDK:

```javascript
const { ReactiveContractsSDK } = require('reactive-contracts-sdk');

// Create an instance of the SDK
const sdk = new ReactiveContractsSDK();

// Your code will go here
```

## Creating a Reactive Contract

### Basic Example - Token Bridge

Here's an example of creating a reactive contract for a token bridge:

```javascript
// Configure your reactive contract
const config = {
  contractName: 'TokenBridgeReactive',
  originChainId: 11155111, // Sepolia
  destinationChainId: 5318008, // Kopli
  originContract: '0x1234567890123456789012345678901234567890', // Your token bridge contract on Sepolia
  destinationContract: '0x0987654321098765432109876543210987654321', // Your token mint contract on Kopli
  eventSignature: 'TokensBridged(address indexed sender, address indexed token, uint256 indexed amount)',
  callbackFunction: 'mintTokens(address origin, address recipient, address token, uint256 amount)',
  callbackGasLimit: 3000000
};

// Generate the contract
const tokenBridgeContract = sdk.generateContract(config);
```

### Cross-Chain Record Updating

```javascript
const config = {
  contractName: 'RecordUpdateReactive',
  originChainId: 11155111, // Sepolia
  destinationChainId: 5318008, // Kopli
  originContract: '0x1234567890123456789012345678901234567890',
  destinationContract: '0x0987654321098765432109876543210987654321',
  eventSignature: 'RecordCreated(address indexed creator, bytes32 indexed recordId, uint256 data)',
  callbackFunction: 'updateRecord(address origin, address creator, bytes32 recordId, uint256 data)',
  callbackArgumentMapping: [
    { type: 'static', value: 'address(0)' },
    { type: 'topic', index: 1, cast: 'address(uint160)' },
    { type: 'topic', index: 2 },
    { type: 'data', dataFormat: 'decoded', dataType: 'uint256' }
  ]
};
```

## Advanced Configuration

### Custom Event Topic Filtering

By default, reactive contracts subscribe to all events with a specific topic0 (event signature hash). You can add additional requirements to filter which events trigger callbacks:

```javascript
const config = {
  // Basic config...
  additionalConditions: [
    {
      expression: 'log.topic_3 > 1000',
      errorMessage: 'Amount too small'
    },
    {
      expression: 'address(uint160(log.topic_1)) != address(0)',
      errorMessage: 'Invalid sender address'
    }
  ]
};
```

### Custom Callback Argument Mapping

The SDK allows you to precisely map data from the emitted event to the callback function arguments:

```javascript
const callbackArgumentMapping = [
  // First argument is typically address(0) in reactive patterns
  { type: 'static', value: 'address(0)' },
  
  // Map the sender address from topic1
  { type: 'topic', index: 1, cast: 'address(uint160)' },
  
  // Map from unpacked event data
  { type: 'data', dataFormat: 'decoded', dataType: 'uint256' },
  
  // Use raw data bytes
  { type: 'data', dataFormat: 'raw' },
  
  // Static values
  { type: 'static', value: '1000' }
];
```

### Automatic Argument Mapping

The SDK can suggest argument mappings based on the event and callback signatures:

```javascript
const eventSignature = 'Transfer(address indexed from, address indexed to, uint256 value)';
const callbackFunction = 'processTransfer(address sender, address receiver, uint256 amount)';

const mapping = sdk.suggestArgumentMapping(eventSignature, callbackFunction);
console.log(mapping);
```

## Deployment

After generating your reactive contract, you'll need to deploy it to the Reactive Network (or Kopli testnet).

### Deploying with Foundry

If you exported your contract as a Forge project, follow these steps:

1. Navigate to the project directory:

```bash
cd ./projects/yourcontractname
```

2. Install dependencies:

```bash
forge install
```

3. Deploy to Kopli testnet:

```bash
forge create --rpc-url https://rpc.kopli.io \
  --private-key YOUR_PRIVATE_KEY \
  src/contracts/YourContractName.sol:YourContractName \
  --constructor-args ORIGIN_CONTRACT_ADDRESS DESTINATION_CONTRACT_ADDRESS
```

Replace `YOUR_PRIVATE_KEY`, `ORIGIN_CONTRACT_ADDRESS`, and `DESTINATION_CONTRACT_ADDRESS` with your values.

### Funding Your Reactive Contract

Reactive contracts need to be funded with the native token to pay for the cross-chain callbacks:

```solidity
// Send funds to your deployed reactive contract
(bool success,) = payable(REACTIVE_CONTRACT_ADDRESS).call{value: 1 ether}("");
require(success, "Transfer failed");
```

## Troubleshooting

### Common Issues

1. **Subscription Failed**: Check if your contract has enough funds to cover subscription costs.

2. **Event Not Detected**: Verify that the event signature and topic0 hash match exactly.

3. **Callback Not Executed**: Ensure the destination contract has the correct callback function and the reactive contract has enough funds.

4. **Gas Limit Errors**: Increase the callback gas limit if your callback function requires more gas.

### Debugging Tips

1. Monitor the `SubscriptionStatus` events emitted during contract deployment.

2. Use blockchain explorers to verify that your events are being emitted correctly.

3. Check the balance of your reactive contract to ensure it has enough funds.

4. Verify that the callback function signature exactly matches the one in your destination contract.

### Getting Help

For more information and support, visit the Reactive Network documentation or join the community forum.

---

This user guide should help you get started with the Reactive Contracts SDK. For more examples and advanced usage, check the `examples` directory in the SDK repository.

### Cross-Chain Withdrawals

```javascript
const config = {
  contractName: 'WithdrawalReactive',
  originChainId: 5318008, // Kopli
  destinationChainId: 11155111, // Sepolia
  originContract: '0x1234567890123456789012345678901234567890',
  destinationContract: '0x0987654321098765432109876543210987654321',
  eventSignature: 'TokensBurned(address indexed recipient, address indexed token, uint256 indexed amount)',
  callbackFunction: 'withdraw(address origin, address recipient, address token, uint256 amount)',
  callbackArgumentMapping: [
    { type: 'static', value: 'address(0)' },
    { type: 'topic', index: 1, cast: 'address(uint160)' },
    { type: 'topic', index: 2, cast: 'address(uint160)' },
    { type: 'topic', index: 3 }
  ]
};
```

// Generate the contract code
const contractCode = sdk.generateContract(config);
console.log(contractCode);

// Export the contract to a file
const filePath = sdk.exportContract(contractCode, config.contractName, './contracts');
console.log(`Contract exported to: ${filePath}`);

// Or export as a full Forge project that can be deployed
const projectPath = sdk.exportForgeProject(contractCode, config.contractName, './projects');
console.log(`Forge project created at: ${projectPath}`);
```

### Required Configuration Parameters

| Parameter | Description |
|-----------|-------------|
| `contractName` | Name of your reactive contract |
| `originChainId` | Chain ID where the events are emitted (e.g., Sepolia: 11155111) |
| `destinationChainId` | Chain ID where callbacks are executed (e.g., Kopli: 5318008) |
| `originContract` | Address of the contract emitting events |
| `destinationContract` | Address of the contract receiving callbacks |
| `eventSignature` | Signature of the event to listen for |
| `callbackFunction` | Signature of the function to call |

### Optional Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `callbackGasLimit` | Gas limit for callback execution | 3000000 |
| `additionalConditions` | Additional checks before triggering callbacks | [] |
| `callbackArgumentMapping` | Custom mapping of event data to callback arguments | [{ type: 'static', value: 'address(0)' }] |

## Common Use Cases

### Cross-Chain Token Bridge

```javascript
const config = {
  contractName: 'TokenBridgeReactive',
  originChainId: 11155111, // Sepolia
  destinationChainId: 5318008, // Kopli
  originContract: '0x1234567890123456789012345678901234567890',
  destinationContract: '0x0987654321098765432109876543210987654321',
  eventSignature: 'TokensLocked(address indexed sender, address indexed token, uint256 indexed amount)',
  callbackFunction: 'mintTokens(address origin, address recipient, address token, uint256 amount)',
  callbackArgumentMapping: [
    { type: 'static', value: 'address(0)' },
    { type: 'topic', index: 1, cast: 'address(uint160)' },
    { type: 'topic', index: 2, cast: 'address(uint160)' },
    { type: 'topic', index: 3 }
  ]
};