"use strict";
/**
 * Chain ID validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_IDS = void 0;
exports.isValidChainId = isValidChainId;
exports.validateAndFormatChainId = validateAndFormatChainId;
exports.getChainName = getChainName;
exports.isSupportedChain = isSupportedChain;
// Common chain IDs for reference
exports.CHAIN_IDS = {
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
function isValidChainId(chainId) {
    const id = Number(chainId);
    return !isNaN(id) && id > 0 && Number.isInteger(id);
}
function validateAndFormatChainId({ chainId, paramName = 'chainId' }) {
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
function getChainName(chainId) {
    const id = Number(chainId);
    for (const [name, value] of Object.entries(exports.CHAIN_IDS)) {
        if (value === id) {
            return name;
        }
    }
    return null;
}
function isSupportedChain(chainId) {
    const id = Number(chainId);
    // Currently, Reactive Network is known to support Sepolia and Kopli
    return id === exports.CHAIN_IDS.SEPOLIA || id === exports.CHAIN_IDS.KOPLI;
}
