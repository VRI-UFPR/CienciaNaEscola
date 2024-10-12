/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import MarkdownText from './MarkdownText';

const protocolInfoStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-gray {
        color: #787878;
    }   

    .bg-coral-red{
        background-color: #F59489;
    }
`;

function ProtocolInfo(props) {
    const { title, description } = props;

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden w-100 p-0">
            <div className="w-100 pb-3 bg-coral-red"></div>
            <div className="p-3 pb-0">
                <h1 className="color-dark-gray font-barlow text-break fw-bold fs-5 m-0 p-0 mb-3">{title}</h1>
                <MarkdownText text={description} />
            </div>

            <style>{protocolInfoStyles}</style>
        </div>
    );
}

export default ProtocolInfo;
