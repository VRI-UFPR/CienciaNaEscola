/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useCallback, useEffect, useRef, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

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

    .color-dark-gray {
        color: #535353;
    }

    .color-sonic-silver {
        color: #787878;
    }

    .fs-7 {
        font-size: 1.1rem !important;
    }

    .location-input {
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }

    .location-icon {
        max-width: 50px;
    }

    .search-col {
        min-width: 32px;
    }
`;

export function Location(props) {
    const { onAnswerChange, answer } = props;
    const iconContainerRef = useRef(null);
    const [iconSize, setIconSize] = useState(0);
    const mapRef = useRef(null);

    const updateIconSize = useCallback(() => setIconSize(iconContainerRef.current.offsetWidth), []);

    useEffect(() => {
        updateIconSize();
        window.addEventListener('resize', updateIconSize);
        return () => window.removeEventListener('resize', updateIconSize);
    }, [updateIconSize]);

    const updateAnswer = useCallback((newAnswer) => onAnswerChange(newAnswer), [onAnswerChange]);

    const defaultLocation = useCallback(() => {
        navigator.geolocation?.getCurrentPosition((pos) =>
            updateAnswer({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        );
    }, [updateAnswer]);

    useEffect(() => {
        if (!answer.latitude && !answer.longitude) defaultLocation();
    }, [answer, defaultLocation]);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="location-icon ratio ratio-1x1 align-self-center w-50 mx-auto" ref={iconContainerRef}>
                        <MaterialSymbol icon="location_on" size={iconSize} fill color="#FFFFFF" />
                    </div>
                </div>
                <div className="col p-3">
                    <div className="row m-0 pb-1">
                        <label htmlFor="latitudeinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7 m-0 p-0">
                            Localização
                        </label>
                    </div>
                    <div className="row m-0 align-items-center">
                        <div className="col m-0 p-0 pe-2">
                            <input
                                type="text"
                                className="location-input form-control color-sonic-silver rounded-0 shadow-none fw-semibold fs-6 p-0"
                                id="latitudeinput"
                                placeholder="Latitude"
                                onChange={(e) => updateAnswer({ ...answer, latitude: e.target.value })}
                                value={answer.latitude}
                            ></input>
                        </div>
                        <div className="col m-0 p-0 pe-2">
                            <input
                                type="text"
                                className="location-input form-control color-sonic-silver rounded-0 shadow-none fw-semibold fs-6 p-0"
                                id="longitudeinput"
                                placeholder="Longitude"
                                onChange={(e) => updateAnswer({ ...answer, longitude: e.target.value })}
                                value={answer.longitude}
                            ></input>
                        </div>
                        <div className="col-auto search-col d-flex justify-content-end m-0 p-0">
                            <RoundedButton
                                hsl={[190, 46, 70]}
                                onClick={() => {
                                    defaultLocation();
                                }}
                                icon="add_location"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row overflow-hidden m-0">
                <MapContainer center={[-14.235, -51.9253]} zoom={16} style={{ height: '400px' }} ref={mapRef}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {answer.latitude && answer.longitude && (
                        <Marker
                            position={[answer.latitude, answer.longitude]}
                            draggable={true}
                            eventHandlers={{
                                moveend: (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    updateAnswer({ latitude: lat, longitude: lng });
                                    mapRef.current.setView([lat, lng]);
                                },
                                add: () => mapRef.current.setView([answer.latitude, answer.longitude]),
                            }}
                        >
                        </Marker>
                    )}
                </MapContainer>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
