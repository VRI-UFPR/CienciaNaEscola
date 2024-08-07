/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React, useCallback, useEffect, useState } from 'react';
import iconLocation from '../../../assets/images/iconLocation.svg';
import iconSearch from '../../../assets/images/iconSearch.svg';
import RoundedButton from '../../RoundedButton';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-sonic-silver {
        color: #787878;
    }

    .fs-7 {
        font-size: 1.1rem !important;
    }

    .location-input {
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }

    .location-icon {
        max-width: 50px;
    }

    .search-col {
        min-width: 32px;
    }
`;

export function Location(props) {
    const [location, setLocation] = useState({ text: '', files: [] });
    const { onAnswerChange, item, group } = props;

    const defaultLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation((prev) => ({ ...prev, text: `${latitude}, ${longitude}` }));
            });
        }
    }, []);

    useEffect(() => {
        defaultLocation();
    }, [defaultLocation]);

    useEffect(() => {
        onAnswerChange(group, item.id, 'ITEM', location);
    }, [location, item.id, onAnswerChange, group]);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="location-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconLocation} alt="Ícone de localização" />
                    </div>
                </div>
                <div className="col p-3">
                    <div className="row m-0 pb-1">
                        <label htmlFor="locationinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7 m-0 p-0">
                            Localização
                        </label>
                    </div>
                    <div className="row m-0 align-items-center">
                        <div className="col m-0 p-0 pe-2">
                            <input
                                type="text"
                                className="location-input form-control color-sonic-silver rounded-0 shadow-none fw-semibold fs-6 p-0"
                                id="locationinput"
                                placeholder="Forneça sua localização"
                                onChange={(e) => setLocation((prev) => ({ ...prev, text: e.target.value }))}
                                defaultValue={location.text}
                            ></input>
                        </div>
                        <div className="col-auto search-col d-flex justify-content-end m-0 p-0">
                            <RoundedButton
                                hsl={[190, 46, 70]}
                                onClick={() => {
                                    defaultLocation();
                                }}
                                icon={iconSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
