import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { StorageContext } from './StorageContext';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const defaultUser = useMemo(() => ({ id: null, username: null, token: null, expiresIn: null }), []);
    const { clearDBObject } = useContext(StorageContext);
    const [acceptTerms, setAcceptTerms] = useState({ value: false });
    const [user, setUser] = useState(defaultUser);

    // Clean up all user traces, except the user itself (acceptTerms, localStorage, indexedDB)
    const clearDBAndStorage = useCallback(() => {
        setAcceptTerms({ value: false });
        localStorage.removeItem('user');
        localStorage.removeItem('acceptTerms');
        clearDBObject('applications');
    }, [clearDBObject]);

    // Create a new user object and store it in localStorage
    const login = useCallback((id, username, token, expiresIn) => {
        setUser({ id, username, token, expiresIn });
        setAcceptTerms({ value: true });

        localStorage.setItem('user', JSON.stringify({ id, username, token, expiresIn }));
        localStorage.setItem('acceptTerms', JSON.stringify({ value: true }));
    }, []);

    // Clear user object and clean up traces (through clearDBAndStorage)
    const logout = useCallback(() => {
        setUser(defaultUser);
        clearDBAndStorage();
    }, [clearDBAndStorage, defaultUser]);

    // Check user's token expiration time and renew it if necessary or clear traces if expired
    const renewLogin = useCallback(() => {
        setUser((prev) => {
            if (prev.expiresIn) {
                const now = new Date();
                const renewTime = new Date(new Date(prev.expiresIn).getTime() - 600000);
                const expirationTime = new Date(prev.expiresIn);
                if (now >= renewTime && now <= expirationTime) {
                    axios
                        .post('http://localhost:3000/api/auth/renewSignIn', null, {
                            headers: {
                                Authorization: `Bearer ${prev.token}`,
                            },
                        })
                        .then((response) => {
                            if (response.data.data.token) {
                                const token = response.data.data.token;
                                const expiresIn = new Date(new Date().getTime() + response.data.data.expiresIn);
                                localStorage.setItem('user', JSON.stringify({ ...prev, token, expiresIn }));
                                return {
                                    ...prev,
                                    token,
                                    expiresIn,
                                };
                            }
                        })
                        .catch((error) => {
                            clearDBAndStorage();
                            return defaultUser;
                        });
                } else if (now > expirationTime) {
                    clearDBAndStorage();
                    return defaultUser;
                }
            }
            return prev;
        });
    }, [defaultUser, clearDBAndStorage]);

    // Load user and acceptTerms from localStorage and schedule periodic token expiration check
    useEffect(() => {
        setUser((prev) => JSON.parse(localStorage.getItem('user')) || prev);
        setAcceptTerms((prev) => JSON.parse(localStorage.getItem('acceptTerms')) || prev);
        renewLogin();

        const interval = setInterval(() => {
            renewLogin();
        }, 300000);
        return () => clearInterval(interval);
    }, [renewLogin]);

    return <AuthContext.Provider value={{ user, acceptTerms, login, logout }}>{children}</AuthContext.Provider>;
};
