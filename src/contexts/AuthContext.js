import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        token: null,
    });

    const login = (id, token) => {
        setUser({ id, token });
    };

    const logout = () => {
        setUser({
            id: null,
            token: null,
        });
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
