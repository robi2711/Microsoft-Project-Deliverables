import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, getUserSession } from '@/components/services/authService';

// Define a type for user data
type User = {
    id: number;
    name: string;
    email: string;
    provider: string;
    role: 'resident' | 'staff' | 'admin';  // Role-based access control
};

// Define the AuthContext type
type AuthContextType = {
    user: User | null;
    login: (provider: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    hasRole: (role: 'resident' | 'staff' | 'admin') => boolean;
};

// Create context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Load user from session storage
    useEffect(() => {
        const loadUserSession = async () => {
            const storedUser = await getUserSession();
            if (storedUser) {
                setUser(storedUser);
            }
        };
        loadUserSession();
    }, []);

    // Login function (calls backend auth API)
    const login = async (provider: string) => {
        try {
            const userData: User = await signIn(provider);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Save session
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    // Logout function (clears session)
    const logout = async () => {
        await signOut();
        setUser(null);
        localStorage.removeItem('user');
        router.push('/'); // Redirect to home
    };

    // Check if user has a specific role
    const hasRole = (role: 'resident' | 'staff' | 'admin') => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context anywhere
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};