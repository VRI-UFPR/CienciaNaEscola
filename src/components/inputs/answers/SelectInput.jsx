import { React } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function SelectInput(props) {
    const options = props.item.itemOptions || [];
    return (
        <div className="rounded shadow bg-white font-barlow pt-3 px-0 mt-3">
            <div className="row align-items-center justify-content-between m-0 pb-3">
                <div className="d-flex col-9 align-items-center text-break text-start px-3">{props.item.text}</div>
                <div className="col px-0">
                    <select className="form-select border-0 rounded-3">
                        <option disabled selected label="Selecione uma opção:"></option>
                        {options.map((option, index) => (
                            <option key={index} value={option.text}>
                                {option.text}
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
