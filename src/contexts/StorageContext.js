import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    const [connected, setConnected] = useState(window.navigator.onLine);
    const [pendingAnswer, setPendingAnswer] = useState(undefined);
    const [application, setApplication] = useState({});
    const [id, setId] = useState(undefined);

    // Retrieve stored data from localStorage
    useEffect(() => {
        const storedConnected = JSON.parse(localStorage.getItem('connected'));
        if (storedConnected) {
            setConnected(storedConnected);
        }
        const storedApplication = JSON.parse(localStorage.getItem('application'));
        if (storedApplication) {
            setApplication(storedApplication);
        }
        const storedPendingAnswer = JSON.parse(localStorage.getItem('pendingAnswer'));
        if (storedPendingAnswer) {
            setPendingAnswer(storedPendingAnswer);
        }
        const storedId = JSON.parse(localStorage.getItem('id'));
        if (storedId) {
            setId(storedId);
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
        if (pendingAnswer) {
            localStorage.setItem('pendingAnswer', JSON.stringify(pendingAnswer));
        }
    }, [pendingAnswer]);

    // Store the pending id in localStorage
    useEffect(() => {
        if (id) {
            localStorage.setItem('id', JSON.stringify(id));
        }
    }, [id]);

    useEffect(() => {
        if (connected && pendingAnswer && id) {
            const uploadFile = async (file) => {
                try {
                    const formData = new FormData();
                    formData.append('api_key', process.env.REACT_APP_API_KEY);
                    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
                    formData.append('file', file);

                    const response = await axios.post(`https://api.cloudinary.com/v1_1/dbxjlnwlo/image/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    return response;
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            };

            const uploadedFiles = {};
            const uploadPromises = [];

            for (let prop in pendingAnswer) {
                uploadedFiles[prop] = [];
                if (pendingAnswer[prop] instanceof File) {
                    uploadPromises.push(
                        uploadFile(pendingAnswer[prop]).then((response) => {
                            uploadedFiles[prop] = [response.data.url];
                        })
                    );
                } else {
                    uploadedFiles[prop] = pendingAnswer[prop];
                }
            }

            Promise.all(uploadPromises).then(() => {
                axios.post(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, uploadedFiles);
            });
            setPendingAnswer(undefined);
            setId(undefined);
            localStorage.removeItem('pendingAnswer');
            localStorage.removeItem('id');
        }
    }, [connected, pendingAnswer, id]);

    useEffect(() => {
        if (connected && application.id) {
            setApplication({});
            localStorage.removeItem('application');
        }
    }, [connected, application]);

    const storeApplicationWithProtocol = useCallback((application) => {
        setApplication(application);
    }, []);

    const storePendingAnswer = (answer) => {
        setPendingAnswer(answer);
    };

    const storePendingId = (id) => {
        setId(id);
    };

    return (
        <StorageContext.Provider value={{ connected, application, storeApplicationWithProtocol, storePendingAnswer, storePendingId }}>
            {children}
        </StorageContext.Provider>
    );
};
