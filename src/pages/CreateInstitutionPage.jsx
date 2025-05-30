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
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SplashPage from './SplashPage';
import ErrorPage from './ErrorPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import { AlertContext } from '../contexts/AlertContext';
import { brazilianStates } from '../utils/constants';
import CustomContainer from '../components/CustomContainer';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey {
        color: #535353;
    }

    .color-grey:checked {
        color: #535353;
    }

    .color-grey:focus {
        color: #535353;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }

    .bg-light-pastel-blue,
    .bg-light-pastel-blue:focus,
    .bg-light-pastel-blue:active {
        background-color: #b8d7e3;
        border-color: #b8d7e3;
    }

    .bg-light-pastel-blue:focus,
    .bg-light-pastel-blue:active {
        box-shadow: inset 0px 4px 4px 0px #00000040;
    }

    .bg-light-pastel-blue:disabled{
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
    }

    .color-steel-blue {
        color: #4E9BB9;
    }
`;

/**
 * Componente de criação e edição de instituição.
 * @param {Object} props - Propriedades do componente.
 * @param {boolean} props.isEditing - Indica se o formulário está no modo de edição.
*/
function CreateInstitutionPage(props) {
    const { institutionId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const formRef = useRef(null);

    const [institution, setInstitution] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [state, setState] = useState('');
    const [searchedCities, setSearchedCities] = useState([]);

    const navigate = useNavigate();

    /**
     * Atualiza a localização da instituição.
     * @param {number} addressId - ID do endereço da instituição.
     * @param {string} state - Estado onde a instituição está localizada.
    */
    const setLocation = useCallback(
        (addressId, state) => {
            const searchParams = { state, country: 'Brasil' };
            const formData = serialize(searchParams);
            axios
                .post(`${process.env.REACT_APP_API_URL}api/address/getAddressesByState`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setSearchedCities(response.data.data);
                    setState(state);
                    setInstitution((prev) => ({ ...prev, addressId: addressId }));
                })
                .catch((error) =>
                    showAlert({
                        headerText: 'Erro ao obter localizações disponíveis',
                        bodyText: error.response?.data.message,
                    })
                );
        },
        [showAlert, user.token]
    );

    /** Efeito para carregar os dados da instituição. */
    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && user.role !== 'ADMIN')
                return setError({ text: 'Operação não permitida', description: 'Você não tem permissão para criar instituições' });
            if (isEditing) {
                axios
                    .get(`${process.env.REACT_APP_API_URL}api/institution/getInstitution/${institutionId}`, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        if (d.actions.toUpdate !== true) {
                            return setError({
                                text: 'Operação não permitida',
                                description: 'Você não tem permissão para editar esta instituição',
                            });
                        }
                        setInstitution({ name: d.name, type: d.type, addressId: d.address.id, actions: d.actions });
                        setLocation(d.address.id, d.address.state);
                        setIsLoading(false);
                    })
                    .catch((error) =>
                        showAlert({ headerText: 'Erro ao obter informações da instituição', bodyText: error.response?.data.message })
                    );
            } else setIsLoading(false);
        }
    }, [institutionId, isEditing, isLoading, user.token, user.status, user.role, user.institutionId, showAlert, setLocation]);

    /**
     * Submete os dados do formulário para criar ou atualizar a instituição.
     * @param {Event} e - Evento de submissão do formulário.
    */
    const submitInstitution = (e) => {
        e.preventDefault();
        const formData = serialize({ ...institution, actions: undefined }, { indices: true });
        if (isEditing) {
            axios
                .put(`${process.env.REACT_APP_API_URL}api/institution/updateInstitution/${institutionId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) =>
                    showAlert({
                        headerText: 'Instituição atualizada com sucesso',
                        onPrimaryBtnClick: () => navigate(`/dash/institutions/${response.data.data.id}`),
                    })
                )
                .catch((error) => showAlert({ headerText: 'Erro ao atualizar instituição', bodyText: error.response?.data.message }));
        } else {
            axios
                .post(`${process.env.REACT_APP_API_URL}api/institution/createInstitution`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) =>
                    showAlert({
                        headerText: 'Instituição criada com sucesso',
                        onPrimaryBtnClick: () => navigate(`/dash/institutions/${response.data.data.id}`),
                    })
                )
                .catch((error) => showAlert({ headerText: 'Erro ao criar instituição', bodyText: error.response?.data.message }));
        }
    };

    /** Exclui a instituição atual. */
    const deleteInstitution = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}api/institution/deleteInstitution/${institutionId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) =>
                showAlert({ headerText: 'Instituição excluída com sucesso', onPrimaryBtnClick: () => navigate(`/dash/institutions`) })
            )
            .catch((error) => showAlert({ headerText: 'Erro ao excluir instituição', bodyText: error.response?.data.message }));
    };

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text={`Carregando ${isEditing ? 'edição' : 'criação'} de instituição...`} />;

    return (
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row align-items-stretch h-100 g-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <CustomContainer className="font-barlow flex-grow-1 overflow-y-scroll p-4" df="12" md="10">
                        <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">{isEditing ? 'Editar' : 'Criar'} instituição</h1>
                        <div className="d-flex flex-column flex-grow-1">
                            <form
                                name="institution-form"
                                className="flex-grow-1 mb-4"
                                ref={formRef}
                                action="/submit"
                                id="institution-form"
                                onSubmit={(e) => submitInstitution(e)}
                            >
                                <div className="mb-3">
                                    <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                        Nome da instituição:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={institution.name || ''}
                                        form="institution-form"
                                        id="name"
                                        className="form-control bg-light-pastel-blue color-grey fw-medium fs-5 border-0 rounded-4"
                                        onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                                        minLength="1"
                                        maxLength="255"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label label="type" className="form-label color-steel-blue fs-5 fw-medium">
                                        Selecione o tipo da instituição
                                    </label>
                                    <select
                                        name="type"
                                        value={institution.type || ''}
                                        id="type"
                                        className="form-control bg-light-pastel-blue color-grey fw-medium fs-5 border-0 rounded-4"
                                        form="institution-form"
                                        onChange={(e) => setInstitution((prev) => ({ ...prev, type: e.target.value || undefined }))}
                                        required
                                    >
                                        <option value="" className="color-grey fw-medium fs-5">
                                            Selecione uma opção:
                                        </option>
                                        <option value="PRIMARY" className="color-grey fw-medium fs-5">
                                            Pré-escola ou Ensino Fundamental I
                                        </option>
                                        <option value="LOWER_SECONDARY" className="color-grey fw-medium fs-5">
                                            Ensino Fundamental II
                                        </option>
                                        <option value="UPPER_SECONDARY" className="color-grey fw-medium fs-5">
                                            Ensino Médio
                                        </option>
                                        <option value="TERTIARY" className="color-grey fw-medium fs-5">
                                            Ensino Superior
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label label="type" className="form-label color-steel-blue fs-5 fw-medium">
                                        Selecione o estado da instituição
                                    </label>
                                    <select
                                        name="state"
                                        value={state || ''}
                                        id="state"
                                        className="form-control bg-light-pastel-blue color-grey fw-medium fs-5 border-0 rounded-4"
                                        form="institution-form"
                                        onChange={(e) => setLocation('', e.target.value)}
                                        required
                                    >
                                        <option value="" className="color-grey fw-medium fs-5">
                                            Selecione uma opção:
                                        </option>
                                        {brazilianStates.map((state, i) => (
                                            <option key={'state-' + i} value={state} className="color-grey fw-medium fs-5">
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label label="type" className="form-label color-steel-blue fs-5 fw-medium">
                                        Selecione a cidade da instituição
                                    </label>
                                    <select
                                        name="address-id"
                                        value={institution.addressId || ''}
                                        id="address-id"
                                        className="form-control bg-light-pastel-blue color-grey fw-medium fs-5 border-0 rounded-4"
                                        form="institution-form"
                                        disabled={!state}
                                        onChange={(e) => setInstitution((prev) => ({ ...prev, addressId: e.target.value || undefined }))}
                                        required
                                    >
                                        <option value="" className="color-grey fw-medium fs-5">
                                            Selecione uma opção:
                                        </option>
                                        {searchedCities.map((city) => (
                                            <option key={'city-' + city.id} value={city.id} className="color-grey fw-medium fs-5">
                                                {city.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                            <div className="row justify-content-center justify-content-lg-start gx-2">
                                <div className="col-5 col-sm-3 col-xl-2">
                                    <TextButton
                                        text={isEditing ? 'Concluir' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={() => {
                                            showAlert({
                                                headerText: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} a instituição?`,
                                                primaryBtnHsl: [355, 78, 66],
                                                primaryBtnLabel: 'Não',
                                                secondaryBtnHsl: [97, 43, 70],
                                                secondaryBtnLabel: 'Sim',
                                                onSecondaryBtnClick: () => formRef.current.requestSubmit(),
                                            });
                                        }}
                                    />
                                </div>
                                {isEditing && institution.actions.toDelete === true && (
                                    <div className="col-5 col-sm-3 col-xl-2">
                                        <TextButton
                                            text={'Excluir'}
                                            hsl={[355, 78, 66]}
                                            onClick={() => {
                                                showAlert({
                                                    headerText: `Tem certeza que deseja excluir a instituição?`,
                                                    primaryBtnHsl: [355, 78, 66],
                                                    primaryBtnLabel: 'Não',
                                                    secondaryBtnHsl: [97, 43, 70],
                                                    secondaryBtnLabel: 'Sim',
                                                    onSecondaryBtnClick: () => deleteInstitution(),
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CustomContainer>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default CreateInstitutionPage;
