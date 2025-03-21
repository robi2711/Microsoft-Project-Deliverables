import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { complexesContainer, usersContainer, adminsContainer } from "@/config/cosmosConfig";
import { Complex, IUser, IAdmin } from "@/types/dbTypes"; // ✅ Correct interface imports
import { asyncHandler } from "@/helpers/dbHelper";

const handleError = (res: Response, error: any, message: string) => {
	console.error(message, error);
	res.status(500).json({ message });
};

export const createComplex = asyncHandler(async (req: Request, res: Response) => {
	const { address } = req.body;
	if (!address) return res.status(400).json({ message: "Address is required." });

	const complex: Complex = {
		id: uuidv4(),
		address,
		admins: [],
		users: [],
		createdAt: new Date().toISOString(),
	};

	const { resource } = await complexesContainer.items.create(complex);
	res.status(201).json({ message: "Complex created!", complex: resource });
});

export const getComplex = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { resource: complex } = await complexesContainer.item(id, id).read<Complex>();
	if (!complex) return res.status(404).json({ message: "Complex not found." });

	const { resources: users } = await usersContainer.items
		.query(`SELECT * FROM c WHERE c.complexId = '${id}'`)
		.fetchAll();
	const { resources: admins } = await adminsContainer.items
		.query(`SELECT * FROM c WHERE c.complexId = '${id}'`)
		.fetchAll();

	res.status(200).json({ ...complex, users, admins });
});

export const getComplexByAddress = asyncHandler(async (req: Request, res: Response) => {
	let { address } = req.query;
	if (!address || typeof address !== "string") {
		return res.status(400).json({ message: "Valid address is required." });
	}

	const querySpec = {
		query: "SELECT * FROM c WHERE c.address = @address",
		parameters: [{ name: "@address", value: address }]
	};

	const { resources: complexes } = await complexesContainer.items.query<Complex>(querySpec).fetchAll();

	if (complexes.length === 0) {
		return res.status(404).json({ message: "No complex found with this address." });
	}

	res.status(200).json(complexes[0]);
});

export const updateComplex = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { resource: existingComplex } = await complexesContainer.item(id, id).read<Complex>();
	if (!existingComplex) return res.status(404).json({ message: "Complex not found." });

	const updatedComplex = { ...existingComplex, ...req.body, updatedAt: new Date().toISOString() };
	const { resource: replacedComplex } = await complexesContainer.item(id, id).replace(updatedComplex);

	res.status(200).json({ message: "Complex updated!", complex: replacedComplex });
});

export const deleteComplex = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	await complexesContainer.item(id, id).delete();
	res.status(200).json({ message: "Complex deleted!" });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
	const user: IUser = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString() };
	const { resource } = await usersContainer.items.create(user);
	res.status(201).json({ message: "User created!", user: resource });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { resource: user } = await usersContainer.item(id, id).read<IUser>();
	if (!user) return res.status(404).json({ message: "User not found." });

	res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { resource: user } = await usersContainer.item(id, id).read<IUser>();
	if (!user) return res.status(404).json({ message: "User not found." });

	const updatedUser = { ...user, ...req.body, updatedAt: new Date().toISOString() };
	const { resource: replacedUser } = await usersContainer.item(id, id).replace(updatedUser);

	res.status(200).json({ message: "User updated!", user: replacedUser });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	await usersContainer.item(id, id).delete();
	res.status(200).json({ message: "User deleted!" });
});

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
	const admin: IAdmin = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString() };
	const { resource } = await adminsContainer.items.create(admin);
	res.status(201).json({ message: "Admin created!", admin: resource });
});

export const getAdmin = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { resource: admin } = await adminsContainer.item(id, id).read<IAdmin>();
	if (!admin) return res.status(404).json({ message: "Admin not found." });

	res.status(200).json(admin);
});

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { resource: admin } = await adminsContainer.item(id, id).read<IAdmin>();
	if (!admin) return res.status(404).json({ message: "Admin not found." });

	const updatedAdmin = { ...admin, ...req.body, updatedAt: new Date().toISOString() };
	const { resource: replacedAdmin } = await adminsContainer.item(id, id).replace(updatedAdmin);

	res.status(200).json({ message: "Admin updated!", admin: replacedAdmin });
});

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	await adminsContainer.item(id, id).delete();
	res.status(200).json({ message: "Admin deleted!" });
});

export default {
	createComplex,
	getComplex,
	getComplexByAddress,
	updateComplex,
	deleteComplex,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	createAdmin,
	getAdmin,
	updateAdmin,
	deleteAdmin
};
