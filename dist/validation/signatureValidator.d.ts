/**
 * Utilities for validating and working with Solidity function and event signatures
 */
declare function isValidFunctionSignature(signature: string): boolean;
declare function isValidEventSignature(signature: string): boolean;
declare function generateTopic0(signature: string): string;
declare function validateAndFormatFunctionSignature(signature: string, paramName?: string): string;
declare function validateAndFormatEventSignature(signature: string, paramName?: string): string;
declare function getFunctionName(signature: string): string;
declare function getEventName(signature: string): string;
declare function parseParameters(signature: string): string[];
export { isValidFunctionSignature, isValidEventSignature, generateTopic0, validateAndFormatFunctionSignature, validateAndFormatEventSignature, getFunctionName, getEventName, parseParameters };
