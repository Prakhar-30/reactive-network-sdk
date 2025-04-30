/**
 * Contract generator for Reactive Smart Contracts
 */
import { ArgumentMapping, Condition } from '../templates/reactiveContractTemplate';
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
    eventSignature?: string;
    callbackFunction?: string;
    additionalConditions?: Condition[];
    callbackArgumentMapping?: ArgumentMapping[];
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
export declare class ReactiveContractGenerator {
    /**
     * Creates a new Reactive Smart Contract based on the provided configuration
     * @param config - Configuration object for the contract
     * @returns Generated contract code
     */
    generateContract(config: ContractConfig): string;
    /**
     * Validates and normalizes the configuration object
     * @param config - The configuration object to validate
     * @returns Validated and normalized configuration
     * @private
     */
    private _validateConfig;
    /**
     * Processes and validates callback argument mappings
     * @param mapping - The callback argument mapping array
     * @param eventSignature - The origin event signature
     * @param callbackFunction - The destination callback function signature
     * @returns Processed callback argument mapping
     * @private
     */
    private _processCallbackArguments;
}
