/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const roundedButtonStyles = (hue, sat, lig, size) => {
    return `
        .rounded-button{
            max-height: ${size}px;
            max-width: ${size}px;
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

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:focus, .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:active {
            color: #fff !important;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%) !important;
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            box-shadow: 0 0 0 0.25rem hsla(${hue}, ${sat}%, ${+lig * 0.7}%, 0.5);
        }
    `;
};

function RoundedButton(props) {
    const {
        hsl: [hue, sat, lig],
        size,
        icon,
        alt,
        className,
        onClick,
        role,
        'data-bs-toggle': dataBsToggle,
    } = props;
    return (
        <button
            type="button"
            data-bs-toggle={dataBsToggle}
            role={role}
            className={`btn btn-${
                'hsl-' + hue + '-' + sat + '-' + lig
            } rounded-button d-flex rounded-circle align-items-center justify-content-center w-100 h-100 p-1 ${className} `}
            onClick={onClick}
        >
            <img src={icon} alt={alt} className="ratio ratio-1x1 w-100"></img>
            <style>{roundedButtonStyles(hue, sat, lig, size)}</style>
        </button>
    );
}

RoundedButton.defaultProps = {
    hsl: [355, 78, 66],
    size: 32,
    icon: helpIcon,
    alt: 'Ícone',
    className: '',
    role: undefined,
    onClick: () => undefined,
};

export default RoundedButton;
