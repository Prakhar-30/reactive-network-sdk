"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_IDS = exports.ReactiveContractsSDK = void 0;
const contractGenerator_1 = require("./generator/contractGenerator");
const chainValidator_1 = require("./validation/chainValidator");
Object.defineProperty(exports, "CHAIN_IDS", { enumerable: true, get: function () { return chainValidator_1.CHAIN_IDS; } });
const signatureValidator_1 = require("./validation/signatureValidator");
const exportHelper_1 = require("./utils/exportHelper");
const eventHelper_1 = require("./utils/eventHelper");
/**
 * Main SDK class for working with Reactive Smart Contracts
 */
class ReactiveContractsSDK {
    constructor() {
        this.generator = new contractGenerator_1.ReactiveContractGenerator();
    }
    /**
     * Generates a reactive contract based on the provided configuration
     * @param config - Configuration object for the contract
     * @returns Generated contract code
     */
    generateContract(config) {
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
    createEventConfig(eventSignature, callbackFunction, conditions = [], callbackArgumentMapping = []) {
        // If no callback argument mapping provided, try to auto-suggest one
        const mappings = callbackArgumentMapping.length === 0 ?
            (0, eventHelper_1.suggestArgumentMapping)(eventSignature, callbackFunction) :
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
    suggestArgumentMapping(eventSignature, callbackFunction) {
        return (0, eventHelper_1.suggestArgumentMapping)(eventSignature, callbackFunction);
    }
    /**
     * Generates the topic0 hash from an event signature
     * @param eventSignature - The event signature
     * @returns The topic0 hash with 0x prefix
     */
    getEventTopic0(eventSignature) {
        return (0, signatureValidator_1.generateTopic0)(eventSignature);
    }
    /**
     * Returns a list of supported chain IDs
     * @returns Mapping of chain names to IDs
     */
    getSupportedChains() {
        return chainValidator_1.CHAIN_IDS;
    }
    /**
     * Exports a generated contract to a file
     * @param contractCode - The contract code to export
     * @param contractName - The name of the contract
     * @param outputPath - Path to export the contract to
     * @returns The path to the exported file
     */
    exportContract(contractCode, contractName, outputPath = './contracts') {
        return (0, exportHelper_1.exportContract)(contractCode, contractName, outputPath);
    }
    /**
     * Creates a Forge project with the reactive contract
     * @param contractCode - The contract code
     * @param contractName - The name of the contract
     * @param outputPath - Path to create the project in
     * @returns The path to the project
     */
    exportForgeProject(contractCode, contractName, outputPath = './projects') {
        return (0, exportHelper_1.exportForgeProject)(contractCode, contractName, outputPath);
    }
    /**
     * Returns the contract as a JSON object
     * @param contractCode - The contract code
     * @param contractName - The name of the contract
     * @returns JSON representation of the contract
     */
    exportAsJson(contractCode, contractName) {
        return (0, exportHelper_1.exportAsJson)(contractCode, contractName);
    }
}
exports.ReactiveContractsSDK = ReactiveContractsSDK;
