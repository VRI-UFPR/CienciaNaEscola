/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { brazilianStates } from '../../../utils/constants';
import axios from 'axios';
import { serialize } from 'object-to-formdata';
import baseUrl from '../../../contexts/RouteContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { AlertContext } from '../../../contexts/AlertContext';

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
`;

/**
 * Componente responsável por gerenciar a seleção e atualização de localizações.
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.addressId - ID do endereço selecionado.
 * @param {Funcion} props.setAddressId - Função para atualizar o ID do endereço.
 * @param {boolean} props.disabled - Define se a interação com o componente está desabilitada. 
 */
export function Location(props) {
    const { addressId, setAddressId, disabled } = props;

    const [state, setState] = useState('');
    const [searchedCities, setSearchedCities] = useState([]);
    const [iconSize, setIconSize] = useState(0);

    const { showAlert } = useContext(AlertContext);
    const { user } = useContext(AuthContext);
    const iconContainerRef = useRef(null);

    /** Atualiza o tamanho do ícone. */
    const updateIconSize = useCallback(() => setIconSize(iconContainerRef.current.offsetWidth), []);

    useEffect(() => {
        updateIconSize();
        window.addEventListener('resize', updateIconSize);
        return () => window.removeEventListener('resize', updateIconSize);
    }, [updateIconSize]);

    /**
     * Atualiza o ID do endereço selecionado.
     * @param {string} addressId - Novo ID do endereço.
     */
    const updateAddressId = useCallback((addressId) => setAddressId(addressId), [setAddressId]);

    /**
     * Obtém o endereço com base na cidade, Estado e país informados.
     * @param {string} city - Nome da cidade.
     * @param {string} state - Nome do Estado.
     * @param {string} country - Nome do país.
     */
    const getAddressId = useCallback(
        async (city, state, country) => {
            const searchParams = { city, state, country };
            const formData = serialize(searchParams);
            const promises = [];
            promises.push(
                axios
                    .post(`${baseUrl}api/address/getAddressId`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .catch((error) => {
                        showAlert({
                            title: 'Erro ao conectar seu endereço',
                            description: error.response?.data.message,
                            dismissHsl: [97, 43, 70],
                            dismissText: 'Ok',
                            dismissible: true,
                        });
                    })
            );
            return Promise.all(promises).then((values) => {
                return values[0].data.data;
            });
        },
        [showAlert, user.token]
    );

    /**
     * Atualiza a localização do usuário.
     * @param {string} addressId - ID do endereço selecionado.
     * @param {string} state - Nome do Estado.
     */
    const setLocation = useCallback(
        (addressId, state) => {
            const searchParams = { state, country: 'Brasil' };
            const formData = serialize(searchParams);
            axios
                .post(`${baseUrl}api/address/getAddressesByState`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setSearchedCities(response.data.data);
                    setState(state);
                    updateAddressId(addressId);
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao atualizar localizações disponíveis',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                });
        },
        [showAlert, updateAddressId, user.token]
    );

    /** Obtém a localização do dispositivo e busca o endereço correspondente. */
    const getDeviceLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                axios
                    .get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then((response) => {
                        const city = response.data.address.city;
                        const state = response.data.address.state;
                        getAddressId(city, state, 'Brasil').then((addressId) => setLocation(addressId, state));
                    })
                    .catch((error) => {
                        showAlert({
                            title: 'Erro ao obter sua localização',
                            description: error.response?.data.message,
                            dismissHsl: [97, 43, 70],
                            dismissText: 'Ok',
                            dismissible: true,
                        });
                    });
            });
        }
    }, [getAddressId, setLocation, showAlert]);

    useEffect(() => {
        if (!addressId) {
            getDeviceLocation();
        }
    }, [addressId, getDeviceLocation]);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden gx-0">
                <div className="col-2 bg-pastel-blue">
                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                        <MaterialSymbol
                            className="location-icon w-50"
                            icon="location_on"
                            size={iconSize}
                            fill
                            color="#FFFFFF"
                            ref={iconContainerRef}
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex flex-column p-3">
                        <label htmlFor="locationinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7">
                            Localização da coleta
                        </label>
                        <div className="row align-items-center justify-content-end gx-1 gy-2">
                            <div className="col-12 col-sm">
                                <select
                                    className="form-select rounded-4 bg-light-pastel-blue fs-5"
                                    id="cityinput"
                                    value={addressId || ''}
                                    onChange={(e) => updateAddressId(e.target.value)}
                                    disabled={disabled || !state}
                                >
                                    <option value="">Cidade...</option>
                                    {searchedCities.map((city) => (
                                        <option key={'city-' + city.id} value={city.id}>
                                            {city.city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-sm">
                                <select
                                    className="form-select rounded-4 bg-light-pastel-blue fs-5"
                                    id="stateinput"
                                    value={state || ''}
                                    onChange={(e) => {
                                        setLocation('', e.target.value);
                                    }}
                                    disabled={disabled}
                                >
                                    <option value="">Estado...</option>
                                    {brazilianStates.map((state, i) => (
                                        <option key={'state-' + i} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-auto">
                                <RoundedButton
                                    hsl={[190, 46, 70]}
                                    onClick={() => {
                                        getDeviceLocation();
                                    }}
                                    icon="add_location"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
