"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceStatsLots = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceStatsLots {
    constructor() {
        this.description = {
            displayName: 'Marketplace Stats: Lots',
            name: 'aiMarketplaceStatsLots',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '=Get lot statistics',
            description: 'Get lot statistics with optional grouping and sorting',
            defaults: {
                name: 'Marketplace Stats: Lots',
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
                    displayName: 'Group By',
                    name: 'groupBy',
                    type: 'options',
                    options: [
                        {
                            name: 'Category',
                            value: 'category',
                        },
                    ],
                    default: '',
                    description: 'Group statistics by field',
                },
                {
                    displayName: 'Sort',
                    name: 'sort',
                    type: 'options',
                    options: [
                        {
                            name: 'Category ID',
                            value: 'catId',
                        },
                        {
                            name: 'Count',
                            value: 'count',
                        },
                    ],
                    default: 'count',
                    description: 'Sort field',
                },
                {
                    displayName: 'Order',
                    name: 'order',
                    type: 'options',
                    options: [
                        {
                            name: 'Ascending',
                            value: 'asc',
                        },
                        {
                            name: 'Descending',
                            value: 'desc',
                        },
                    ],
                    default: 'desc',
                    description: 'Sort order',
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
                const groupBy = this.getNodeParameter('groupBy', i);
                const sort = this.getNodeParameter('sort', i);
                const order = this.getNodeParameter('order', i);
                const timeout = this.getNodeParameter('timeout', i);
                const retryOn5xx = this.getNodeParameter('retryOn5xx', i);
                const maxRetries = this.getNodeParameter('maxRetries', i);
                const additionalHeaders = this.getNodeParameter('additionalHeaders', i);
                const responseFormat = this.getNodeParameter('responseFormat', i);
                // Determine base URL
                let baseUrl = overrideBaseUrl;
                if (!baseUrl) {
                    baseUrl = environment === 'prod'
                        ? 'https://d51z3o93bhujm.cloudfront.net'
                        : 'https://4lhcdoghbl.execute-api.eu-central-1.amazonaws.com/dev';
                }
                // Build query parameters
                const queryParams = [];
                if (groupBy)
                    queryParams.push(`groupBy=${encodeURIComponent(groupBy)}`);
                if (sort)
                    queryParams.push(`sort=${encodeURIComponent(sort)}`);
                if (order)
                    queryParams.push(`order=${encodeURIComponent(order)}`);
                const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
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
                // Make request with retry logic
                let retryCount = 0;
                let response;
                while (retryCount <= maxRetries) {
                    try {
                        response = await this.helpers.request({
                            method: 'GET',
                            url: `${baseUrl}/stats-v2/lots${queryString}`,
                            headers,
                            timeout: timeout * 1000,
                            json: responseFormat === 'json',
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
exports.AiMarketplaceStatsLots = AiMarketplaceStatsLots;
