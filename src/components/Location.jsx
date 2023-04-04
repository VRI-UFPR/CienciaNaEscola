import React from 'react';
import LocationIcon from '../assets/images/LocationIcon.svg';

const styles = `
    label{
        font-weight: 500;
        color: #535353;
    }

    .form-control{
        font-weight: 500;
        color: #787878;
        font-size: 90%;
        border-radius: 0;
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function Location(props) {
    return (
        <div className="overflow-hidden shadow rounded bg-white py-3 px-0">
            <div className="row m-0 mb-3">
                <div className="col-2 d-flex justify-content-center p-0">
                    <img src={LocationIcon} alt="Location Icon" style={{ width: "30px" }}/>
                </div>
                <div className="col p-0">
                    <label labelfor="adressinput" className="font-barlow lh-sm m-0">
                        Forneça sua localização
                    </label>
                    <input
                        type="text"
                        className="form-control font-barlow p-0 lh-sm"
                        id="adressinput"
                        placeholder="Adicione a localização"
                    ></input>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-2"></div>
                <div className="col">
                    <label labelfor="latitudeinput" className="font-barlow lh-sm m-0">
                        Latitude
                    </label>
                    <input
                        type="number"
                        className="form-control font-barlow p-0 lh-sm"
                        id="latitudeinput"
                        placeholder="Adicione a latitude"
                    ></input>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-2"></div>
                <div className="col">
                    <label labelfor="longitudeinput" className="font-barlow lh-sm m-0">
                        Longitude
                    </label>
                    <input
                        type="number"
                        className="form-control font-barlow p-0 lh-sm"
                        id="longitudeinput"
                        placeholder="Adicione a longitude"
                    ></input>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
