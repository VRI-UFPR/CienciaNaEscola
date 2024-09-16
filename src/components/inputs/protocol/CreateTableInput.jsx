import React from 'react';
import RoundedButton from '../../RoundedButton';
import iconTrash from '../../../assets/images/iconTrash.svg';

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
        min-width: 250px;
    }

    .column-input:focus, .line-input:focus {
        outline: none !important;
    }
`;

function CreateTableInput(props) {
    const { group, groupIndex, pageIndex, insertItem, updateItem, removeItem, insertTableColumn, updateTableColumn, removeTableColumn } =
        props;

    const changeItem = (event, itemIndex) => {
        const updatedText = event.target.value;

        // Update the text in the items array directly
        const updatedItems = group.items.map((currentItem, index) => {
            if (index === itemIndex) {
                return { ...currentItem, text: updatedText }; // Update only the text of the item being edited
            }
            return currentItem;
        });

        // Use the updateItem function to propagate changes to the parent component
        updateItem(updatedItems[itemIndex], pageIndex, groupIndex, itemIndex);
    };

    console.log('🚀 ~ CreateTablePage ~ group:', group);

    return (
        <div className="p-4 p-lg-5">
            <div className="table-grid overflow-auto bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="row justify-content-between pb-2 m-0">
                    <div className="col d-flex justify-content-start p-0">
                        <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 m-0">
                            {(() => {
                                switch (group.type) {
                                    case 'TEXTBOX_TABLE':
                                        return 'Tabela de texto';

                                    case 'RADIO_TABLE':
                                        return 'Tabela de escolha simples';

                                    case 'CHECKBOX_TABLE':
                                        return 'Tabela de múltipla escolha';

                                    default:
                                        return;
                                }
                            })()}
                        </h1>
                    </div>
                    <div className="col d-flex justify-content-end p-0">
                        <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} onClick={() => {}} />
                    </div>
                </div>
                <table className="table table-bordered border-black">
                    <thead>
                        <tr>
                            <th>
                                <button type="button" onClick={() => insertTableColumn(pageIndex, groupIndex)}>
                                    + Coluna
                                </button>
                                {group.type === 'TEXTBOX_TABLE' && (
                                    <button type="button" onClick={() => insertItem('TEXTBOX', pageIndex, groupIndex)}>
                                        + Linha
                                    </button>
                                )}
                                {group.type === 'RADIO_TABLE' && (
                                    <button type="button" onClick={() => insertItem('RADIO', pageIndex, groupIndex)}>
                                        + Linha
                                    </button>
                                )}
                                {group.type === 'CHECKBOX_TABLE' && (
                                    <button type="button" onClick={() => insertItem('CHECKBOX', pageIndex, groupIndex)}>
                                        + Linha
                                    </button>
                                )}
                            </th>
                            {group.tableColumns?.map((column, columnIndex) => {
                                return (
                                    <td key={'column-' + columnIndex}>
                                        <div className="d-flex justify-content-between w-100">
                                            <input
                                                type="text"
                                                className="column-input border border-0 fs-5 lh-1 w-100 p-0"
                                                id="question"
                                                value={column.text || ''}
                                                placeholder="Insira algum texto..."
                                                aria-describedby="questionHelp"
                                                onChange={(e) => updateTableColumn(pageIndex, groupIndex, columnIndex, e.target.value)}
                                            />
                                            <RoundedButton
                                                className="ms-2"
                                                hsl={[190, 46, 70]}
                                                icon={iconTrash}
                                                onClick={() => removeTableColumn(pageIndex, groupIndex, columnIndex)}
                                            />
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {group.items?.map((item, itemIndex) => {
                            return (
                                <tr key={'item-line-' + itemIndex}>
                                    <td>
                                        <div className="d-flex justify-content-between w-100">
                                            <input
                                                type="text"
                                                className="line-input border border-0 fs-5 lh-1 w-100 p-0"
                                                id="question"
                                                value={item.text || ''}
                                                placeholder="Insira algum texto..."
                                                aria-describedby="questionHelp"
                                                onChange={(event) => changeItem(event, itemIndex)}
                                            />
                                            <RoundedButton
                                                className="ms-2"
                                                hsl={[190, 46, 70]}
                                                icon={iconTrash}
                                                onClick={() => removeItem(pageIndex, groupIndex, itemIndex)}
                                            />
                                        </div>
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
