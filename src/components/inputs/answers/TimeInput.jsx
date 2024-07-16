import { React, useCallback, useEffect } from 'react';
import iconTime from '../../../assets/images/iconTime.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-sonic-silver {
        color: #787878;
    }

    .fs-7 {
        font-size: 1.1rem !important;
    }

    .time-icon{
        max-width: 50px;
    }
`;

function TimeInput(props) {
    const { onAnswerChange, item, answer, disabled } = props;

    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    useEffect(() => {
        if (!answer.text) {
            const date = new Date();
            const hour = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            updateAnswer({ ...answer, text: `${hour}:${minutes}` });
        }
    }, [answer, updateAnswer]);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="time-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconTime} alt="Ícone de relógio" />
                    </div>
                </div>
                <div className="col p-3">
                    <div className="row m-0 pb-1">
                        <label htmlFor="timeinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7 m-0 p-0">
                            Horário da coleta
                        </label>
                    </div>
                    <div className="row m-0">
                        <input
                            type="time"
                            className="form-control border-0 color-sonic-silver fw-medium fs-7 w-auto m-0 p-0"
                            id="timeinput"
                            value={answer.text}
                            onChange={(e) => updateAnswer({ ...answer, text: e.target.value })}
                            disabled={disabled}
                        ></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default TimeInput;
