/**
 * Basic example of using the Reactive Contracts SDK
 */

const { ReactiveContractsSDK } = require('../src/index');

// Create an instance of the SDK
const sdk = new ReactiveContractsSDK();

// Configure a cross-chain token bridge reactive contract
const config = {
  contractName: 'TokenBridgeReactive',
  originChainId: 11155111, // Sepolia
  destinationChainId: 5318008, // Kopli
  originContract: '0x1234567890123456789012345678901234567890',
  destinationContract: '0x0987654321098765432109876543210987654321',
  eventSignature: 'TokensBridged(address indexed sender, address indexed token, uint256 indexed amount)',
  callbackFunction: 'mintTokens(address origin, address recipient, address token, uint256 amount)',
  callbackGasLimit: 3000000,
  additionalConditions: [
    {
      expression: 'log.topic_3 > 0',
      errorMessage: 'Amount must be greater than 0'
    }
  ],
  callbackArgumentMapping: [
    { type: 'static', value: 'address(0)' },
    { type: 'topic', index: 1, cast: 'address(uint160)' },
    { type: 'topic', index: 2, cast: 'address(uint160)' },
    { type: 'topic', index: 3 }
  ]
};

// Generate the contract code
const contractCode = sdk.generateContract(config);
console.log('Generated contract code:');
console.log('------------------------');
console.log(contractCode);
console.log('------------------------');

// Export the contract to a file
const outputPath = './output';
const filePath = sdk.exportContract(contractCode, config.contractName, outputPath);
console.log(`Contract exported to: ${filePath}`);

// Export as a Forge project
const projectPath = sdk.exportForgeProject(contractCode, config.contractName, outputPath);
console.log(`Forge project created at: ${projectPath}`);

// Get the topic0 hash for the event
const topic0 = sdk.getEventTopic0(config.eventSignature);
console.log(`Event topic0 hash: ${topic0}`);

// Show an example of automatic argument mapping
const eventSig = 'Transfer(address indexed from, address indexed to, uint256 value)';
const callbackSig = 'processTransfer(address sender, address receiver, uint256 amount)';

console.log('\nAutomatic argument mapping example:');
console.log('----------------------------------');
console.log(`Event: ${eventSig}`);
console.log(`Callback: ${callbackSig}`);
const mapping = sdk.suggestArgumentMapping(eventSig, callbackSig);
console.log('Suggested mapping:');
console.log(JSON.stringify(mapping, null, 2));