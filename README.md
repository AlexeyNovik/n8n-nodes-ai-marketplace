# n8n-nodes-ai-marketplace

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

An n8n community node that provides comprehensive integration with the AI Marketplace API. This unified node combines all marketplace operations into a single, organized interface similar to professional integrations like Agile CRM.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The AI Marketplace node provides a unified interface with resource-based organization:

### 🔐 Authentication
- **Login** - Authenticate user and obtain access tokens
- **Signup** - Register new user account

### 🏥 Health
- **Check** - Get API health status

### 📊 Statistics  
- **Users** - Get total user count
- **Lots** - Get lot statistics with grouping options (status, category, date)
- **Offers** - Get total offer count
- **Feedback** - Get total feedback count

### 🏷️ Lots Management
- **List** - List all lots with optional client-side limiting
- **Create** - Create new lots (requires authentication)
- **Get** - Get specific lot by ID
- **Close** - Close a lot (lot owner/admin only)
- **Reopen** - Reopen a closed lot (lot owner/admin only)

### 💰 Offers Management
- **Create** - Create offers on lots
- **Get** - Get specific offer by ID
- **Accept** - Accept offers (seller only)
- **Reject** - Reject offers (seller only)
- **Complete** - Mark offers as completed (seller only)
- **Cancel** - Cancel offers (buyer only)

### 💬 Feedback
- **Create** - Create feedback for completed offers

### ⚡ Events (MCP Compatible)
- **Subscribe** - Subscribe to marketplace events
- **Unsubscribe** - Unsubscribe from events
- **List Subscriptions** - List active subscriptions

### 📂 Categories
- **List** - List all available categories with names, IDs, and descriptions

### ⚙️ Administration
- **Initialize Categories** - Initialize default categories for testing

## Credentials

This package uses **AI Marketplace API (Bearer)** credential type:

- **Access Token** (required): Bearer token obtained from the Login operation
- **ID Token** (optional): Cognito ID token
- **Refresh Token** (optional): Token for automatic renewal

## Compatibility

- Minimum n8n version: 1.13.0
- Tested with Node.js 18
- Supports both development and production environments

## Usage

### How It Works

Unlike traditional n8n integrations with multiple separate nodes, AI Marketplace provides a **unified node** with two-level organization:

1. **Resource** - Select the main resource (Auth, Lots, Offers, etc.)
2. **Operation** - Choose the specific action for that resource

This creates a clean, organized interface similar to professional integrations.

### Environment Configuration

All operations support environment selection:
- **Development**: `https://4lhcdoghbl.execute-api.eu-central-1.amazonaws.com/dev`
- **Production**: `https://d51z3o93bhujm.cloudfront.net`  
- **Override Base URL**: Custom endpoint URL

### Common Features

All operations include:
- **Timeout**: Configurable request timeout (default: 30s)
- **Retry Logic**: Automatic retry on 5xx errors with exponential backoff
- **Response Format**: JSON or raw response options
- **Additional Fields**: Expandable options for advanced configuration

### Authentication Flow

1. Use **Resource: Authentication → Operation: Signup** to register new users
2. Use **Resource: Authentication → Operation: Login** to obtain access tokens
3. Configure **AI Marketplace API (Bearer)** credential with the access token
4. Use authenticated operations for secured functionality

### Example Workflows

#### Complete Marketplace Flow
```
1. AI Marketplace (Auth → Login)
2. AI Marketplace (Health → Check)
3. AI Marketplace (Categories → List)
4. AI Marketplace (Stats → Users)
5. AI Marketplace (Lots → List)
6. AI Marketplace (Lots → Create)
7. AI Marketplace (Offers → Create)
8. AI Marketplace (Offers → Accept)
9. AI Marketplace (Offers → Complete)
10. AI Marketplace (Feedback → Create)
11. AI Marketplace (Events → Subscribe)
```

### MCP Agent Integration

The Events resource provides MCP-compatible webhook subscriptions:
- Support for standard MCP security headers
- HTTPS-only callback URLs
- Retry policies with DLQ support
- Event types: onLotCreated, onLotClosed, onOfferCreated, onOfferStatusChanged, onFeedbackLeft

## API Version Updates

**Version 3.0.0** introduces the unified node structure:
- **Single Node**: All operations consolidated into one AI Marketplace node
- **Resource-Based Organization**: Clean categorization similar to Agile CRM
- **Dynamic Interface**: Fields shown/hidden based on selected resource and operation
- **Improved UX**: Professional appearance with logical grouping

### Endpoint Support
- `/health-v2` - Health checks
- `/auth-v2/signup` & `/auth-v2/login` - Authentication
- `/stats-v2/*` - Statistics (users, lots, offers, feedback)
- `/lots-v2` - Lot management (list, create, get, close, reopen)
- `/offers-v2` - Offer management (create, get, accept, reject, complete, cancel)
- `/feedback-v2` - Feedback creation
- `/categories-v2` - Category listing
- `/admin-v2/init-categories` - Category initialization
- `/events/*` - Event subscription management

## Migration from v2.0.0

If you're upgrading from the previous multi-node structure:

1. **Remove old workflows**: The individual nodes (AI Marketplace Auth, AI Marketplace Lots, etc.) are no longer available
2. **Use unified node**: Replace individual nodes with the single "AI Marketplace" node
3. **Configure resource/operation**: Set the appropriate Resource and Operation for each use case
4. **Update credentials**: Credential configuration remains the same

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [AI Marketplace API Documentation](https://ai-marketplace.com/docs)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

## License

[MIT](LICENSE.md)