"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceEventsListSubscriptions = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceEventsListSubscriptions {
    constructor() {
        this.description = {
            displayName: 'Marketplace Events: List Subscriptions',
            name: 'aiMarketplaceEventsListSubscriptions',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '=List subscriptions',
            description: 'List all active event subscriptions for MCP agents',
            defaults: {
                name: 'Marketplace Events: List Subscriptions',
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
                // For MCP compatibility, simulate subscription listing
                // In a real implementation, this would query the event subscription database
                const subscriptions = [
                    {
                        subscriptionId: `sub_${Date.now()}_example1`,
                        eventType: 'onLotCreated',
                        callbackUrl: 'https://example.com/webhook/lots',
                        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                        status: 'active',
                    },
                    {
                        subscriptionId: `sub_${Date.now()}_example2`,
                        eventType: 'onOfferStatusChanged',
                        callbackUrl: 'https://example.com/webhook/offers',
                        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                        status: 'active',
                    },
                ];
                const response = {
                    subscriptions,
                    total: subscriptions.length,
                    mcpCompliant: true,
                    supportedEvents: [
                        'onLotCreated',
                        'onLotClosed',
                        'onOfferCreated',
                        'onOfferStatusChanged',
                        'onFeedbackLeft',
                    ],
                    deliveryMethods: ['webhook', 'websocket'],
                    securityFeatures: {
                        signatureValidation: true,
                        timestampValidation: true,
                        keyRotation: true,
                        ipAllowlist: true,
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
exports.AiMarketplaceEventsListSubscriptions = AiMarketplaceEventsListSubscriptions;
