import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const roundedButtonStyles = (hue, sat, lig, size) => {
    return `
        .rounded-button{
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
            color: #fff !important;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%) !important;
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            box-shadow: inset 0px 4px 4px 0px #00000040;
        }
    `;
};

function RoundedButton(props) {
    const {
        hsl: [hue, sat, lig] = [355, 78, 66],
        size = 32,
        icon = helpIcon,
        alt = 'Ícone',
        className = '',
        onClick = () => undefined,
        role = undefined,
        disabled,
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
            disabled={disabled}
        >
            <img src={icon} alt={alt} className="ratio ratio-1x1 w-100"></img>
            <style>{roundedButtonStyles(hue, sat, lig, size)}</style>
        </button>
    );
}

export default RoundedButton;
