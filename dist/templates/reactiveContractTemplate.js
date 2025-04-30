"use strict";
/**
 * Template for generating Reactive Smart Contracts
 * This template creates a contract that listens for events on one chain
 * and triggers callbacks on another chain
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReactiveContractTemplate = generateReactiveContractTemplate;
function generateReactiveContractTemplate(options) {
    const { contractName, originChainId, destinationChainId, originContract, destinationContract, callbackGasLimit, eventConfigurations = [] // Array of event configurations
     } = options;
    // Create a valid import statement based on the expected library location
    const importStatement = `import 'lib/reactive-lib/src/abstract-base/AbstractReactive.sol';
  import 'lib/reactive-lib/src/interfaces/ISubscriptionService.sol';
  import 'lib/reactive-lib/src/interfaces/IReactive.sol';`;
    // Generate event topic constants
    const topicConstants = eventConfigurations.map((eventConfig) => {
        const eventName = eventConfig.eventName || extractEventName(eventConfig.eventSignature);
        return `    uint256 private constant TOPIC_${eventName.toUpperCase()} = ${eventConfig.eventTopic0};`;
    }).join('\n');
    // Generate subscription code for each event
    const subscriptions = eventConfigurations.map((eventConfig) => {
        const eventName = eventConfig.eventName || extractEventName(eventConfig.eventSignature);
        return `
              try service.subscribe(
                  ORIGIN_CHAIN_ID,
                  origin_contract,
                  TOPIC_${eventName.toUpperCase()},
                  REACTIVE_IGNORE,
                  REACTIVE_IGNORE,
                  REACTIVE_IGNORE
              ) {
                  emit SubscriptionStatus(true, "${eventConfig.eventSignature}");
              } catch {
                  emit SubscriptionStatus(false, "${eventConfig.eventSignature}");
              }`;
    }).join('\n');
    // Generate event handling code for each event
    const eventHandlers = eventConfigurations.map((eventConfig) => {
        const eventName = eventConfig.eventName || extractEventName(eventConfig.eventSignature);
        const conditions = (eventConfig.conditions || []).map((condition) => `            require(${condition.expression}, "${condition.errorMessage}");`).join('\n');
        const callbackArgs = buildCallbackArguments(eventConfig.callbackArgumentMapping);
        return `
          // Handle ${eventConfig.eventSignature} event
          if (log.topic_0 == TOPIC_${eventName.toUpperCase()}) {
  ${conditions ? conditions + '\n' : ''}
              bytes memory payload_callback = abi.encodeWithSignature(
                  "${eventConfig.callbackFunction}",
                  ${callbackArgs}
              );
  
              emit Callback(
                  DESTINATION_CHAIN_ID,
                  destination_contract,
                  CALLBACK_GAS_LIMIT,
                  payload_callback
              );
          }`;
    }).join('\n');
    // Build the contract template
    return `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;
  
  ${importStatement}
  
  contract ${contractName} is AbstractReactive {
      uint256 private constant ORIGIN_CHAIN_ID = ${originChainId};
      uint256 private constant DESTINATION_CHAIN_ID = ${destinationChainId};
      uint64 private constant CALLBACK_GAS_LIMIT = ${callbackGasLimit || '3000000'};
      
      // Event topic constants
  ${topicConstants}
      
      address private immutable origin_contract;
      address private immutable destination_contract;
      
      event SubscriptionStatus(bool success, string eventSignature);
  
      constructor(address _originContract, address _destinationContract) {
          origin_contract = _originContract;
          destination_contract = _destinationContract;
          
          if (!vm) {
  ${subscriptions}
          }
      }
  
      function react(LogRecord calldata log) external override vmOnly {
          require(log.chain_id == ORIGIN_CHAIN_ID, "Wrong chain");
          require(log._contract == origin_contract, "Wrong contract");
          
  ${eventHandlers}
      }
  }`;
}
/**
 * Extracts the event name from an event signature
 * @param signature Event signature
 * @returns Event name
 */
function extractEventName(signature) {
    return signature.substring(0, signature.indexOf('('));
}
/**
 * Builds the callback arguments string based on the provided mapping
 * @param mapping - Array of argument mappings
 * @returns Formatted callback arguments
 */
function buildCallbackArguments(mapping) {
    if (!mapping || mapping.length === 0) {
        return 'address(0)';
    }
    return mapping.map(arg => {
        if (arg.type === 'static') {
            return arg.value;
        }
        else if (arg.type === 'topic') {
            if (arg.cast) {
                return `${arg.cast}(log.topic_${arg.index})`;
            }
            return `log.topic_${arg.index}`;
        }
        else if (arg.type === 'data') {
            if (arg.dataFormat === 'raw') {
                return 'log.data';
            }
            else {
                return `abi.decode(log.data, (${arg.dataType}))`;
            }
        }
        else {
            return 'address(0)';
        }
    }).join(',\n            ');
}
