import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {adminsContainer, complexesContainer, contractContainer, usersContainer} from "@/config/cosmosConfig";
import {Complex, Contract, IAdmin, IUser} from "@/types/dbTypes"; // ✅ Correct interface imports
import {asyncHandler} from "@/helpers/dbHelper";
import dotenv from "dotenv";

dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL;

const handleError = (res: Response, error: any, message: string) => {
	console.error(message, error);
	res.status(500).json({message});
};


export const createComplex = asyncHandler(async (req: Request, res: Response) => {
	const {address} = req.body;
	if (!address) return res.status(400).json({message: "Address is required."});

	const complex: Complex = {
		id: uuidv4(),
		address,
		concierges: [],
		admins: [],
		users: [],
		createdAt: new Date().toISOString(),
	};

	const {resource} = await complexesContainer.items.create(complex);
	res.status(201).json({message: "Complex created!", complex: resource});
});


export const getComplex = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: complex} = await complexesContainer.item(id, id).read<Complex>();
	if (!complex) return res.status(404).json({message: "Complex not found."});

	const {resources: users} = await usersContainer.items
		.query(`SELECT *
                FROM c
                WHERE c.complexId = '${id}'`)
		.fetchAll();
	const {resources: admins} = await adminsContainer.items
		.query(`SELECT *
                FROM c
                WHERE c.complexId = '${id}'`)
		.fetchAll();

	res.status(200).json({...complex, users, admins});
});


export const getComplexByAddress = asyncHandler(async (req: Request, res: Response) => {
	let {address} = req.query;
	if (!address || typeof address !== "string") {
		return res.status(400).json({message: "Valid address is required."});
	}

	const querySpec = {
		query: "SELECT * FROM c WHERE c.address = @address",
		parameters: [{name: "@address", value: address}]
	};

	const {resources: complexes} = await complexesContainer.items.query<Complex>(querySpec).fetchAll();

	if (complexes.length === 0) {
		return res.status(404).json({message: "No complex found with this address."});
	}

	res.status(200).json(complexes[0]);
});


// Get all residents of a complex - to populate rows in residents management dashboard page.
export const getResidentsByComplexId = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resources: users} = await usersContainer.items
		.query(`SELECT *
                FROM c
                WHERE c.complexId = '${id}'`)
		.fetchAll();

	if (!users.length) return res.status(404).json({message: "No residents found for this complex."});

	res.status(200).json(users);
});


export const updateComplex = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: existingComplex} = await complexesContainer.item(id, id).read<Complex>();
	if (!existingComplex) return res.status(404).json({message: "Complex not found."});

	const updatedComplex = {...existingComplex, ...req.body, updatedAt: new Date().toISOString()};
	const {resource: replacedComplex} = await complexesContainer.item(id, id).replace(updatedComplex);

	res.status(200).json({message: "Complex updated!", complex: replacedComplex});
});


export const deleteComplex = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	await complexesContainer.item(id, id).delete();
	res.status(200).json({message: "Complex deleted!"});
});


export const createUser = asyncHandler(async (req: Request, res: Response) => {
	const user: IUser = {...req.body, id: uuidv4(), createdAt: new Date().toISOString()};
	const {resource} = await usersContainer.items.create(user);
	res.status(201).json({message: "User created!", user: resource});
});


export const getUser = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: user} = await usersContainer.item(id, id).read<IUser>();
	if (!user) return res.status(404).json({message: "User not found."});

	res.status(200).json(user);
});


export const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: user} = await usersContainer.item(id, id).read<IUser>();
	if (!user) return res.status(404).json({message: "User not found."});

	const updatedUser = {...user, ...req.body, updatedAt: new Date().toISOString()};
	const {resource: replacedUser} = await usersContainer.item(id, id).replace(updatedUser);

	res.status(200).json({message: "User updated!", user: replacedUser});
});


export const getUserByNumber = asyncHandler(async (req: Request, res: Response) => {
	const {number} = req.params;
	if (!number || typeof number !== "string") {
		return res.status(400).json({message: "Valid number is required."});
	}
	const querySpec = {
		query: "SELECT * FROM c WHERE c.phone = @phone",
		parameters: [{name: "@phone", value: number}]
	};
	const {resources: users} = await usersContainer.items.query<IUser>(querySpec).fetchAll();
	if (users.length === 0) {
		return res.status(404).json({message: "No user found with this number."});
	}
	res.status(200).json(users[0]);
});


export const getUsersByComplex = asyncHandler(async (req: Request, res: Response) => {
	const {complexId} = req.params;
	const querySpec = {
		query: "SELECT * FROM c WHERE c.complexId = @complexId",
		parameters: [{name: "@complexId", value: complexId}]
	};
	const {resources: users} = await usersContainer.items.query<IUser>(querySpec).fetchAll();
	if (users.length === 0) {
		return res.status(404).json({message: "No users found for this complex."});
	}
	res.status(200).json(users);
});


