"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceFeedbackCreate = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceFeedbackCreate {
    constructor() {
        this.description = {
            displayName: 'Marketplace Feedback: Create',
            name: 'aiMarketplaceFeedbackCreate',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '=Create feedback',
            description: 'Create feedback for a completed offer',
            defaults: {
                name: 'Marketplace Feedback: Create',
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
                    displayName: 'Offer ID',
                    name: 'offerId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the completed offer to provide feedback for',
                },
                {
                    displayName: 'Quality Rating',
                    name: 'quality',
                    type: 'number',
                    required: true,
                    default: 5,
                    typeOptions: {
                        minValue: 1,
                        maxValue: 5,
                        numberStepSize: 1,
                    },
                    description: 'Quality rating from 1 to 5',
                },
                {
                    displayName: 'Delivery Time Rating',
                    name: 'deliveryTime',
                    type: 'number',
                    required: true,
                    default: 5,
                    typeOptions: {
                        minValue: 1,
                        maxValue: 5,
                        numberStepSize: 1,
                    },
                    description: 'Delivery time rating from 1 to 5',
                },
                {
                    displayName: 'Price Rating',
                    name: 'price',
                    type: 'number',
                    required: true,
                    default: 5,
                    typeOptions: {
                        minValue: 1,
                        maxValue: 5,
                        numberStepSize: 1,
                    },
                    description: 'Price rating from 1 to 5',
                },
                {
                    displayName: 'Comment',
                    name: 'comment',
                    type: 'string',
                    default: '',
                    typeOptions: {
                        rows: 3,
                        maxLength: 512,
                    },
                    description: 'Optional comment (max 512 characters)',
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
        var _a;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const environment = this.getNodeParameter('environment', i);
                const overrideBaseUrl = this.getNodeParameter('overrideBaseUrl', i);
                const offerId = this.getNodeParameter('offerId', i);
                const quality = this.getNodeParameter('quality', i);
                const deliveryTime = this.getNodeParameter('deliveryTime', i);
                const price = this.getNodeParameter('price', i);
                const comment = this.getNodeParameter('comment', i);
                const timeout = this.getNodeParameter('timeout', i);
                const retryOn5xx = this.getNodeParameter('retryOn5xx', i);
                const maxRetries = this.getNodeParameter('maxRetries', i);
                const additionalHeaders = this.getNodeParameter('additionalHeaders', i);
                const responseFormat = this.getNodeParameter('responseFormat', i);
                // Validate rating values
                if (quality < 1 || quality > 5 || !Number.isInteger(quality)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Quality rating must be an integer between 1 and 5');
                }
                if (deliveryTime < 1 || deliveryTime > 5 || !Number.isInteger(deliveryTime)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Delivery time rating must be an integer between 1 and 5');
                }
                if (price < 1 || price > 5 || !Number.isInteger(price)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Price rating must be an integer between 1 and 5');
                }
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
                // Build request body
                const body = {
                    offerId,
                    quality,
                    deliveryTime,
                    price,
                };
                if (comment)
                    body.comment = comment;
                // Make request with retry logic
                let retryCount = 0;
                let response;
                while (retryCount <= maxRetries) {
                    try {
                        response = await this.helpers.requestWithAuthentication.call(this, 'aiMarketplaceApi', {
                            method: 'POST',
                            url: `${baseUrl}/feedback-v2`,
                            headers,
                            timeout: timeout * 1000,
                            json: responseFormat === 'json',
                            body: responseFormat === 'json' ? body : JSON.stringify(body),
                        });
                        break;
                    }
                    catch (error) {
                        const isRetryableError = retryOn5xx && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) >= 500;
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
exports.AiMarketplaceFeedbackCreate = AiMarketplaceFeedbackCreate;
