import express, { Request, Response } from "express";
import container from "@/config/cosmosConfig";

interface Customer {
    id?: string;
    name: string;
    address: string;
    telephone: string;
    email: string;
    packages: {
        id: string;
        name: string;
        description: string;
        delivered: boolean;
    }[];
    createdAt: string;
}

const getCustomer: express.Handler = async (req: Request, res: Response) => {

    const nameParam = typeof req.query.name === "string" ? req.query.name : undefined;
    const addressParam = typeof req.query.address === "string" ? req.query.address : undefined;

    if (!nameParam && !addressParam) {
        res.status(400).json({ message: "Please provide at least a name or address query parameter." });
        return;
    }


    let querySpec: { query: string; parameters: { name: string; value: string }[] };

    if (nameParam && addressParam) {
        querySpec = {
            query: "SELECT * FROM c WHERE c.name = @name OR c.address = @address",
            parameters: [
                { name: "@name", value: nameParam },
                { name: "@address", value: addressParam }
            ]
        };
    } else if (nameParam) {
        querySpec = {
            query: "SELECT * FROM c WHERE c.name = @name",
            parameters: [{ name: "@name", value: nameParam }]
        };
    } else { // addressParam is defined
        querySpec = {
            query: "SELECT * FROM c WHERE c.address = @address",
            parameters: [{ name: "@address", value: addressParam! }]
        };
    }

    try {
        const { resources: customers } = await container.items.query<Customer>(querySpec).fetchAll();

        if (customers.length === 0) {
            res.status(404).json({ message: "Customer not found." });
        } else {
            res.status(200).json(customers);
        }
    } catch (error) {
        console.error("Error fetching customer from Cosmos DB:", error);
        res.status(500).json({ message: "Failed to retrieve customer." });
    }
};

export default getCustomer;
