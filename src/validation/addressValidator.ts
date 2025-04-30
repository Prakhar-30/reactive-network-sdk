/**
 * Ethereum address validation utilities
 */

/**
 * Validates if a string is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidAddress(address: string): boolean {
    // Check if it's a string and matches Ethereum address format (0x followed by 40 hex characters)
    if (typeof address !== 'string') return false;
    return /^0x[0-9a-fA-F]{40}$/.test(address);
}
  
  /**
   * Validates and formats an address, throwing an error if invalid
   * @param {string} address - The address to validate and format
   * @param {string} paramName - The name of the parameter (for error messages)
   * @returns {string} - The formatted address
   * @throws {Error} - If the address is invalid
   */
  function validateAndFormatAddress(address: string, paramName = 'address'): string {
    if (!address) {
      throw new Error(`${paramName} is required`);
    }
    
    if (!isValidAddress(address)) {
      throw new Error(`Invalid ${paramName}: ${address}`);
    }
    
    // Return the address in lowercase format for consistency
    return address.toLowerCase();
  }
  
  /**
   * Converts a contract address to its numeric value for use in contract generation
   * @param {string} address - The address to convert
   * @returns {string} - The code representation of the address
   */
  function addressToCode(address: string): string {
    if (!isValidAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    
    return address;
  }
  
  export {
    isValidAddress,
    validateAndFormatAddress,
    addressToCode
  };