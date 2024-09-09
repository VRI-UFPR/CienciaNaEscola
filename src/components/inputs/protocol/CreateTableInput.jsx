import React, { useCallback, useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import iconFile from '../../../assets/images/iconFile.svg';
import iconTrash from '../../../assets/images/iconTrash.svg';
import { defaultNewInput } from '../../../utils/constants';

const createTableStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-light-grey {
        background-color: #D9D9D9;
    }

    .text-steel-blue {
        color: #4E9BB9;
    }

    .border-steel-blue {
        border-color: #4E9BB9 !important;
    }

    .form-check-input {
        background-color: #D9D9D9;
    }

    .table-grid {
        max-height: 300px;
    }

    .table td, .table th {
        min-width: 200px;
    }
`;

function CreateTableInput(props) {
    const { group, groupIndex, pageIndex, insertItem, updateItem, insertTableColumn, updateTableColumn } = props;
    const [item, setItem] = useState(defaultNewInput('TEXTBOX'));

    const changeItem = useCallback(
        (event, itemIndex) => {
            setItem((prev) => ({ ...prev, text: event.target.value }));
            updateItem(item, pageIndex, groupIndex, itemIndex);
        },
        [item, pageIndex, groupIndex, updateItem]
    );

    console.log('🚀 ~ CreateTablePage ~ group:', group);

    return (
        <div className="p-4 p-lg-5">
            <div className="table-grid overflow-auto bg-light-grey rounded-4 lh-1 w-100 p-4">
                <table className="table table-bordered border-black">
                    <thead>
                        <tr>
                            <th>
                                <button type="button" onClick={() => insertTableColumn(pageIndex, groupIndex)}>
                                    + Coluna
                                </button>
                                <button type="button" onClick={() => insertItem('TEXTBOX', pageIndex, groupIndex)}>
                                    + Linha
                                </button>
                            </th>
                            {group.tableColumns?.map((column, columnIndex) => {
                                return (
                                    <td>
                                        <input
                                            type="text"
                                            className="border-1 border-black fs-5 lh-1 w-100 p-0"
                                            id="question"
                                            value={column.text || ''}
                                            placeholder="Insira algum texto..."
                                            aria-describedby="questionHelp"
                                            onChange={(e) => updateTableColumn(pageIndex, groupIndex, columnIndex, e.target.value)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {group.items?.map((itemIndex) => {
                            return (
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            className="border-1 border-black fs-5 lh-1 w-100 p-0"
                                            id="question"
                                            value={item.text || ''}
                                            placeholder="Insira algum texto..."
                                            aria-describedby="questionHelp"
                                            onChange={(event) => changeItem(event, itemIndex)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <style>{createTableStyles}</style>
        </div>
    );
}

export default CreateTableInput;
