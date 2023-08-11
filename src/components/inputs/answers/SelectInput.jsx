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
            <div className="d-flex column justify-content-between m-0">
                <div className="col-11 text-start px-3 pb-3">
                    {props.input.question}
                </div>

                {/* <button
                    type="button"
                    className="btn btn-sm dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu">
                    {options.map((option, index) => (
                        <li key={index} value={option.value}>
                            {option.label}
                        </li>
                    ))}
                </ul> */}

                <div className="px-0 pt-2">
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