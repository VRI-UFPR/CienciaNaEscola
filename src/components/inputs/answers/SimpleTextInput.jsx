/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import MarkdownText from '../../MarkdownText';
import Gallery from '../../Gallery';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-dark-grey {
        color: #787878;
    }

    .color-dark-gray {
        color: #535353;
    }

    .simple-text-input {
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }
`;

/**
 * Componente responsável por exibir um menu de select e permitir a seleção de opções.
 * @param {Object} props - Propriedades do componente.  
 * @param {Function} props.onAnswerChange - Função chamada quando a resposta tem alteração.
 * @param {Object} props.item - Objeto que representa o item da pergunta.
 * @param {Object} props.answer - Objeto que contêm as respostas.
 * @param {React.Ref} props.galleryModalRef - Referência para o modal da galeria.
 * @param {boolean} props.disabled - Define se a interação com o componente está desabilitada.
*/
function SimpleTextInput(props) {
    const { onAnswerChange, item, answer, galleryModalRef, disabled } = props;

    /**
     * Atualiza a resposta com o novo valor digitado no campo de texto.
     * @param {Object} newAnswer - Novo objeto de resposta contendo o texto atualizado.
    */
    const updateAnswer = (newAnswer) => {
        onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0">
                <MarkdownText text={item.text} />
            </div>

            <Gallery className="mb-3" item={item} galleryModalRef={galleryModalRef} />

            <input
                type={item.type === 'NUMBERBOX' ? 'number' : 'text'}
                className="simple-text-input form-control rounded-0 shadow-none bg-dark-grey font-barlow fw-medium fs-6 mb-3 p-0"
                id="simpletextinput"
                value={answer.text}
                placeholder="Digite sua resposta aqui"
                onChange={(e) => updateAnswer(e.target.value.trim() === '' ? {} : { ...answer, text: e.target.value })}
                disabled={disabled}
            ></input>
            <style>{styles}</style>
        </div>
    );
}

export default SimpleTextInput;
