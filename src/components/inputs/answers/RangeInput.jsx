import { React, useEffect, useState } from 'react';
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
    const { onAnswerChange, answer, item, disabled } = props;
    const [value, setValue] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);
    const [step, setStep] = useState(2);
    const [hasUpdated, setHasUpdated] = useState(false);

    useEffect(() => {
        if (!hasUpdated) {
            if (item) {
                for (let j = 0; j < item.itemValidations.length; j++) {
                    let i = item.itemValidations[j];
                    switch (i.type) {
                        case 'MIN':
                            setMin(parseInt(i.argument));
                            break;
                        case 'MAX':
                            setMax(parseInt(i.argument));
                            break;
                        case 'STEP':
                            setStep(parseInt(i.argument));
                            break;
                        default:
                            break;
                    }
                }
            }
            setHasUpdated(true);
        }
    }, [hasUpdated, item]);

    useEffect(() => {
        if (hasUpdated) {
            setValue(Math.floor((min + max) / 2));
        }
    }, [hasUpdated, min, max]);

    const updateAnswer = (newAnswer) => {
        onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
        setValue(newAnswer.text);
    };

    const rangeStyle = {
        background: `linear-gradient(to right, #AAD390 ${((value - min) / (max - min)) * 100}%, #ccc ${
            ((value - min) / (max - min)) * 100
        }%)`,
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="d-flex flex-column">
                <label htmlFor="customRange" className="">
                    <MarkdownText text={item.text} />
                </label>
                <input
                    type="range"
                    className="w-100"
                    min={min}
                    max={max}
                    step={step}
                    id="customRange"
                    onChange={(e) => updateAnswer({ ...answer, text: String(e.target.value) })}
                    style={rangeStyle}
                    value={value}
                    disabled={disabled}
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
