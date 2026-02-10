'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_USERS, ROLES } from './data';

const AuthContext = createContext({
    user: null,
    login: () => { },
    loginAsRole: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('tattva_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Demo authentication logic
        const foundUser = DEMO_USERS.find(u => u.email === email && 'password' === 'password'); // Simplified check

        // For verify purpose, accepting any password if email matches a demo user
        // In a real app complexity would be higher.
        // Let's stick to the convention used in login page: any password works for demo users

        // Actually, let's look at how login page might use this. 
        // If we want a specific password for DEV:
        if (email === 'dev@tattva.ai' && password !== 'dev123') {
            return { success: false, error: 'Invalid password' };
        }

        const validUser = DEMO_USERS.find(u => u.email === email);

        if (validUser) {
            setUser(validUser);
            localStorage.setItem('tattva_user', JSON.stringify(validUser));
            return { success: true };
        }

        return { success: false, error: 'User not found' };
    };

    const loginAsRole = (role) => {
        const demoUser = DEMO_USERS.find(u => u.role === role);
        if (demoUser) {
            setUser(demoUser);
            localStorage.setItem('tattva_user', JSON.stringify(demoUser));
            return { success: true };
        }
        return { success: false, error: 'Role demo user not found' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tattva_user');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginAsRole, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
