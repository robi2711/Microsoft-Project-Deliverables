import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Initialize Microsoft Graph client
if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Environment variables TENANT_ID, CLIENT_ID, and CLIENT_SECRET must be defined");
}
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
});
const client = Client.initWithMiddleware({ authProvider });

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

async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log("Processing creation request...");

    try {
        const body: RequestBody = await request.json() as RequestBody;
        if (!body?.userData || !body?.additionalData) {
            throw new Error("Invalid request body");
        }

        const { email, password } = body.userData;
        const { phone, address, name } = body.additionalData;

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

        const userId: string = user.id;
        await storeUserData(userId, { phone, address, name });

        return {
            status: 200,
            body: JSON.stringify({ message: "User created successfully!", userId }),
            headers: { "Content-Type": "application/json" },
        };
    } catch (error: unknown) {
        let errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        context.log(`Error creating user: ${errorMessage}`);

        return {
            status: 500,
            body: JSON.stringify({ error: "Failed to create user", details: errorMessage }),
            headers: { "Content-Type": "application/json" },
        };
    }
}

// get user Roles
async function getUserRoles(userId: string): Promise<string[]> {
    const response = await client.api(`/users/${userId}/appRoleAssignments`).get();
    return response.value ? response.value.map((role: any) => role.displayName) : [];
}

function generateJWT(user: { id: string; email: string; roles: string[] }) {//token gen
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    return jwt.sign(
        { userId: user.id, email: user.email, roles: user.roles },
        JWT_SECRET as string, // Ensure it's a valid string
        { expiresIn: "1h" }
    );
}

// RBAC Login  Change refferance (rut) in comments
app.http("authLogin", {
    route: "auth/login",
    methods: ["POST"],
    handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            const body = await req.json() as { email: string; password: string };
            const { email, password } = body;
            const user = await findUser(email, password);

            if (!user) {
                return {
                    status: 401,
                    body: JSON.stringify({ error: "Invalid credentials" }),
                    headers: { "Content-Type": "application/json" }
                };
            }

            const roles = await getUserRoles(user.id);
            const accessToken = generateJWT({ id: user.id, email: user.email, roles });

            return {
                status: 200,
                body: JSON.stringify({ accessToken }),
                headers: { "Content-Type": "application/json" }
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                status: 500,
                body: JSON.stringify({ error: "Internal Service error" }),
                headers: { "Content-Type": "application/json" }
            };
        }
    }
});
// Middleware for RBAC
function authorize(allowedRoles: string[]) {
    return (req: HttpRequest, res: { status: (code: number) => { json: (arg0: { error: string }) => any } }, next: () => void) => {
        const authHeader = req.headers.get("authorization"); // ✅ Use `.get()` for Azure's HttpRequest

        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not set");
        }

        const token = authHeader.split(" ")[1];

        try {
            const verToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { roles?: string[] };

            if (!verToken.roles || !verToken.roles.some(role => allowedRoles.includes(role))) {
                return res.status(403).json({ error: "Insufficient permissions" });
            }

            (req as any).user = { roles: verToken.roles };
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    };
}

// Data storage function -> need to add post request
async function storeUserData(userId: string, data: { phone: string; address: string; name: string }): Promise<void> {
    console.log("Storing user data:", { userId, ...data });
}

// find user
async function findUser(email: string, password: string) {
    return { id: "12345", email, roles: ["Users"] };
}

// Register Azure function
export async function adminRoute(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return new Promise((resolve) => {
        const middleware = authorize(["Admins"]);

        const res = {
            status: (code: number) => ({
                json: (data: { error: string }) => resolve({
                    status: code,
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" }
                })
            })
        };

        middleware(req, res as any, () => {
            resolve({
                status: 200,
                body: JSON.stringify({ message: "Welcome, Admin!" }),
                headers: { "Content-Type": "application/json" }
            });
        });
    });
}

export async function concRoute(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return new Promise((resolve) => {
        const middleware = authorize(["Concierge"]);

        const res = {
            status: (code: number) => ({
                json: (data: { error: string }) => resolve({
                    status: code,
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" }
                })
            })
        };

        middleware(req, res as any, () => {
            resolve({
                status: 200,
                body: JSON.stringify({ message: "Welcome, Concierge!" }),
                headers: { "Content-Type": "application/json" }
            });
        });
    });
}



// Register Azure function
app.http("admin", {
    route: "admin",
    methods: ["GET"],
    handler: adminRoute,
});
app.http("Concierge", {
    route: "Concierge",
    methods: ["GET"],
    handler: concRoute,
});


/*
1. Receives a POST request containing user details (email, password, phone, address, and name).
2. Authenticates with Microsoft Graph API using Azure Entra ID (formerly Azure AD) credentials.
3. Creates a new user in Azure Entra ID with the given details.
4. Stores additional user data (phone, address, name) in a placeholder function (simulating a database save).
5. Returns a response with the user ID or an error message.
6. RBAC fetches user roles generates JWT token
7. VAlidate user find user, lookup function next step will be to make db stuff work
8. generate jwt upon succesful login
9. middleware (doublechecking )
10. admin and concierge only route 
11. Refresh token to manage expiration

 */

/*
JWT TOLKIEN ->REFRESH TOLKIEN
const refreshTokens = new Map();

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await findUser(email, password);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.set(refreshToken, user.id); // Store securely in DB

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken });
})

// ACCESS TOLKIEN
let accessToken = null;

async function login(email, password) {
    const response = await axios.post("/auth/login", { email, password });
    accessToken = response.data.accessToken; // Store in memory
    document.cookie = `refreshToken=${response.data.refreshToken}; HttpOnly; Secure`;
}

async function getProtectedResource() {
    const response = await axios.get("/protected-resource", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
}

 */