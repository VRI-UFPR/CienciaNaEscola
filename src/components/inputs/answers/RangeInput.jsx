/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useEffect, useState } from 'react';
import MarkdownText from '../../MarkdownText';

const styles = `
    #customRange {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        width: 15rem;
    }

    #customRange::-webkit-slider-runnable-track {
        height: 0.5rem;
        border-radius: 5px;
    }

    #customRange::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 25px;
        width: 8px;
        margin-top: -8px;
        border-radius: 5px;
        background-color: #535353;
    }

    .range-subtitle span {
        width: 40px;
    }
`;

/**
 * Componente responsável por exibir um controle de range com valores mínimos, máximos e passo configurável.
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.onAnswerChange - Função chamada quando a resposta é alterada.
 * @param {Object} props.item - Objeto representando o item.
 * @param {Object} props.answer - Objeto contendo a resposta.
 * @param {boolean} props.disabled - Define se a interação com o componente está desabilitada.
 */
function RangeInput(props) {
    const { onAnswerChange, answer, item, disabled } = props;
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);
    const [step, setStep] = useState(1);
    const [hasUpdated, setHasUpdated] = useState(false);

    /** Atualiza a resposta com o novo valor do range. */
    const updateAnswer = (newAnswer) => {
        onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
    };

    useEffect(() => {
        if (!hasUpdated) {
            if (item) {
                for (let j = 0; j < item.itemValidations.length; j++) {
                    let i = item.itemValidations[j];
                    switch (i.type) {
                        case 'MIN':
                            if (parseInt(i.argument) > 800000) setMin(800000);
                            else setMin(parseInt(i.argument));
                            break;
                        case 'MAX':
                            if (parseInt(i.argument) > 1000000) setMax(1000000);
                            else setMax(parseInt(i.argument));
                            break;
                        case 'STEP':
                            setStep(parseInt(i.argument));
                            break;
                        default:
                            break;
                    }
                }
            }
            setHasUpdated(true);
        }
    }, [hasUpdated, item, answer, min, max]);

    /** Esilização do controle do range. */
    const rangeStyle = {
        background: '#AAD390',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="d-flex flex-column">
                <label htmlFor="customRange" className="">
                    <MarkdownText text={item.text} />
                </label>
                <input
                    type="range"
                    className="w-100"
                    min={min}
                    max={max}
                    step={step}
                    id="customRange"
                    onChange={(e) => updateAnswer({ ...answer, text: String(e.target.value) })}
                    style={rangeStyle}
                    value={parseFloat(answer.text)}
                    disabled={disabled}
                />
            </div>
            <div className="range-subtitle d-flex justify-content-between pt-2">
                <span className={`${parseFloat(answer.text) === parseFloat(min) ? 'fw-medium fs-5' : 'fw-normal fs-6'} w-25`}>{min}</span>
                <span
                    className={`${
                        parseFloat(answer.text) === parseFloat(min) || parseFloat(answer.text) === parseFloat(max) ? 'd-none' : ''
                    } text-center fw-medium fs-5 w-25`}
                >
                    {answer.text}
                </span>
                <span className={`${parseFloat(answer.text) === parseFloat(max) ? 'fw-medium fs-5' : 'fw-normal fs-6'} text-end w-25`}>
                    {max}
                </span>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default RangeInput;
