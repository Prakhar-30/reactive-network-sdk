/**
 * Contract generator for Reactive Smart Contracts
 */

import { validateAndFormatAddress } from '../validation/addressValidator';
import { validateAndFormatChainId, isSupportedChain } from '../validation/chainValidator';
import { 
  validateAndFormatEventSignature, 
  validateAndFormatFunctionSignature,
  generateTopic0 as generateEventTopic0, 
  parseParameters 
} from '../validation/signatureValidator';
import { 
  generateReactiveContractTemplate, 
  EventConfiguration, 
  ArgumentMapping,
  Condition
} from '../templates/reactiveContractTemplate';

/**
 * Configuration interface for contract generation
 */
export interface ContractConfig {
  contractName: string;
  originChainId: number | string;
  destinationChainId: number | string;
  originContract: string;
  destinationContract: string;
  callbackGasLimit?: number;
  // Single event support (legacy)
  eventSignature?: string;
  callbackFunction?: string;
  additionalConditions?: Condition[];
  callbackArgumentMapping?: ArgumentMapping[];
  // Multi-event support
  events?: EventConfig[];
}

/**
 * Configuration for a single event
 */
export interface EventConfig {
  eventName?: string;
  eventSignature: string;
  callbackFunction: string;
  conditions?: Condition[];
  callbackArgumentMapping?: ArgumentMapping[];
}

/**
 * Main class for generating Reactive Smart Contracts
 */
export class ReactiveContractGenerator {
  /**
   * Creates a new Reactive Smart Contract based on the provided configuration
   * @param config - Configuration object for the contract
   * @returns Generated contract code
   */
  generateContract(config: ContractConfig): string {
    try {
      // Validate and normalize the configuration
      const validatedConfig = this._validateConfig(config);
      
      // Generate the contract from the template
      return generateReactiveContractTemplate(validatedConfig);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate contract: ${errorMessage}`);
    }
  }
  
  /**
   * Validates and normalizes the configuration object
   * @param config - The configuration object to validate
   * @returns Validated and normalized configuration
   * @private
   */
  private _validateConfig(config: ContractConfig): any {
    if (!config) {
      throw new Error('Configuration is required');
    }
    
    // Check required fields
    if (!config.contractName) {
      throw new Error('Contract name is required');
    }
    
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(config.contractName)) {
      throw new Error(`Invalid contract name: ${config.contractName}`);
    }
    
    // Validate chain IDs
    const originChainId = validateAndFormatChainId({ chainId: config.originChainId });
    const destinationChainId = validateAndFormatChainId({ chainId: config.destinationChainId });
    
    // Check if chains are supported
    if (!isSupportedChain(originChainId)) {
      console.warn(`Warning: Origin chain ID ${originChainId} may not be supported by Reactive Network`);
    }
    
    if (!isSupportedChain(destinationChainId)) {
      console.warn(`Warning: Destination chain ID ${destinationChainId} may not be supported by Reactive Network`);
    }
    
    // Validate contract addresses
    const originContract = validateAndFormatAddress(config.originContract, 'originContract');
    const destinationContract = validateAndFormatAddress(config.destinationContract, 'destinationContract');
    
    // Validate callback gas limit
    let callbackGasLimit = config.callbackGasLimit || 3000000;
    if (typeof callbackGasLimit !== 'number' || callbackGasLimit <= 0) {
      throw new Error(`Invalid callback gas limit: ${callbackGasLimit}`);
    }
    
    // Process event configurations
    let eventConfigurations: EventConfiguration[] = [];
    
    // Check if we're using the legacy single-event format or the new multi-event format
    if (config.eventSignature && config.callbackFunction) {
      // Legacy single event format
      const eventSignature = validateAndFormatEventSignature(config.eventSignature, 'eventSignature');
      const eventTopic0 = `0x${generateEventTopic0(eventSignature).substring(2)}`;
      const callbackFunction = validateAndFormatFunctionSignature(config.callbackFunction, 'callbackFunction');
      
      eventConfigurations.push({
        eventSignature,
        eventTopic0,
        callbackFunction,
        conditions: config.additionalConditions || [],
        callbackArgumentMapping: this._processCallbackArguments(
          config.callbackArgumentMapping || [],
          eventSignature,
          callbackFunction
        )
      });
    } else if (config.events && Array.isArray(config.events) && config.events.length > 0) {
      // New multi-event format
      eventConfigurations = config.events.map(eventConfig => {
        const eventSignature = validateAndFormatEventSignature(eventConfig.eventSignature, 'eventSignature');
        const eventTopic0 = `0x${generateEventTopic0(eventSignature).substring(2)}`;
        const callbackFunction = validateAndFormatFunctionSignature(eventConfig.callbackFunction, 'callbackFunction');
        
        return {
          eventName: eventConfig.eventName || extractEventName(eventSignature),
          eventSignature,
          eventTopic0,
          callbackFunction,
          conditions: eventConfig.conditions || [],
          callbackArgumentMapping: this._processCallbackArguments(
            eventConfig.callbackArgumentMapping || [],
            eventSignature,
            callbackFunction
          )
        };
      });
    } else {
      throw new Error('Either eventSignature + callbackFunction or events array must be provided');
    }
    
    // Return the validated configuration
    return {
      contractName: config.contractName,
      originChainId,
      destinationChainId,
      originContract,
      destinationContract,
      callbackGasLimit,
      eventConfigurations
    };
  }
  
  /**
   * Processes and validates callback argument mappings
   * @param mapping - The callback argument mapping array
   * @param eventSignature - The origin event signature
   * @param callbackFunction - The destination callback function signature
   * @returns Processed callback argument mapping
   * @private
   */
  private _processCallbackArguments(
    mapping: ArgumentMapping[],
    eventSignature: string,
    callbackFunction: string
  ): ArgumentMapping[] {
    // If no mapping is provided, create a default one with address(0)
    if (mapping.length === 0) {
      return [{
        type: 'static',
        value: 'address(0)'
      }];
    }
    
    // Validate each argument mapping
    return mapping.map((arg, index) => {
      if (!arg.type) {
        throw new Error(`Argument mapping at index ${index} is missing 'type'`);
      }
      
      switch (arg.type) {
        case 'static':
          if (!arg.value) {
            throw new Error(`Static argument at index ${index} is missing 'value'`);
          }
          return arg;
          
        case 'topic':
          if (arg.index === undefined || arg.index === null) {
            throw new Error(`Topic argument at index ${index} is missing 'index'`);
          }
          
          const topicIndex = Number(arg.index);
          if (isNaN(topicIndex) || topicIndex < 0 || topicIndex > 3) {
            throw new Error(`Invalid topic index at argument ${index}: ${arg.index}`);
          }
          
          return { ...arg, index: topicIndex };
          
        case 'data':
          // Validate data format
          if (!arg.dataFormat) {
            throw new Error(`Data argument at index ${index} is missing 'dataFormat'`);
          }
          
          if (arg.dataFormat === 'decoded' && !arg.dataType) {
            throw new Error(`Decoded data argument at index ${index} is missing 'dataType'`);
          }
          
          return arg;
          
        default:
          throw new Error(`Unknown argument type at index ${index}: ${(arg as any).type}`);
      }
    });
  }
}

/**
 * Extracts the event name from an event signature
 * @param signature Event signature
 * @returns Event name
 */
function extractEventName(signature: string): string {
  return signature.substring(0, signature.indexOf('('));
}