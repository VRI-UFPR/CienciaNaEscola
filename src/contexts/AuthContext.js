import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        email: null,
        token: null,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (id, email, token) => {
        setUser({ id, email, token });
        localStorage.setItem('user', JSON.stringify({ id, email, token }));
    };

    const logout = () => {
        setUser({
            id: null,
            email: null,
            token: null,
        });
        localStorage.removeItem('user');
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
