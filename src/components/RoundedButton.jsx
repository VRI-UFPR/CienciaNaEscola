import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const roundedButtonStyles = (hue, sat, lig, size) => {
    return `
        .help-button{
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
    const { hue, sat, lig, size, icon } = props;
    return (
        <div className="ratio ratio-1x1 help-button">
            <button type="button" className="btn d-flex btn-hsl rounded-circle w-100 h-100 align-items-center justify-content-center p-1 ">
                <img src={icon} alt="Ícone do botão de ajuda" className="w-100"></img>
            </button>
            <style>{roundedButtonStyles(hue, sat, lig, size)}</style>
        </div>
    );
}

RoundedButton.defaultProps = {
    hue: 355,
    sat: 78,
    lig: 66,
    size: 32,
    icon: helpIcon,
};

export default RoundedButton;
