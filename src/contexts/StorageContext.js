import { createContext, useState, useEffect } from 'react';

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    const [connected, setConnected] = useState(window.navigator.onLine);

    useEffect(() => {
        const storedConnected = JSON.parse(localStorage.getItem('connected'));
        if (storedConnected) {
            setConnected(storedConnected);
        }
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            setConnected(true);
        };

        const handleOffline = () => {
            setConnected(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (connected !== undefined) {
            localStorage.setItem('connected', JSON.stringify(connected));
        }
    }, [connected]);

    return <StorageContext.Provider value={{ connected }}>{children}</StorageContext.Provider>;
};
