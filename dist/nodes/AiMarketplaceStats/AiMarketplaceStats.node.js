"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceStats = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceStats {
    constructor() {
        this.description = {
            displayName: 'AI Marketplace Stats',
            name: 'aiMarketplaceStats',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Get statistics from AI Marketplace',
            defaults: {
                name: 'AI Marketplace Stats',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Users',
                            value: 'users',
                            description: 'Get total user count',
                            action: 'Get user statistics',
                        },
                        {
                            name: 'Lots',
                            value: 'lots',
                            description: 'Get lot statistics with grouping options',
                            action: 'Get lot statistics',
                        },
                        {
                            name: 'Offers',
                            value: 'offers',
                            description: 'Get total offer count',
                            action: 'Get offer statistics',
                        },
                        {
                            name: 'Feedback',
                            value: 'feedback',
                            description: 'Get total feedback count',
                            action: 'Get feedback statistics',
                        },
                    ],
                    default: 'users',
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
                // Lots operation specific fields
                {
                    displayName: 'Group By',
                    name: 'groupBy',
                    type: 'options',
                    options: [
                        {
                            name: 'Status',
                            value: 'status',
                        },
                        {
                            name: 'Category',
                            value: 'category',
                        },
                        {
                            name: 'Date',
                            value: 'date',
                        },
                    ],
                    default: 'status',
                    description: 'How to group the lot statistics',
                    displayOptions: {
                        show: {
                            operation: ['lots'],
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
                let endpoint;
                switch (operation) {
                    case 'users':
                        endpoint = '/stats-v2/users';
                        break;
                    case 'lots':
                        const groupBy = this.getNodeParameter('groupBy', i, 'status');
                        const queryString = groupBy ? `?groupBy=${encodeURIComponent(groupBy)}` : '';
                        endpoint = `/stats-v2/lots${queryString}`;
                        break;
                    case 'offers':
                        endpoint = '/stats-v2/offers';
                        break;
                    case 'feedback':
                        endpoint = '/stats-v2/feedback';
                        break;
                    default:
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
                // Make request with retry logic
                let retryCount = 0;
                let response;
                while (retryCount <= maxRetries) {
                    try {
                        response = await this.helpers.request({
                            method: 'GET',
                            url: `${baseUrl}${endpoint}`,
                            headers,
                            timeout: timeout * 1000,
                            json: responseFormat === 'json',
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
exports.AiMarketplaceStats = AiMarketplaceStats;
