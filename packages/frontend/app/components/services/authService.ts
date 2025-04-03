import api from './apiService';
// Handles user login with the provider
export type UserCredentials = {
	email: string
	password: string
}
export type AdminCredentials = {
	adminId: string
	password: string
}

export type ConciergeCredentials = {
	conciergeId: string
	password: string
}

export type SignUpData = {
	name: string
	phone: string
	address: string
	email: string
	password: string
	accountType: "user" | "concierge" | "admin"
}

export type UserData = {
	name: string
	email: string
	password: string
	role: string
	accountType: "user" | "concierge" | "admin"
}
const API_URL = "asdasdads"
export const signInAdmin = async (provider: AdminCredentials) => {
	const response = await api.post('/auth/signUpAdmin', {
		provider
	});

	// If login fails, show an error
	if (!response) {
		throw new Error('Failed to sign in');
	}

	// Return the user data from the response
	return await response;
};

// Handles user logout
export const signOut = async () => {
	const response = await fetch('/api/auth/logout', {
		method: 'POST',
	});

	// If logout fails, show an error
	if (!response.ok) {
		throw new Error('Failed to sign out');
	}

	// Return the response confirming the user has logged out
	return await response.json();
};

// Fetch the current logged-in user session
export const getUserSession = async () => {
	const response = await fetch('/api/auth/session');

	// If there’s no session, return null
	if (!response.ok) {
		return null;
	}

	// Return the session data if the user is logged in
	return await response.json();
};


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

export async function signUp(data: SignUpData) {
	try {
		const response = await fetch(`${API_URL}/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
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


export async function signInUser(credentials: AdminCredentials) {
	try {
		const response = await fetch(`${API_URL}/auth/admin/signin`, {
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
		console.error("Admin sign in error:", error)
		throw error
	}
}