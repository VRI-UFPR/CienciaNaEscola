/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React, useEffect, useState } from 'react';
import iconTime from '../../../assets/images/iconTime.svg';

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

    .time-icon{
        max-width: 50px;
    }
`;

function TimeInput(props) {
    const [time, setTime] = useState({ text: '', files: [] });
    const { onAnswerChange, item, group } = props;

    useEffect(() => {
        const date = new Date();
        const hour = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        setTime((prev) => ({ ...prev, text: `${hour}:${minutes}` }));
    }, []);

    useEffect(() => {
        onAnswerChange(group, item.id, 'ITEM', time);
    }, [time, item.id, onAnswerChange, group]);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="time-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconTime} alt="Ícone de relógio" />
                    </div>
                </div>
                <div className="col p-3">
                    <div className="row m-0 pb-1">
                        <label htmlFor="timeinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7 m-0 p-0">
                            Horário da coleta
                        </label>
                    </div>
                    <div className="row m-0">
                        <input
                            type="time"
                            className="form-control border-0 color-sonic-silver fw-medium fs-7 w-auto m-0 p-0"
                            id="timeinput"
                            onChange={(e) => setTime((prev) => ({ ...prev, text: e.target.value }))}
                            defaultValue={time.text}
                        ></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default TimeInput;
