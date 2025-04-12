import api from "./apiService";

export type AdminCredentials = {
	email: string;
	givenName: string;
}

export type AdminInfo = {
	email: string;
	sub: string;
}



export async function signInAdmin(credentials: AdminCredentials, password : string) {
	const params = {
		credentials,
		password,
	};

	try {
		const response = await api.post(`/auth/signInAdmin`, params, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("Response from signInAdmin:", response.data);
		return response.data as AdminInfo;
	} catch (error) {
		console.error("Sign up error:", error);
		throw error;
	}
}

export async function signOutAdmin(credentials: AdminCredentials, password : string) {
	const params = {
		credentials,
		password,
	}
	try {
		const response = await fetch(`/auth/signOutAdmin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to sign in");
		}

		return await response.json();
	} catch (error) {
		console.error("Admin sign in error:", error);
		throw error;
	}
}

// Sign up function for Admin
export async function signUpAdmin(credentials: AdminCredentials, password: string) {
	const params = {
		credentials,
		password,
	};

	try {
		const response = await api.post(`/auth/signUpAdmin`, params, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Sign up error:", error);
		throw error;
	}
}

