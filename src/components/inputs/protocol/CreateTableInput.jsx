import { React } from 'react';
import RoundedButton from '../../RoundedButton';

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
        updateItem(updatedItems[itemIndex], itemIndex);
    };

    return (
        <div className="pb-4 pb-lg-5">
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className=" table-grid overflow-auto">
                    <table className="table table-bordered border-black">
                        <thead>
                            <tr>
                                <th>
                                    <div className='row justify-content-center'>
                                        <RoundedButton
                                            className="ms-2"
                                            hsl={[190, 46, 70]}
                                            icon="table_rows"
                                            onClick={() => insertItem('TABLEROW', pageIndex, groupIndex)}
                                        />
                                        <RoundedButton
                                            className="ms-2"
                                            hsl={[190, 46, 70]}
                                            icon="view_column"
                                            onClick={() => insertTableColumn()}
                                        />
                                    </div>
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
                                                    onChange={(e) => updateTableColumn(columnIndex, e.target.value)}
                                                />
                                                <RoundedButton
                                                    className="ms-2"
                                                    hsl={[190, 46, 70]}
                                                    size={32}
                                                    icon="delete"
                                                    onClick={() => removeTableColumn(columnIndex)}
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
                                                    size={32}
                                                    icon="delete"
                                                    onClick={() => removeItem(itemIndex)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{createTableStyles}</style>
        </div>
    );
}

export default CreateTableInput;
