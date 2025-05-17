/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/
import { useState, useMemo } from 'react';

import HomeButton from './HomeButton';

const ProtocolListStyles = (hue, sat, lig) => {
    return `
        .list-container-${'hsl-' + hue + '-' + sat + '-' + lig} {
            color: #fff;
            font-weight: 700;
            font-size: 1.3rem;
            background-color: hsl(${hue}, ${sat}%, ${lig}%);
            border-color: hsl(${hue}, ${sat}%, ${lig}%);
        }

        .button-container {
            color: #262626;
        }

        .button-list-${'hsl-' + hue + '-' + sat + '-' + lig}::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        .button-list-${'hsl-' + hue + '-' + sat + '-' + lig}::-webkit-scrollbar-track {
            background: hsl(${hue}, ${sat}%, ${lig * 0.9}%);
            border-radius: 16px;
        }

        .button-list-${'hsl-' + hue + '-' + sat + '-' + lig}::-webkit-scrollbar-thumb {
            background: hsl(${hue}, ${sat}%, ${lig * 0.7}%);
            border-radius: 16px;  /* Rounded corners for the thumb */
        }

        .button-list-${'hsl-' + hue + '-' + sat + '-' + lig}::-webkit-scrollbar-thumb:hover {
            background: hsl(${hue}, ${sat}%, ${lig * 0.6}%);
        }

        .bg-light,
        .bg-light:focus,
        .bg-light:active {
            background-color: #ffffff;
            border-color: #ffffff;
        }

        .bg-light:focus,
        .bg-light:active {
            box-shadow: inset 0px 4px 4px 0px #00000040;
        }
    `;
};

function ProtocolList(props) {
    const {
        listItems,
        hsl: [hue, sat, lig],
        viewFunction = () => {},
        allowEdit = false,
        editFunction = () => {},
        allowDelete = false,
        deleteFunction = () => {},
    } = props;

    const [search, setSearch] = useState('');

    const sortedAndFilteredItems = useMemo(() => {
        const filtered = listItems.filter((li) => li.title.toLowerCase().includes(search.toLowerCase()));

        const sorted = [...filtered].sort((a, b) => a.id - b.id);

        return sorted;
    }, [listItems, search]);

    return (
        <div
            className={` list-container-${
                'hsl-' + hue + '-' + sat + '-' + lig
            } d-flex flex-column flex-grow-1 rounded-4 w-100 m-0 p-0 px-4 py-4 overflow-hidden`}
        >
            <div className="row gx-2 gy-0 mb-3 align-items-center">
                <div className="col">
                    <input
                        type="text"
                        name="list-search"
                        value={search}
                        id="list-search"
                        placeholder="Buscar pelo título"
                        className="form-control form-control-sm color-grey bg-light fw-medium rounded-4 border-0"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div
                className={`button-list-${
                    'hsl-' + hue + '-' + sat + '-' + lig
                } d-flex flex-column align-items-center h-100 pt-1 pe-3 overflow-y-scroll`}
            >
                {sortedAndFilteredItems.map((li) => (
                    <div
                        key={'list-item-' + li.id}
                        className="button-container d-flex flex-column align-items-center text-decoration-none w-100 pb-3"
                    >
                        <HomeButton
                            title={li.title}
                            primaryDescription={li.primaryDescription}
                            secondaryDescription={li.secondaryDescription}
                            viewFunction={() => viewFunction(li.id)}
                            allowEdit={allowEdit || li.allowEdit}
                            editFunction={() => editFunction(li.id)}
                            allowDelete={allowDelete || li.allowDelete}
                            deleteFunction={() => deleteFunction(li.id)}
                        />
                    </div>
                ))}
                {sortedAndFilteredItems.length === 0 && (
                    <p className="font-barlow text-center color-grey fw-medium m-0">Nada para mostrar por enquanto</p>
                )}
            </div>
            <style>{ProtocolListStyles(hue, sat, lig)}</style>
        </div>
    );
}

export default ProtocolList;
