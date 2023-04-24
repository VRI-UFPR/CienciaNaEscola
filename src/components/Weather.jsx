import React from 'react';

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

    .form-img {
        width: 50%;
        height: 50%;
    }

    .form-row {
        display: grid;
        grid-template-columns: 50% 50%;
    }
`;

function Weather(props) {
    return (
        <div className="d-flex flex-column shadow rounded bg-white pb-4 p-3">
            <div className="row justify-content-between mb-2 m-0">
                <div className="col p-0">
                    <p className="form-label font-barlow lh-sm">Como você descreveria o tempo hoje?</p>
                </div>
            </div>

            <div className="form-row">
                {props.objects.map((object) => {
                    const objTitle = object.title.toLowerCase().replace(/\s/g, '');

                    return (
                        <div className="d-flex flex-column ms-2 mb-2" key={object.id}>
                            <div className="d-flex align-items-center">
                                <input className="form-check-input mt-0" type="radio" name="radiooptions" id={objTitle + 'input'}></input>
                                <label className="form-check-label font-barlow px-2 py-2">{object.title}</label>
                            </div>
                            <img className="form-img" src={object.image} alt={object.alt} />
                        </div>
                    );
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Weather;
