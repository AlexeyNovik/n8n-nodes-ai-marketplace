import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AiMarketplaceApi implements ICredentialType {
	name = 'aiMarketplaceApi';
	displayName = 'AI Marketplace API (Bearer)';
	documentationUrl = 'https://ai-marketplace.com/docs';
	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.idToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://4lhcdoghbl.execute-api.eu-central-1.amazonaws.com/dev',
			url: '/health-v2',
		},
	};
}

