import express, { Request, Response } from "express";
import container from "@/config/cosmosConfig";

interface dbController {
	createItem: express.Handler;
}

const dbController: dbController = {
	createItem: async (req: Request, res: Response) => {
		const { name, description } = req.body;
		console.log("Creating item with:", name, description);

		if (!name || !description) {
			res.status(400).json({ message: "Missing name or description." });
			return;
		}

		try {
			const { resource: createdItem } = await container.items.create({
				name,
				description,
				createdAt: new Date().toISOString(),
			});

			res.status(201).json({
				message: "Item created successfully!",
				item: createdItem,
			});
		} catch (error) {
			console.error("Error inserting item into Cosmos DB:", error);
			res.status(500).json({ message: "Failed to create item." });
		}
	},
};

export default dbController;
