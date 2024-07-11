/*
Copyright (C) 2024 Laboratório Visão Robótica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React } from 'react';
import CheckIcon from '../assets/images/CheckIcon.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }    

    .custom-btn {
        background-color: #F8F8F8;
        border-radius: 10px;
        width: 85%;
        box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.25);
    }

    .home-btn-title {
        overflow-y: scroll;
        max-height: 100%;
    }

    ::-webkit-scrollbar {
        width: 0px;
    }
`;

function HomeButton(props) {
    const { title, check } = props;

    return (
        <div className="custom-btn d-flex align-items-center justify-content-between font-barlow h-100 px-4">
            <div className="d-flex align-items-center h-100 w-100 py-2">
                <h5 className="home-btn-title text-wrap fw-medium w-100 py-1 my-0">{title}</h5>

                {check && (
                    <div className="d-flex justify-content-end align-items-center p-0 m-0">
                        <img src={CheckIcon} alt="Ícone de já respondido" className="w-50 h-50" />
                    </div>
                )}
            </div>

            <style>{styles}</style>
        </div>
    );
}

HomeButton.defaultProps = {
    check: false,
};

export default HomeButton;
