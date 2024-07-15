import { createContext, useContext, useEffect } from 'react';
import { Outlet, useBlocker } from 'react-router-dom';
import { AlertContext } from './AlertContext';

export const LayoutContext = createContext();

export const LayoutProvider = (props) => {
    const { isDashboard } = props;
    const { hideAlert, isAlertVisible, isDismissable } = useContext(AlertContext);
    const blocker = useBlocker(({ currentLocation, nextLocation }) => isAlertVisible && currentLocation.pathname !== nextLocation.pathname);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            if (!isDismissable) {
                alert('Você não pode sair da página agora. Aguarde finalizar a ação.');
            } else {
                blocker.reset?.();
                hideAlert();
            }
        }
    }, [isDismissable, blocker, hideAlert]);

    return (
        <LayoutContext.Provider value={{ isDashboard }}>
            <Outlet />
        </LayoutContext.Provider>
    );
};
