import React from 'react';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .select-label{
        font-weight: 600;
        font-size: 1rem;
        color: #535353;
    }

    .select-input{
    
    }
`;

function SelectInput(props) {
    console.log(props);
    return (
        <div className="rounded shadow bg-white font-barlow p-3">
            <div className="row m-0 d-flex justify-content-end">
                <label labelfor="select" className="form-label select-label m-0">{props.input.question}</label>
                <div className="col-4">
                    <select className="form-select">
                        <option selected>Selecione uma opção</option>
                        <option value="1">Opção 1</option>
                        <option value="2">Opção 2</option>
                        <option value="3">Opção 3</option>
                    </select>
                </div>
            </div>

            <style>{style}</style>
        </div>
    );
}

export default SelectInput;