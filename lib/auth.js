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
        const storedUser = localStorage.getItem('tattv_user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) { localStorage.removeItem('tattv_user'); }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const validUser = DEMO_USERS.find(u => u.email === email && u.password === password);

        if (validUser) {
            setUser(validUser);
            localStorage.setItem('tattv_user', JSON.stringify(validUser));
            return { success: true };
        }

        // Check if email exists but password is wrong
        const emailExists = DEMO_USERS.find(u => u.email === email);
        if (emailExists) {
            return { success: false, error: 'Invalid password' };
        }

        return { success: false, error: 'User not found' };
    };

    const loginAsRole = (role) => {
        const demoUser = DEMO_USERS.find(u => u.role === role);
        if (demoUser) {
            setUser(demoUser);
            localStorage.setItem('tattv_user', JSON.stringify(demoUser));
            return { success: true };
        }
        return { success: false, error: 'Role demo user not found' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tattv_user');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginAsRole, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
