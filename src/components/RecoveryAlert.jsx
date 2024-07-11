/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import React from 'react';
import TextButton from './TextButton';

const alertProtocolAlertStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }
    .bg-white {
        background-color: #FFFFFF;
    }
    .alert-protocol-h1 {
        font-weight: 400;
        color: #3C3A3A;
    }
`;

function RecoveryAlert(props) {
    return (
        <div className="d-flex flex-column shadow bg-white rounded-4 w-100 mx-0 px-0 py-4">
            <div className="row p-4 py-2 mx-0">
                <h1 className="alert-protocol-h1 font-century-gothic text-center fs-3">
                    Acesse o e-mail cadastrado para recuperar sua senha
                </h1>
            </div>
            <div className="row d-flex justify-content-center p-4 py-2 mx-0">
                <div className="col-auto d-flex px-1">
                    <TextButton hsl={[97, 43, 70]} text="OK" className="p-4 px-5" />
                </div>
            </div>
            <style>{alertProtocolAlertStyles}</style>
        </div>
    );
}

export default RecoveryAlert;
