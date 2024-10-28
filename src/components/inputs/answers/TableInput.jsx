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
`;

function TableInput(props) {
    const { onAnswerChange, tableIndex, group, answers, answersPage, disabled } = props;

    const updateAnswer = useCallback(
        (newAnswer, itemId) => {
            onAnswerChange(group.id, itemId, 'TABLE', newAnswer);
        },
        [onAnswerChange, group.id]
    );

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
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 m-0">
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
                            <th scope="col" className="miw-150 mw-150 mh-90"></th>
                            {group.tableColumns?.map((column, columnIndex) => {
                                return (
                                    <th key={'column-' + columnIndex} scope="col" className="overflow-auto miw-150 mw-150 mh-90">
                                        <div className="d-flex justify-content-center">{column.text}</div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {group.items?.map((item, itemIndex) => {
                            const specificAnswers = Object.values(item.tableAnswers || {});
                            return (
                                <tr key={'item-line-' + itemIndex}>
                                    <th scope="row" className="miw-150 mw-150 mh-90">
                                        <div className="overflow-auto text-break mh-90">{item.text}</div>
                                    </th>
                                    {!answersPage && group.tableColumns?.map((column, columnIndex) => {
                                        return (
                                            <td key={'column' + columnIndex} className="overflow-auto miw-150 mw-150 mh-90">
                                                {group.type === 'TEXTBOX_TABLE' && (
                                                    <textarea
                                                        type="text"
                                                        className="column-input border border-0 w-100"
                                                        id="columntext"
                                                        onChange={(e) => handleTableUpdate(item.id, column.id, e.target.value, true)}
                                                        disabled={disabled}
                                                    ></textarea>
                                                )}
                                                {group.type === 'RADIO_TABLE' && (
                                                    <input
                                                        className={`column-input w-100`}
                                                        type="radio"
                                                        name={'column-option-for-item-' + itemIndex}
                                                        id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                        onChange={(e) => handleTableUpdate(item.id, column.id, e.target.checked)}
                                                        disabled={disabled}
                                                    ></input>
                                                )}
                                                {group.type === 'CHECKBOX_TABLE' && (
                                                    <input
                                                        className={`column-input w-100`}
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
                                    {answersPage && specificAnswers.map((answer, answerIndex) => {
                                        if (answerIndex !== tableIndex) return null
                                        const nestedAnswer = Object.values(answer)
                                        return group.tableColumns?.map((column, columnIndex) => {
                                            const isChecked = nestedAnswer[0] && nestedAnswer[0][column.id] !== undefined;
                                            const nestedValue = nestedAnswer?.[0][columnIndex + 1];
                                            return (
                                                <td key={'column' + columnIndex} className="overflow-auto miw-150 mw-150 mh-90">
                                                    {group.type === 'TEXTBOX_TABLE' && (
                                                        <textarea
                                                            type="text"
                                                            className="column-input border border-0 w-100"
                                                            id="columntext"
                                                            value={nestedValue}
                                                            onChange={(e) => handleTableUpdate(item.id, column.id, e.target.value, true)}
                                                            disabled={disabled}
                                                        ></textarea>
                                                    )}
                                                    {group.type === 'RADIO_TABLE' && (
                                                        <input
                                                            className={`column-input w-100`}
                                                            type="radio"
                                                            name={'column-option-for-item-' + itemIndex}
                                                            id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                            checked={isChecked}
                                                            onChange={(e) => handleTableUpdate(item.id, column.id, e.target.checked)}
                                                            disabled={disabled}
                                                        ></input>
                                                    )}
                                                    {group.type === 'CHECKBOX_TABLE' && (
                                                        <input
                                                            className={`column-input w-100`}
                                                            type="checkbox"
                                                            name={'column-option-for-item-' + itemIndex}
                                                            id={'columnOption-' + columnIndex + '-of-' + itemIndex + '-item-'}
                                                            checked={isChecked}
                                                            onChange={(e) => handleTableUpdate(item.id, column.id, e.target.checked)}
                                                            disabled={disabled}
                                                        ></input>
                                                    )}
                                                </td>
                                            );  
                                        })
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
