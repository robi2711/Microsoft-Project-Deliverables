import { AzureFunction, Context, HttpRequest } from '@azure/functions';//does not work yet, cant test or set up Entra ID as we have no access as of making this file
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const { userData, additionalData } = req.body;
    const { email, password } = userData;
    const { phone, address, name } = additionalData;

    // Azure Entra ID credentials
    const tenantId = process.env.TENANT_ID;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    // Initialize Microsoft Graph client
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default'],
    });
    const client = Client.initWithMiddleware({ authProvider });

    try {
        // Step 1: Create user in Azure Entra ID
        const user = await client.api('/users').post({
            accountEnabled: true,
            displayName: name,
            mailNickname: email.split('@')[0],
            userPrincipalName: email,
            passwordProfile: {
                forceChangePasswordNextSignIn: false,
                password: password,
            },
        });

        // sends straight to db, will change once azure
        const userId = user.id; // Azure Entra ID user ID
        await storeUserData(userId, { phone, address, name });

        context.res = {
            status: 200,
            body: { message: 'User created successfully!', userId },
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: 'Failed to create user', details: error },
        };
    }
};

async function storeUserData(userId: string, data: { phone: string; address: string; name: string }): Promise<void> {
    // Replace this with your database logic (e.g., Cosmos DB, SQL Database)
    console.log('Storing user data:', { userId, ...data });
}

export default httpTrigger;