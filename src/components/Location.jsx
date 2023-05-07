import React from 'react';
import iconLocation from '../assets/images/iconLocation.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .location-label{
        font-size: 1rem;
        font-weight: 600;
        color: #535353;
    }

    .location-input, .location-input::placeholder{
        font-size: 1rem;
        font-weight: 600;
        color: #787878 !important;
    }

    .location-input{
        border-radius: 0;
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }

    .location-icon{
        max-width: 50px;
    }
`;

export function Location(props) {
    return (
        <div className="rounded-4 shadow bg-white overflow-hidden p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="location-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconLocation} alt="" />
                    </div>
                </div>
                <div className="col my-1 p-4 ps-3">
                    <div className="row m-0 mb-3">
                        <label labelfor="adressinput" className="form-label location-label font-barlow lh-sm m-0 p-0">
                            Forneça sua localização
                        </label>
                        <input
                            type="text"
                            className="form-control location-input font-barlow lh-sm pt-1 p-0"
                            id="adressinput"
                            placeholder="Adicione a localização"
                        ></input>
                    </div>

                    <div className="row m-0 mb-3">
                        <label labelfor="latitudeinput" className="form-label location-label font-barlow lh-sm m-0 p-0">
                            Latitude
                        </label>
                        <input
                            type="number"
                            className="form-control location-input font-barlow lh-sm pt-1 p-0"
                            id="latitudeinput"
                            placeholder="Adicione a latitude"
                        ></input>
                    </div>
                    <div className="row m-0">
                        <label labelfor="longitudeinput" className="form-label location-label font-barlow lh-sm m-0 p-0">
                            Longitude
                        </label>
                        <input
                            type="number"
                            className="form-control location-input font-barlow lh-sm pt-1 p-0"
                            id="longitudeinput"
                            placeholder="Adicione a longitude"
                        ></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
