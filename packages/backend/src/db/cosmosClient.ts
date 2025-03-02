import dotenv from "dotenv";
dotenv.config();

import { CosmosClient, Container } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME!;
const containerId = process.env.COSMOS_DB_CONTAINER_NAME!;

if (!endpoint || !key) {
    console.error("Missing environment variables for Cosmos DB.");
    process.exit(1);
}

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container: Container = database.container(containerId);

// Test the connection by fetching the database account details
client.getDatabaseAccount()
    .then(response => {
        console.log("Connected to Cosmos DB. Database Account Info:", response.resource);
    })
    .catch(error => {
        console.error("Failed to connect to Cosmos DB:", error);
    });

export default container;
