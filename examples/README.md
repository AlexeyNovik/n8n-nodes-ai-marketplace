# Example Workflows

This directory contains sample workflows demonstrating how to use the AI Marketplace n8n nodes.

## sample-workflow.json

A complete end-to-end workflow that demonstrates:

1. **Authentication** - Login to get access tokens
2. **Health Check** - Verify API availability
3. **Categories** - List available categories with names and IDs
4. **Statistics** - Get user count statistics
5. **Lot Management** - List existing lots and create a new lot
6. **Offer Flow** - Create, accept, and complete an offer
7. **Feedback** - Provide feedback for the completed transaction
8. **Event Subscription** - Subscribe to marketplace events for future notifications

### Prerequisites

Before running this workflow, ensure you have:

1. **n8n installed** with the AI Marketplace nodes package
2. **Valid credentials** for the AI Marketplace API:
   - Email and password for authentication
   - The login will provide the access token needed for secured operations

### Setup Instructions

1. Import the workflow into your n8n instance
2. Configure the **AI Marketplace API (Bearer)** credential:
   - Initially, leave the access token empty
   - Run the Login node first to obtain the access token
   - Update the credential with the returned access token
3. Update the sample data as needed:
   - Change email/password in the Login node
   - Modify lot details in the Create Lot node
   - Adjust callback URL in the Events Subscribe node

### Running the Workflow

1. **Manual Trigger**: Click "Test workflow" to start
2. **Monitor Execution**: Watch each node execute in sequence
3. **Check Results**: Each node will output relevant data from the API
4. **Error Handling**: Nodes are configured to continue on fail for testing

### Node Configuration Notes

- **Environment**: All nodes default to 'dev' environment
- **Timeout**: 30-second timeout for all requests
- **Retry Logic**: Automatic retry on 5xx errors with exponential backoff
- **Authentication**: Secured nodes require the Bearer token credential
- **MCP Compatibility**: Event nodes include MCP-specific features for agent workflows

### Expected Output

The workflow will produce:
- Authentication tokens from login
- Health status confirmation
- Available categories list with IDs and descriptions
- User statistics
- Available lots list
- New lot creation confirmation
- Offer acceptance and completion confirmations
- Feedback submission confirmation
- Event subscription details

This workflow provides a foundation for building more complex AI Marketplace integrations with n8n.

### API Version Updates

All nodes in this workflow now use the updated API endpoints with `-v2` suffix:
- Health checks use `/health-v2`
- Authentication uses `/auth-v2/login`
- All other endpoints follow the new versioning pattern

The workflow remains fully compatible and requires no changes to existing configurations.

