import { ReactiveContractGenerator, ContractConfig, EventConfig } from './generator/contractGenerator';
import { CHAIN_IDS } from './validation/chainValidator';
import { generateTopic0 } from './validation/signatureValidator';
import { exportContract, exportForgeProject, exportAsJson } from './utils/exportHelper';
import { suggestArgumentMapping } from './utils/eventHelper';
import { 
  ArgumentMapping as ContractArgumentMapping, 
  Condition 
} from './templates/reactiveContractTemplate';

/**
 * Main SDK class for working with Reactive Smart Contracts
 */
class ReactiveContractsSDK {
  private generator: ReactiveContractGenerator;

  constructor() {
    this.generator = new ReactiveContractGenerator();
  }
  
  /**
   * Generates a reactive contract based on the provided configuration
   * @param config - Configuration object for the contract
   * @returns Generated contract code
   */
  generateContract(config: ContractConfig): string {
    return this.generator.generateContract(config);
  }
  
  /**
   * Creates a new event configuration object for use with multi-event contracts
   * @param eventSignature - Event signature to listen for
   * @param callbackFunction - Function to call when the event is detected
   * @param conditions - Optional conditions to evaluate before triggering callback
   * @param callbackArgumentMapping - Optional mapping of event arguments to callback arguments
   * @returns Event configuration object
   */
  createEventConfig(
    eventSignature: string, 
    callbackFunction: string, 
    conditions: Condition[] = [], 
    callbackArgumentMapping: ContractArgumentMapping[] = []
  ): EventConfig {
    // If no callback argument mapping provided, try to auto-suggest one
    const mappings = callbackArgumentMapping.length === 0 ? 
      suggestArgumentMapping(eventSignature, callbackFunction) as ContractArgumentMapping[] : 
      callbackArgumentMapping;
    
    return {
      eventName: eventSignature.substring(0, eventSignature.indexOf('(')),
      eventSignature,
      callbackFunction,
      conditions,
      callbackArgumentMapping: mappings
    };
  }
  
  /**
   * Suggests argument mappings for a given event signature and callback function
   * @param eventSignature - The event signature to map from
   * @param callbackFunction - The callback function to map to
   * @returns Suggested argument mappings
   */
  suggestArgumentMapping(eventSignature: string, callbackFunction: string): ContractArgumentMapping[] {
    return suggestArgumentMapping(eventSignature, callbackFunction) as ContractArgumentMapping[];
  }
  
  /**
   * Generates the topic0 hash from an event signature
   * @param eventSignature - The event signature
   * @returns The topic0 hash with 0x prefix
   */
  getEventTopic0(eventSignature: string): string {
    return generateTopic0(eventSignature);
  }
  
  /**
   * Returns a list of supported chain IDs
   * @returns Mapping of chain names to IDs
   */
  getSupportedChains(): typeof CHAIN_IDS {
    return CHAIN_IDS;
  }
  
  /**
   * Exports a generated contract to a file
   * @param contractCode - The contract code to export
   * @param contractName - The name of the contract
   * @param outputPath - Path to export the contract to
   * @returns The path to the exported file
   */
  exportContract(contractCode: string, contractName: string, outputPath: string = './contracts'): string {
    return exportContract(contractCode, contractName, outputPath);
  }
  
  /**
   * Creates a Forge project with the reactive contract
   * @param contractCode - The contract code
   * @param contractName - The name of the contract
   * @param outputPath - Path to create the project in
   * @returns The path to the project
   */
  exportForgeProject(contractCode: string, contractName: string, outputPath: string = './projects'): string {
    return exportForgeProject(contractCode, contractName, outputPath);
  }
  
  /**
   * Returns the contract as a JSON object
   * @param contractCode - The contract code
   * @param contractName - The name of the contract
   * @returns JSON representation of the contract
   */
  exportAsJson(contractCode: string, contractName: string): { name: string; code: string; timestamp: string } {
    return exportAsJson(contractCode, contractName);
  }
}

export {
  ReactiveContractsSDK,
  CHAIN_IDS,
  ContractConfig,
  EventConfig,
  ContractArgumentMapping as ArgumentMapping,
  Condition
};