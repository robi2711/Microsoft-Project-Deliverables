// Handles user login with the provider
export const signIn = async (provider: string) => {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({ provider }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	// If login fails, show an error
	if (!response.ok) {
		throw new Error('Failed to sign in');
	}

	// Return the user data from the response
	return await response.json();
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
