import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    const [connected, setConnected] = useState(window.navigator.onLine);
    const [localApplications, setLocalApplications] = useState(undefined);
    const [pendingRequests, setPendingRequests] = useState(undefined);
    const isRequesting = useRef(false);

    const getDBPendingRequests = useCallback(() => {
        const JSONtoFormData = (data) => {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            return formData;
        };

        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open('picceDB');
            dbRequest.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction(['pendingRequests'], 'readwrite');
                const pendingRequestsStored = tx.objectStore('pendingRequests');
                const result = [];
                pendingRequestsStored.openCursor().onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        result.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(result.map((request) => ({ ...request, data: JSONtoFormData(request.data) })));
                    }
                };
            };
            dbRequest.onerror = (event) => {
                console.error('Error opening indexedDB: ', event.target.error);
                reject([]);
            };
        });
    }, []);

    const getDBapplication = useCallback(() => {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open('picceDB');
            dbRequest.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction(['applications'], 'readwrite');
                const applicationStored = tx.objectStore('applications');
                const result = [];
                applicationStored.openCursor().onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        result.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(result);
                    }
                };
            };
            dbRequest.onerror = (event) => {
                console.error('Error opening indexedDB: ', event.target.error);
                reject([]);
            };
        });
    }, []);

    const storeDBObject = useCallback((storeName, data) => {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open('picceDB');
            dbRequest.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction([storeName], 'readwrite');
                const store = tx.objectStore(storeName);
                store.add(data);
                resolve();
            };
            dbRequest.onerror = (event) => {
                console.error('Error opening indexedDB: ', event.target.error);
                reject();
            };
        });
    }, []);

    const clearDBObject = useCallback((storeName) => {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open('picceDB');
            dbRequest.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction([storeName], 'readwrite');
                const store = tx.objectStore(storeName);
                store.clear();
                resolve();
            };
            dbRequest.onerror = (event) => {
                console.error('Error opening indexedDB: ', event.target.error);
                reject();
            };
        });
    }, []);

    // Retrieve stored data from localStorage
    useEffect(() => {
        const dbRequest = indexedDB.open('picceDB');
        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('applications', { keyPath: 'id' });
            db.createObjectStore('pendingRequests', { keyPath: 'id' });
        };
        getDBapplication().then((result) => {
            setLocalApplications(result);
        });
        getDBPendingRequests().then((result) => {
            setPendingRequests(result);
        });
    }, [getDBPendingRequests, getDBapplication]);

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

    useEffect(() => {
        if (connected && pendingRequests?.length > 0 && !isRequesting.current) {
            isRequesting.current = true;
            const promises = [];
            for (const request of pendingRequests) {
                try {
                    // Axios request promise
                    const promise = axios.post(request.url, request.data, request.config).then((response) => {
                        Notification.requestPermission().then((result) => {
                            new Notification('Envio pendente realizado! ', { body: request.title });
                        });
                    });
                    promises.push(promise);
                } catch (error) {
                    Notification.requestPermission().then((result) => {
                        new Notification('Envio pendente falhou. Submeta a resposta novamente! ', { body: request.title });
                    });
                }
            }
            Promise.all(promises).then(() => {
                setPendingRequests([]);
                clearDBObject('pendingRequests').then(() => {
                    isRequesting.current = false;
                });
            });
        }
    }, [connected, pendingRequests, clearDBObject]);

    const storeLocalApplication = useCallback(
        (application) => {
            setLocalApplications((prev) => {
                if (prev.find((app) => app.id === application.id)) {
                    return prev;
                } else {
                    return [...prev, application];
                }
            });
            storeDBObject('applications', application);
        },
        [storeDBObject]
    );

    const storePendingRequest = useCallback(
        (request) => {
            const formDataToJSON = (formData) => {
                const data = {};
                for (const key of formData.keys()) {
                    data[key] = formData.get(key);
                }
                return data;
            };

            setPendingRequests((prev) => [...prev, request]);
            storeDBObject('pendingRequests', { ...request, data: formDataToJSON(request.data) });
        },
        [storeDBObject]
    );

    return (
        <StorageContext.Provider value={{ connected, localApplications, storeLocalApplication, storePendingRequest, clearDBObject }}>
            {children}
        </StorageContext.Provider>
    );
};
