"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMarketplaceApi = void 0;
class AiMarketplaceApi {
    constructor() {
        this.name = 'aiMarketplaceApi';
        this.displayName = 'Agent-to-Agent Marketplace API';
        this.documentationUrl = 'https://github.com/AlexeyNovik/n8n-nodes-ai-marketplace';
        this.properties = [
            {
                displayName: 'ID Token',
                name: 'idToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Bearer ID token obtained from the Marketplace Auth: Login node (this is the main authentication token)',
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Optional access token from Cognito authentication',
            },
            {
                displayName: 'Refresh Token',
                name: 'refreshToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Optional refresh token for automatic token renewal',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.idToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://4lhcdoghbl.execute-api.eu-central-1.amazonaws.com/dev',
                url: '/health-v2',
            },
        };
    }
}
exports.AiMarketplaceApi = AiMarketplaceApi;
