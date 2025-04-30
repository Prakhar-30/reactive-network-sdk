"use strict";
/**
 * Helper utilities for working with Ethereum events and ABI encoding
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEventParameters = mapEventParameters;
exports.suggestArgumentMapping = suggestArgumentMapping;
exports.isSimilarType = isSimilarType;
exports.extractType = extractType;
exports.suggestCasting = suggestCasting;
exports.suggestDefaultValue = suggestDefaultValue;
const signatureValidator_1 = require("../validation/signatureValidator");
function mapEventParameters(eventSignature) {
    const parameters = (0, signatureValidator_1.parseParameters)(eventSignature);
    // Initialize the mapping
    const mapping = {};
    let topicIndex = 1; // topic0 is the event signature
    let dataIndex = 0;
    // Iterate through parameters
    parameters.forEach((param, index) => {
        // Check if the parameter is indexed
        const isIndexed = param.includes('indexed');
        if (isIndexed) {
            // If more than 3 indexed parameters, the rest go into data
            if (topicIndex <= 3) {
                mapping[index] = { type: 'topic', index: topicIndex };
                topicIndex++;
            }
            else {
                mapping[index] = { type: 'data', index: dataIndex };
                dataIndex++;
            }
        }
        else {
            mapping[index] = { type: 'data', index: dataIndex };
            dataIndex++;
        }
    });
    return mapping;
}
function suggestArgumentMapping(eventSignature, callbackSignature) {
    const eventParams = (0, signatureValidator_1.parseParameters)(eventSignature);
    const callbackParams = (0, signatureValidator_1.parseParameters)(callbackSignature);
    // First parameter is always address(0) for the 'spender' in reactive patterns
    const mapping = [
        { type: 'static', value: 'address(0)' }
    ];
    // Map the rest of the parameters based on names and types
    const eventMapping = mapEventParameters(eventSignature);
    // Skip the first callback parameter (it's already set to address(0))
    for (let i = 1; i < callbackParams.length; i++) {
        const callbackParam = callbackParams[i];
        // Try to find a matching parameter in the event
        let foundMatch = false;
        for (let j = 0; j < eventParams.length; j++) {
            const eventParam = eventParams[j].replace('indexed', '').trim();
            // If types are similar, suggest a mapping
            if (isSimilarType(eventParam, callbackParam)) {
                const paramMapping = eventMapping[j];
                if (paramMapping.type === 'topic') {
                    // For address types in topics, always use address(uint160) casting
                    const paramType = extractType(eventParam);
                    if (isAddressType(paramType)) {
                        mapping.push({
                            type: 'topic',
                            index: paramMapping.index,
                            cast: 'address(uint160)'
                        });
                    }
                    else {
                        // For uint256 and other numeric types, no casting needed
                        mapping.push({
                            type: 'topic',
                            index: paramMapping.index
                        });
                    }
                }
                else {
                    // For data fields, always use proper decoding
                    mapping.push({
                        type: 'data',
                        dataFormat: 'decoded',
                        dataType: extractType(eventParam)
                    });
                }
                foundMatch = true;
                break;
            }
        }
        // If no match found, suggest a default value
        if (!foundMatch) {
            mapping.push(suggestDefaultValue(callbackParam));
        }
    }
    return mapping;
}
/**
 * Checks if two parameter types are similar
 * @param {string} type1 - First parameter type
 * @param {string} type2 - Second parameter type
 * @returns {boolean} - True if types are similar
 */
function isSimilarType(type1, type2) {
    const baseType1 = extractType(type1);
    const baseType2 = extractType(type2);
    // Simple matching for basic types
    return baseType1 === baseType2 ||
        (isAddressType(baseType1) && isAddressType(baseType2)) ||
        (isUintType(baseType1) && isUintType(baseType2)) ||
        (isIntType(baseType1) && isIntType(baseType2)) ||
        (isBytes32Type(baseType1) && isBytes32Type(baseType2));
}
/**
 * Extracts the type part from a parameter
 * @param {string} param - Parameter string
 * @returns {string} - Type part
 */
function extractType(param) {
    return param.split(' ').filter(part => !part.startsWith('memory') &&
        !part.startsWith('calldata') &&
        !part.startsWith('storage')).join(' ');
}
/**
 * Checks if a type is an address type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's an address type
 */
function isAddressType(type) {
    return type === 'address';
}
/**
 * Checks if a type is a uint type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's a uint type
 */
function isUintType(type) {
    return type.startsWith('uint');
}
/**
 * Checks if a type is an int type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's an int type
 */
function isIntType(type) {
    return type.startsWith('int');
}
/**
 * Checks if a type is a bytes32 type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's a bytes32 type
 */
function isBytes32Type(type) {
    return type === 'bytes32';
}
/**
 * Suggests casting code for converting between types
 * @param {string} fromType - Source type
 * @param {string} toType - Target type
 * @returns {string|null} - Casting code or null if no casting needed
 */
function suggestCasting(fromType, toType) {
    fromType = extractType(fromType);
    toType = extractType(toType);
    if (isAddressType(toType)) {
        return 'address(uint160)';
    }
    if (fromType === toType) {
        return null;
    }
    return toType;
}
/**
 * Suggests a default value for a parameter type
 * @param {string} paramType - Parameter type
 * @returns {Object} - Argument mapping with default value
 */
function suggestDefaultValue(paramType) {
    const type = extractType(paramType);
    if (isAddressType(type)) {
        return { type: 'static', value: 'address(0)' };
    }
    if (isUintType(type) || isIntType(type)) {
        return { type: 'static', value: '0' };
    }
    if (isBytes32Type(type)) {
        return { type: 'static', value: 'bytes32(0)' };
    }
    if (type === 'bool') {
        return { type: 'static', value: 'false' };
    }
    if (type === 'string') {
        return { type: 'static', value: '""' };
    }
    // Default case
    return { type: 'static', value: '0' };
}
