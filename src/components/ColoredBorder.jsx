/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

const styles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-steel-blue {
        background-color: #4E9BB9;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-lime-green {
        background-color: #AAD390;
    }

    .border-cell {
        height: 10px;
    }
`;

function ColoredBorder(props) {
    return (
        <div className="row w-100 p-0 m-0">
            <div className="col border-cell bg-pastel-blue"></div>
            <div className="col border-cell bg-coral-red"></div>
            <div className="col border-cell bg-yellow-orange"></div>
            <div className="col border-cell bg-steel-blue"></div>
            <div className="col border-cell bg-crimson"></div>
            <div className="col border-cell bg-lime-green"></div>
            <style>{styles}</style>
        </div>
    );
}

export default ColoredBorder;
