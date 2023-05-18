import { React } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-dark-grey {
        color: #787878;
    }

    .color-dark-gray {
        color: #535353;
    }

    .simple-text-input {
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }
`;

function SimpleTextInput(props) {
    const { onAnswerChange, input, answer } = props;

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0 pb-3">
                <label labelfor="simpletextinput" className="form-label color-dark-gray font-barlow fw-medium fs-6 m-0 p-0">
                    {input.question}
                </label>
            </div>

            <input
                type="text"
                className="simple-text-input form-control rounded-0 shadow-none bg-dark-grey font-barlow fw-medium fs-6 mb-3 p-0"
                id="simpletextinput"
                placeholder="Digite sua resposta aqui"
                onChange={(e) => onAnswerChange(input.id, [e.target.value])}
                value={answer ? answer[0].value : undefined}
                disabled={answer !== undefined}
            ></input>
            <style>{styles}</style>
        </div>
    );
}

SimpleTextInput.defaultProps = {
    onAnswerChange: () => undefined,
    input: {},
};

export default SimpleTextInput;