// UPDATE USER PACKAGE like a boss,this is hard to code on a laptop crying
export const updateUserPackage = asyncHandler(async (req: Request, res: Response) => {
	const {userId, packageId} = req.params;
	const updatedPackageData = req.body;

	// First: find the user across all partitions
	const {resources: users} = await usersContainer.items
		.query<IUser>(`SELECT *
                       FROM c
                       WHERE c.id = '${userId}'`)
		.fetchAll();

	if (!users.length) return res.status(404).json({message: "User not found."});

	const user = users[0];

	const updatedPackages = user.packages.map(pkg =>
		pkg.id === packageId ? {...pkg, ...updatedPackageData} : pkg
	);

	const updatedUser = {...user, packages: updatedPackages, updatedAt: new Date().toISOString()};

	const {resource: replacedUser} = await usersContainer
		.item(userId, user.complexId)
		.replace(updatedUser);

	res.status(200).json({message: "Package updated!", user: replacedUser});
});


export const addUserPackage = asyncHandler(async (req: Request, res: Response) => {
	const {userId} = req.params;
	const newPackage = req.body.packageData;
	newPackage.timeStamp = new Date().toISOString();
	newPackage.collected = false;
	if (!newPackage) {
		return res.status(400).json({message: "Package must be included."});
	}
	if (!newPackage.id) {
		newPackage.id = uuidv4();
	}

	// Find user across all partitions (by ID)
	const {resources: users} = await usersContainer.items
		.query<IUser>(`SELECT *
                       FROM c
                       WHERE c.id = '${userId}'`)
		.fetchAll();

	if (!users.length) return res.status(404).json({message: "User not found."});

	const user = users[0];
	// Check for duplicate package ID
	if (user.packages.some(pkg => pkg.id === newPackage.id)) {
		return res.status(400).json({message: "Package with this ID already exists for this user."});
	}

	const updatedUser = {
		...user,
		packages: [...user.packages, newPackage],
		updatedAt: new Date().toISOString()
	};

	const {resource: replacedUser} = await usersContainer
		.item(userId, user.complexId)
		.replace(updatedUser);

	// Send WhatsApp notification to the target user
	await fetch(`${BACKEND_URL}/whatsapp/send`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			telephone: 'whatsapp:' + user.phone,
			name: newPackage.recipientName,
			packages: newPackage.carrier, // Tracking number for now, no way to know what package is yet
		}),
	});
	
	res.status(200).json({message: "Package added!", user: replacedUser});
});


export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	await usersContainer.item(id, id).delete();
	res.status(200).json({message: "User deleted!"});
});


export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
	const admin: IAdmin = {...req.body, id: uuidv4(), createdAt: new Date().toISOString()};
	const {resource} = await adminsContainer.items.create(admin);
	res.status(201).json({message: "Admin created!", admin: resource});
});


export const getAdmin = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: admin} = await adminsContainer.item(id, id).read<IAdmin>();
	if (!admin) return res.status(404).json({message: "Admin not found."});

	res.status(200).json(admin);
});


export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: admin} = await adminsContainer.item(id, id).read<IAdmin>();
	if (!admin) return res.status(404).json({message: "Admin not found."});

	const updatedAdmin = {...admin, ...req.body, updatedAt: new Date().toISOString()};
	const {resource: replacedAdmin} = await adminsContainer.item(id, id).replace(updatedAdmin);

	res.status(200).json({message: "Admin updated!", admin: replacedAdmin});
});


export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	await adminsContainer.item(id, id).delete();
	res.status(200).json({message: "Admin deleted!"});
});

export const getContractById = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: contract} = await contractContainer.item(id, id).read<Contract>();
	if (!contract) return res.status(404).json({message: "Contract not found."});

	res.status(200).json(contract);
}
);

export const updateContract = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const {resource: contract} = await contractContainer.item(id, id).read<Contract>();
	if (!contract) return res.status(404).json({message: "Contract not found."});

	const updatedContract = {...contract, ...req.body, updatedAt: new Date().toISOString()};
	const {resource: replacedContract} = await contractContainer.item(id, id).replace(updatedContract);

	res.status(200).json({message: "Contract updated!", contract: replacedContract});
});

export const getContract = asyncHandler(async (req: Request, res: Response) => {
	const {number} = req.query;
	if (!number || typeof number !== "string") {
		return res.status(400).json({message: "Valid number is required."});
	}
	const querySpec = {
		query: "SELECT * FROM c WHERE c.phone = @number",
		parameters: [{name: "@number", value: number}]
	};
	const {resources: users} = await contractContainer.items.query<Contract>(querySpec).fetchAll();
	if (users.length === 0) {
		return res.status(404).json({message: "No user found with this number."});
	}
	res.status(200).json(users[0]);
});

export const createContract = asyncHandler(async (req: Request, res: Response) => {
	const id = uuidv4();
	const contract: Contract = {...req.body, id:id, scanned:false, complete:false, createdAt: new Date().toISOString()};
	const {resource} = await contractContainer.items.create(contract);
	res.status(201).json({message: "Contract created!", contract: resource});
});

export const deleteContract = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	await contractContainer.item(id,id).delete();
	res.status(200).json({message: "Contract deleted!"});
});


