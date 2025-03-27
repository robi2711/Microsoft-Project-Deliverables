// THIS IS A SAMPLE AND MUST BE MODIFIED WHEN AUTH IS DONE

// Authentication service for API requests

// Types for authentication
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
	firstName: string
	lastName: string
	email: string
	password: string
	accountType: "user" | "concierge" | "admin"
}

export type UserData = {
	firstName: string
	lastName: string
	email: string
	password: string
	role: string
	accountType: "user" | "concierge" | "admin"
}

const API_URL = "/localhost:3001"

// Sign in functions
export async function signInUser(credentials: UserCredentials) {
	try {
		const response = await fetch(`${API_URL}/auth/user/signin`, {
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
		console.error("Sign in error:", error)
		throw error
	}
}

export async function signInAdmin(credentials: AdminCredentials) {
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

// Sign up function
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

