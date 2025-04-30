/**
 * Template for generating Reactive Smart Contracts
 * This template creates a contract that listens for events on one chain
 * and triggers callbacks on another chain
 */
export interface Condition {
    expression: string;
    errorMessage: string;
}
export interface StaticArgument {
    type: 'static';
    value: string;
}
export interface TopicArgument {
    type: 'topic';
    index: number;
    cast?: string;
}
export interface DataArgument {
    type: 'data';
    dataFormat: 'raw' | 'decoded';
    dataType?: string;
}
export type ArgumentMapping = StaticArgument | TopicArgument | DataArgument;
export interface EventConfiguration {
    eventName?: string;
    eventSignature: string;
    eventTopic0: string;
    callbackFunction: string;
    conditions?: Condition[];
    callbackArgumentMapping: ArgumentMapping[];
}
export declare function generateReactiveContractTemplate(options: any): string;
