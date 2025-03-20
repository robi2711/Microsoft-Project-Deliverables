import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
// can't test or set up Entra ID (waiting for email) as we have no access as of making this file
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';

interface UserData {
    email: string;
    password: string;
}

interface AdditionalData {
    phone: string;
    address: string;
    name: string;
}

interface RequestBody {
    userData: UserData;
    additionalData: AdditionalData;
}

async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("Processing user creation request...");

    try {
        // Parse JSON safely
        const body: RequestBody = await request.json() as RequestBody;
        if (!body?.userData || !body?.additionalData) {
            throw new Error("Invalid request body");
        }

        const { email, password } = body.userData;
        const { phone, address, name } = body.additionalData;

        // Azure Entra ID credentials
        const tenantId = process.env.TENANT_ID;
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        if (!tenantId || !clientId || !clientSecret) {
            throw new Error("Missing Azure Entra ID credentials in environment variables.");
        }

        // Initialize Microsoft Graph client
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
            scopes: ['https://graph.microsoft.com/.default'],
        });
        const client = Client.initWithMiddleware({ authProvider });

        // creates user in Entra
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

        if (!user?.id) {
            throw new Error("Failed to retrieve user ID from Microsoft Graph API");
        }

        // Sends data straight to DB, will change once Azure is available
        const userId: string = user.id; // Azure Entra ID user ID
        await storeUserData(userId, { phone, address, name });

        return {
            status: 200,
            body: JSON.stringify({ message: "User created successfully!", userId }),
            headers: { "Content-Type": "application/json" },
        };
    } catch (error: unknown) {
        let errorMessage = "Unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        context.log(`Error creating user: ${errorMessage}`);

        return {
            status: 500,
            body: JSON.stringify({ error: "Failed to create user", details: errorMessage }),
            headers: { "Content-Type": "application/json" },
        };
    }
}

// Placeholder to simulate storing user data
async function storeUserData(userId: string, data: { phone: string; address: string; name: string }): Promise<void> {
    console.log("Storing user data:", { userId, ...data });
}

// Register Azure Functions v4
app.http("httpTrigger", {
    route: "createUser",
    methods: ["POST"],
    handler: httpTrigger,
});
/*
1. Receives a POST request containing user details (email, password, phone, address, and name).
2. Authenticates with Microsoft Graph API using Azure Entra ID (formerly Azure AD) credentials.
3. Creates a new user in Azure Entra ID with the given details.
4. Stores additional user data (phone, address, name) in a placeholder function (simulating a database save).
5. Returns a response with the user ID or an error message.

 */