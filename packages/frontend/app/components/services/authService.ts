
// Authentication service for API requests
// Types for authentication
export type UserCredentials = {
	email: string;
	givenName: string;
	number: string;
	address: string;
}

export type AdminCredentials = {
	email: string;
	givenName: string;
}

export type ConciergeCredentials = {
	email: string
	password: string
}

export type UserInfo = {
	email: string;
	givenName: string;
	number: string;
	address: string;

}

export type UserData = {
	givenName: string
	email: string
	password: string
	role: string
	accountType: "user" | "concierge" | "admin"
}

const API_URL = "http://localhost:3001";



export async function signInAdmin(credentials: AdminCredentials, password : string) {
	const params = {
		credentials,
		password,
	}
	try {
		const response = await fetch(`${API_URL}/auth/signInAdmin`, {
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

export async function signOutAdmin(credentials: AdminCredentials, password : string) {
	const params = {
		credentials,
		password,
	}
	try {
		const response = await fetch(`${API_URL}/auth/signOutAdmin`, {
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
export async function signUpAdmin(credentials: AdminCredentials, password : string) {
	const params = {
		credentials,
		password,
	}

	try {
		const response = await fetch(`${API_URL}/auth/signUpAdmin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || "Failed to sign up")
		}

		return await response.json()
	} catch (error) {
		console.error("Sign up error:", error)
		throw error
	}
}
//Sign Up function for user
export async function signUpUser(credentials: UserInfo, password : string) {
	const params = {
		credentials,
		password,
	}

	try {
		const response = await fetch(`${API_URL}/auth/signUpUser`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || "Failed to sign up")
		}

		return await response.json()
	} catch (error) {
		console.error("Sign up error:", error)
		throw error
	}
}
//need to finish back end of concierge
export async function signInConcierge(credentials: ConciergeCredentials) {
	try {
		const response = await fetch(`${API_URL}/auth/concierge/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || "Failed to sign in")
		}

		return await response.json()
	} catch (error) {
		console.error("Concierge sign in error:", error)
		throw error
	}
}