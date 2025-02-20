/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext, useState } from 'react';
import CheckIcon from '../assets/images/CheckIcon.svg';
import RoundedButton from './RoundedButton';
import { AlertContext } from '../contexts/AlertContext';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }    

    .custom-btn {
        background-color: #F8F8F8;
        cursor: pointer;
        border-radius: 10px;
        width: 85%;
        box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.25);
    }

    .home-btn-title {
        overflow-y: scroll;
        max-height: 100%;
    }

    .home-btn-title::-webkit-scrollbar  {
        width: 0px;
    }

    .h-100px {
        height: 100px;
        min-heigth: 100px;
        max-height: 100px;
    }

    .icon-check{
        width: 35px;
        height: 35px;
    }
`;

function HomeButton(props) {
    const {
        title,
        primaryDescription,
        secondaryDescription,
        viewFunction = () => {},
        allowEdit = false,
        editFunction = () => {},
        allowDelete = false,
        deleteFunction = () => {},
        check = false,
    } = props;

    const { showAlert } = useContext(AlertContext);
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div
            className={`custom-btn rounded-4 row g-1 align-items-center font-barlow w-100 p-3 ${isCollapsed ? 'h-100px' : ''}`}
            onClick={viewFunction}
        >
            <div className="col home-btn-title">
                <h5 className="text-break fs-6 lh-1 fw-medium m-0">{title}</h5>
                <p className="text-break fs-6 lh-1 fw-light m-0">{primaryDescription || ''}</p>
                <p className="text-break fs-6 lh-1 fw-light m-0">{secondaryDescription || ''}</p>
            </div>
            <div className="col-auto">
                <div className="row d-flex flex-column flex-lg-row g-1">
                    <div className="col-12 col-lg-auto">
                        {allowEdit && !isCollapsed && (
                            <RoundedButton
                                hsl={[37, 98, 76]}
                                size={30}
                                className="text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    editFunction();
                                }}
                                icon="edit"
                            />
                        )}
                    </div>
                    <div className="col-12 col-lg-auto">
                        {allowEdit && (
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                size={30}
                                className="text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCollapsed((prev) => !prev);
                                }}
                                icon={isCollapsed ? 'expand_content' : 'collapse_content'}
                            />
                        )}
                    </div>
                    <div className="col-12 col-lg-auto">
                        {allowDelete && !isCollapsed && (
                            <RoundedButton
                                hsl={[355, 78, 66]}
                                size={30}
                                className="text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showAlert({
                                        headerText: 'Tem certeza que deseja excluir?',
                                        primaryBtnHsl: [355, 78, 66],
                                        primaryBtnLabel: 'Não',
                                        secondaryBtnHsl: [97, 43, 70],
                                        secondaryBtnLabel: 'Sim',
                                        onSecondaryBtnClick: () => deleteFunction(),
                                    });
                                }}
                                icon="delete"
                            />
                        )}
                    </div>
                </div>
            </div>
            {check && (
                <div className="col-auto ms-2">
                    <img src={CheckIcon} alt="Ícone de já respondido" className="icon-check" />
                </div>
            )}
            <style>{styles}</style>
        </div>
    );
}

export default HomeButton;
