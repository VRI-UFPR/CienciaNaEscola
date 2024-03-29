import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        username: null,
        token: null,
    });

    const [acceptTerms, setAcceptTerms] = useState({ value: false });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedTermsValidation = JSON.parse(localStorage.getItem('acceptTerms'));
        if (storedUser) {
            setUser(storedUser);
        }
        if (storedTermsValidation) {
            setAcceptTerms(storedTermsValidation);
        }
    }, []);

    const login = (id, username, token) => {
        setUser({ id, username, token });
        localStorage.setItem('user', JSON.stringify({ id, username, token }));
        setAcceptTerms({ value: true });
        localStorage.setItem('acceptTerms', JSON.stringify({ value: true }));
    };

    const logout = () => {
        setUser({
            id: null,
            username: null,
            token: null,
        });
        localStorage.removeItem('user');
    };

    return <AuthContext.Provider value={{ user, acceptTerms, login, logout }}>{children}</AuthContext.Provider>;
};
