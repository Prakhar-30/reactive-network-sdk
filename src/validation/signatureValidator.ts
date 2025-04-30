/**
 * Utilities for validating and working with Solidity function and event signatures
 */

import { keccak256 } from 'js-sha3';

/**
 * Validates if a string is a valid Solidity function signature
 * @param {string} signature - The function signature to validate
 * @returns {boolean} - True if valid, false otherwise
 */
interface FunctionSignature {
    signature: string;
}

function isValidFunctionSignature(signature: string): boolean {
    // Basic validation for function signatures (name + parameters)
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*\(([a-zA-Z0-9_$,\[\]\s]*)\)$/.test(signature);
}

/**
 * Validates if a string is a valid Solidity event signature
 * @param {string} signature - The event signature to validate
 * @returns {boolean} - True if valid, false otherwise
 */
interface EventSignature {
    signature: string;
}

function isValidEventSignature(signature: string): boolean {
    // Basic validation for event signatures (name + parameters)
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*\(([a-zA-Z0-9_$,\[\]\s]*)\)$/.test(signature);
}

/**
 * Generates the topic0 hash from an event signature
 * @param {string} signature - The event signature
 * @returns {string} - The topic0 hash with 0x prefix
 */
interface GenerateTopic0Input {
    signature: string;
}

function generateTopic0(signature: string): string {
    if (!isValidEventSignature(signature)) {
        throw new Error(`Invalid event signature: ${signature}`);
    }
    
    return '0x' + keccak256(signature);
}

/**
 * Validates and formats a function signature, throwing an error if invalid
 * @param {string} signature - The function signature to validate
 * @param {string} paramName - Name of the parameter (for error messages)
 * @returns {string} - The validated function signature
 * @throws {Error} - If the signature is invalid
 */
interface ValidateFunctionSignatureInput {
    signature: string;
    paramName?: string;
}

function validateAndFormatFunctionSignature(signature: string, paramName: string = 'function signature'): string {
    if (!signature) {
        throw new Error(`${paramName} is required`);
    }
    
    if (!isValidFunctionSignature(signature)) {
        throw new Error(`Invalid ${paramName}: ${signature}`);
    }
    
    return signature;
}

/**
 * Validates and formats an event signature, throwing an error if invalid
 * @param {string} signature - The event signature to validate
 * @param {string} paramName - Name of the parameter (for error messages)
 * @returns {string} - The validated event signature
 * @throws {Error} - If the signature is invalid
 */
interface ValidateEventSignatureInput {
    signature: string;
    paramName?: string;
}

function validateAndFormatEventSignature(signature: string, paramName: string = 'event signature'): string {
    if (!signature) {
        throw new Error(`${paramName} is required`);
    }
    
    if (!isValidEventSignature(signature)) {
        throw new Error(`Invalid ${paramName}: ${signature}`);
    }
    
    return signature;
}

/**
 * Gets the function name from a function signature
 * @param {string} signature - The function signature
 * @returns {string} - The function name
 */
interface GetFunctionNameInput {
    signature: string;
}

function getFunctionName(signature: string): string {
    if (!isValidFunctionSignature(signature)) {
        throw new Error(`Invalid function signature: ${signature}`);
    }
    
    return signature.substring(0, signature.indexOf('('));
}

/**
 * Gets the event name from an event signature
 * @param {string} signature - The event signature
 * @returns {string} - The event name
 */
interface GetEventNameInput {
    signature: string;
}

function getEventName(signature: string): string {
    if (!isValidEventSignature(signature)) {
        throw new Error(`Invalid event signature: ${signature}`);
    }
    
    return signature.substring(0, signature.indexOf('('));
}

/**
 * Parses parameters from a function or event signature
 * @param {string} signature - The function or event signature
 * @returns {string[]} - Array of parameter types
 */
interface ParseParametersInput {
    signature: string;
}

function parseParameters(signature: string): string[] {
  const paramString = signature.substring(
    signature.indexOf('(') + 1,
    signature.lastIndexOf(')')
  );
  
  if (!paramString) return [];
  
  return paramString.split(',').map(param => param.trim());
}

export {
  isValidFunctionSignature,
  isValidEventSignature,
  generateTopic0,
  validateAndFormatFunctionSignature,
  validateAndFormatEventSignature,
  getFunctionName,
  getEventName,
  parseParameters
};