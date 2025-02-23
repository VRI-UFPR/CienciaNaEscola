/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { createContext, useContext, useEffect } from 'react';
import { Outlet, useBlocker } from 'react-router-dom';
import { AlertContext } from './AlertContext';
import { AuthContext } from './AuthContext';
import ErrorPage from '../pages/ErrorPage';

export const LayoutContext = createContext();

export const LayoutProvider = (props) => {
    const { isDashboard = false } = props;
    const { hideAlert, isAlertVisible, isClosable } = useContext(AlertContext);
    const { user } = useContext(AuthContext);
    const blocker = useBlocker(({ currentLocation, nextLocation }) => isAlertVisible && currentLocation.pathname !== nextLocation.pathname);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            if (!isClosable) {
                alert('Você não pode sair da página agora. Aguarde finalizar a ação.');
            } else {
                blocker.reset?.();
                hideAlert();
            }
        }
    }, [blocker, hideAlert, isClosable]);

    return (
        <LayoutContext.Provider value={{ isDashboard }}>
            {isDashboard && (user.role === 'GUEST' || user.role === 'USER') ? (
                <ErrorPage text={'Operação não permitida'} description={'Você não possui acesso às funções da dashboard'} />
            ) : (
                <Outlet />
            )}
        </LayoutContext.Provider>
    );
};
