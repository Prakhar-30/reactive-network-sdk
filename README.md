# Reactive Contracts SDK

A TypeScript SDK for creating, customizing and deploying Reactive Smart Contracts for the Reactive Network.

[![npm version](https://img.shields.io/npm/v/reactive-contracts-sdk.svg)](https://www.npmjs.com/package/reactive-contracts-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Reactive Network enables cross-chain communication through reactive smart contracts that listen for events on one chain and trigger callbacks on another chain. This SDK simplifies the process of creating reactive smart contracts by providing tools to generate contract code based on configuration parameters.

## New Features in v0.2.0

- **Multiple Events Support**: Listen to multiple events with a single contract
- **Conditional Event Handling**: Add conditions to filter which events trigger callbacks
- **Event-to-Function Mapping**: Map different events to different callback functions

## Installation

```bash
npm install reactive-contracts-sdk
```

## Usage

### Basic Example (Single Event)

```typescript
import { ReactiveContractsSDK } from 'reactive-contracts-sdk';

// Create an instance of the SDK
const sdk = new ReactiveContractsSDK();

// Configure your reactive contract
const config = {
  contractName: 'MyReactiveContract',
  originChainId: 11155111, // Sepolia
  destinationChainId: 5318008, // Kopli
  originContract: '0x1234567890123456789012345678901234567890',
  destinationContract: '0x0987654321098765432109876543210987654321',
  eventSignature: 'TokensDeposited(address,bytes32,uint256)',
  callbackFunction: 'completeSwap(address,bytes32)',
  additionalConditions: [
    {
      expression: 'log.topic_3 > 0',
      errorMessage: 'Amount must be greater than 0'
    }
  ],
  callbackArgumentMapping: [
    { type: 'static', value: 'address(0)' },
    { type: 'topic', index: 1 }
  ]
};

// Generate the contract code
const contractCode = sdk.generateContract(config);
console.log(contractCode);

// Export the contract to a file
const filePath = sdk.exportContract(contractCode, config.contractName);
console.log(`Contract exported to: ${filePath}`);

// Or export as a full Forge project
const projectPath = sdk.exportForgeProject(contractCode, config.contractName);
console.log(`Forge project created at: ${projectPath}`);
```

### Advanced Example (Multiple Events)

```typescript
import { ReactiveContractsSDK } from 'reactive-contracts-sdk';

const sdk = new ReactiveContractsSDK();

// Create event configurations
const depositEvent = sdk.createEventConfig(
  'Deposit(address indexed sender, uint256 indexed amount)',
  'processDeposit(address origin, address sender, uint256 amount)',
  [
    { expression: 'log.topic_2 > 1 ether', errorMessage: 'Deposit too small' }
  ]
);

const withdrawEvent = sdk.createEventConfig(
  'Withdraw(address indexed receiver, uint256 indexed amount)',
  'processWithdraw(address origin, address receiver, uint256 amount)',
  [
    { expression: 'log.topic_2 <= 10 ether', errorMessage: 'Withdrawal too large' }
  ]
);

// Configure your multi-event reactive contract
const config = {
  contractName: 'BankingReactive',
  originChainId: 11155111, // Sepolia
  destinationChainId: 5318008, // Kopli
  originContract: '0x1234567890123456789012345678901234567890',
  destinationContract: '0x0987654321098765432109876543210987654321',
  events: [depositEvent, withdrawEvent],
  callbackGasLimit: 3000000
};

// Generate the contract
const contractCode = sdk.generateContract(config);
console.log('Contract generated successfully!');

// Export as a Forge project
const projectPath = sdk.exportForgeProject(contractCode, config.contractName, './projects');
console.log(`Forge project created at: ${projectPath}`);
```

### Getting Event Topic Hash

```typescript
import { ReactiveContractsSDK } from 'reactive-contracts-sdk';

const sdk = new ReactiveContractsSDK();
const eventSignature = 'Transfer(address,address,uint256)';
const topic0 = sdk.getEventTopic0(eventSignature);

console.log(`Event topic0 hash: ${topic0}`);
```

### Automatic Argument Mapping

```typescript
import { ReactiveContractsSDK } from 'reactive-contracts-sdk';

const sdk = new ReactiveContractsSDK();
const eventSignature = 'TokensDeposited(address indexed sender, bytes32 indexed id, uint256 amount)';
const callbackFunction = 'completeSwap(address sender, bytes32 id)';

const mapping = sdk.suggestArgumentMapping(eventSignature, callbackFunction);
console.log(mapping);
```

## Configuration Options

### Base Configuration

| Parameter | Type | Description |
|-----------|------|-------------|
| `contractName` | `string` | Name of the generated contract |
| `originChainId` | `number` | Chain ID where events are emitted |
| `destinationChainId` | `number` | Chain ID where callbacks are sent |
| `originContract` | `string` | Address of contract emitting events |
| `destinationContract` | `string` | Address of contract receiving callbacks |
| `callbackGasLimit` | `number` | (Optional) Gas limit for callbacks (default: 3000000) |

### Single Event Configuration (Legacy)

| Parameter | Type | Description |
|-----------|------|-------------|
| `eventSignature` | `string` | Event signature to listen for |
| `callbackFunction` | `string` | Function signature to call |
| `additionalConditions` | `array` | (Optional) Additional requirements for handling events |
| `callbackArgumentMapping` | `array` | (Optional) Mapping of event data to callback args |

### Multi-Event Configuration (New in v0.2.0)

| Parameter | Type | Description |
|-----------|------|-------------|
| `events` | `array` | Array of event configurations |

### Event Configuration Object

| Parameter | Type | Description |
|-----------|------|-------------|
| `eventName` | `string` | (Optional) Custom name for the event |
| `eventSignature` | `string` | Event signature to listen for |
| `callbackFunction` | `string` | Function signature to call |
| `conditions` | `array` | (Optional) Conditions to check before triggering callback |
| `callbackArgumentMapping` | `array` | (Optional) Mapping of event data to callback args |

## Callback Argument Mapping

The `callbackArgumentMapping` array defines how to map event data to callback function arguments:

- `{ type: 'static', value: 'address(0)' }` - Static value
- `{ type: 'topic', index: 1, cast: 'address' }` - Map from event topic
- `{ type: 'data', dataFormat: 'decoded', dataType: 'uint256' }` - Map from event data

## Conditions

The `conditions` array allows you to add filtering logic before triggering callbacks:

```typescript
[
  { 
    expression: 'log.topic_2 > 1 ether', 
    errorMessage: 'Amount too small' 
  },
  {
    expression: 'address(uint160(log.topic_1)) != address(0)',
    errorMessage: 'Invalid sender'
  }
]
```

## Supported Chains

The SDK includes constants for commonly used chain IDs:

```typescript
import { CHAIN_IDS } from 'reactive-contracts-sdk';

console.log(CHAIN_IDS.SEPOLIA); // 11155111
console.log(CHAIN_IDS.KOPLI);   // 5318008
```

## License

MIT