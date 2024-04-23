import { createContext, useState, useEffect, useContext } from 'react';
import { StorageContext } from './StorageContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        username: null,
        token: null,
        acceptedTerms: null,
    });

    const { clearDBObject } = useContext(StorageContext);

    const [acceptTerms, setAcceptTerms] = useState({ value: false });

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

    // const acceptTerms = () => {
    //     setUser({ ...user, acceptedTerms: true });
    //     localStorage.setItem('user', JSON.stringify({ ...user, acceptedTerms: true }));
    // };

    const logout = () => {
        setUser({
            id: null,
            username: null,
            token: null,
        });
        localStorage.removeItem('user');
        setAcceptTerms({ value: false });
        localStorage.removeItem('acceptTerms');
        clearDBObject('applications');
    };

    return <AuthContext.Provider value={{ user, login, logout, acceptTerms }}>{children}</AuthContext.Provider>;
};
