/**
 * Ethereum address validation utilities
 */
/**
 * Validates if a string is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
declare function isValidAddress(address: string): boolean;
/**
 * Validates and formats an address, throwing an error if invalid
 * @param {string} address - The address to validate and format
 * @param {string} paramName - The name of the parameter (for error messages)
 * @returns {string} - The formatted address
 * @throws {Error} - If the address is invalid
 */
declare function validateAndFormatAddress(address: string, paramName?: string): string;
/**
 * Converts a contract address to its numeric value for use in contract generation
 * @param {string} address - The address to convert
 * @returns {string} - The code representation of the address
 */
declare function addressToCode(address: string): string;
export { isValidAddress, validateAndFormatAddress, addressToCode };
