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

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .general {
        width: 85%;
    }

    .leftArrow {
        transform: scaleX(-1);
        margin-right: 7px;
    }

    .rightArrow {
        margin-left: 7px;
    }

    .leftArrow, .rightArrow {
        width: 35px;
    }

    .arrowText {
        color: #F59489;
        font-weight: 700;
        font-size: 15px;
    }
`;

function HomeArrows(props) {
    return (
        <div className="general d-flex container-fluid align-itens-center justify-content-between mt-3 p-0">
            <div className="d-flex align-items-center justify-content-center">
                {/* <img src={pinkArrow} alt="Seta" className="leftArrow"></img> */}
                <span className="arrowText d-flex">Voltar</span>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <span className="arrowText">Ver mais</span>
                {/* <img src={pinkArrow} alt="Seta" className="rightArrow"></img> */}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default HomeArrows;
