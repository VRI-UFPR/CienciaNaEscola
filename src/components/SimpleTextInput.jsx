import React from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    label{
        font-weight: 500;
        font-size: 90%;
        color: #535353;
    }

    .form-control{
        color: #787878;
        font-size: 85%;
        border-radius: 0;
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }
`;

function SimpleTextInput(props) {
    return (
        <div className="shadow rounded bg-white pb-4 p-3">
            <div className="row justify-content-between mb-1 m-0">
                <label labelfor="simpletextinput" className="form-label font-barlow px-0">
                    {props.input.question}
                </label>
            </div>

            <input type="text" className="form-control p-0 mb-4" id="simpletextinput" placeholder="Digite sua resposta aqui"></input>
            <style>{styles}</style>
        </div>
    );
}

export default SimpleTextInput;
