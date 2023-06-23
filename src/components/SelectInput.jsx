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

    .select-border-gray {
        border-color: #A5A5A5
    }

    .select-label{
        font-weight: 600;
        font-size: 1rem;
        color: #535353;
    }
`;

function SelectInput(props) {
    console.log(props);
    const options = props.input.options || [];
    return (
        <div className="rounded shadow bg-white font-barlow pt-3 px-0">
            <div className="row d-flex justify-content-end m-0">
                <label labelfor="select" className="form-label select-label m-0 px-3">
                    {props.input.question}
                </label>
                <div className="col-5 px-0 pt-2">
                    <select className="form-select select-border-gray rounded-3">
                        <option defaultValue=""></option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <style>{style}</style>
        </div>
    );
}

export default SelectInput;