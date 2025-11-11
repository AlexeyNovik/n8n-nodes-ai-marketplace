"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplace = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Validates that an ID parameter is safe for use in URLs
 * Prevents path traversal and URL injection attacks
 */
function validateId(id, paramName) {
    if (!id || typeof id !== 'string') {
        throw new Error(`${paramName} is required and must be a string`);
    }
    // Check for path traversal attempts
    if (id.includes('..') || id.includes('/') || id.includes('\\')) {
        throw new Error(`${paramName} contains invalid characters (path traversal attempt detected)`);
    }
    // Check for URL-unsafe characters that could enable injection
    if (id.includes('%') || id.includes('?') || id.includes('#') || id.includes('&')) {
        throw new Error(`${paramName} contains invalid characters`);
    }
    // Ensure reasonable length (UUIDs are typically < 50 chars)
    if (id.length > 100) {
        throw new Error(`${paramName} exceeds maximum length of 100 characters`);
    }
    // Check for control characters
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x1F\x7F]/.test(id)) {
        throw new Error(`${paramName} contains invalid control characters`);
    }
}
/**
 * Validates that a callback URL uses HTTPS protocol
 * Required for secure webhook delivery
 */
function validateCallbackUrl(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('Callback URL is required');
    }
    // Parse URL to check protocol
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'https:') {
            throw new Error('Callback URL must use HTTPS protocol for security. HTTP is not allowed.');
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Invalid callback URL format');
        }
        throw error;
    }
}
/**
 * Sanitizes and validates text input fields
 * Prevents excessively long inputs and potential injection attacks
 */
function sanitizeTextInput(input, fieldName, maxLength) {
    if (!input) {
        return input;
    }
    if (typeof input !== 'string') {
        throw new Error(`${fieldName} must be a string`);
    }
    // Trim whitespace
    const trimmed = input.trim();
    // Check length
    if (trimmed.length > maxLength) {
        throw new Error(`${fieldName} exceeds maximum length of ${maxLength} characters (current: ${trimmed.length})`);
    }
    // Check for control characters (except newlines and tabs which are acceptable in text)
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(trimmed)) {
        throw new Error(`${fieldName} contains invalid control characters`);
    }
    return trimmed;
}
/**
 * Validates numeric input fields
 * Ensures values are within acceptable ranges
 */
