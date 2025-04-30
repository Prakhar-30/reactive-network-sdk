/**
 * Helper utilities for working with Ethereum events and ABI encoding
 */

import { parseParameters } from '../validation/signatureValidator';

/**
 * Maps event parameter positions to topic indices
 * @param {string} eventSignature - The event signature
 * @returns {Object} - Mapping of parameter position to topic index or data
 */
interface EventParameterMapping {
    type: 'topic' | 'data';
    index: number;
}

interface EventMapping {
    [parameterIndex: number]: EventParameterMapping;
}

function mapEventParameters(eventSignature: string): EventMapping {
    const parameters: string[] = parseParameters(eventSignature);
    
    // Initialize the mapping
    const mapping: EventMapping = {};
    let topicIndex: number = 1; // topic0 is the event signature
    let dataIndex: number = 0;
    
    // Iterate through parameters
    parameters.forEach((param: string, index: number) => {
        // Check if the parameter is indexed
        const isIndexed: boolean = param.includes('indexed');
        
        if (isIndexed) {
            // If more than 3 indexed parameters, the rest go into data
            if (topicIndex <= 3) {
                mapping[index] = { type: 'topic', index: topicIndex };
                topicIndex++;
            } else {
                mapping[index] = { type: 'data', index: dataIndex };
                dataIndex++;
            }
        } else {
            mapping[index] = { type: 'data', index: dataIndex };
            dataIndex++;
        }
    });
    
    return mapping;
}

/**
 * Generates suggestions for mapping event parameters to callback arguments
 * @param {string} eventSignature - The event signature
 * @param {string} callbackSignature - The callback function signature
 * @returns {Array} - Suggested argument mappings
 */
interface ArgumentMappingBase {
    type: string;
}

interface StaticArgumentMapping extends ArgumentMappingBase {
    type: 'static';
    value: string;
}

interface TopicArgumentMapping extends ArgumentMappingBase {
    type: 'topic';
    index: number;
    cast: string | null;
}

interface DataArgumentMapping extends ArgumentMappingBase {
    type: 'data';
    dataFormat: 'decoded';
    dataType: string;
}

type ArgumentMapping = StaticArgumentMapping | TopicArgumentMapping | DataArgumentMapping;

function suggestArgumentMapping(eventSignature: string, callbackSignature: string): ArgumentMapping[] {
    const eventParams: string[] = parseParameters(eventSignature);
    const callbackParams: string[] = parseParameters(callbackSignature);
    
    // First parameter is typically address(0) in reactive patterns
    const mapping: ArgumentMapping[] = [
        { type: 'static', value: 'address(0)' }
    ];
    
    // Map the rest of the parameters based on names and types
    const eventMapping: EventMapping = mapEventParameters(eventSignature);
    
    // Skip the first callback parameter (it's already set to address(0))
    for (let i = 1; i < callbackParams.length; i++) {
        const callbackParam: string = callbackParams[i];
        
        // Try to find a matching parameter in the event
        let foundMatch: boolean = false;
        
        for (let j = 0; j < eventParams.length; j++) {
            const eventParam: string = eventParams[j].replace('indexed', '').trim();
            
            // If types are similar, suggest a mapping
            if (isSimilarType(eventParam, callbackParam)) {
                const paramMapping: EventParameterMapping = eventMapping[j];
                
                if (paramMapping.type === 'topic') {
                    // For topics, we might need to add casting
                    mapping.push({
                        type: 'topic',
                        index: paramMapping.index,
                        cast: suggestCasting(eventParam, callbackParam)
                    });
                } else {
                    // For data fields
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
interface SimilarType {
    type1: string;
    type2: string;
}

function isSimilarType(type1: string, type2: string): boolean {
    const baseType1: string = extractType(type1);
    const baseType2: string = extractType(type2);
    
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
function extractType(param: string): string {
    return param.split(' ').filter(part => !part.startsWith('memory') && 
                                                                                    !part.startsWith('calldata') && 
                                                                                    !part.startsWith('storage')).join(' ');
}

/**
 * Checks if a type is an address type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's an address type
 */
function isAddressType(type: string): boolean {
    return type === 'address';
}

/**
 * Checks if a type is a uint type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's a uint type
 */
function isUintType(type: string): boolean {
    return type.startsWith('uint');
}

/**
 * Checks if a type is an int type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's an int type
 */
function isIntType(type: string): boolean {
    return type.startsWith('int');
}

/**
 * Checks if a type is a bytes32 type
 * @param {string} type - The type to check
 * @returns {boolean} - True if it's a bytes32 type
 */
function isBytes32Type(type: string): boolean {
    return type === 'bytes32';
}

/**
 * Suggests casting code for converting between types
 * @param {string} fromType - Source type
 * @param {string} toType - Target type
 * @returns {string|null} - Casting code or null if no casting needed
 */
interface CastingSuggestion {
    fromType: string;
    toType: string;
}

function suggestCasting(fromType: string, toType: string): string | null {
    fromType = extractType(fromType);
    toType = extractType(toType);
    
    if (isAddressType(toType)) {
        return 'address(uint160';
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
function suggestDefaultValue(paramType: string): StaticArgumentMapping {
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

export {
    mapEventParameters,
    suggestArgumentMapping,
    isSimilarType,
    extractType,
    suggestCasting,
    suggestDefaultValue
  };