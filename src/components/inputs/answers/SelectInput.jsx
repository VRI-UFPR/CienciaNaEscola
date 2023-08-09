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
        <div className="btn-group d-flex bg-white rounded">
            <button className="btn col-11 text-start px-0" type="button">
                {props.input.question}
            </button>
            <button
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
            </ul>

            <style>{styles}</style>
        </div>
    );
}

export default SelectInput;