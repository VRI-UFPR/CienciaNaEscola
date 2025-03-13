/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useCallback } from 'react';
import MarkdownText from '../../MarkdownText';
import Gallery from '../../Gallery';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9
    }

    .form-check-input {
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }

    .form-check-input:focus {
        border: 0;
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }

    .form-check input:checked {
        border: 0;
        background-color: #91CAD6;
    }
`;

/**
 * Este componente representa um grupo de checkboxes que permite ao usuário selecionar múltiplas opções.
 * @param {Object} props - Propriedades do componente.  
 * @param {Function} props.onAnswerChange - Função chamada quando a resposta tem alteração.
 * @param {Object} props.item - Objeto que representa o item da pergunta.
 * @param {Object} props.answer - Objeto que contêm as respostas.
 * @param {React.Ref} props.galleryModalRef - Referência para o modal da galeria.
 * @param {boolean} props.disabled - Define se a checkbox está desabilitada. 
 */
function CheckBoxInput(props) {
    const { onAnswerChange, item, answer, galleryModalRef, disabled } = props;

    /**
     * Aualiza a resposta.
     * @param {Object} newAnswer - Novo objeo de resposta.
     */
    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'OPTION', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    /**
     * Manipula a atualização das opções do checkbox.
     * @param {Object} optionId - Identificador da opção a ser atualizada.
     * @param {boolean} updatedOption - Indica se a opção foi marcada ou desmarcada.
     */
    const handleOptionsUpdate = (optionId, updatedOption) => {
        const newOptions = { ...answer };
        if (updatedOption) {
            newOptions[optionId] = '';
        } else {
            delete newOptions[optionId];
        }
        updateAnswer({ ...newOptions, group: answer.group });
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0">
                <MarkdownText text={item.text} />
            </div>

            <Gallery className="mb-3" item={item} galleryModalRef={galleryModalRef} />

            <div className="row m-0 px-2">
                {item.itemOptions.map((option) => {
                    const optname = option.text.toLowerCase().replace(/\s/g, '');

                    return (
                        <div key={optname + 'input' + item.id + 'option' + option.id} className="form-check m-0 mb-3 pe-0">
                            <input
                                className={`form-check-input bg-grey`}
                                type="checkbox"
                                name={'checkboxoptions' + item.id}
                                checked={answer[option.id] !== undefined}
                                id={optname + 'input' + item.id}
                                onChange={(e) => handleOptionsUpdate(option.id, e.target.checked)}
                                disabled={disabled}
                            ></input>
                            <label className={`form-check-label font-barlow fw-medium fs-6`} htmlFor={optname + 'input' + item.id}>
                                {option.text}
                            </label>
                            <Gallery className="mt-1" item={option} galleryModalRef={galleryModalRef} />
                        </div>
                    );
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default CheckBoxInput;
