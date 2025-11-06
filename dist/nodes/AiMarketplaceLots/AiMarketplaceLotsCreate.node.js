"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceLotsCreate = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class AiMarketplaceLotsCreate {
    constructor() {
        this.description = {
            displayName: 'Marketplace Lots: Create',
            name: 'aiMarketplaceLotsCreate',
            icon: 'file:aimarketplace.svg',
            group: ['output'],
            version: 1,
            subtitle: '=Create lot',
            description: 'Create a new lot in the marketplace',
            defaults: {
                name: 'Marketplace Lots: Create',
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
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    required: true,
                    default: '',
                    typeOptions: {
                        maxLength: 512,
                    },
                    description: 'Lot title (max 512 characters)',
                },
                {
                    displayName: 'Pricing Type',
                    name: 'pricingType',
                    type: 'options',
                    required: true,
                    options: [
                        {
                            name: 'Fixed',
                            value: 'fixed',
                        },
                        {
                            name: 'Auction',
                            value: 'auction',
                        },
                    ],
                    default: 'fixed',
                    description: 'Pricing model for the lot',
                },
                {
                    displayName: 'Price',
                    name: 'price',
                    type: 'number',
                    required: true,
                    default: 0,
                    typeOptions: {
                        minValue: 0,
                    },
                    description: 'Starting price (minimum 0)',
                },
                {
                    displayName: 'Category ID',
                    name: 'catId',
                    type: 'string',
                    default: '',
                    description: 'Category identifier',
                },
                {
                    displayName: 'Description',
                    name: 'description',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                        maxLength: 8192,
                    },
                    default: '',
                    description: 'Lot description (max 8192 characters)',
                },
                {
                    displayName: 'Price Step',
                    name: 'priceStep',
                    type: 'number',
                    default: 0,
                    typeOptions: {
                        minValue: 0,
                    },
                    description: 'Price increment for auctions (minimum 0)',
                },
                {
                    displayName: 'Buy Now',
                    name: 'buyNow',
                    type: 'boolean',
                    default: false,
                    description: 'Enable buy now option',
                },
                {
                    displayName: 'Buy Now Price',
                    name: 'buyNowPrice',
                    type: 'number',
                    default: 0,
                    typeOptions: {
                        minValue: 0,
                    },
                    description: 'Buy now price (minimum 0)',
                    displayOptions: {
                        show: {
                            buyNow: [true],
                        },
                    },
                },
                {
                    displayName: 'Amount Limit',
                    name: 'amountLimit',
                    type: 'boolean',
                    default: false,
                    description: 'Enable quantity limits',
                },
                {
                    displayName: 'Amount Available',
                    name: 'amountAvailable',
                    type: 'number',
                    default: 1,
                    typeOptions: {
                        minValue: 0,
                    },
                    description: 'Available quantity (minimum 0)',
                    displayOptions: {
                        show: {
                            amountLimit: [true],
                        },
                    },
                },
                {
                    displayName: 'End Date',
                    name: 'endDate',
                    type: 'dateTime',
                    default: '',
                    description: 'Lot expiration date',
                },
                {
                    displayName: 'Visible to Agent IDs',
                    name: 'visibleToAgentIds',
                    type: 'string',
                    default: '',
                    placeholder: 'agent1,agent2,agent3',
                    description: 'Comma-separated list of agent IDs that can see this lot',
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
                const title = this.getNodeParameter('title', i);
                const pricingType = this.getNodeParameter('pricingType', i);
                const price = this.getNodeParameter('price', i);
                const catId = this.getNodeParameter('catId', i);
                const description = this.getNodeParameter('description', i);
                const priceStep = this.getNodeParameter('priceStep', i);
                const buyNow = this.getNodeParameter('buyNow', i);
                const buyNowPrice = this.getNodeParameter('buyNowPrice', i, 0);
                const amountLimit = this.getNodeParameter('amountLimit', i);
                const amountAvailable = this.getNodeParameter('amountAvailable', i, 1);
                const endDate = this.getNodeParameter('endDate', i);
                const visibleToAgentIdsString = this.getNodeParameter('visibleToAgentIds', i);
                const timeout = this.getNodeParameter('timeout', i);
                const retryOn5xx = this.getNodeParameter('retryOn5xx', i);
                const maxRetries = this.getNodeParameter('maxRetries', i);
                const additionalHeaders = this.getNodeParameter('additionalHeaders', i);
                const responseFormat = this.getNodeParameter('responseFormat', i);
                // Parse visible to agent IDs
                const visibleToAgentIds = visibleToAgentIdsString
                    ? visibleToAgentIdsString.split(',').map(id => id.trim()).filter(id => id.length > 0)
                    : [];
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
                    title,
                    pricingType,
                    price,
                };
                if (catId)
                    body.catId = catId;
                if (description)
                    body.description = description;
                if (priceStep > 0)
                    body.priceStep = priceStep;
                if (buyNow)
                    body.buyNow = buyNow;
                if (buyNow && buyNowPrice > 0)
                    body.buyNowPrice = buyNowPrice;
                if (amountLimit)
                    body.amountLimit = amountLimit;
                if (amountLimit && amountAvailable >= 0)
                    body.amountAvailable = amountAvailable;
                if (endDate)
                    body.endDate = endDate;
                if (visibleToAgentIds.length > 0)
                    body.visibleToAgentIds = visibleToAgentIds;
                // Make request with retry logic
                let retryCount = 0;
                let response;
                while (retryCount <= maxRetries) {
                    try {
                        response = await this.helpers.requestWithAuthentication.call(this, 'aiMarketplaceApi', {
                            method: 'POST',
                            url: `${baseUrl}/lots-v2`,
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
exports.AiMarketplaceLotsCreate = AiMarketplaceLotsCreate;
