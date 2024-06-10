import { React, useState } from 'react';
import MarkdownText from '../../MarkdownText';

const styles = `
    #customRange {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        width: 15rem;
    }

    #customRange::-webkit-slider-runnable-track {
        height: 0.5rem;
        border-radius: 5px;
    }

    #customRange::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 25px;
        width: 8px;
        margin-top: -8px;
        border-radius: 5px;
        background-color: #535353;
    }

    .range-subtitle span {
        width: 40px;
    }
`;

function RangeInput(props) {
    const { item, min = 0, max = 10, step = 1 } = props;
    const [value, setValue] = useState(Math.floor((min + max) / 2));

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const rangeStyle = {
        background: `linear-gradient(to right, #AAD390 ${((value - min) / (max - min)) * 100}%, #ccc ${
            ((value - min) / (max - min)) * 100
        }%)`,
        borderRadius: '5px',
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="d-flex flex-column">
                <label for="customRange" className="">
                    <MarkdownText text={item.text} />
                </label>
                <input
                    type="range"
                    className="w-100"
                    min={min}
                    max={max}
                    step={step}
                    id="customRange"
                    onChange={handleInputChange}
                    style={rangeStyle}
                    value={value}
                />
            </div>
            <div className="range-subtitle d-flex justify-content-between pt-2">
                <span className={`${parseFloat(value) === parseFloat(min) ? 'd-none' : ''} fw-normal fs-6`}>{min}</span>
                <span className="text-decoration-underline text-center fw-medium fs-5">{value}</span>
                <span className={`${parseFloat(value) === parseFloat(max) ? 'd-none' : ''} text-end fw-normal fs-6`}>{max}</span>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default RangeInput;
