/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { StorageContext } from './StorageContext';
import axios from 'axios';
import baseUrl from './RouteContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { clearLocalApplications, clearPendingRequests, pendingRequests, connected } = useContext(StorageContext);
    const [user, setUser] = useState({ status: 'loading' });

    const acceptTerms = () => {
        setUser({ ...user, acceptedTerms: true });
        localStorage.setItem('user', JSON.stringify({ ...user, acceptedTerms: true }));
    };

    // Send all pending requests to the server when the user is connected and logged in
    useEffect(() => {
        if (connected && user.id && user.token && pendingRequests?.length > 0) {
            const promises = [];
            for (const request of pendingRequests) {
                if (request.userId === user.id) {
                    try {
                        // Axios request promise
                        const promise = axios
                            .post(request.url, request.data, {
                                ...request.config,
                                headers: { ...request.config?.headers, Authorization: `Bearer ${user.token}` },
                            })
                            .then((response) => {
                                Notification.requestPermission().then((result) => {
                                    navigator.serviceWorker.ready.then((registration) => {
                                        registration.showNotification('Envio pendente realizado!', { body: request.title });
                                    });
                                });
                            });
                        promises.push(promise);
                    } catch (error) {
                        Notification.requestPermission().then((result) => {
                            navigator.serviceWorker.ready.then((registration) => {
                                registration.showNotification('Envio pendente falhou. Submeta a resposta novamente!', {
                                    body: request.title,
                                });
                            });
                        });
                    }
                }
            }
            Promise.all(promises).then(() => {
                clearPendingRequests();
            });
        }
    }, [clearPendingRequests, pendingRequests, connected, user]);

    // Clean up all user traces, except the user itself (localStorage, indexedDB)
    const clearDBAndStorage = useCallback(() => {
        localStorage.removeItem('user');
        clearLocalApplications();
    }, [clearLocalApplications]);

    // Create a new user object and store it in localStorage
    const login = useCallback((id, username, role, token, expiresIn, acceptedTerms, institutionId, profileImage) => {
        setUser({ id, username, role, token, expiresIn, acceptedTerms, institutionId, status: 'authenticated', profileImage });

        localStorage.setItem('user', JSON.stringify({ id, username, role, token, expiresIn, acceptedTerms, institutionId, profileImage }));
    }, []);

    const renewUser = useCallback(
        (username, role, profileImage) => {
            setUser({ ...user, username, role, status: 'authenticated', profileImage });

            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: user.id,
                    username,
                    role,
                    token: user.token,
                    expiresIn: user.expiresIn,
                    acceptedTerms: user.acceptTerms,
                    institutionId: user.institutionId,
                    profileImage,
                })
            );
        },
        [user]
    );

    // Clear user object and clean up traces (through clearDBAndStorage)
    const logout = useCallback(() => {
        setUser({ status: 'unauthenticated' });
        clearDBAndStorage();
    }, [clearDBAndStorage]);

    // Check user's token expiration time and renew it if necessary or clear traces if expired
    const renewLogin = useCallback(() => {
        setUser((prev) => {
            if (prev.status === 'authenticated') {
                const now = new Date();
                const renewTime = new Date(new Date(prev.expiresIn).getTime() - 600000);
                const expirationTime = new Date(prev.expiresIn);
                if (now >= renewTime && now <= expirationTime) {
                    axios
                        .post(`${baseUrl}api/auth/renewSignIn`, null, {
                            headers: {
                                Authorization: `Bearer ${prev.token}`,
                            },
                        })
                        .then((response) => {
                            if (response.data.data.token) {
                                const token = response.data.data.token;
                                const expiresIn = new Date(new Date().getTime() + response.data.data.expiresIn);
                                const role = response.data.data.role;
                                localStorage.setItem('user', JSON.stringify({ ...prev, token, expiresIn }));
                                return {
                                    ...prev,
                                    role,
                                    token,
                                    expiresIn,
                                    status: 'authenticated',
                                };
                            }
                        })
                        .catch((error) => {
                            clearDBAndStorage();
                            return { status: 'unauthenticated' };
                        });
                } else if (now > expirationTime) {
                    clearDBAndStorage();
                    return { status: 'unauthenticated' };
                }
            }
            return prev;
        });
    }, [clearDBAndStorage]);

    // Load user from localStorage and schedule periodic token expiration check
    useEffect(() => {
        setUser((prev) =>
            JSON.parse(localStorage.getItem('user'))
                ? { ...JSON.parse(localStorage.getItem('user')), status: 'authenticated' }
                : { status: 'unauthenticated' }
        );

        const interval = setInterval(() => {
            renewLogin();
        }, 300000);
        return () => clearInterval(interval);
    }, [renewLogin]);

    useEffect(() => {
        if (user.status === 'authenticated') renewLogin();
    }, [user.status, renewLogin]);

    return <AuthContext.Provider value={{ user, login, logout, acceptTerms, renewUser }}>{children}</AuthContext.Provider>;
};
