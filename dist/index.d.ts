import { ContractConfig, EventConfig } from './generator/contractGenerator';
import { CHAIN_IDS } from './validation/chainValidator';
import { ArgumentMapping as ContractArgumentMapping, Condition } from './templates/reactiveContractTemplate';
/**
 * Main SDK class for working with Reactive Smart Contracts
 */
declare class ReactiveContractsSDK {
    private generator;
    constructor();
    /**
     * Generates a reactive contract based on the provided configuration
     * @param config - Configuration object for the contract
     * @returns Generated contract code
     */
    generateContract(config: ContractConfig): string;
    /**
     * Creates a new event configuration object for use with multi-event contracts
     * @param eventSignature - Event signature to listen for
     * @param callbackFunction - Function to call when the event is detected
     * @param conditions - Optional conditions to evaluate before triggering callback
     * @param callbackArgumentMapping - Optional mapping of event arguments to callback arguments
     * @returns Event configuration object
     */
    createEventConfig(eventSignature: string, callbackFunction: string, conditions?: Condition[], callbackArgumentMapping?: ContractArgumentMapping[]): EventConfig;
    /**
     * Suggests argument mappings for a given event signature and callback function
     * @param eventSignature - The event signature to map from
     * @param callbackFunction - The callback function to map to
     * @returns Suggested argument mappings
     */
    suggestArgumentMapping(eventSignature: string, callbackFunction: string): ContractArgumentMapping[];
    /**
     * Generates the topic0 hash from an event signature
     * @param eventSignature - The event signature
     * @returns The topic0 hash with 0x prefix
     */
    getEventTopic0(eventSignature: string): string;
    /**
     * Returns a list of supported chain IDs
     * @returns Mapping of chain names to IDs
     */
    getSupportedChains(): typeof CHAIN_IDS;
    /**
     * Exports a generated contract to a file
     * @param contractCode - The contract code to export
     * @param contractName - The name of the contract
     * @param outputPath - Path to export the contract to
     * @returns The path to the exported file
     */
    exportContract(contractCode: string, contractName: string, outputPath?: string): string;
    /**
     * Creates a Forge project with the reactive contract
     * @param contractCode - The contract code
     * @param contractName - The name of the contract
     * @param outputPath - Path to create the project in
     * @returns The path to the project
     */
    exportForgeProject(contractCode: string, contractName: string, outputPath?: string): string;
    /**
     * Returns the contract as a JSON object
     * @param contractCode - The contract code
     * @param contractName - The name of the contract
     * @returns JSON representation of the contract
     */
    exportAsJson(contractCode: string, contractName: string): {
        name: string;
        code: string;
        timestamp: string;
    };
}
export { ReactiveContractsSDK, CHAIN_IDS, ContractConfig, EventConfig, ContractArgumentMapping as ArgumentMapping, Condition };
