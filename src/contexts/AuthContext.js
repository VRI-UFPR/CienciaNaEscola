import { createContext, useState, useEffect, useContext } from 'react';
import { StorageContext } from './StorageContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        username: null,
        token: null,
        expiresIn: null,
    });

    const { clearDBObject } = useContext(StorageContext);

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

    const login = (id, username, token, expiresIn) => {
        setUser({ id, username, token, expiresIn });
        localStorage.setItem('user', JSON.stringify({ id, username, token, expiresIn }));
        setAcceptTerms({ value: true });
        localStorage.setItem('acceptTerms', JSON.stringify({ value: true }));
    };

    const logout = () => {
        setUser({
            id: null,
            username: null,
            token: null,
            expiresIn: null,
        });
        localStorage.removeItem('user');
        setAcceptTerms({ value: false });
        localStorage.removeItem('acceptTerms');
        clearDBObject('applications');
    };

    return <AuthContext.Provider value={{ user, acceptTerms, login, logout }}>{children}</AuthContext.Provider>;
};
