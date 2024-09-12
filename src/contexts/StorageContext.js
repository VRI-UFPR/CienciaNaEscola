import { createContext, useState, useEffect, useCallback } from 'react';

export const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    const [connected, setConnected] = useState(window.navigator.onLine);
    const [localApplications, setLocalApplications] = useState(undefined);
    const [pendingRequests, setPendingRequests] = useState(undefined);

    const getDBPendingRequests = useCallback(() => {
        const JSONtoFormData = (data) => {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            return formData;
        };

        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open('picceDB', 1);
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
            const dbRequest = indexedDB.open('picceDB', 1);
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
            const dbRequest = indexedDB.open('picceDB', 1);
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
            const dbRequest = indexedDB.open('picceDB', 1);
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

    const clearLocalApplications = useCallback(() => {
        setLocalApplications([]);
        clearDBObject('applications');
    }, [clearDBObject]);

    const clearPendingRequests = useCallback(() => {
        setPendingRequests([]);
        clearDBObject('pendingRequests');
    }, [clearDBObject]);

    // Retrieve stored data from localStorage
    useEffect(() => {
        const dbRequest = indexedDB.open('picceDB', 1);
        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            Array.from(db.objectStoreNames).forEach((storeName) => {
                db.deleteObjectStore(storeName);
            });
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

    const storeLocalApplication = useCallback(
        (application) => {
            setLocalApplications((prev) => {
                return prev.map((app) => {
                    if (app.id === application.id) {
                        return application;
                    } else {
                        return app;
                    }
                });
            });
            clearDBObject('applications');
            storeDBObject('applications', application);
        },
        [storeDBObject, clearDBObject]
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
        <StorageContext.Provider
            value={{
                connected,
                localApplications,
                pendingRequests,
                storeLocalApplication,
                storePendingRequest,
                clearLocalApplications,
                clearPendingRequests,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
};
