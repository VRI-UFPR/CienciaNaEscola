import React from 'react';

const TextButtonStyles = (hue, sat, lig) => {
    return `
        .btn-hsl {
            color: #fff;
            font-weight: 700;
            font-size: 1.3rem;
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

function TextButton(props) {
    const {
        hsl: [hue, sat, lig],
        text,
        className,
    } = props;
    return (
        <button
            type="button"
            className={`btn d-flex btn-hsl font-century-gothic align-items-center justify-content-center w-100 p-2 ${className}`}
        >
            {text}
            <style>{TextButtonStyles(hue, sat, lig)}</style>
        </button>
    );
}

TextButton.defaultProps = {
    hsl: [0, 0, 0],
    text: 'Button',
};

export default TextButton;