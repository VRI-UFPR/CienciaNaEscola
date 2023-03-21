import React from "react";
import FormInputButtons from "./FormInputButtons";

const styles = `
    .form-label, .form-check-label {
        font-weight: 500;
        font-size: 90%;
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    
    .form-check-input{
        background-color: #D9D9D9
    }
`;

function Weather(props) {
    return (
        <div className="p-3 shadow rounded pb-4">
            <div className="row m-0 justify-content-between mb-2">
                <div className="col-9 p-0">
                    <p className="form-label font-barlow lh-sm">Como você descreveria o tempo hoje?</p>
                </div>
                <div className="col-3 d-flex justify-content-end ps-3 p-0">
                    <FormInputButtons />
                </div>
            </div>

            {props.titles.map((title, i) => (
                <div className="d-flex ms-2 mb-2">
                    <input className="form-check-input" type="radio" name="radiooptions" id={"input"}></input>
                    <label className="form-check-label font-barlow px-2" key={i}>
                        {title}
                    </label>
                </div>
            ))}
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default Weather;
