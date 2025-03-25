import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut } from '../api/auth';

// Create a context for authentication state
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Check if the user is already logged in (from localStorage)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function (calls backend auth API)
    const login = async (provider) => {
        const userData = await signIn(provider);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Save session
    };

    // Logout function (clears session)
    const logout = async () => {
        await signOut();
        setUser(null);
        localStorage.removeItem('user');
        router.push('/'); // Redirect to home
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context anywhere
export const useAuth = () => useContext(AuthContext);
