/**
 * Helper utilities for working with Ethereum events and ABI encoding
 */
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
declare function mapEventParameters(eventSignature: string): EventMapping;
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
    cast?: string | null;
}
interface DataArgumentMapping extends ArgumentMappingBase {
    type: 'data';
    dataFormat: 'raw' | 'decoded';
    dataType?: string;
}
type ArgumentMapping = StaticArgumentMapping | TopicArgumentMapping | DataArgumentMapping;
declare function suggestArgumentMapping(eventSignature: string, callbackSignature: string): ArgumentMapping[];
/**
 * Checks if two parameter types are similar
 * @param {string} type1 - First parameter type
 * @param {string} type2 - Second parameter type
 * @returns {boolean} - True if types are similar
 */
declare function isSimilarType(type1: string, type2: string): boolean;
/**
 * Extracts the type part from a parameter
 * @param {string} param - Parameter string
 * @returns {string} - Type part
 */
declare function extractType(param: string): string;
/**
 * Suggests casting code for converting between types
 * @param {string} fromType - Source type
 * @param {string} toType - Target type
 * @returns {string|null} - Casting code or null if no casting needed
 */
declare function suggestCasting(fromType: string, toType: string): string | null;
/**
 * Suggests a default value for a parameter type
 * @param {string} paramType - Parameter type
 * @returns {Object} - Argument mapping with default value
 */
declare function suggestDefaultValue(paramType: string): StaticArgumentMapping;
export { mapEventParameters, suggestArgumentMapping, isSimilarType, extractType, suggestCasting, suggestDefaultValue, ArgumentMapping, StaticArgumentMapping, TopicArgumentMapping, DataArgumentMapping };
