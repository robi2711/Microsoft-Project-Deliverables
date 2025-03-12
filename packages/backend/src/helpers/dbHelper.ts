
// Helper function to create a query to get a document from the database
export const createGetQuery = (name?: string, address?: string) => {
	if (!name && !address) {
		throw new Error("Please provide at least a name or address query parameter.");
	}

	let querySpec: {
		query: string;
		parameters: { name: string; value: string }[];
	};

	if (name && address) {
		querySpec = {
			query: "SELECT * FROM c WHERE c.name = @name OR c.address = @address",
			parameters: [
				{ name: "@name", value: name },
				{ name: "@address", value: address },
			],
		};
	} else if (name) {
		querySpec = {
			query: "SELECT * FROM c WHERE c.name = @name",
			parameters: [{ name: "@name", value: name }],
		};
	} else {
		querySpec = {
			query: "SELECT * FROM c WHERE c.address = @address",
			parameters: [{ name: "@address", value: address! }],
		};
	}

	return querySpec;
};