function validateNumericInput(value, fieldName, min, max) {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`${fieldName} must be a valid number`);
    }
    if (!isFinite(value)) {
        throw new Error(`${fieldName} must be a finite number`);
    }
    if (value < min) {
        throw new Error(`${fieldName} must be at least ${min} (current: ${value})`);
    }
    if (value > max) {
        throw new Error(`${fieldName} must not exceed ${max} (current: ${value})`);
    }
    return value;
}
class AiMarketplace {
    constructor() {
        this.description = {
            displayName: 'AI Marketplace',
            name: 'aiMarketplace',
            icon: 'file:aimarketplace.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
            description: 'Interact with AI Marketplace API',
            defaults: {
                name: 'AI Marketplace',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'aiMarketplaceApi',
                    required: false,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Authentication',
                            value: 'auth',
                        },
                        {
                            name: 'Health',
                            value: 'health',
                        },
                        {
                            name: 'Statistics',
                            value: 'stats',
                        },
                        {
                            name: 'Lots',
                            value: 'lots',
                        },
                        {
                            name: 'Offers',
                            value: 'offers',
                        },
                        {
                            name: 'Feedback',
                            value: 'feedback',
                        },
                        {
                            name: 'Events',
                            value: 'events',
                        },
                        {
                            name: 'Categories',
                            value: 'categories',
                        },
                        {
                            name: 'Admin',
                            value: 'admin',
                        },
                    ],
                    default: 'auth',
                    description: 'The resource to operate on',
                },
                // Authentication Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['auth'],
                        },
                    },
                    options: [
                        {
                            name: 'Login',
                            value: 'login',
                            description: 'Authenticate user and obtain access tokens',
                            action: 'Login to AI Marketplace',
                        },
                        {
                            name: 'Signup',
                            value: 'signup',
                            description: 'Register new user account',
                            action: 'Sign up for AI Marketplace',
                        },
                    ],
                    default: 'login',
                    description: 'The operation to perform',
                },
                // Health Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['health'],
                        },
                    },
                    options: [
                        {
                            name: 'Check',
                            value: 'check',
                            description: 'Check API health status',
                            action: 'Get health status',
                        },
                    ],
                    default: 'check',
                    description: 'The operation to perform',
                },
                // Stats Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['stats'],
                        },
                    },
                    options: [
                        {
                            name: 'Users',
                            value: 'users',
                            description: 'Get total user count',
                            action: 'Get user statistics',
                        },
                        {
                            name: 'Lots',
                            value: 'lotsStats',
                            description: 'Get lot statistics with grouping options',
                            action: 'Get lot statistics',
                        },
                        {
                            name: 'Offers',
                            value: 'offersStats',
                            description: 'Get total offer count',
                            action: 'Get offer statistics',
                        },
                        {
                            name: 'Feedback',
                            value: 'feedbackStats',
                            description: 'Get total feedback count',
                            action: 'Get feedback statistics',
                        },
                    ],
                    default: 'users',
                    description: 'The operation to perform',
                },
                // Lots Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['lots'],
                        },
                    },
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
                // Offers Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['offers'],
                        },
                    },
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
                // Feedback Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['feedback'],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create feedback for completed offer',
                            action: 'Create feedback',
                        },
                    ],
                    default: 'create',
                    description: 'The operation to perform',
                },
                // Events Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['events'],
                        },
                    },
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
                // Categories Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['categories'],
                        },
                    },
                    options: [
                        {
                            name: 'List',
                            value: 'list',
                            description: 'List all available categories',
                            action: 'List categories',
                        },
                    ],
                    default: 'list',
                    description: 'The operation to perform',
                },
                // Admin Operations
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['admin'],
                        },
                    },
                    options: [
                        {
                            name: 'Initialize Categories',
                            value: 'initCategories',
                            description: 'Initialize default categories (requires authentication and admin privileges)',
                            action: 'Initialize categories',
                        },
                    ],
                    default: 'initCategories',
                    description: 'The operation to perform',
                },
                // Common Environment Settings
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
                // Auth Fields
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'User email address',
                    displayOptions: {
                        show: {
                            resource: ['auth'],
                        },
                    },
                    typeOptions: {
                        validation: [
                            {
                                type: 'email',
                            },
                        ],
                    },
                },
                {
                    displayName: 'Password',
                    name: 'password',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    required: true,
                    default: '',
                    description: 'User password',
                    displayOptions: {
                        show: {
                            resource: ['auth'],
                        },
                    },
                },
                {
                    displayName: 'Display Name',
                    name: 'displayName',
                    type: 'string',
                    default: '',
                    description: 'Display name for new user account',
                    displayOptions: {
                        show: {
                            resource: ['auth'],
                            operation: ['signup'],
                        },
                    },
                },
                // Stats Fields
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
                            resource: ['stats'],
                            operation: ['lotsStats'],
                        },
                    },
                },
                // Lots Fields
                {
                    displayName: 'Lot ID',
                    name: 'lotId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the lot',
                    displayOptions: {
                        show: {
                            resource: ['lots'],
                            operation: ['get', 'close', 'reopen'],
                        },
                    },
                },
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'Lot title (max 200 characters)',
                    displayOptions: {
                        show: {
                            resource: ['lots'],
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
                    description: 'Lot description (max 5000 characters)',
                    displayOptions: {
                        show: {
                            resource: ['lots'],
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
                            resource: ['lots'],
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
                            resource: ['lots'],
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
                            resource: ['lots'],
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
                            resource: ['lots'],
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    default: 0,
                    description: 'Maximum number of lots to return (0 for no limit)',
                    displayOptions: {
                        show: {
                            resource: ['lots'],
                            operation: ['list'],
                        },
                    },
                },
                // Offers Fields
                {
                    displayName: 'Offer ID',
                    name: 'offerId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the offer',
                    displayOptions: {
                        show: {
                            resource: ['offers'],
                            operation: ['get', 'accept', 'reject', 'complete', 'cancel'],
                        },
                    },
                },
                {
                    displayName: 'Lot ID',
                    name: 'lotId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the lot to make offer on',
                    displayOptions: {
                        show: {
                            resource: ['offers'],
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
                            resource: ['offers'],
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
                            resource: ['offers'],
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    default: '',
                    description: 'Optional message to seller (max 1000 characters)',
                    displayOptions: {
                        show: {
                            resource: ['offers'],
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
                            resource: ['offers'],
                            operation: ['create'],
                        },
                    },
                },
                // Feedback Fields
                {
                    displayName: 'Offer ID',
                    name: 'offerId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the completed offer',
                    displayOptions: {
                        show: {
                            resource: ['feedback'],
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Rating',
                    name: 'rating',
                    type: 'number',
                    required: true,
                    default: 5,
                    description: 'Rating from 1-5',
                    displayOptions: {
                        show: {
                            resource: ['feedback'],
                            operation: ['create'],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                        maxValue: 5,
                    },
                },
                {
                    displayName: 'Comment',
                    name: 'comment',
                    type: 'string',
                    default: '',
                    description: 'Optional feedback comment (max 512 characters)',
                    displayOptions: {
                        show: {
                            resource: ['feedback'],
                            operation: ['create'],
                        },
                    },
                    typeOptions: {
                        maxLength: 512,
                    },
                },
                // Events Fields
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
                            resource: ['events'],
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
                    description: 'HTTPS callback URL for webhook events (HTTPS required for security, HTTP not allowed)',
                    displayOptions: {
                        show: {
                            resource: ['events'],
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
                            resource: ['events'],
                            operation: ['subscribe'],
                        },
                    },
                },
                {
                    displayName: 'Subscription ID',
                    name: 'subscriptionId',
                    type: 'string',
                    required: true,
                    default: '',
                    description: 'The ID of the subscription to cancel',
                    displayOptions: {
                        show: {
                            resource: ['events'],
                            operation: ['unsubscribe'],
                        },
                    },
                },
                // Stats Time Span Field
                {
                    displayName: 'Time Span',
                    name: 'timeSpan',
                    type: 'options',
                    options: [
                        {
                            name: 'Today',
                            value: 'today',
                        },
                        {
                            name: '7 Days',
                            value: '7 days',
                        },
                        {
                            name: '30 Days',
                            value: '30 days',
                        },
                        {
                            name: 'All Time',
                            value: 'all time',
                        },
                    ],
                    default: 'all time',
                    description: 'Time period for statistics with period-over-period comparison',
                    displayOptions: {
                        show: {
                            resource: ['stats'],
                            operation: ['users', 'lotsStats', 'offersStats', 'feedbackStats'],
                        },
                    },
                },
                // Additional Options
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
            ],
        };
    }
    async execute() {
        var _a, _b, _c;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                const environment = this.getNodeParameter('environment', i);
                const overrideBaseUrl = this.getNodeParameter('overrideBaseUrl', i);
                const additionalFields = this.getNodeParameter('additionalFields', i, {});
                const timeout = (_a = additionalFields.timeout) !== null && _a !== void 0 ? _a : 30;
                const responseFormat = (_b = additionalFields.responseFormat) !== null && _b !== void 0 ? _b : 'json';
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
                // Determine request parameters based on resource and operation
                let method = 'GET';
                let endpoint = '';
                let body = undefined;
                let useAuth = false;
                // Route to appropriate handler based on resource
                if (resource === 'auth') {
                    useAuth = false; // Auth endpoints don't require authentication
                    if (operation === 'login') {
                        method = 'POST';
                        endpoint = '/auth-v2/login';
                        body = {
                            email: this.getNodeParameter('email', i),
                            password: this.getNodeParameter('password', i),
                        };
                    }
                    else if (operation === 'signup') {
                        method = 'POST';
                        endpoint = '/auth-v2/signup';
                        body = {
                            email: this.getNodeParameter('email', i),
                            password: this.getNodeParameter('password', i),
                            displayName: this.getNodeParameter('displayName', i, ''),
                        };
                    }
                }
                else if (resource === 'health') {
                    useAuth = false; // Health check is public
                    method = 'GET';
                    endpoint = '/health-v2';
                }
                else if (resource === 'stats') {
                    useAuth = false; // All stats endpoints are public
                    const timeSpan = this.getNodeParameter('timeSpan', i, 'all time');
                    const timeSpanQuery = `timeSpan=${encodeURIComponent(timeSpan)}`;
                    if (operation === 'users') {
                        method = 'GET';
                        endpoint = `/stats-v2/users?${timeSpanQuery}`;
                    }
                    else if (operation === 'lotsStats') {
                        method = 'GET';
                        const groupBy = this.getNodeParameter('groupBy', i, '');
                        const queryParts = [timeSpanQuery];
                        if (groupBy)
                            queryParts.push(`groupBy=${encodeURIComponent(groupBy)}`);
                        endpoint = `/stats-v2/lots?${queryParts.join('&')}`;
                    }
                    else if (operation === 'offersStats') {
                        method = 'GET';
                        endpoint = `/stats-v2/offers?${timeSpanQuery}`;
                    }
                    else if (operation === 'feedbackStats') {
                        method = 'GET';
                        endpoint = `/stats-v2/feedback?${timeSpanQuery}`;
                    }
                }
                else if (resource === 'lots') {
                    useAuth = ['create', 'close', 'reopen'].includes(operation); // Only create, close, reopen require auth
                    if (operation === 'list') {
                        method = 'GET';
                        endpoint = '/lots-v2';
                    }
                    else if (operation === 'create') {
                        method = 'POST';
                        endpoint = '/lots-v2';
                        const title = sanitizeTextInput(this.getNodeParameter('title', i), 'Title', 200);
                        const description = sanitizeTextInput(this.getNodeParameter('description', i), 'Description', 5000);
                        const timeline = this.getNodeParameter('timeline', i, '');
                        const budget = this.getNodeParameter('budget', i);
                        validateNumericInput(budget, 'Budget', 0, 999999999);
                        body = {
                            title: title,
                            description: description,
                            category: this.getNodeParameter('category', i),
                            budget: budget,
                            currency: this.getNodeParameter('currency', i, 'USD'),
                            timeline: timeline ? sanitizeTextInput(timeline, 'Timeline', 500) : '',
                        };
                    }
                    else if (operation === 'get') {
                        method = 'GET';
                        const lotId = this.getNodeParameter('lotId', i);
                        validateId(lotId, 'Lot ID');
                        endpoint = `/lots-v2/${encodeURIComponent(lotId)}`;
                    }
                    else if (operation === 'close') {
                        method = 'POST';
                        const lotId = this.getNodeParameter('lotId', i);
                        validateId(lotId, 'Lot ID');
                        endpoint = `/lots-v2/${encodeURIComponent(lotId)}/close`;
                    }
                    else if (operation === 'reopen') {
                        method = 'POST';
                        const lotId = this.getNodeParameter('lotId', i);
                        validateId(lotId, 'Lot ID');
                        endpoint = `/lots-v2/${encodeURIComponent(lotId)}/reopen`;
                    }
                }
                else if (resource === 'offers') {
                    useAuth = true;
                    if (operation === 'create') {
                        method = 'POST';
                        endpoint = '/offers-v2';
                        const offerLotId = this.getNodeParameter('lotId', i);
                        validateId(offerLotId, 'Lot ID');
                        const message = this.getNodeParameter('message', i, '');
                        const offerTimeline = this.getNodeParameter('timeline', i, '');
                        const amount = this.getNodeParameter('amount', i);
                        validateNumericInput(amount, 'Amount', 0, 999999999);
                        body = {
                            lotId: offerLotId,
                            amount: amount,
                            currency: this.getNodeParameter('currency', i, 'USD'),
                            message: message ? sanitizeTextInput(message, 'Message', 1000) : '',
                            timeline: offerTimeline ? sanitizeTextInput(offerTimeline, 'Timeline', 500) : '',
                        };
                    }
                    else if (operation === 'get') {
                        method = 'GET';
                        const offerId = this.getNodeParameter('offerId', i);
                        validateId(offerId, 'Offer ID');
                        endpoint = `/offers-v2/${encodeURIComponent(offerId)}`;
                    }
                    else if (operation === 'accept') {
                        method = 'POST';
                        const offerId = this.getNodeParameter('offerId', i);
                        validateId(offerId, 'Offer ID');
                        endpoint = `/offers-v2/${encodeURIComponent(offerId)}/accept`;
                    }
                    else if (operation === 'reject') {
                        method = 'POST';
                        const offerId = this.getNodeParameter('offerId', i);
                        validateId(offerId, 'Offer ID');
                        endpoint = `/offers-v2/${encodeURIComponent(offerId)}/reject`;
                    }
                    else if (operation === 'complete') {
                        method = 'POST';
                        const offerId = this.getNodeParameter('offerId', i);
                        validateId(offerId, 'Offer ID');
                        endpoint = `/offers-v2/${encodeURIComponent(offerId)}/complete`;
                    }
                    else if (operation === 'cancel') {
                        method = 'POST';
                        const offerId = this.getNodeParameter('offerId', i);
                        validateId(offerId, 'Offer ID');
                        endpoint = `/offers-v2/${encodeURIComponent(offerId)}/cancel`;
                    }
                }
                else if (resource === 'feedback') {
                    useAuth = true;
                    method = 'POST';
                    endpoint = '/feedback-v2';
                    const feedbackOfferId = this.getNodeParameter('offerId', i);
                    validateId(feedbackOfferId, 'Offer ID');
                    const comment = this.getNodeParameter('comment', i, '');
                    const rating = this.getNodeParameter('rating', i);
                    validateNumericInput(rating, 'Rating', 1, 5);
                    body = {
                        offerId: feedbackOfferId,
                        rating: rating,
                        comment: comment ? sanitizeTextInput(comment, 'Comment', 512) : '',
                    };
                }
                else if (resource === 'events') {
                    useAuth = true;
                    // NOTE: Events endpoints intentionally don't use /v2 suffix as they are a separate API service
                    if (operation === 'subscribe') {
                        method = 'POST';
                        endpoint = '/events/subscribe';
                        const callbackUrl = this.getNodeParameter('callbackUrl', i);
                        validateCallbackUrl(callbackUrl);
                        body = {
                            eventTypes: this.getNodeParameter('eventTypes', i),
                            callbackUrl: callbackUrl,
                            deliveryMethod: this.getNodeParameter('deliveryMethod', i, 'webhook'),
                            securityHeaders: {},
                            retryPolicy: 'standard',
                            dlqEnabled: false,
                        };
                    }
                    else if (operation === 'unsubscribe') {
                        method = 'DELETE';
                        const subscriptionId = this.getNodeParameter('subscriptionId', i);
                        validateId(subscriptionId, 'Subscription ID');
                        endpoint = `/events/subscriptions/${encodeURIComponent(subscriptionId)}`;
                    }
                    else if (operation === 'listSubscriptions') {
                        method = 'GET';
                        endpoint = '/events/subscriptions';
                    }
                }
                else if (resource === 'categories') {
                    useAuth = false; // Categories endpoint is public
                    method = 'GET';
                    endpoint = '/categories-v2';
                }
                else if (resource === 'admin') {
                    useAuth = true; // SECURITY: Admin endpoints require authentication
                    method = 'POST';
                    endpoint = '/admin-v2/init-categories';
                }
                // Validate credentials are provided when required
                if (useAuth) {
                    const credentials = await this.getCredentials('aiMarketplaceApi').catch(() => null);
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.idToken)) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Authentication required: Please configure AI Marketplace API credentials for this operation');
                    }
                }
                // Make request
                let response;
                if (useAuth) {
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'aiMarketplaceApi', {
                        method,
                        url: `${baseUrl}${endpoint}`,
                        headers,
                        timeout: timeout * 1000,
                        json: responseFormat === 'json',
                        body: body ? (responseFormat === 'json' ? body : JSON.stringify(body)) : undefined,
                    });
                }
                else {
                    response = await this.helpers.httpRequest({
                        method,
                        url: `${baseUrl}${endpoint}`,
                        headers,
                        timeout: timeout * 1000,
                        json: responseFormat === 'json',
                        body: body ? (responseFormat === 'json' ? body : JSON.stringify(body)) : undefined,
                    });
                }
                // Special handling for certain operations
                // Add sessionToken alias for login (MCP compatibility)
                if (resource === 'auth' && operation === 'login' && responseFormat === 'json' && (response === null || response === void 0 ? void 0 : response.accessToken)) {
                    response.sessionToken = response.accessToken;
                }
                // Apply client-side limiting for lots list (MCP compatibility)
                if (resource === 'lots' && operation === 'list' && responseFormat === 'json') {
                    const limit = this.getNodeParameter('limit', i, 0);
                    if (limit !== 0) {
                        validateNumericInput(limit, 'Limit', 0, 10000);
                    }
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
                const errorObj = error;
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: (_c = errorObj.message) !== null && _c !== void 0 ? _c : 'Unknown error' },
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
exports.AiMarketplace = AiMarketplace;
