import express, { Request, Response, Handler } from "express";
import container from "@/config/cosmosConfig";
import { v4 as uuidv4 } from "uuid";
import { Package, User, Customer } from "@/types/dbTypes";
import { createGetQuery } from "@/helpers/dbHelper";

interface DbController {
	createUser: Handler;
	getCustomer: Handler;
	updateUser: Handler;
	removeUser: Handler;
}

const dbController: DbController = {
	createUser: async (req: Request, res: Response): Promise<void> => {
		// Typing from cosmos documents I don't really understand it, but it works
		const { name, address, telephone, email, packages } = req.body as User;

		if (!name || !address || !telephone || !email || !packages) {
			res.status(400).json({ message: "Missing required fields." });
		}

		// Map packages and ensure each has an id
		const validatedPackages: Package[] = packages.map((pkg) => ({
			id: pkg.id || uuidv4(),
			name: pkg.name,
			description: pkg.description,
			delivered: pkg.delivered,
		}));

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
			console.error("Error inserting user:", error);
			res.status(500).json({ message: "Failed to create user." });
		}
	},

	getCustomer: async (req: Request, res: Response): Promise<void> => {
		const name = req.query.name as string | undefined;
		const address = req.query.address as string | undefined;
		if (!name && !address) {
			res.status(400).json({ message: "Please provide at least a name or address query parameter." });
		}

		const querySpec = createGetQuery(name as string, address as string);

		try {
			const { resources: customers } = await container.items
				.query<Customer>(querySpec)
				.fetchAll();
			if (!customers.length) {
				res.status(404).json({ message: "Customer not found." });
			}
			res.status(200).json(customers);
		} catch (error) {
			console.error("Error fetching customer:", error);
			res.status(500).json({ message: "Failed to retrieve customer." });
		}
	},

	updateUser: async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "User id is required for update." });
		}

		try {
			// Retrieve the existing user (as a Customer)
			const { resource: existingUser } = await container.item(id, id).read<Customer>();
			if (!existingUser) {
				res.status(404).json({ message: "User not found." });
			}

			// Merge the existing user with the fields provided in the request body.
			// This shallow merge assumes that if packages are provided, they require full replacement.
			const updatedUser = {
				...existingUser,
				...req.body,
				updatedAt: new Date().toISOString(),
			};

			// If packages are provided, re-map them to ensure they adhere to the Package type.
			if (req.body.packages) {
				updatedUser.packages = (req.body.packages as Package[]).map((pkg) => ({
					id: pkg.id || uuidv4(),
					name: pkg.name,
					description: pkg.description,
					delivered: pkg.delivered,
				}));
			}

			const { resource: replacedUser } = await container.item(id, id).replace(updatedUser);
			res.status(200).json({ message: "User updated successfully!", user: replacedUser });
		} catch (error) {
			console.error("Error updating user:", error);
			res.status(500).json({ message: "Failed to update user." });
		}
	},

	removeUser: async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "User id is required for deletion." });
		}

		try {
			const { resource: existingUser } = await container.item(id, id).read<Customer>();
			if (!existingUser) {
				res.status(404).json({ message: "User not found." });
			}

			await container.item(id, id).delete();
			res.status(200).json({ message: "User removed successfully." });
		} catch (error) {
			console.error("Error removing user:", error);
			res.status(500).json({ message: "Failed to remove user." });
		}
	},
};

export default dbController;
