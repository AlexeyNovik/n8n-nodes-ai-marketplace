"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceEvents = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceEvents {
    constructor() {
        this.description = {
            displayName: 'AI Marketplace Events',
            name: 'aiMarketplaceEvents',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage event subscriptions for AI Marketplace (MCP Compatible)',
            defaults: {
                name: 'AI Marketplace Events',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aiMarketplaceApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Subscribe',
                            value: 'subscribe',
                            description: 'Subscribe to marketplace events',
                            action: 'Subscribe to events',
                        },
                        {
                            name: 'Unsubscribe',
                            value: 'unsubscribe',
                            description: 'Unsubscribe from events',
                            action: 'Unsubscribe from events',
                        },
                        {
                            name: 'List Subscriptions',
                            value: 'listSubscriptions',
                            description: 'List active subscriptions',
                            action: 'List subscriptions',
                        },
                    ],
                    default: 'subscribe',
                    description: 'The operation to perform',
                },
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
                // Subscribe operation fields
                {
                    displayName: 'Event Types',
                    name: 'eventTypes',
                    type: 'multiOptions',
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
                    default: ['onLotCreated'],
                    description: 'Event types to subscribe to',
                    displayOptions: {
                        show: {
                            operation: ['subscribe'],
                        },
                    },
                },
                {
                    displayName: 'Callback URL',
                    name: 'callbackUrl',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'HTTPS callback URL for webhook events',
                    displayOptions: {
                        show: {
                            operation: ['subscribe'],
                        },
                    },
                    typeOptions: {
                        validation: [
                            {
                                type: 'url',
                            },
                        ],
                    },
                },
                {
                    displayName: 'Delivery Method',
                    name: 'deliveryMethod',
                    type: 'options',
                    options: [
                        {
                            name: 'Webhook',
                            value: 'webhook',
                        },
                        {
                            name: 'WebSocket',
                            value: 'websocket',
                        },
                    ],
                    default: 'webhook',
                    description: 'Event delivery method',
                    displayOptions: {
                        show: {
                            operation: ['subscribe'],
                        },
                    },
                },
                // Unsubscribe operation fields
                {
                    displayName: 'Subscription ID',
                    name: 'subscriptionId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the subscription to cancel',
                    displayOptions: {
                        show: {
                            operation: ['unsubscribe'],
                        },
                    },
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Timeout (seconds)',
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
                        // Subscribe-specific additional fields
                        {
                            displayName: 'Security Headers',
                            name: 'securityHeaders',
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
                                            description: 'Security header name (e.g., X-Webhook-Signature)',
                                        },
                                        {
                                            displayName: 'Value',
                                            name: 'value',
                                            type: 'string',
                                            default: '',
                                            description: 'Security header value',
                                        },
                                    ],
                                },
                            ],
                            displayOptions: {
                                show: {
                                    '/operation': ['subscribe'],
                                },
                            },
                        },
                        {
                            displayName: 'Retry Policy',
                            name: 'retryPolicy',
                            type: 'options',
                            options: [
                                {
                                    name: 'Standard',
                                    value: 'standard',
                                },
                                {
                                    name: 'Fast',
                                    value: 'fast',
                                },
                                {
                                    name: 'None',
                                    value: 'none',
                                },
                            ],
                            default: 'standard',
                            description: 'Retry policy for failed webhook deliveries',
                            displayOptions: {
                                show: {
                                    '/operation': ['subscribe'],
                                },
                            },
                        },
                        {
                            displayName: 'DLQ Enabled',
                            name: 'dlqEnabled',
                            type: 'boolean',
                            default: false,
                            description: 'Enable Dead Letter Queue for failed events',
                            displayOptions: {
                                show: {
                                    '/operation': ['subscribe'],
                                },
                            },
                        },
                    ],
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
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                const environment = this.getNodeParameter('environment', i);
                const overrideBaseUrl = this.getNodeParameter('overrideBaseUrl', i);
                const additionalFields = this.getNodeParameter('additionalFields', i, {});
                const additionalHeaders = this.getNodeParameter('additionalHeaders', i);
                const timeout = (_a = additionalFields.timeout) !== null && _a !== void 0 ? _a : 30;
                const retryOn5xx = (_b = additionalFields.retryOn5xx) !== null && _b !== void 0 ? _b : true;
                const maxRetries = (_c = additionalFields.maxRetries) !== null && _c !== void 0 ? _c : 2;
                const responseFormat = (_d = additionalFields.responseFormat) !== null && _d !== void 0 ? _d : 'json';
                // Determine base URL
                let baseUrl = overrideBaseUrl;
                if (!baseUrl) {
                    baseUrl = environment === 'prod'
                        ? 'https://d51z3o93bhujm.cloudfront.net'
                        : 'https://4lhcdoghbl.execute-api.eu-central-1.amazonaws.com/dev';
                }
                // Build headers
                const headers = {
                    'Content-Type': 'application/json',
                };
                if (additionalHeaders === null || additionalHeaders === void 0 ? void 0 : additionalHeaders.headers) {
                    for (const header of additionalHeaders.headers) {
                        if (header.name && header.value) {
                            headers[header.name] = header.value;
                        }
                    }
                }
                // Determine request parameters based on operation
                let method;
                let endpoint;
                let body = undefined;
                switch (operation) {
                    case 'subscribe':
                        method = 'POST';
                        endpoint = '/events/subscribe';
                        // Build security headers if provided
                        const securityHeaders = {};
                        if ((_e = additionalFields.securityHeaders) === null || _e === void 0 ? void 0 : _e.headers) {
                            for (const header of additionalFields.securityHeaders.headers) {
                                if (header.name && header.value) {
                                    securityHeaders[header.name] = header.value;
                                }
                            }
                        }
                        body = {
                            eventTypes: this.getNodeParameter('eventTypes', i),
                            callbackUrl: this.getNodeParameter('callbackUrl', i),
                            deliveryMethod: this.getNodeParameter('deliveryMethod', i, 'webhook'),
                            securityHeaders,
                            retryPolicy: (_f = additionalFields.retryPolicy) !== null && _f !== void 0 ? _f : 'standard',
                            dlqEnabled: (_g = additionalFields.dlqEnabled) !== null && _g !== void 0 ? _g : false,
                        };
                        break;
                    case 'unsubscribe':
                        method = 'DELETE';
                        const subscriptionId = this.getNodeParameter('subscriptionId', i);
                        endpoint = `/events/subscriptions/${encodeURIComponent(subscriptionId)}`;
                        break;
                    case 'listSubscriptions':
                        method = 'GET';
                        endpoint = '/events/subscriptions';
                        break;
                    default:
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
                // Make request with retry logic
                let retryCount = 0;
                let response;
                while (retryCount <= maxRetries) {
                    try {
                        response = await this.helpers.requestWithAuthentication.call(this, 'aiMarketplaceApi', {
                            method,
                            url: `${baseUrl}${endpoint}`,
                            headers,
                            timeout: timeout * 1000,
                            json: responseFormat === 'json',
                            body: body ? (responseFormat === 'json' ? body : JSON.stringify(body)) : undefined,
                        });
                        break;
                    }
                    catch (error) {
                        const isRetryableError = retryOn5xx && ((_h = error.response) === null || _h === void 0 ? void 0 : _h.status) >= 500;
                        if (retryCount < maxRetries && isRetryableError) {
                            retryCount++;
                            // Exponential backoff: 2^retryCount seconds
                            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                            continue;
                        }
                        throw error;
                    }
                }
                returnData.push({
                    json: responseFormat === 'json' ? response : { data: response },
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
exports.AiMarketplaceEvents = AiMarketplaceEvents;
