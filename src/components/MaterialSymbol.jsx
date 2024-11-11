/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import 'material-symbols';

function MaterialSymbol(props) {
    const { icon, size, weight, fill = 1, color, grade = 200 } = props;
    return (
        <span
            className="material-symbols-rounded"
            style={{
                color: color,
                fontVariationSettings: `"FILL" ${fill ? 1 : 0}${weight ? `, "wght" ${weight}` : ''}${grade ? `, "GRAD" ${grade}` : ''}${
                    size ? `, "opsz" ${size}` : ''
                }`,
                fontSize: size ? `${size}px` : undefined,
            }}
        >
            {icon}
        </span>
    );
}

export default MaterialSymbol;
