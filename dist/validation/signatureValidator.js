"use strict";
/**
 * Utilities for validating and working with Solidity function and event signatures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidFunctionSignature = isValidFunctionSignature;
exports.isValidEventSignature = isValidEventSignature;
exports.generateTopic0 = generateTopic0;
exports.validateAndFormatFunctionSignature = validateAndFormatFunctionSignature;
exports.validateAndFormatEventSignature = validateAndFormatEventSignature;
exports.getFunctionName = getFunctionName;
exports.getEventName = getEventName;
exports.parseParameters = parseParameters;
const js_sha3_1 = require("js-sha3");
function isValidFunctionSignature(signature) {
    // Basic validation for function signatures (name + parameters)
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*\(([a-zA-Z0-9_$,\[\]\s]*)\)$/.test(signature);
}
function isValidEventSignature(signature) {
    // Basic validation for event signatures (name + parameters)
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*\(([a-zA-Z0-9_$,\[\]\s]*)\)$/.test(signature);
}
function generateTopic0(signature) {
    if (!isValidEventSignature(signature)) {
        throw new Error(`Invalid event signature: ${signature}`);
    }
    return '0x' + (0, js_sha3_1.keccak256)(signature);
}
function validateAndFormatFunctionSignature(signature, paramName = 'function signature') {
    if (!signature) {
        throw new Error(`${paramName} is required`);
    }
    if (!isValidFunctionSignature(signature)) {
        throw new Error(`Invalid ${paramName}: ${signature}`);
    }
    return signature;
}
function validateAndFormatEventSignature(signature, paramName = 'event signature') {
    if (!signature) {
        throw new Error(`${paramName} is required`);
    }
    if (!isValidEventSignature(signature)) {
        throw new Error(`Invalid ${paramName}: ${signature}`);
    }
    return signature;
}
function getFunctionName(signature) {
    if (!isValidFunctionSignature(signature)) {
        throw new Error(`Invalid function signature: ${signature}`);
    }
    return signature.substring(0, signature.indexOf('('));
}
function getEventName(signature) {
    if (!isValidEventSignature(signature)) {
        throw new Error(`Invalid event signature: ${signature}`);
    }
    return signature.substring(0, signature.indexOf('('));
}
function parseParameters(signature) {
    const paramString = signature.substring(signature.indexOf('(') + 1, signature.lastIndexOf(')'));
    if (!paramString)
        return [];
    return paramString.split(',').map(param => param.trim());
}
