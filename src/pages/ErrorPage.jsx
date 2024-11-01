/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext } from 'react';
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';
import { useNavigate } from 'react-router-dom';
import TextButton from '../components/TextButton';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutContext } from '../contexts/LayoutContext';

const styles = `
    .logo-picce-circular{
        min-width: 200px;
        max-width: 350px;
    }

    .logo-picce-textual{
        max-width: 175px;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .color-grey {
        color: #535353;
    }
`;

function ErrorPage(props) {
    const { text, description } = props;
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { isDashboard } = useContext(LayoutContext);

    return (
        <div className="d-flex flex-column align-items-center vh-100">
            <ColoredBorder />
            <div className="d-flex align-items-end justify-content-center h-50 w-100 pt-5">
                <img src={logoPicceCircular} className="logo-picce-circular w-75 p-4" alt="Logo gráfico Picce"></img>
            </div>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center px-4 pb-5 m-0">
                <span className="font-barlow color-grey text-center text-break fw-medium fs-3 mb-2">{text || ''}</span>
                <span className="font-barlow color-grey text-center text-break fw-medium fs-5 mb-4">{description || ''}</span>
                <TextButton
                    text="Voltar ao início"
                    className="w-auto px-4"
                    onClick={() => {
                        logout();
                        navigate(isDashboard ? '/dash/' : '/');
                    }}
                    hsl={[355, 78, 66]}
                ></TextButton>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center h-25 w-75 px-2 pb-5 m-0">
                <img src={logoPicceTextual} className="logo-picce-textual w-50 p-0" alt="Logo textual Picce"></img>
            </div>
            <ColoredBorder />
            <style>{styles}</style>
        </div>
    );
}

export default ErrorPage;
