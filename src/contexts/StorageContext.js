import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    const [connected, setConnected] = useState(window.navigator.onLine);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [application, setApplication] = useState({});

    // Retrieve stored data from localStorage
    useEffect(() => {
        const JSONtoFormData = (data) => {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            return formData;
        };

        const storedConnected = JSON.parse(localStorage.getItem('connected'));
        if (storedConnected) {
            setConnected(storedConnected);
        }
        const storedApplication = JSON.parse(localStorage.getItem('application'));
        if (storedApplication) {
            setApplication(storedApplication);
        }
        const storedPendingRequests = JSON.parse(localStorage.getItem('pendingRequests'));
        if (storedPendingRequests) {
            setPendingRequests(storedPendingRequests.map((request) => ({ ...request, data: JSONtoFormData(request.data) })));
        }
    }, []);

    // Add event listeners to update the connected state
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

    // Store the connected state in localStorage
    useEffect(() => {
        if (connected !== undefined) {
            localStorage.setItem('connected', JSON.stringify(connected));
        }
    }, [connected]);

    // Store the application state in localStorage
    useEffect(() => {
        if (application.id) {
            localStorage.setItem('application', JSON.stringify(application));
        }
    }, [application]);

    // Store the pending requests in localStorage
    useEffect(() => {
        const formDataToJSON = (formData) => {
            const data = {};
            for (const key of formData.keys()) {
                data[key] = formData.get(key);
            }
            return data;
        };

        const pendingRequestsToStore = pendingRequests.map((request) => ({ ...request, data: formDataToJSON(request.data) }));

        if (pendingRequests.length > 0) {
            localStorage.setItem('pendingRequests', JSON.stringify(pendingRequestsToStore));
        }
    }, [pendingRequests]);

    useEffect(() => {
        if (connected && pendingRequests.length > 0) {
            pendingRequests.forEach(async (request) => {
                try {
                    await axios.post(request.url, request.data, request.config);
                } catch (error) {
                    console.error(error);
                }
            });
            setPendingRequests([]);
            localStorage.removeItem('pendingRequests');
        }
    }, [connected, pendingRequests]);

    useEffect(() => {
        if (connected && application.id) {
            setApplication({});
            localStorage.removeItem('application');
        }
    }, [connected, application]);

    const storeApplicationWithProtocol = useCallback((application) => {
        setApplication(application);
    }, []);

    const storePendingRequest = (request) => {
        setPendingRequests((prev) => [...prev, request]);
    };

    return (
        <StorageContext.Provider value={{ connected, application, storeApplicationWithProtocol, storePendingRequest }}>
            {children}
        </StorageContext.Provider>
    );
};
