/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';
import CustomContainer from '../components/CustomContainer';

const styles = `
    .logo-picce-circular{
        min-width: 200px;
        max-width: 350px;
    }

    .logo-picce-textual{
        max-width: 175px;
    }

    .spinner-splash{
        width: 50px;
        height: 50px;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .color-grey {
        color: #535353;
    }
`;

function SplashPage(props) {
    const { text } = props;

    return (
        <div className="d-flex flex-column align-items-center vh-100">
            <ColoredBorder />
            <CustomContainer className="font-barlow flex-grow-1 w-100 p-4" df="12" md="10">
                <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center w-100 pt-5 pb-5">
                    <img src={logoPicceCircular} className="logo-picce-circular w-75 px-3 mb-5" alt="Logo gráfico Picce"></img>
                    <span className="font-barlow color-grey text-center text-break fw-medium fs-3 mb-4">{text || ''}</span>
                    <div className="spinner-border text-secondary spinner-splash" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center w-100 pb-5">
                    <img src={logoPicceTextual} className="logo-picce-textual w-50 px-3" alt="Logo textual Picce"></img>
                </div>
            </CustomContainer>

            <ColoredBorder />
            <style>{styles}</style>
        </div>
    );
}

export default SplashPage;
