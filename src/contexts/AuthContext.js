import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        token: null,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (id, token) => {
        setUser({ id, token });
        localStorage.setItem('user', JSON.stringify({ id, token }));
    };

    const logout = () => {
        setUser({
            id: null,
            token: null,
        });
        localStorage.removeItem('user');
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
