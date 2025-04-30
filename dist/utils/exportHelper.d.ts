/**
 * Utilities for exporting generated contracts
 */
/**
 * Exports a generated contract to a file
 * @param {string} contractCode - The contract code to export
 * @param {string} contractName - The name of the contract
 * @param {string} outputPath - Path to export the contract to
 * @returns {string} - The path to the exported file
 */
declare function exportContract(contractCode: string, contractName: string, outputPath: string): string;
declare function exportForgeProject(contractCode: string, contractName: string, outputPath: string): string;
/**
 * Returns the contract code as a JSON object
 * @param {string} contractCode - The contract code
 * @param {string} contractName - The name of the contract
 * @returns {Object} - JSON representation of the contract
 */
interface ContractJson {
    name: string;
    code: string;
    timestamp: string;
}
declare function exportAsJson(contractCode: string, contractName: string): ContractJson;
export { exportContract, exportForgeProject, exportAsJson };
