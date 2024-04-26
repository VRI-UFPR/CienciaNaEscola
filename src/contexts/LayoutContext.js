import { createContext } from 'react';
import { Outlet } from 'react-router-dom';

export const LayoutContext = createContext();

export const LayoutProvider = (props) => {
    const { isDashboard } = props;

    return (
        <LayoutContext.Provider value={{ isDashboard }}>
            <Outlet />
        </LayoutContext.Provider>
    );
};
