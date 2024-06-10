import React from 'react';

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

        .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:focus, .btn-${'hsl-' + hue + '-' + sat + '-' + lig}:active {
            color: #fff !important;
            background-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%) !important;
            border-color: hsl(${hue}, ${sat}%, ${+lig * 0.7}%);
            box-shadow: inset 0px 4px 4px 0px #00000040;
        }
    `;
};

function TextButton(props) {
    const {
        hsl: [hue, sat, lig],
        text,
        className,
        type,
        onClick,
        role,
        overWriteStyles,
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

TextButton.defaultProps = {
    hsl: [0, 0, 0],
    text: 'Button',
    type: 'button',
    role: undefined,
    overWriteStyles: false,
    onClick: () => undefined,
};

export default TextButton;
