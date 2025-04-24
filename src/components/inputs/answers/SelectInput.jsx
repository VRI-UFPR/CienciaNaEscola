/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useCallback, useState } from 'react';
import TextButton from '../../TextButton';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .form-select:focus {
        cursor: pointer;
        box-shadow: none !important;
    }
`;

/**
 * Componente responsável por exibir um menu de select e permitir a seleção de opções.
 * @param {Object} props - Propriedades do componente.  
 * @param {Function} props.onAnswerChange - Função chamada quando a resposta tem alteração.
 * @param {Object} props.item - Objeto que representa o item da pergunta.
 * @param {Object} props.answer - Objeto que contêm as respostas.
 * @param {React.Ref} props.galleryRef - Referência para o modal da galeria.
 * @param {boolean} props.disabled - Define se a interação com o componente está desabilitada.
*/
function SelectInput(props) {
    const { onAnswerChange, item, answer, galleryRef, disabled } = props;
    const [ImageVisibility, setImageVisibility] = useState(false);

    /**
     * Atualiza a resposta com a opção selecionada.
     * @param {Object} newAnswer - Novo objeto de resposta contendo a opção selecionada.
    */
    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'OPTION', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    /** Alterna a visibilidade da imagem. */
    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    /**
     * Atualiza a opção selecionada no menu de select.
     * @param {number} optionId - ID da opção selecionada.
    */
    const handleOptionsUpdate = (optionId) => {
        const newOptions = {};
        if (optionId !== -1) {
            newOptions[optionId] = '';
        }
        updateAnswer({ ...newOptions, group: answer.group });
    };

    return (
        <div className="rounded-4 shadow bg-white font-barlow p-3">
            <div className="row align-items-center justify-content-between pb-2 m-0">
                <p className="text-break text-start color-dark-gray font-barlow fw-medium fs-6 lh-sm px-0 m-0">{item.text}</p>
            </div>

            {item.files.length > 0 && galleryRef && (
                <div className="row justify-content-center m-0 ">
                    {item.files.slice(0, ImageVisibility ? item.files.length : 3).map((image, index) => {
                        return (
                            <div
                                key={'image-' + image.id}
                                className={`col-${item.files.length > 3 ? 4 : 12 / item.files.length} m-0 px-1 px-lg-2 ${
                                    index > 2 && 'mt-2'
                                }`}
                            >
                                <div
                                    className={`${
                                        item.files.length > 1 && 'ratio ratio-1x1'
                                    } border border-light-subtle rounded-4 overflow-hidden`}
                                    onClick={() => galleryRef.current.showModal({ images: item.files, currentImage: index })}
                                >
                                    <img src={image.path} className="img-fluid object-fit-contain" alt="Responsive" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {item.files.length > 3 && (
                <div className="row justify-content-center m-0 pt-3">
                    <TextButton
                        className="fs-6 w-auto p-2 py-0"
                        hsl={[190, 46, 70]}
                        text={`Ver ${ImageVisibility ? 'menos' : 'mais'}`}
                        onClick={toggleImageVisibility}
                    />
                </div>
            )}

            <div className="row px-0 py-2 m-0">
                <select
                    className="form-select border border-dark-subtle px-2 py-0"
                    onChange={(e) => handleOptionsUpdate(e.target.value)}
                    value={Object.keys(answer)[0] || -1}
                >
                    <option value="-1" label="Selecione uma opção:"></option>
                    {item.itemOptions.map((option) => {
                        const optname = option.text.toLowerCase().replace(/\s/g, '');
                        return (
                            <option key={optname + 'input' + item.id} value={option.id} label={option.text} disabled={disabled}></option>
                        );
                    })}
                </select>
            </div>

            <style>{styles}</style>
        </div>
    );
}

export default SelectInput;
