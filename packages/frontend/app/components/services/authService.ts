import api from "./apiService";

export type AdminCredentials = {
	email: string;
	givenName: string;
}

export type AdminInfo = {
	type: string;
	email: string;
	username: string;
	accessToken: string;
	idToken: string;
	refreshToken: string;
	tokenType: string;
	address: string;
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

export async function signInConcierge(credentials: string, password : string) {
	const params = {
		credentials,
		password,
	};

	try {
		const response = await api.post(`/auth/signInConcierge`, params, {
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


export async function signOutAdmin(AccessToken: string | undefined) {
	try {
		const response = await api.post(`/auth/signOutAdmin`, {AccessToken}, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log(response);
		return response;
	} catch (error) {
		console.error("Sign out error:", error);
		throw error;
	}
}

// Sign up function for Admin
export async function signUpAdmin(credentials: AdminCredentials, password: string, address: string) {
	const params = {
		credentials,
		password,
		address,
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

export async function signUpConcierge(credentials: string, password: string, sub : string) {
	const params = {
		credentials,
		password,
		complexId: sub
	};

	try {
		const response = await api.post(`/auth/signUpConcierge`, params, {
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

