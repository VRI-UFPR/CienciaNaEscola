/*
Copyright (C) 2024 Laboratório Visão Robótica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import React, { useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import iconFile from '../../../assets/images/iconFile.svg';
import iconTrash from '../../../assets/images/iconTrash.svg';
import { defaultNewInput } from '../../../utils/constants';

const textBoxStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .text-steel-blue {
        color: #4E9BB9;
    }

    .border-steel-blue{
        border-color: #4E9BB9 !important;
    }

    .form-check-input {
        background-color: #D9D9D9;
    }
`;

function CreateTextBoxInput(props) {
    const [item, setItem] = useState(defaultNewInput('TEXTBOX'));
    const { pageIndex, groupIndex, itemIndex, updateItem, removeItem } = props;

    useEffect(() => {
        updateItem(item, pageIndex, groupIndex, itemIndex);
    }, [item, pageIndex, groupIndex, itemIndex, updateItem]);

    return (
        <div className="pb-4 pb-lg-5">
            <div className="row justify-content-between pb-2 m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 m-0">Caixa de texto</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconFile} />
                    <RoundedButton
                        className="ms-2"
                        hsl={[190, 46, 70]}
                        icon={iconTrash}
                        onClick={() => removeItem(pageIndex, groupIndex, itemIndex)}
                    />
                </div>
            </div>
            <div className="row form-check form-switch pb-3 m-0 ms-2">
                <input className="form-check-input border-0 fs-5 p-0" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label className="form-check-label font-barlow fw-medium fs-5 p-0" htmlFor="flexSwitchCheckDefault">
                    Obrigatório
                </label>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label htmlFor="question" className="form-label fs-5 fw-medium">
                        Pergunta
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="question"
                        aria-describedby="questionHelp"
                        onChange={(event) => setItem((prev) => ({ ...prev, text: event.target.value }))}
                    />
                    {!item.text && (
                        <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="form-label fs-5 fw-medium">
                        Descrição
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="description"
                        onChange={(event) => setItem((prev) => ({ ...prev, description: event.target.value }))}
                    />
                </div>
            </div>
            <style>{textBoxStyles}</style>
        </div>
    );
}

export default CreateTextBoxInput;
