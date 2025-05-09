"use client";
import { createContext, useContext, useState, useEffect } from 'react';

export interface UserInfo {
	username: string;
	email: string;
	accessToken: string,
	idToken: string,
	refreshToken: string,
	tokenType: string,
	complexIds: string[],
	sub: string;
	type: string;
	selectedComplexName? : string;
	selectedComplex? : string;
}
export interface ComplexResponse {
	id: string;
	address: string;
}

interface UserContextType {
	userInfo: UserInfo | null;
	setUserInfo: (userInfo: {
		accessToken: string;
		complexIds: string[];
		email: string;
		idToken: string;
		refreshToken: string;
		sub: string;
		tokenType: string;
		type: string;
		username: string;
		selectedComplexName?: string;
		selectedComplex?: string
	}) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const updateUserInfo = (userInfo: UserInfo) => {
		setUserInfo(userInfo);
		sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
	};

	useEffect(() => {
		const storedUserInfo = sessionStorage.getItem('userInfo');
		if (storedUserInfo) {
			setUserInfo(JSON.parse(storedUserInfo));
		}
	}, []);

	return (
		<UserContext.Provider value={{ userInfo, setUserInfo: updateUserInfo }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
