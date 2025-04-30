/**
 * Chain ID validation utilities
 */
export declare const CHAIN_IDS: {
    ETHEREUM: number;
    OPTIMISM: number;
    BSC: number;
    POLYGON: number;
    ARBITRUM: number;
    GOERLI: number;
    SEPOLIA: number;
    MUMBAI: number;
    KOPLI: number;
    REACTIVE_MAINNET: number;
};
declare function isValidChainId(chainId: number | string): boolean;
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
declare function validateAndFormatChainId({ chainId, paramName }: ChainIdValidationParams): number;
/**
 * Gets the common name for a chain ID if available
 * @param {number} chainId - The chain ID to get the name for
 * @returns {string|null} - The chain name or null if not found
 */
declare function getChainName(chainId: number | string): string | null;
declare function isSupportedChain(chainId: number | string): boolean;
export { isValidChainId, validateAndFormatChainId, getChainName, isSupportedChain };
