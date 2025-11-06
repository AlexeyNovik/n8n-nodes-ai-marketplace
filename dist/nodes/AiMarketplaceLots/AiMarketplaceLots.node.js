"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceLots = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceLots {
    constructor() {
        this.description = {
            displayName: 'AI Marketplace Lots',
            name: 'aiMarketplaceLots',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage lots on AI Marketplace',
            defaults: {
                name: 'AI Marketplace Lots',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aiMarketplaceApi',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['create', 'close', 'reopen'],
                        },
                    },
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
                            name: 'List',
                            value: 'list',
                            description: 'List all lots with optional client-side limiting',
                            action: 'List lots',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create new lot (requires authentication)',
                            action: 'Create lot',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get specific lot by ID',
                            action: 'Get lot',
                        },
                        {
                            name: 'Close',
                            value: 'close',
                            description: 'Close a lot (lot owner/admin only)',
                            action: 'Close lot',
                        },
                        {
                            name: 'Reopen',
                            value: 'reopen',
                            description: 'Reopen a closed lot (lot owner/admin only)',
                            action: 'Reopen lot',
                        },
                    ],
                    default: 'list',
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
                // Get/Close/Reopen operations need Lot ID
                {
                    displayName: 'Lot ID',
                    name: 'lotId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the lot',
                    displayOptions: {
                        show: {
                            operation: ['get', 'close', 'reopen'],
                        },
                    },
                },
                // Create operation fields
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'Lot title',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Description',
                    name: 'description',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'Lot description',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Category',
                    name: 'category',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'Lot category',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Budget',
                    name: 'budget',
                    type: 'number',
                    required: true,
                    default: 0,
                    description: 'Lot budget',
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
                    displayName: 'Timeline',
                    name: 'timeline',
                    type: 'string',
                    default: '',
                    description: 'Expected timeline',
                    displayOptions: {
                        show: {
                            operation: ['create'],
                        },
                    },
                },
                // List operation fields
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    default: 0,
                    description: 'Maximum number of lots to return (0 for no limit)',
                    displayOptions: {
                        show: {
                            operation: ['list'],
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
                let useAuth = false;
                switch (operation) {
                    case 'list':
                        method = 'GET';
                        endpoint = '/lots-v2';
                        break;
                    case 'create':
                        method = 'POST';
                        endpoint = '/lots-v2';
                        useAuth = true;
                        body = {
                            title: this.getNodeParameter('title', i),
                            description: this.getNodeParameter('description', i),
                            category: this.getNodeParameter('category', i),
                            budget: this.getNodeParameter('budget', i),
                            currency: this.getNodeParameter('currency', i, 'USD'),
                            timeline: this.getNodeParameter('timeline', i, ''),
                        };
                        break;
                    case 'get':
                        method = 'GET';
                        const getLotId = this.getNodeParameter('lotId', i);
                        endpoint = `/lots-v2/${encodeURIComponent(getLotId)}`;
                        break;
                    case 'close':
                        method = 'PATCH';
                        const closeLotId = this.getNodeParameter('lotId', i);
                        endpoint = `/lots-v2/${encodeURIComponent(closeLotId)}/close`;
                        useAuth = true;
                        break;
                    case 'reopen':
                        method = 'PATCH';
                        const reopenLotId = this.getNodeParameter('lotId', i);
                        endpoint = `/lots-v2/${encodeURIComponent(reopenLotId)}/reopen`;
                        useAuth = true;
                        break;
                    default:
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
                // Make request with retry logic
                let retryCount = 0;
                let response;
                while (retryCount <= maxRetries) {
                    try {
                        if (useAuth) {
                            response = await this.helpers.requestWithAuthentication.call(this, 'aiMarketplaceApi', {
                                method,
                                url: `${baseUrl}${endpoint}`,
                                headers,
                                timeout: timeout * 1000,
                                json: responseFormat === 'json',
                                body: body ? (responseFormat === 'json' ? body : JSON.stringify(body)) : undefined,
                            });
                        }
                        else {
                            response = await this.helpers.request({
                                method,
                                url: `${baseUrl}${endpoint}`,
                                headers,
                                timeout: timeout * 1000,
                                json: responseFormat === 'json',
                                body: body ? (responseFormat === 'json' ? body : JSON.stringify(body)) : undefined,
                            });
                        }
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
                // Apply client-side limiting for list operation (MCP compatibility)
                if (operation === 'list' && responseFormat === 'json') {
                    const limit = this.getNodeParameter('limit', i, 0);
                    if (limit > 0 && (response === null || response === void 0 ? void 0 : response.lots) && Array.isArray(response.lots)) {
                        response.lots = response.lots.slice(0, limit);
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
exports.AiMarketplaceLots = AiMarketplaceLots;
