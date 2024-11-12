/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

const TextButtonStyles = (hue, sat, lig) => {
    return `
        .btn-${'hsl-' + hue + '-' + sat + '-' + lig} {
            color: #fff;
            font-weight: 700;
            font-size: 1.3rem;
            background-color: hsl(${hue}, ${sat}%, ${lig}%);
            border-color: hsl(${hue}, ${sat}%, ${lig}%);
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:hover {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:active {
            color: #fff !important;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%) !important;
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            box-shadow: inset 0px 4px 4px 0px #00000040;
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:focus {
            color: #fff !important;
            background-color: hsl(${hue}, ${sat}%, ${lig}%);
            border-color: hsl(${hue}, ${sat}%, ${lig}%);
            box-shadow: none;
        }

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:disabled {
            background-color: hsl(0,0%,85%) !important;
            border-color: hsl(0,0%,60%);
            box-shadow: none;
        }
    `;
};

function TextButton(props) {
    const {
        hsl: [hue, sat, lig] = [0, 0, 0],
        text = 'Button',
        className,
        type = 'button',
        onClick = () => undefined,
        role = undefined,
        overWriteStyles = false,
    } = props;
    return (
        <button
            type={type}
            role={role}
            className={`btn btn-${'hsl-' + hue + '-' + sat + '-' + lig} ${
                overWriteStyles
                    ? className
                    : `${className} d-flex rounded-4 font-century-gothic align-items-center justify-content-center w-100`
            }`}
            onClick={onClick}
        >
            {text}
            <style>{TextButtonStyles(hue, sat, lig)}</style>
        </button>
    );
}

export default TextButton;
