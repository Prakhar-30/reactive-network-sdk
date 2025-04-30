// test/multiEvent.test.ts
import { ReactiveContractsSDK } from '../src/index';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

describe('ReactiveContractsSDK Multi-Event Support', () => {
  let sdk: ReactiveContractsSDK;
  
  beforeEach(() => {
    sdk = new ReactiveContractsSDK();
  });
  
  describe('createEventConfig', () => {
    it('should create a valid event configuration', () => {
      const eventSignature = 'Deposit(address indexed sender, uint256 amount)';
      const callbackFunction = 'processDeposit(address origin, address sender, uint256 amount)';
      const conditions = [
        { expression: 'log.topic_2 > 1 ether', errorMessage: 'Deposit too small' }
      ];
      
      const eventConfig = sdk.createEventConfig(eventSignature, callbackFunction, conditions);
      
      expect(eventConfig).toBeDefined();
      expect(eventConfig.eventSignature).toBe(eventSignature);
      expect(eventConfig.callbackFunction).toBe(callbackFunction);
      expect(eventConfig.conditions).toEqual(conditions);
      expect(eventConfig.callbackArgumentMapping).toBeDefined();
    });
  });
  
  describe('generateContract with multiple events', () => {
    it('should generate a contract with multiple event handlers', () => {
      const depositEvent = sdk.createEventConfig(
        'Deposit(address indexed sender, uint256 indexed amount)',
        'processDeposit(address origin, address sender, uint256 amount)',
        [{ expression: 'log.topic_2 > 0', errorMessage: 'Amount must be greater than 0' }]
      );
      
      const withdrawEvent = sdk.createEventConfig(
        'Withdraw(address indexed receiver, uint256 amount)',
        'processWithdraw(address origin, address receiver, uint256 amount)'
      );
      
      const config = {
        contractName: 'MultiEventContract',
        originChainId: 11155111,
        destinationChainId: 5318008,
        originContract: '0x1234567890123456789012345678901234567890',
        destinationContract: '0x0987654321098765432109876543210987654321',
        events: [depositEvent, withdrawEvent]
      };
      
      const contractCode = sdk.generateContract(config);
      
      // Check for event handling code
      expect(contractCode).toContain('contract MultiEventContract is AbstractReactive');
      expect(contractCode).toContain('// Handle Deposit(address indexed sender, uint256 indexed amount) event');
      expect(contractCode).toContain('// Handle Withdraw(address indexed receiver, uint256 amount) event');
      expect(contractCode).toContain('require(log.topic_2 > 0, "Amount must be greater than 0")');
      expect(contractCode).toContain('TOPIC_DEPOSIT');
      expect(contractCode).toContain('TOPIC_WITHDRAW');
      expect(contractCode).toContain('emit SubscriptionStatus(true, "Deposit(address indexed sender, uint256 indexed amount)")');
    });
    
    it('should still support the legacy single event format', () => {
      const config = {
        contractName: 'LegacyContract',
        originChainId: 11155111,
        destinationChainId: 5318008,
        originContract: '0x1234567890123456789012345678901234567890',
        destinationContract: '0x0987654321098765432109876543210987654321',
        eventSignature: 'Transfer(address,address,uint256)',
        callbackFunction: 'handleTransfer(address,address,uint256)'
      };
      
      const contractCode = sdk.generateContract(config);
      
      expect(contractCode).toContain('contract LegacyContract is AbstractReactive');
      expect(contractCode).toContain('TOPIC_TRANSFER');
      expect(contractCode).toContain('handleTransfer(address,address,uint256)');
    });
  });
});