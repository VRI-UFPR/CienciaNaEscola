import React from 'react';
import FormInputButtons from './FormInputButtons';

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
        <div className="shadow rounded pb-4 p-3">
            <div className="row justify-content-between mb-1 m-0">
                <div className="col-8 p-0">
                    <label labelfor="simpletextinput" className="form-label font-barlow">
                        Qual a temperatura no momento?
                    </label>
                </div>
                <div className="col-3 d-flex justify-content-end ps-3 p-0">
                    <FormInputButtons />
                </div>
            </div>

            <input type="text" className="form-control p-0 mb-4" id="simpletextinput" placeholder="Formato numérico inteiro"></input>
            <style>{styles}</style>
        </div>
    );
}

export default SimpleTextInput;
