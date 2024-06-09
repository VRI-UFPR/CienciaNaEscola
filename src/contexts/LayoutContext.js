import { createContext, useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AlertContext } from './AlertContext';

export const LayoutContext = createContext();

export const LayoutProvider = (props) => {
    const { isDashboard } = props;
    const location = useLocation();
    const { hideAlert } = useContext(AlertContext);

    useEffect(() => {
        hideAlert();
    }, [location, hideAlert]);

    return (
        <LayoutContext.Provider value={{ isDashboard }}>
            <Outlet />
        </LayoutContext.Provider>
    );
};
