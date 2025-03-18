import dotenv from "dotenv";
import { CosmosClient, Container } from "@azure/cosmos";

dotenv.config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME;

if (!endpoint || !key || !databaseId) {
    console.error("Missing environment variables for CosmosDB.");
    process.exit(1);
}

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);

export const complexesContainer: Container = database.container("complexes");
export const usersContainer: Container = database.container("users");
export const adminsContainer: Container = database.container("admins");

client.getDatabaseAccount()
    .then(response => {
        console.log("✅ Connected to CosmosDB. Database Account Info:", response.resource);
    })
    .catch(error => {
        console.error("❌ Failed to connect to CosmosDB:", error);
        process.exit(1);
    });


export default { client, database, complexesContainer, usersContainer, adminsContainer };
