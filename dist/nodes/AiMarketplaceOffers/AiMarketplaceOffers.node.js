"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceOffers = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceOffers {
    constructor() {
        this.description = {
            displayName: 'AI Marketplace Offers',
            name: 'aiMarketplaceOffers',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage offers on AI Marketplace',
            defaults: {
                name: 'AI Marketplace Offers',
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
                            name: 'Create',
                            value: 'create',
                            description: 'Create offer on lot',
                            action: 'Create offer',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get specific offer by ID',
                            action: 'Get offer',
                        },
                        {
                            name: 'Accept',
                            value: 'accept',
                            description: 'Accept offer (seller only)',
                            action: 'Accept offer',
                        },
                        {
                            name: 'Reject',
                            value: 'reject',
                            description: 'Reject offer (seller only)',
                            action: 'Reject offer',
                        },
                        {
                            name: 'Complete',
                            value: 'complete',
                            description: 'Mark offer as completed (seller only)',
                            action: 'Complete offer',
                        },
                        {
                            name: 'Cancel',
                            value: 'cancel',
                            description: 'Cancel offer (buyer only)',
                            action: 'Cancel offer',
                        },
                    ],
                    default: 'create',
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
                // Get/Accept/Reject/Complete/Cancel operations need Offer ID
                {
                    displayName: 'Offer ID',
                    name: 'offerId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the offer',
                    displayOptions: {
                        show: {
                            operation: ['get', 'accept', 'reject', 'complete', 'cancel'],
                        },
                    },
                },
                // Create operation fields
                {
                    displayName: 'Lot ID',
                    name: 'lotId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the lot to make offer on',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Amount',
                    name: 'amount',
                    type: 'number',
                    required: true,
                    default: 0,
                    description: 'Offer amount',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Currency',
                    name: 'currency',
                    type: 'string',
                    default: 'USD',
                    description: 'Currency code',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    default: '',
                    description: 'Optional message to seller',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Timeline',
                    name: 'timeline',
                    type: 'string',
                    default: '',
                    description: 'Proposed timeline',
                    displayOptions: {
                        show: {
                            operation: ['create'],
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
        var _a, _b, _c, _d, _e;
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
                    case 'create':
                        method = 'POST';
                        endpoint = '/offers-v2';
                        body = {
                            lotId: this.getNodeParameter('lotId', i),
                            amount: this.getNodeParameter('amount', i),
                            currency: this.getNodeParameter('currency', i, 'USD'),
                            message: this.getNodeParameter('message', i, ''),
                            timeline: this.getNodeParameter('timeline', i, ''),
                        };
                        break;
                    case 'get':
                        method = 'GET';
                        const getOfferId = this.getNodeParameter('offerId', i);
                        endpoint = `/offers-v2/${encodeURIComponent(getOfferId)}`;
                        break;
                    case 'accept':
                        method = 'PATCH';
                        const acceptOfferId = this.getNodeParameter('offerId', i);
                        endpoint = `/offers-v2/${encodeURIComponent(acceptOfferId)}/accept`;
                        break;
                    case 'reject':
                        method = 'PATCH';
                        const rejectOfferId = this.getNodeParameter('offerId', i);
                        endpoint = `/offers-v2/${encodeURIComponent(rejectOfferId)}/reject`;
                        break;
                    case 'complete':
                        method = 'PATCH';
                        const completeOfferId = this.getNodeParameter('offerId', i);
                        endpoint = `/offers-v2/${encodeURIComponent(completeOfferId)}/complete`;
                        break;
                    case 'cancel':
                        method = 'PATCH';
                        const cancelOfferId = this.getNodeParameter('offerId', i);
                        endpoint = `/offers-v2/${encodeURIComponent(cancelOfferId)}/cancel`;
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
                        const isRetryableError = retryOn5xx && ((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) >= 500;
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
exports.AiMarketplaceOffers = AiMarketplaceOffers;
