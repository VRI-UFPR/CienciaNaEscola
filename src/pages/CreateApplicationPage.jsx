/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import axios from 'axios';
import { serialize } from 'object-to-formdata';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import SplashPage from './SplashPage';
import { AlertContext } from '../contexts/AlertContext';
import { StorageContext } from '../contexts/StorageContext';
import TextButton from '../components/TextButton';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import CustomContainer from '../components/CustomContainer';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    
    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey {
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
    .bg-light-pastel-blue:active,
    .bg-light-grey:focus,
    .bg-light-grey:active {
        box-shadow: inset 0px 4px 4px 0px #00000040;
    }

    .bg-light-pastel-blue:disabled,
    .bg-light-grey:disabled {
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
    }

    .bg-light-grey,
    .bg-light-grey:focus,
    .bg-light-grey:active {
        background-color: #D9D9D9;
        border-color: #D9D9D9;
    }

    .color-steel-blue {
        color: #4E9BB9;
    }

    .form-check-input {
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }
    .form-check-input:focus {
        border: 0;
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }
    .form-check input:checked {
        border: 0;
        background-color: #91CAD6;
    }
`;

/**
 * Página de criação/edição de aplicação.
 * @param {Object} props - Propriedades do componente.
 * @param {boolean} props.isEditing - Indica se a aplicação está sendo editada.
*/
function CreateApplicationPage(props) {
    const { applicationId, protocolId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const { clearLocalApplications } = useContext(StorageContext);
    const formRef = useRef(null);

    /** Estado inicial da aplicação. */
    const [application, setApplication] = useState({
        protocolId: protocolId,
        keepLocation: false,
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
    });

    /** Estado inicial do protocolo. */
    const [protocol, setProtocol] = useState({
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
    });

    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchedClassrooms, setSearchedClassrooms] = useState([]);
    const [searchedAnswerUsers, setSearchedAnswerUsers] = useState([]);
    const [searchedAnswerClassrooms, setSearchedAnswerClassrooms] = useState([]);

    const [VCSearchInput, setVCSearchInput] = useState('');
    const [VUSearchInput, setVUSearchInput] = useState('');
    const [AVUSearchInput, setAVUSearchInput] = useState('');
    const [AVCSearchInput, setAVCSearchInput] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (user.role === 'USER') {
                setError({
                    text: 'Operação não permitida',
                    description: `Você não tem permissão para ${isEditing ? 'editar' : 'criar'} aplicações`,
                });
                return;
            }
            const promises = [];
            let reqProtocolId = protocolId;
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${process.env.REACT_APP_API_URL}api/application/getApplication/${applicationId}`, {
                            headers: { Authorization: `Bearer ${user.token}` },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            reqProtocolId = d.protocol.id;
                            if (d.actions.toUpdate !== true)
                                return Promise.reject({
                                    text: 'Operação não permitida',
                                    description: 'Você não tem permissão para editar esta aplicação',
                                });
                            setApplication({
                                visibility: d.visibility,
                                answersVisibility: d.answersVisibility,
                                viewersUser: d.viewersUser.map(({ id }) => id),
                                viewersClassroom: d.viewersClassroom.map(({ id }) => id),
                                answersViewersUser: d.answersViewersUser.map(({ id }) => id),
                                answersViewersClassroom: d.answersViewersClassroom.map(({ id }) => id),
                                keepLocation: d.keepLocation,
                                actions: d.actions,
                            });
                            setSearchedClassrooms(d.viewersClassroom.map(({ id, name, users }) => ({ id, name, users })));
                            setSearchedUsers(d.viewersUser.map(({ id, username, classrooms }) => ({ id, username, classrooms })));
                            setSearchedAnswerClassrooms(d.answersViewersClassroom.map(({ id, name, users }) => ({ id, name, users })));
                            setSearchedAnswerUsers(
                                d.answersViewersUser.map(({ id, username, classrooms }) => ({ id, username, classrooms }))
                            );
                        })
                        .catch((error) =>
                            Promise.reject(
                                error.text
                                    ? error
                                    : { text: 'Erro ao obter informações da aplicação', description: error.response?.data.message }
                            )
                        )
                );
            }
            Promise.all(promises)
                .then(() => {
                    axios
                        .get(`${process.env.REACT_APP_API_URL}api/protocol/getProtocol/${reqProtocolId}`, {
                            headers: { Authorization: `Bearer ${user.token}` },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setProtocol({
                                viewersUser: d.viewersUser.map((u) => ({ id: u.id, username: u.username })),
                                viewersClassroom: d.viewersClassroom.map((c) => ({ id: c.id, name: c.name })),
                                answersViewersUser: d.answersViewersUser.map((u) => ({ id: u.id, username: u.username })),
                                answersViewersClassroom: d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name })),
                                visibility: d.visibility,
                                answersVisibility: d.answersVisibility,
                            });
                            if (!isEditing) {
                                if (d.visibility === 'RESTRICT') {
                                    setApplication((prev) => ({
                                        ...prev,
                                        viewersUser: d.viewersUser.map((u) => u.id),
                                        viewersClassroom: d.viewersClassroom.map((c) => c.id),
                                    }));
                                    setSearchedUsers(d.viewersUser.map(({ id, username, classrooms }) => ({ id, username, classrooms })));
                                    setSearchedClassrooms(d.viewersClassroom.map(({ id, name, users }) => ({ id, name, users })));
                                }
                                if (d.answersVisibility === 'RESTRICT') {
                                    setApplication((prev) => ({
                                        ...prev,
                                        answersViewersUser: d.answersViewersUser.map((u) => u.id),
                                        answersViewersClassroom: d.answersViewersClassroom.map((c) => c.id),
                                    }));
                                    setSearchedAnswerUsers(
                                        d.answersViewersUser.map(({ id, username, classrooms }) => ({ id, username, classrooms }))
                                    );
                                    setSearchedAnswerClassrooms(
                                        d.answersViewersClassroom.map(({ id, name, users }) => ({ id, name, users }))
                                    );
                                }
                            }
                            setIsLoading(false);
                        })
                        .catch((error) =>
                            Promise.reject({
                                text: 'Erro ao obter informações do protocolo',
                                description: error.response?.data.message,
                            })
                        );
                })
                .catch((error) => setError(error));
        }
    }, [isEditing, isLoading, user.status, user.institutionId, user.token, user.role, applicationId, protocolId, user.id, showAlert]);

    /**
     * Submete a aplicação, criando ou atualizando conforme o modo de edição.
     * @param {Event} e - Evento de envio do formulário.
    */
    const submitApplication = (e) => {
        e.preventDefault();
        const formData = serialize({ ...application, actions: undefined }, { indices: true });
        if (isEditing) {
            axios
                .put(`${process.env.REACT_APP_API_URL}api/application/updateApplication/${applicationId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    clearLocalApplications();
                    showAlert({
                        headerText: 'Aplicação atualizada com sucesso',
                        onPrimaryBtnClick: () => navigate(`/dash/applications/${response.data.data.id}`),
                    });
                })
                .catch((error) => showAlert({ headerText: 'Erro ao atualizar aplicação', description: error.response?.data.message }));
        } else {
            axios
                .post(`${process.env.REACT_APP_API_URL}api/application/createApplication`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    showAlert({
                        headerText: 'Aplicação criada com sucesso',
                        onPrimaryBtnClick: () => navigate(`/dash/applications/${response.data.data.id}`),
                    });
                })
                .catch((error) => showAlert({ headerText: 'Erro ao criar aplicação', bodyText: error.response?.data.message }));
        }
    };

    /** Deleta uma aplicação com base no ID fornecido. */
    const deleteApplication = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}api/application/deleteApplication/${applicationId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                clearLocalApplications();
                showAlert({ headerText: 'Aplicação excluída com sucesso', onPrimaryBtnClick: () => navigate(`/dash/applications/`) });
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir aplicação', bodyText: error.response?.data.message }));
    };

    /**
     * Busca usuários pelo nome de usuário.
     * @param {string} term - Termo de busca para encontrar usuários.
    */
    const searchUsers = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/user/searchUserByUsername`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                const d = response.data.data;

                /** Filtra os usuários que ainda não são espectadores e que têm permissão para visualizar o protocolo. */
                const newUsers = [
                    ...d
                        .filter(
                            (u) =>
                                !application.viewersUser.includes(u.id) &&
                                (protocol.visibility === 'PUBLIC' || protocol.viewersUser.map((v) => v.id).includes(u.id))
                        )
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedUsers
                        .filter((u) => application.viewersUser.includes(u.id))
                        .sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedUsers(newUsers);
            })
            .catch((error) => showAlert({ headerText: 'Erro ao buscar usuários', bodyText: error.response?.data.message }));
    };

    /**
     * Busca usuários pelo nome de usuário para visualizar respostas.
     * @param {string} term - Termo de busca para encontrar usuários.
    */
    const searchAnswerUsers = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/user/searchUserByUsername`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                const d = response.data.data;
                const newUsers = [
                    ...d
                        .filter(
                            (u) =>
                                !application.answersViewersUser.includes(u.id) &&
                                (protocol.answersVisibility === 'PUBLIC' || protocol.answersViewersUser.map((v) => v.id).includes(u.id))
                        )
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedAnswerUsers
                        .filter((u) => application.answersViewersUser.includes(u.id))
                        .sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedAnswerUsers(newUsers);
            })
            .catch((error) => showAlert({ headerText: 'Erro ao buscar usuários', bodyText: error.response?.data.message }));
    };

    /**
     * Busca salas de aula pelo nome.
     * @param {string} term - Termo de busca para encontrar salas de aula.
    */
    const searchClassrooms = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/classroom/searchClassroomByName`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                const d = response.data.data;
                const newClassrooms = d
                    .filter(
                        (c) =>
                            !application.viewersClassroom.includes(c.id) &&
                            (protocol.visibility === 'PUBLIC' || protocol.viewersClassroom.map((v) => v.id).includes(c.id))
                    )
                    .map(({ id, name, users }) => ({ id, name, users }));
                const concatenedClassrooms = [
                    ...newClassrooms,
                    ...searchedClassrooms
                        .filter((c) => application.viewersClassroom.includes(c.id))
                        .sort((a, b) => a.name.localeCompare(b.name)),
                ];
                // for (const c of newClassrooms) {
                //     const newUsers = c.users
                //         .filter((u) => !application.viewersUser.includes(u.id))
                //         .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
                //     setSearchedUsers((prev) =>
                //         [
                //             ...prev.map((u) => {
                //                 if (newUsers.includes(u.id)) {
                //                     return { ...u, classrooms: [...u.classrooms, c.id] };
                //                 }
                //                 return u;
                //             }),
                //             ...newUsers,
                //         ].sort((a, b) => a.username.localeCompare(b.username))
                //     );
                // }
                setSearchedClassrooms(concatenedClassrooms);
            })
            .catch((error) => showAlert({ headerText: 'Erro ao buscar grupos', bodyText: error.response?.data.message }));
    };

    /**
     * Busca salas de aula pelo nome para visualização de respostas.
     * @param {string} term - Termo de busca para encontrar salas de aula.
    */
    const searchAnswerClassrooms = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/classroom/searchClassroomByName`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                const d = response.data.data;
                const newClassrooms = d
                    .filter(
                        (c) =>
                            !application.answersViewersClassroom.includes(c.id) &&
                            (protocol.answersVisibility === 'PUBLIC' || protocol.answersViewersClassroom.map((v) => v.id).includes(c.id))
                    )
                    .map(({ id, name, users }) => ({ id, name, users }));
                const concatenedClassrooms = [
                    ...newClassrooms,
                    ...searchedAnswerClassrooms
                        .filter((c) => application.answersViewersClassroom.includes(c.id))
                        .sort((a, b) => a.name.localeCompare(b.name)),
                ];
                // for (const c of newClassrooms) {
                //     const newUsers = c.users
                //         .filter((u) => !application.answersViewersUser.includes(u.id))
                //         .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
                //     setSearchedAnswerUsers((prev) =>
                //         [
                //             ...prev.map((u) => {
                //                 if (newUsers.includes(u.id)) {
                //                     return { ...u, classrooms: [...u.classrooms, c.id] };
                //                 }
                //                 return u;
                //             }),
                //             ...newUsers,
                //         ].sort((a, b) => a.username.localeCompare(b.username))
                //     );
                // }
                setSearchedAnswerClassrooms(concatenedClassrooms);
            })
            .catch((error) => showAlert({ headerText: 'Erro ao buscar grupos', bodyText: error.response?.data.message }));
    };

    /**
     * Remove um usuário da lista de visualizadores da aplicação.
     * @param {number|string} id - ID do usuário a ser removido.
    */
    const unselectUser = (id) => {
        setApplication((prev) => ({
            ...prev,
            viewersUser: prev.viewersUser.filter((u) => u !== id),
            viewersClassroom: searchedClassrooms
                .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.viewersClassroom.includes(c.id))
                .map((c) => c.id),
        }));
    };

    /**
     * Adiciona uma sala de aula à lista de visualizadores da aplicação e seus usuários à lista de visualizadores individuais. 
     * @param {number|string} id - ID da sala de aula a ser selecionada.
    */
    const selectClassroom = (id) => {
        const c = searchedClassrooms.find((c) => c.id === id);
        const newUsers = c.users
            .filter((u) => !application.viewersUser.includes(u.id))
            .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
        setSearchedUsers((prev) =>
            [
                ...prev.map((u) => {
                    if (newUsers.includes(u.id)) return { ...u, classrooms: [...u.classrooms, c.id] };
                    return u;
                }),
                ...newUsers.filter((u) => !prev.map((u) => u.id).includes(u.id)),
            ].sort((a, b) => a.username.localeCompare(b.username))
        );
        setApplication((prev) => ({
            ...prev,
            viewersClassroom: [...prev.viewersClassroom, id],
            viewersUser: [
                ...prev.viewersUser,
                ...searchedClassrooms
                    .find((c) => c.id === id)
                    .users.filter((u) => !prev.viewersUser.includes(u.id))
                    .map((u) => u.id),
            ],
        }));
    };

    /**
     * Remove um usuário da lista de visualizadores de respostas da aplicação.
     * @param {number|string} id - ID do usuário a ser removido da lista de visualizadores de respostas.
    */
    const unselectAnswerUser = (id) => {
        setApplication((prev) => ({
            ...prev,
            answersViewersUser: prev.answersViewersUser.filter((u) => u !== id),
            answersViewersClassroom: searchedAnswerClassrooms
                .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.answersViewersClassroom.includes(c.id))
                .map((c) => c.id),
        }));
    };

    /**
     * Adiciona uma sala de aula à lista de visualizadores de respostas da aplicação.
     * @param {number|string} id - ID da sala de aula a ser adicionada como visualizadora de respostas.
    */
    const selectAnswerClassroom = (id) => {
        const c = searchedAnswerClassrooms.find((c) => c.id === id);
        const newUsers = c.users
            .filter((u) => !application.answersViewersUser.includes(u.id))
            .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
        setSearchedAnswerUsers((prev) =>
            [
                ...prev.map((u) => {
                    if (newUsers.includes(u.id)) return { ...u, classrooms: [...u.classrooms, c.id] };
                    return u;
                }),
                ...newUsers.filter((u) => !prev.map((u) => u.id).includes(u.id)),
            ].sort((a, b) => a.username.localeCompare(b.username))
        );
        setApplication((prev) => ({
            ...prev,
            answersViewersClassroom: [...prev.answersViewersClassroom, id],
            answersViewersUser: [
                ...prev.answersViewersUser,
                ...searchedAnswerClassrooms
                    .find((c) => c.id === id)
                    .users.filter((u) => !prev.answersViewersUser.includes(u.id))
                    .map((u) => u.id),
            ],
        }));
    };

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text={`Carregando ${isEditing ? 'edição' : 'criação'} de aplicação...`} />;

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
                        <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">{isEditing ? 'Editar' : 'Criar'} aplicação</h1>
                        <div className="d-flex flex-column flex-grow-1">
                            <form
                                name="application-form"
                                id="application-form"
                                className="flex-grow-1 mb-4"
                                ref={formRef}
                                action="/submit"
                                onSubmit={(e) => submitApplication(e)}
                            >
                                <div className="mb-3">
                                    <div className="form-check form-switch fs-5">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="enabled"
                                            checked={application.keepLocation || false}
                                            onChange={(e) => setApplication((prev) => ({ ...prev, keepLocation: e.target.checked }))}
                                        />
                                        <label className="form-check-label color-steel-blue fs-5 fw-medium me-2" htmlFor="enabled">
                                            Solicitar localização das respostas
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label label="visibility" className="form-label color-steel-blue fs-5 fw-medium">
                                        Selecione a visibilidade da aplicação
                                    </label>
                                    <select
                                        name="visibility"
                                        value={application.visibility || ''}
                                        id="visibility"
                                        form="application-form"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                        onChange={(e) => setApplication((prev) => ({ ...prev, visibility: e.target.value || undefined }))}
                                    >
                                        <option value="">Selecione uma opção:</option>
                                        {protocol.visibility === 'PUBLIC' && <option value="PUBLIC">Visível para todos</option>}
                                        <option value="RESTRICT">Restringir visualizadores</option>
                                    </select>
                                </div>
                                {application.visibility === 'RESTRICT' && (
                                    <div>
                                        <fieldset>
                                            <div className="row gx-2 gy-0 mb-2 align-items-center">
                                                <div className="col-12 col-xxl-auto">
                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-0">
                                                        Selecione os usuários que visualizarão a aplicação:
                                                    </p>
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="users-search"
                                                        value={VUSearchInput || ''}
                                                        id="users-search"
                                                        placeholder="Buscar por nome de usuário"
                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                        onChange={(e) => setVUSearchInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') searchUsers(VUSearchInput);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        className="text-white"
                                                        onClick={() => searchUsers(VUSearchInput)}
                                                        icon="person_search"
                                                    />
                                                </div>
                                            </div>
                                            {searchedUsers.length > 0 && (
                                                <div className="row user-list gy-2 mb-3">
                                                    {searchedUsers.map((u) => (
                                                        <div key={'viewer-user-' + u.id} className="col-6 col-md-4 col-xl-3">
                                                            <div className="form-check">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="viewers-user"
                                                                    id={`viewer-user-${u.id}`}
                                                                    value={u.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.viewersUser.includes(u.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked)
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                viewersUser: [
                                                                                    ...prev.viewersUser,
                                                                                    parseInt(e.target.value),
                                                                                ],
                                                                            }));
                                                                        else unselectUser(parseInt(e.target.value));
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`viewer-user-${u.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {u.username}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </fieldset>
                                    </div>
                                )}
                                {application.visibility === 'RESTRICT' && (
                                    <div>
                                        <fieldset>
                                            <div className="row gx-2 gy-0 mb-2 align-items-center">
                                                <div className="col-12 col-xxl-auto">
                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-0">
                                                        Selecione os grupos que visualizarão a aplicação:
                                                    </p>
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="classrooms-search"
                                                        value={VCSearchInput || ''}
                                                        id="classrooms-search"
                                                        placeholder="Buscar por nome do grupo"
                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                        onChange={(e) => setVCSearchInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') searchClassrooms(VCSearchInput);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        className="text-white"
                                                        onClick={() => searchClassrooms(VCSearchInput)}
                                                        icon="search"
                                                    />
                                                </div>
                                            </div>
                                            {searchedClassrooms.length > 0 && (
                                                <div className="row user-list gy-2 mb-3">
                                                    {searchedClassrooms.map((c) => (
                                                        <div key={'viewer-classroom-' + c.id} className="col-6 col-md-4 col-xl-3">
                                                            <div className="form-check">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="viewers-classroom"
                                                                    id={`viewer-classroom-${c.id}`}
                                                                    value={c.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.viewersClassroom.includes(c.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) selectClassroom(parseInt(e.target.value));
                                                                        else
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                viewersClassroom: prev.viewersClassroom.filter(
                                                                                    (id) => id !== parseInt(e.target.value)
                                                                                ),
                                                                            }));
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`viewer-classroom-${c.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {c.name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </fieldset>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label label="answer-visibility" className="form-label color-steel-blue fs-5 fw-medium">
                                        Selecione a visibilidade das respostas da aplicação
                                    </label>
                                    <select
                                        name="answer-visibility"
                                        value={application.answersVisibility || ''}
                                        id="answer-visibility"
                                        form="application-form"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                        onChange={(e) =>
                                            setApplication((prev) => ({ ...prev, answersVisibility: e.target.value || undefined }))
                                        }
                                    >
                                        <option value="">Selecione uma opção:</option>
                                        {protocol.answersVisibility === 'PUBLIC' && <option value="PUBLIC">Visível para todos</option>}
                                        <option value="RESTRICT">Restringir visualizadores</option>
                                    </select>
                                </div>
                                {application.answersVisibility === 'RESTRICT' && (
                                    <div>
                                        <fieldset>
                                            <div className="row gx-2 gy-0 mb-2 align-items-center">
                                                <div className="col-12 col-xxl-auto">
                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-0">
                                                        Selecione os usuários que visualizarão as respostas da aplicação:
                                                    </p>
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="answer-users-search"
                                                        value={AVUSearchInput || ''}
                                                        id="answer-users-search"
                                                        placeholder="Buscar por nome de usuário"
                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                        onChange={(e) => setAVUSearchInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') searchAnswerUsers(AVUSearchInput);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        className="text-white"
                                                        onClick={() => searchAnswerUsers(AVUSearchInput)}
                                                        icon="person_search"
                                                    />
                                                </div>
                                            </div>
                                            {searchedAnswerUsers.length > 0 && (
                                                <div className="row user-list gy-2 mb-3">
                                                    {searchedAnswerUsers.map((u) => (
                                                        <div key={'answer-viewer-user-' + u.id} className="col-6 col-md-4 col-xl-3">
                                                            <div className="form-check">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="answer-viewers-user"
                                                                    id={`answer-viewer-user-${u.id}`}
                                                                    value={u.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.answersViewersUser.includes(u.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked)
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                answersViewersUser: [
                                                                                    ...prev.answersViewersUser,
                                                                                    parseInt(e.target.value),
                                                                                ],
                                                                            }));
                                                                        else unselectAnswerUser(parseInt(e.target.value));
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`answer-viewer-user-${u.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {u.username}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </fieldset>
                                    </div>
                                )}
                                {application.answersVisibility === 'RESTRICT' && (
                                    <div>
                                        <fieldset>
                                            <div className="row gx-2 gy-0 mb-2 align-items-center">
                                                <div className="col-12 col-xxl-auto">
                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-0">
                                                        Selecione os grupos que visualizarão as respostas da aplicação:
                                                    </p>
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="answer-classrooms-search"
                                                        value={AVCSearchInput || ''}
                                                        id="answer-classrooms-search"
                                                        placeholder="Buscar por nome do grupo"
                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                        onChange={(e) => setAVCSearchInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') searchAnswerClassrooms(AVCSearchInput);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        className="text-white"
                                                        onClick={() => searchAnswerClassrooms(AVCSearchInput)}
                                                        icon="search"
                                                    />
                                                </div>
                                            </div>
                                            {searchedAnswerClassrooms.length > 0 && (
                                                <div className="row user-list gy-2 mb-3">
                                                    {searchedAnswerClassrooms.map((c) => (
                                                        <div key={'answer-viewer-classroom-' + c.id} className="col-6 col-md-4 col-xl-3">
                                                            <div className="form-check">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="answer-viewers-classroom"
                                                                    id={`answer-viewer-classroom-${c.id}`}
                                                                    value={c.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.answersViewersClassroom.includes(c.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked)
                                                                            selectAnswerClassroom(parseInt(e.target.value));
                                                                        else
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                answersViewersClassroom:
                                                                                    prev.answersViewersClassroom.filter(
                                                                                        (id) => id !== parseInt(e.target.value)
                                                                                    ),
                                                                            }));
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`answer-viewer-classroom-${c.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {c.name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </fieldset>
                                    </div>
                                )}
                            </form>
                            <div className="row justify-content-center justify-content-lg-start gx-2">
                                <div className="col-5 col-sm-3 col-xl-2">
                                    <TextButton
                                        text={isEditing ? 'Concluir' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={() => {
                                            showAlert({
                                                headerText: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} a aplicação?`,
                                                primaryBtnHsl: [355, 78, 66],
                                                primaryBtnLabel: 'Não',
                                                secondaryBtnHsl: [97, 43, 70],
                                                secondaryBtnLabel: 'Sim',
                                                onSecondaryBtnClick: () => formRef.current.requestSubmit(),
                                            });
                                        }}
                                    />
                                </div>
                                {isEditing && application.actions.toDelete === true && (
                                    <div className="col-5 col-sm-3 col-xl-2">
                                        <TextButton
                                            text={'Excluir'}
                                            hsl={[355, 78, 66]}
                                            onClick={() => {
                                                showAlert({
                                                    headerText: `Tem certeza que deseja excluir a aplicação?`,
                                                    primaryBtnHsl: [355, 78, 66],
                                                    primaryBtnLabel: 'Não',
                                                    secondaryBtnHsl: [97, 43, 70],
                                                    secondaryBtnLabel: 'Sim',
                                                    onSecondaryBtnClick: () => deleteApplication(),
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

export default CreateApplicationPage;
