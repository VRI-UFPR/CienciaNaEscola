/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import MaterialSymbol from './MaterialSymbol';

const roundedButtonStyles = (hue, sat, lig, size) => {
    return `
        .rounded-button-${size}{
            height: ${size}px;
            width: ${size}px;
            max-height: ${size}px;
            max-width: ${size}px;
            min-height: ${size}px;
            min-width: ${size}px;
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig} {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${lig}%);
            border-color: hsl(${hue}, ${sat}%, ${lig}%);
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:hover {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:active {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%) !important;
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            box-shadow: inset 0px 4px 4px 0px #00000040;
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:focus {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${lig}%);
            border-color: hsl(${hue}, ${sat}%, ${lig}%);
            box-shadow: none;
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:disabled {
            color: #000 !important;
            background-color: hsl(0,0%,85%) !important;
            border-color: hsl(0,0%,60%);
        }
    `;
};

function RoundedButton(props) {
    const {
        icon = 'question_mark',
        size = 36,
        hsl: [hue, sat, lig] = [355, 78, 66],
        onClick = () => undefined,
        role = undefined,
        className = '',
        disabled,
        dataBsToggle,
        dataBsTarget,
        dataBsCustomClass,
        dataBsTitle,
        weight = 400,
        fill = 1,
        grade = 200,
    } = props;

    return (
        <button
            type="button"
            data-bs-toggle={dataBsToggle}
            data-bs-title={dataBsTitle}
            data-bs-custom-class={dataBsCustomClass}
            data-bs-target={dataBsTarget}
            role={role}
            className={`btn btn-${
                'hsl-' + hue + '-' + sat + '-' + lig
            } rounded-button-${size} d-flex rounded-circle align-items-center justify-content-center p-0 ${className} `}
            onClick={onClick}
            disabled={disabled}
        >
            <MaterialSymbol icon={icon} size={Math.floor(size * 0.7)} fill={fill} grade={grade} weight={weight} />
            <style>{roundedButtonStyles(hue, sat, lig, size)}</style>
        </button>
    );
}

export default RoundedButton;
