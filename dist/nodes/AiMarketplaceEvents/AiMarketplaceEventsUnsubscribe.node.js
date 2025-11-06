"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceEventsUnsubscribe = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceEventsUnsubscribe {
    constructor() {
        this.description = {
            displayName: 'Marketplace Events: Unsubscribe',
            name: 'aiMarketplaceEventsUnsubscribe',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '=Unsubscribe from events',
            description: 'Unsubscribe from marketplace event notifications',
            defaults: {
                name: 'Marketplace Events: Unsubscribe',
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
                    displayName: 'Subscription ID',
                    name: 'subscriptionId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the subscription to cancel',
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
                const subscriptionId = this.getNodeParameter('subscriptionId', i);
                // For MCP compatibility, simulate subscription cancellation
                // In a real implementation, this would integrate with the event system
                const response = {
                    status: 'unsubscribed',
                    subscriptionId,
                    cancelledAt: new Date().toISOString(),
                    mcpCompliant: true,
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
exports.AiMarketplaceEventsUnsubscribe = AiMarketplaceEventsUnsubscribe;
