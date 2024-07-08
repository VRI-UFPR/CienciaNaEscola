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
            box-shadow: 0 0 0 0.25rem hsla(${hue}, ${sat}%, ${+lig * 0.7}%, 0.5);
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
