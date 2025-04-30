// test/generator.test.ts
import { ReactiveContractsSDK, ArgumentMapping, Condition } from '../src/index';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

describe('ReactiveContractsSDK', () => {
  let sdk: ReactiveContractsSDK;
  
  beforeEach(() => {
    sdk = new ReactiveContractsSDK();
  });
  
  describe('generateContract', () => {
    it('should generate a contract with valid config', () => {
      // Use the proper imported types
      const config = {
        contractName: 'TestContract',
        originChainId: 11155111,
        destinationChainId: 5318008,
        originContract: '0x1234567890123456789012345678901234567890',
        destinationContract: '0x0987654321098765432109876543210987654321',
        eventSignature: 'TestEvent(address,uint256)',
        callbackFunction: 'testCallback(address,uint256)',
        callbackGasLimit: 3000000
      };
      
      const contractCode = sdk.generateContract(config);
      
      // Check for expected content in the generated code
      expect(contractCode).toContain('contract TestContract is AbstractReactive');
      expect(contractCode).toContain('ORIGIN_CHAIN_ID = 11155111');
      expect(contractCode).toContain('DESTINATION_CHAIN_ID = 5318008');
      expect(contractCode).toContain('function react(LogRecord calldata log)');
      expect(contractCode).toContain('emit Callback(');
    });
    
    it('should throw an error with invalid config', () => {
      const config = {
        // Missing required fields
        contractName: 'TestContract'
      };
      
      expect(() => sdk.generateContract(config as any)).toThrow();
    });
    
    it('should handle additional conditions', () => {
      // Use imported Condition type
      const additionalConditions: Condition[] = [
        {
          expression: 'log.topic_1 != 0',
          errorMessage: 'Invalid address'
        }
      ];
      
      const config = {
        contractName: 'TestContract',
        originChainId: 11155111,
        destinationChainId: 5318008,
        originContract: '0x1234567890123456789012345678901234567890',
        destinationContract: '0x0987654321098765432109876543210987654321',
        eventSignature: 'TestEvent(address,uint256)',
        callbackFunction: 'testCallback(address,uint256)',
        additionalConditions
      };
      
      const contractCode = sdk.generateContract(config);
      
      // Check for the additional condition
      expect(contractCode).toContain('require(log.topic_1 != 0, "Invalid address")');
    });
    
    it('should handle callback argument mapping', () => {
      // Use imported ArgumentMapping type
      const callbackArgumentMapping: ArgumentMapping[] = [
        { type: 'static', value: 'address(0)' },
        { type: 'topic', index: 1, cast: 'address(uint160)' },
        { type: 'data', dataFormat: 'decoded', dataType: 'uint256' }
      ];
      
      const config = {
        contractName: 'TestContract',
        originChainId: 11155111,
        destinationChainId: 5318008,
        originContract: '0x1234567890123456789012345678901234567890',
        destinationContract: '0x0987654321098765432109876543210987654321',
        eventSignature: 'TestEvent(address indexed sender, uint256 amount)',
        callbackFunction: 'testCallback(address spender, address sender, uint256 amount)',
        callbackArgumentMapping
      };
      
      const contractCode = sdk.generateContract(config);
      
      // Check for the callback arguments
      expect(contractCode).toContain('address(0),');
      expect(contractCode).toContain('address(uint160)(log.topic_1)');
    });
  });
  
  describe('createEventConfig', () => {
    it('should create proper event configuration with spender parameter', () => {
      const eventSignature = 'Transfer(address indexed from, address indexed to, uint256 indexed value)';
      const callbackFunction = 'handleTransfer(address spender, address from, address to, uint256 value)';
      
      const eventConfig = sdk.createEventConfig(eventSignature, callbackFunction);
      
      // Basic validation
      expect(eventConfig).toBeDefined();
      expect(eventConfig.eventSignature).toBe(eventSignature);
      expect(eventConfig.callbackFunction).toBe(callbackFunction);
      expect(eventConfig.callbackArgumentMapping).toBeDefined();
      
      // First parameter should be static address(0)
      if (eventConfig.callbackArgumentMapping && eventConfig.callbackArgumentMapping.length > 0) {
        const firstArg = eventConfig.callbackArgumentMapping[0];
        if (firstArg && typeof firstArg === 'object' && 'type' in firstArg) {
          expect(firstArg.type).toBe('static');
          if (firstArg.type === 'static' && 'value' in firstArg) {
            expect(firstArg.value).toBe('address(0)');
          }
        }
      }
    });
  });
  
  describe('getEventTopic0', () => {
    it('should generate the correct topic0 hash', () => {
      const eventSignature = 'Transfer(address,address,uint256)';
      const topic0 = sdk.getEventTopic0(eventSignature);
      
      // Known hash for the Transfer event
      expect(topic0).toEqual('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');
    });
    
    it('should throw an error with invalid event signature', () => {
      const eventSignature = 'InvalidSignature';
      
      expect(() => sdk.getEventTopic0(eventSignature)).toThrow();
    });
  });
});