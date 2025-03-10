import express, { Request, Response, Handler } from "express";
import container from "@/config/cosmosConfig";
import { v4 as uuidv4 } from "uuid";
import { Package, User, Customer, DbController } from "@/types/dbTypes";

// Extend the DbController interface to include updateUser and removeUser
interface ExtendedDbController extends DbController {
	updateUser: Handler;
	removeUser: Handler;
}

const dbController: ExtendedDbController = {
	createUser: async (req: Request, res: Response): Promise<void> => {
		// Typing from cosmos documents I don't really understand it, but it works
		const { name, address, telephone, email, packages } = req.body as User;

		if (!name || !address || !telephone || !email || !packages) {
			res.status(400).json({ message: "Missing required fields." });
			return;
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
			return;
		} catch (error) {
			console.error("Error inserting user:", error);
			res.status(500).json({ message: "Failed to create user." });
			return;
		}
	},

	getCustomer: async (req: Request, res: Response): Promise<void> => {
		const { name, address } = req.query;

		if (!name && !address) {
			res.status(400).json({ message: "Please provide at least a name or address query parameter." });
			return;
		}

		let querySpec: {
			query: string;
			parameters: { name: string; value: string }[];
		};

		if (typeof name === "string" && typeof address === "string") {
			querySpec = {
				query: "SELECT * FROM c WHERE c.name = @name OR c.address = @address",
				parameters: [
					{ name: "@name", value: name },
					{ name: "@address", value: address },
				],
			};
		} else if (typeof name === "string") {
			querySpec = {
				query: "SELECT * FROM c WHERE c.name = @name",
				parameters: [{ name: "@name", value: name }],
			};
		} else if (typeof address === "string") {
			querySpec = {
				query: "SELECT * FROM c WHERE c.address = @address",
				parameters: [{ name: "@address", value: address }],
			};
		} else {
			res.status(400).json({ message: "Invalid query parameters." });
			return;
		}

		try {
			const { resources: customers } = await container.items
				.query<Customer>(querySpec)
				.fetchAll();
			if (!customers.length) {
				res.status(404).json({ message: "Customer not found." });
				return;
			}
			res.status(200).json(customers);
			return;
		} catch (error) {
			console.error("Error fetching customer:", error);
			res.status(500).json({ message: "Failed to retrieve customer." });
			return;
		}
	},

	updateUser: async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "User id is required for update." });
			return;
		}

		try {
			// Retrieve the existing user (as a Customer)
			const { resource: existingUser } = await container.item(id, id).read<Customer>();
			if (!existingUser) {
				res.status(404).json({ message: "User not found." });
				return;
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
			return;
		} catch (error) {
			console.error("Error updating user:", error);
			res.status(500).json({ message: "Failed to update user." });
			return;
		}
	},

	removeUser: async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "User id is required for deletion." });
			return;
		}

		try {
			const { resource: existingUser } = await container.item(id, id).read<Customer>();
			if (!existingUser) {
				res.status(404).json({ message: "User not found." });
				return;
			}

			await container.item(id, id).delete();
			res.status(200).json({ message: "User removed successfully." });
			return;
		} catch (error) {
			console.error("Error removing user:", error);
			res.status(500).json({ message: "Failed to remove user." });
			return;
		}
	},
};

export default dbController;
