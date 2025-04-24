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

/**
 * Componente responsável por criar um campo de entrada para uma tabela.
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.group - Grupo de itens da tabela.
 * @param {number} props.groupIndex - Índice do grupo dentro da página.
 * @param {number} props.pageIndex - Índice da página.
 * @param {Function} props.insertItem - Função para adicionar um novo item na tabela.
 * @param {Function} props.updateItem - Função para atualizar um item na tabela.
 * @param {Function} props.removeItem - Função para remover um item da tabela.
 * @param {Function} props.insertTableColumn - Função para adicionar uma nova coluna na tabela.
 * @param {Function} props.updateTableColumn - Função para atualizar uma coluna da tabela.
 * @param {Function} props.removeTableColumn - Função para remover uma coluna da tabela.
*/
function CreateTableInput(props) {
    const { group, groupIndex, pageIndex, insertItem, updateItem, removeItem, insertTableColumn, updateTableColumn, removeTableColumn } =
        props;

    /**
     * Função chamada quando o texto de um item da tabela é alterado.
     * Atualiza o texto do item no estado da tabela e propaga a alteração para o componente pai.
     * @param {Object} event - Evento disparado pela alteração no campo de texto.
     * @param {number} itemIndex - Índice do item na tabela que está sendo editado.
    */
    const changeItem = (event, itemIndex) => {
        const updatedText = event.target.value;

        const updatedItems = group.items.map((currentItem, index) => {
            if (index === itemIndex) {
                return { ...currentItem, text: updatedText };
            }
            return currentItem;
        });

        updateItem(updatedItems[itemIndex], itemIndex);
    };

    return (
        <div className="pb-4 pb-lg-5">
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="table-grid overflow-auto">
                    <table className="table table-bordered border-black">
                        <thead>
                            <tr>
                                <th>
                                    <div className="row justify-content-center">
                                        <span>Adicionar: </span>
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
