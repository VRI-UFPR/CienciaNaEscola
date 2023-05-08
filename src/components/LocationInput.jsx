import { React, useEffect, useState } from 'react';
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
    const [location, setLocation] = useState();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation(latitude + ', ' + longitude);
            });
        }
    }, []);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="location-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconLocation} alt="Ícone de localização" />
                    </div>
                </div>
                <div className="col p-3 pe-4">
                    <div className="row m-0">
                        <label htmlFor="locationinput" className="form-label location-label font-century-gothic m-0 p-0">
                            Localização
                        </label>
                    </div>
                    <div className="row m-0">
                        <input
                            type="text"
                            className="form-control location-input pt-1 p-0"
                            defaultValue={location || ''}
                            id="locationinput"
                            placeholder="Forneça sua localização"
                        ></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
