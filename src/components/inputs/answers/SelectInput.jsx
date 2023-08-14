import { React } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function SelectInput(props) {
    console.log(props);
    const options = props.input.options || [];
    return (
        <div className="rounded shadow bg-white font-barlow pt-3 px-0 mt-3">
            <div className="d-flex column align-items-center justify-content-between m-0 pb-3">
                <div className="d-flex col-9 align-items-center text-break text-start px-3">
                    {props.input.question}
                </div>
                <div className="px-0">
                    <select className="form-select border-0 rounded-3">
                        <option defaultValue=""></option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <style>{styles}</style>
        </div>
    );
}

export default SelectInput;