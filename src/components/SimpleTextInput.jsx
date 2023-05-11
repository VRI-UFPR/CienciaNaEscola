import { React, useEffect, useState } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .simple-text-label{
        font-weight: 600;
        font-size: 1rem;
        color: #535353;
    }

    .simple-text-input, .simple-text-input::placeholder{
        font-weight: 600;
        color: #787878;
        font-size: 1rem;
    }

    .simple-text-input{
        border-radius: 0;
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }
`;

function SimpleTextInput(props) {
    const [text, setText] = useState(['']);
    const { onAnswerChange, input, answer } = props;

    useEffect(() => {
        onAnswerChange(input.id, text);
    }, [text, input.id, onAnswerChange]);

    return (
        <div className="shadow rounded bg-white p-3">
            <div className="row justify-content-between mb-1 m-0">
                <label labelfor="simpletextinput" className="form-label simple-text-label font-barlow px-0">
                    {input.question}
                </label>
            </div>

            <input
                type="text"
                className="form-control font-barlow simple-text-input p-0 mb-4"
                id="simpletextinput"
                placeholder="Digite sua resposta aqui"
                onChange={(e) => setText([e.target.value])}
                value={answer ? answer[0].value : text}
                disabled={answer !== undefined}
            ></input>
            <style>{styles}</style>
        </div>
    );
}

export default SimpleTextInput;
