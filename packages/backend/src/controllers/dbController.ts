import express, { Request, Response } from "express";
import container from "@/config/cosmosConfig";
import { v4 as uuidv4 } from "uuid";

interface Package {
	id: string;
	name: string;
	description: string;
	delivered: boolean;
}

interface User {
	name: string;
	address: string;
	telephone: string;
	email: string;
	packages: Package[];
	createdAt: string;
}

interface dbController {
	createUser: express.Handler;
}

const dbController: dbController = {
	createUser: async (req: Request, res: Response) => {
		const { name, address, telephone, email, packages } = req.body;

		console.log("Creating user with:", name, address, telephone, email, packages);

		// Validate required fields
		if (!name || !address || !telephone || !email || !packages) {
			res.status(400).json({ message: "Missing required fields." });
			return;
		}

		// Ensure packages is an array
		if (!Array.isArray(packages)) {
			res.status(400).json({ message: "Packages must be an array." });
			return;
		}

		// Validate each package object and assign a unique id if not provided
		const validatedPackages: Package[] = packages.map((pkg: any) => {
			if (!pkg.name || !pkg.description || typeof pkg.delivered !== "boolean") {
				throw new Error("Invalid package object.");
			}
			return {
				id: pkg.id || uuidv4(),
				name: pkg.name,
				description: pkg.description,
				delivered: pkg.delivered,
			};
		});

		const user: User = {
			name,
			address,
			telephone,
			email,
			packages: validatedPackages,
			createdAt: new Date().toISOString(),
		};

		try {
			const { resource: createdUser } = await container.items.create(user);
			res.status(201).json({
				message: "User created successfully!",
				user: createdUser,
			});
		} catch (error) {
			console.error("Error inserting user into Cosmos DB:", error);
			res.status(500).json({ message: "Failed to create user." });
		}
	},
};

export default dbController;
