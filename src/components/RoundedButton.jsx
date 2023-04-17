import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const roundedButtonStyles = (hue, sat, lig, size) => {
    return `
        .rounded-button{
            max-height: ${size}px;
            max-width: ${size}px;
        }

        .btn-hsl {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${lig}%);
            border-color: hsl(${hue}, ${sat}%, ${lig}%);
        }

        .btn-hsl:hover {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
        }

        .btn-hsl:focus {
            color: #fff;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
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
    } = props;
    return (
        <div className="ratio ratio-1x1 rounded-button">
            <button type="button" className="btn btn-hsl d-flex rounded-circle align-items-center justify-content-center w-100 h-100 p-1">
                <img src={icon} alt="Ícone do botão de ajuda" className="w-100"></img>
            </button>
            <style>{roundedButtonStyles(hue, sat, lig, size)}</style>
        </div>
    );
}

RoundedButton.defaultProps = {
    hsl: [355, 78, 66],
    size: 32,
    icon: helpIcon,
};

export default RoundedButton;