export const getUserPackages = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;
	const querySpec = {
		query: "SELECT c.packages FROM c WHERE c.id = @id",
		parameters: [{name: "@id", value: id}]
	};
	const {resources: parcels} = await usersContainer.items.query(querySpec).fetchAll();
	if (parcels.length === 0) {
		return res.status(404).json({message: "No parcels or user found."});
	}
	res.status(200).json(parcels);
});


export const getPackagesByComplexId = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;


	const {resources: users} = await usersContainer.items
		.query<IUser>(`SELECT *
                       FROM c
                       WHERE c.complexId = '${id}'`)
		.fetchAll();

	if (!users.length) {
		return res.status(404).json({message: "No users found for this complex."});
	}


	const allPackages = users.flatMap(user =>
		Array.isArray(user.packages)
			? user.packages.map(pkg => ({
				...pkg,
				userId: user.id,
				userName: user.name,
				unitNumber: user.unitNumber,
			}))
			: []
	);

	res.status(200).json(allPackages);
});

export const getContractsByComplexId = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;

	const {resources: contracts} = await contractContainer.items
		.query<Contract>(`SELECT *
                       FROM c
                       WHERE c.complexId = '${id}'`)
		.fetchAll();

	if (!contracts.length) {
		return res.status(404).json({message: "No contracts found for this complex."});
	}

	res.status(200).json(contracts);
});


export const getComplexesByAdminId = asyncHandler(async (req: Request, res: Response) => {
	const {adminId} = req.params;

	const {resources: complexes} = await complexesContainer.items
		.query<Complex>(`SELECT *
                         FROM c
                         WHERE ARRAY_CONTAINS(c.admins, '${adminId}')`)
		.fetchAll();

	if (!complexes.length) return res.status(404).json({message: "No complexes found for this admin."});

	res.status(200).json(complexes);
});

export const getComplexesByConciergeID = asyncHandler(async (req: Request, res: Response) => {
	const {id} = req.params;

	const {resources: complexes} = await complexesContainer.items
		.query<Complex>(`SELECT *
                         FROM c
                         WHERE ARRAY_CONTAINS(c.concierges, '${id}')`)
		.fetchAll();

	if (!complexes.length) return res.status(404).json({message: "No complexes found for this admin."});

	res.status(200).json(complexes);
});

export const getUserIdByName = asyncHandler(async (req: Request, res: Response) => {
	const { name, complexId, address } = req.query;


	if (!name || typeof name !== "string") {
		return res.status(400).json({ message: "Name is required." });
	}

	if (!complexId || typeof complexId !== "string") {
		return res.status(400).json({ message: "Valid complexId is required." });
	}

	const normalizedName = name.toLowerCase();

	const querySpec = {
		query: "SELECT * FROM c WHERE LOWER(c.name) = @name AND c.complexId = @complexId",
		parameters: [
			{ name: "@name", value: normalizedName },
			{ name: "@complexId", value: complexId },
		],
	};

	const { resources: users } = await usersContainer.items.query<IUser>(querySpec).fetchAll();

	if (!users.length) {
		return res.status(404).json({ message: "No user found with that name." });
	}

	// If multiple users are found and address is provided, filter by address
	if (users.length > 1 && address && typeof address === "string") {
		const normalizedAddress = address.replace(/-/g, " ").toLowerCase();
		const filteredUsers = users.filter(user => user.unitNumber && user.unitNumber.toLowerCase() === normalizedAddress);

		if (!filteredUsers.length) {
			return res.status(404).json({ message: "No user found with the provided name and address." });
		}

		return res.status(200).json(filteredUsers[0]); // Return the first match
	}

	res.status(200).json(users[0]);
});


export const getUserIdByAddress = asyncHandler(async (req: Request, res: Response) => {
	const { address } = req.params;

	if (!address || typeof address !== "string") {
		return res.status(400).json({ message: "Address is required." });
	}

	const normalizedAddress = address.replace(/-/g, " ").toLowerCase();

	const querySpec = {
		query: "SELECT * FROM c WHERE LOWER(c.unitNumber) = @address",
		parameters: [{ name: "@address", value: normalizedAddress }]
	};

	const { resources: users } = await usersContainer.items.query<IUser>(querySpec).fetchAll();

	if (!users.length) {
		return res.status(404).json({ message: "No user found with that address." });
	}

	const user = users[0];

	res.status(200).json({
		id: user.id,
		complexId: user.complexId,
		unitNumber: user.unitNumber,
		name: user.name
	});
});



export default {
	getUserIdByName,
	getUserIdByAddress,
	updateUserPackage,
	addUserPackage,
	getComplexesByAdminId,
	createComplex,
	getComplex,
	getComplexByAddress,
	getResidentsByComplexId,
	updateComplex,
	deleteComplex,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	createAdmin,
	getUserByNumber,
	getAdmin,
	updateAdmin,
	deleteAdmin,
	getUsersByComplex,
	getPackagesByComplexId,
	getContractsByComplexId,
	createContract,
	getContract,
	getContractById,
	updateContract,
	deleteContract,
	getComplexesByConciergeID,
	getUserPackages,
};
