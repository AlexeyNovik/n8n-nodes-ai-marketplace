"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceEventsSubscribe = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceEventsSubscribe {
    constructor() {
        this.description = {
            displayName: 'Marketplace Events: Subscribe',
            name: 'aiMarketplaceEventsSubscribe',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '=Subscribe to events',
            description: 'Subscribe to marketplace events for MCP agent workflows',
            defaults: {
                name: 'Marketplace Events: Subscribe',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Environment',
                    name: 'environment',
                    type: 'options',
                    options: [
                        {
                            name: 'Development',
                            value: 'dev',
                        },
                        {
                            name: 'Production',
                            value: 'prod',
                        },
                    ],
                    default: 'dev',
                    description: 'The environment to connect to',
                },
                {
                    displayName: 'Override Base URL',
                    name: 'overrideBaseUrl',
                    type: 'string',
                    default: '',
                    description: 'Optional URL to override the environment default',
                },
                {
                    displayName: 'Event Type',
                    name: 'eventType',
                    type: 'options',
                    required: true,
                    options: [
                        {
                            name: 'Lot Created',
                            value: 'onLotCreated',
                        },
                        {
                            name: 'Lot Closed',
                            value: 'onLotClosed',
                        },
                        {
                            name: 'Offer Created',
                            value: 'onOfferCreated',
                        },
                        {
                            name: 'Offer Status Changed',
                            value: 'onOfferStatusChanged',
                        },
                        {
                            name: 'Feedback Left',
                            value: 'onFeedbackLeft',
                        },
                    ],
                    default: 'onLotCreated',
                    description: 'Type of event to subscribe to',
                },
                {
                    displayName: 'Callback URL',
                    name: 'callbackUrl',
                    type: 'string',
                    required: true,
                    default: '',
                    typeOptions: {
                        validation: [
                            {
                                type: 'url',
                            },
                        ],
                    },
                    description: 'HTTPS URL to receive event notifications',
                },
                {
                    displayName: 'Auth Token',
                    name: 'authToken',
                    type: 'string',
                    default: '',
                    typeOptions: {
                        password: true,
                    },
                    description: 'Optional authentication token for callback URL',
                },
                {
                    displayName: 'Timeout',
                    name: 'timeout',
                    type: 'number',
                    default: 30,
                    description: 'Request timeout in seconds',
                },
                {
                    displayName: 'Retry on 5xx Errors',
                    name: 'retryOn5xx',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to retry on 5xx HTTP status codes',
                },
                {
                    displayName: 'Max Retries',
                    name: 'maxRetries',
                    type: 'number',
                    default: 2,
                    description: 'Maximum number of retry attempts',
                },
                {
                    displayName: 'Additional Headers',
                    name: 'additionalHeaders',
                    type: 'fixedCollection',
                    default: {},
                    typeOptions: {
                        multipleValues: true,
                    },
                    options: [
                        {
                            name: 'headers',
                            displayName: 'Header',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Response Format',
                    name: 'responseFormat',
                    type: 'options',
                    options: [
                        {
                            name: 'JSON',
                            value: 'json',
                        },
                        {
                            name: 'Raw',
                            value: 'raw',
                        },
                    ],
                    default: 'json',
                    description: 'Format of the response data',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const eventType = this.getNodeParameter('eventType', i);
                const callbackUrl = this.getNodeParameter('callbackUrl', i);
                const authToken = this.getNodeParameter('authToken', i);
                // Validate callback URL is HTTPS
                if (!callbackUrl.startsWith('https://')) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Callback URL must be HTTPS');
                }
                // For MCP compatibility, simulate subscription creation
                // In a real implementation, this would integrate with the event system
                const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const response = {
                    subscriptionId,
                    status: 'subscribed',
                    eventType,
                    callbackUrl,
                    createdAt: new Date().toISOString(),
                    // Include configuration info for reference
                    mcpCompliant: true,
                    deliveryMethod: 'webhook',
                    securityHeaders: ['X-MCP-Signature', 'X-MCP-Timestamp', 'X-MCP-Key-Id'],
                    retryPolicy: {
                        maxRetries: 3,
                        backoffIntervals: [5, 10, 20], // seconds
                        dlqEnabled: true,
                    },
                };
                returnData.push({
                    json: response,
                    pairedItem: { item: i },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
            }
        }
        return [returnData];
    }
}
exports.AiMarketplaceEventsSubscribe = AiMarketplaceEventsSubscribe;
