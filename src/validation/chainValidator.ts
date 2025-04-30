/**
 * Chain ID validation utilities
 */

// Common chain IDs for reference
export const CHAIN_IDS = {
    // Mainnets
    ETHEREUM: 1,
    OPTIMISM: 10,
    BSC: 56,
    POLYGON: 137,
    ARBITRUM: 42161,
    
    // Testnets
    GOERLI: 5,
    SEPOLIA: 11155111,
    MUMBAI: 80001,
    
    // Reactive Network
    KOPLI: 5318008,
    REACTIVE_MAINNET: 1597 // Placeholder, update with actual value when available
  };
  
  /**
   * Validates if a value is a valid chain ID number
   * @param {number|string} chainId - The chain ID to validate
   * @returns {boolean} - True if valid, false otherwise
   */
interface ChainIdInput {
    chainId: number | string;
}

function isValidChainId(chainId: number | string): boolean {
    const id = Number(chainId);
    return !isNaN(id) && id > 0 && Number.isInteger(id);
}
  
  /**
   * Validates and formats a chain ID, throwing an error if invalid
   * @param {number|string} chainId - The chain ID to validate
   * @param {string} paramName - Name of the parameter (for error messages)
   * @returns {number} - The formatted chain ID
   * @throws {Error} - If the chain ID is invalid
   */
interface ChainIdValidationParams {
    chainId: number | string;
    paramName?: string;
}

function validateAndFormatChainId({ chainId, paramName = 'chainId' }: ChainIdValidationParams): number {
    if (chainId === undefined || chainId === null) {
        throw new Error(`${paramName} is required`);
    }
    
    const id = Number(chainId);
    
    if (!isValidChainId(id)) {
        throw new Error(`Invalid ${paramName}: ${chainId}`);
    }
    
    return id;
}
  
  /**
   * Gets the common name for a chain ID if available
   * @param {number} chainId - The chain ID to get the name for
   * @returns {string|null} - The chain name or null if not found
   */
function getChainName(chainId: number | string): string | null {
    const id: number = Number(chainId);
    
    for (const [name, value] of Object.entries(CHAIN_IDS)) {
        if (value === id) {
            return name;
        }
    }
    
    return null;
}
  
  /**
   * Validates that a chain ID is supported by Reactive Network
   * Currently supports Kopli testnet and Sepolia
   * @param {number} chainId - The chain ID to validate
   * @returns {boolean} - True if supported, false otherwise
   */
interface ChainValidationResult {
    isSupported: boolean;
}

function isSupportedChain(chainId: number | string): boolean {
    const id: number = Number(chainId);
    
    // Currently, Reactive Network is known to support Sepolia and Kopli
    return id === CHAIN_IDS.SEPOLIA || id === CHAIN_IDS.KOPLI;
}
  
  export {
      isValidChainId,
      validateAndFormatChainId,
      getChainName,
      isSupportedChain
  };