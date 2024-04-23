import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        username: null,
        token: null,
        acceptedTerms: null,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (id, username, token, acceptedTerms) => {
        setUser({ id, username, token, acceptedTerms });
        localStorage.setItem('user', JSON.stringify({ id, username, token, acceptedTerms }));
    };

    const acceptTerms = () => {
        setUser({ ...user, acceptedTerms: true });
        localStorage.setItem('user', JSON.stringify({ ...user, acceptedTerms: true }));
    };

    const logout = () => {
        setUser({
            id: null,
            username: null,
            token: null,
        });
        localStorage.removeItem('user');
    };

    return <AuthContext.Provider value={{ user, login, logout, acceptTerms }}>{children}</AuthContext.Provider>;
};
