import { React, useCallback } from 'react';
import MarkdownText from '../../MarkdownText';
// import Gallery from '../../Gallery';

const TableInputStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9
    }

    .color-dark-gray {
        color: #535353;
    }

    .column-input:focus {
        outline: none !important;
    }

    .mw-150 {
        max-width: 150px;
    }

    .min-w-150 {
        min-width: 150px;
    }

    .mh-134 {
        max-height: 134px;
    }
`;

/**
 * Componente responsável por exibir e gerenciar entradas em formato de tabela.
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.onAnswerChange - Função chamada quando uma célula da tabela é atualizada.
 * @param {string} props.applicationAnswerId - ID da resposta da aplicação.
 * @param {Object} props.group - Objeto representando o grupo de perguntas da tabela.
 * @param {Array} props.answers - Lista de respostas associadas à tabela.
 * @param {number} props.answersPage - Página atual das respostas.
 * @param {boolean} props.disabled - Define se a interação com o componente está desabilitada.
 */
function TableInput(props) {
    const { onAnswerChange, applicationAnswerId, group, answers, answersPage, disabled, isProtocol } = props;

    /**
     * Atualiza a resposta da tabela.
     * @param {Object} newAnswer - Novo objeto de resposta.
     * @param {sring} itemId - ID do item dentro da tabela.
     */
    const updateAnswer = useCallback(
        (newAnswer, itemId) => {
            onAnswerChange(group.id, itemId, 'TABLE', newAnswer);
        },
        [onAnswerChange, group.id]
    );

    /**
     * Gerencia a atualização de uma célula da tabela.
     * @param {string} itemId - ID do item da tabela.
     * @param {number} columnId - ID da coluna.
     * @param {boolean} updatedText - Novo valor da célula.
     */
    const handleTableUpdate = (itemId, columnId, updatedText) => {
        let newAnswer = { ...answers.find((a) => a.item === itemId).answer };
        if (group.type === 'RADIO_TABLE') newAnswer = { [`${columnId}`]: '' };
        if (updatedText === '' || !updatedText) {
            delete newAnswer[columnId];
        } else {
            if (updatedText === true) newAnswer[columnId] = '';
            else newAnswer[columnId] = updatedText;
        }
        updateAnswer({ ...newAnswer, group: group.id }, itemId);
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row px-2 m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="p-0 m-0">
                        {(() => {
                            switch (group.type) {
                                case 'TEXTBOX_TABLE':
                                    return <MarkdownText text={'#Tabela de texto'} />;

                                case 'RADIO_TABLE':
                                    return <MarkdownText text={'#Tabela de escolha simples'} />;

                                case 'CHECKBOX_TABLE':
                                    return <MarkdownText text={'#Tabela de múltipla escolha'} />;

                                default:
                                    return;
                            }
                        })()}
                    </h1>
                </div>
            </div>
            <div className="table-grid overflow-auto w-auto">
                <table className="table table-bordered border-black">
                    <thead>
                        <tr>
                            <th scope="col" className="min-w-150 mw-150 mh-134"></th>
                            {group.tableColumns?.map((column, columnIndex) => {
                                return (
                                    <th
                                        key={'column-' + columnIndex}
                                        scope="col"
                                        className="align-middle overflow-auto min-w-150 mw-150 mh-134"
                                    >
                                        <div className="overflow-auto text-break text-center font-barlow fw-medium fs-6 color-dark-gray mh-134">
                                            {column.text}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {group.items?.map((item, itemIndex) => {
                            return (
                                <tr key={'item-line-' + itemIndex}>
                                    <th scope="row" className="min-w-150 mw-150 mh-134">
                                        <div className="overflow-auto text-break font-barlow fw-medium fs-6 color-dark-gray mh-134">
                                            {item.text}
                                        </div>
                                    </th>
                                    {!answersPage &&
                                        group.tableColumns?.map((column, columnIndex) => {
                                            return (
                                                <td key={'column' + columnIndex} className="overflow-auto min-w-150 mw-150 mh-134">
                                                    {group.type === 'TEXTBOX_TABLE' && (
                                                        <textarea
                                                            type="text"
                                                            className="column-input border border-0 font-barlow fw-medium fs-6 color-dark-gray w-100"
                                                            id="columntext"
                                                            onChange={(e) => handleTableUpdate(item.id, column.id, e.target.value, true)}
                                                            disabled={disabled}
                                                        ></textarea>
                                                    )}
                                                    {group.type === 'RADIO_TABLE' && (
                                                        <input
                                                            className={`column-input font-barlow fw-medium fs-6 color-dark-gray w-100`}
                                                            type="radio"
                                                            name={'column-option-for-item-' + itemIndex}
                                                            id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                            onChange={(e) => handleTableUpdate(item.id, column.id, e.target.checked)}
                                                            disabled={disabled}
                                                        ></input>
                                                    )}
                                                    {group.type === 'CHECKBOX_TABLE' && (
                                                        <input
                                                            className={`column-input font-barlow fw-medium fs-6 color-dark-gray w-100`}
                                                            type="checkbox"
                                                            name={'column-option-for-item-' + itemIndex}
                                                            id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                            onChange={(e) => handleTableUpdate(item.id, column.id, e.target.checked)}
                                                            disabled={disabled}
                                                        ></input>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    {answersPage &&
                                        !isProtocol &&
                                        Object.entries(item.tableAnswers).map(([applicationAnsId, answerGroup]) => {
                                            return (
                                                applicationAnsId === applicationAnswerId &&
                                                Object.entries(answerGroup).map(([answerGroupId, groupAnswers]) => {
                                                    return group.tableColumns?.map((column, columnIndex) => {
                                                        const answerEntry = Object.entries(groupAnswers).find(
                                                            ([key]) => String(key) === String(column.id)
                                                        );
                                                        const value = answerEntry ? answerEntry[1] : null;
                                                        return (
                                                            <td
                                                                key={'column' + columnIndex}
                                                                className="overflow-auto min-w-150 mw-150 mh-134"
                                                            >
                                                                {group.type === 'TEXTBOX_TABLE' && (
                                                                    <textarea
                                                                        type="text"
                                                                        className="column-input border border-0 font-barlow fw-medium fs-6 color-dark-gray w-100"
                                                                        id="columntext"
                                                                        value={value ? value : ''}
                                                                        disabled={disabled}
                                                                    ></textarea>
                                                                )}
                                                                {group.type === 'RADIO_TABLE' && (
                                                                    <input
                                                                        className={`column-input font-barlow fw-medium fs-6 color-dark-gray w-100`}
                                                                        type="radio"
                                                                        name={`column-option-for-item-${itemIndex}-column-${column.id}-application-${applicationAnsId}`}
                                                                        id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                                        checked={value === null ? false : true}
                                                                        disabled={disabled}
                                                                    ></input>
                                                                )}
                                                                {group.type === 'CHECKBOX_TABLE' && (
                                                                    <input
                                                                        className={`column-input font-barlow fw-medium fs-6 color-dark-gray w-100`}
                                                                        type="checkbox"
                                                                        name={'column-option-for-item-' + itemIndex}
                                                                        id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                                        checked={value === null ? false : true}
                                                                        disabled={disabled}
                                                                    ></input>
                                                                )}
                                                            </td>
                                                        );
                                                    });
                                                })
                                            );
                                        })}
                                    {answersPage &&
                                        isProtocol &&
                                        group.tableColumns?.map((tableColumn) => {
                                            const tableAnswer = item.tableAnswers.find(
                                                (tableAnswer) =>
                                                    tableAnswer.group.applicationAnswer.id === applicationAnswerId &&
                                                    tableAnswer.columnId === tableColumn.id
                                            );
                                            return (
                                                <td key={'column' + tableColumn.id} className="overflow-auto min-w-150 mw-150 mh-134">
                                                    {group.type === 'TEXTBOX_TABLE' && (
                                                        <textarea
                                                            type="text"
                                                            className="column-input border border-0 font-barlow fw-medium fs-6 color-dark-gray w-100"
                                                            id="columntext"
                                                            value={tableAnswer ? tableAnswer.text : ''}
                                                            disabled={disabled}
                                                        ></textarea>
                                                    )}
                                                    {group.type === 'RADIO_TABLE' && (
                                                        <input
                                                            className={`column-input font-barlow fw-medium fs-6 color-dark-gray w-100`}
                                                            type="radio"
                                                            name={`column-option-for-item-${itemIndex}-column-${
                                                                tableColumn.id
                                                            }-application-${666}`}
                                                            id={'columnOption-' + tableColumn.id + '-of-' + itemIndex + '-item-'}
                                                            checked={tableAnswer ? false : true}
                                                            disabled={disabled}
                                                        ></input>
                                                    )}
                                                    {group.type === 'CHECKBOX_TABLE' && (
                                                        <input
                                                            className={`column-input font-barlow fw-medium fs-6 color-dark-gray w-100`}
                                                            type="checkbox"
                                                            name={'column-option-for-item-' + itemIndex}
                                                            id={'columnOption-' + tableColumn.id + '-of-' + itemIndex + '-item-'}
                                                            checked={tableAnswer ? false : true}
                                                            disabled={disabled}
                                                        ></input>
                                                    )}
                                                </td>
                                            );
                                        })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style>{TableInputStyles}</style>
        </div>
    );
}

export default TableInput;
