/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext, useEffect } from 'react';
import RoundedButton from './RoundedButton';
import { serialize } from 'object-to-formdata';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { AlertContext } from '../contexts/AlertContext';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip } from 'bootstrap';

function CreateProtocolProperties(props) {
    const { setSearchedOptions, searchedOptions, protocol, setProtocol, setSearchInputs, searchInputs } = props;
    const { user } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        new Tooltip('.title-tooltip', { trigger: 'hover' });
        new Tooltip('.description-tooltip', { trigger: 'hover' });
        new Tooltip('.enabled-tooltip', { trigger: 'hover' });
        new Tooltip('.replicable-tooltip', { trigger: 'hover' });
        new Tooltip('.visibility-tooltip', { trigger: 'hover' });
        new Tooltip('.applicability-tooltip', { trigger: 'hover' });
        new Tooltip('.answer-visiblity-tooltip', { trigger: 'hover' });
    }, []);

    const searchUsers = (term, target) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${baseUrl}api/user/searchUserByUsername`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                if (target === 'viewersUser') {
                    const d = response.data.data;
                    const newUsers = [
                        ...d
                            .filter((u) => !protocol.viewersUser.includes(u.id))
                            .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                        ...searchedOptions.viewersUser
                            .filter((u) => protocol.viewersUser.includes(u.id))
                            .sort((a, b) => a.username.localeCompare(b.username)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, viewersUser: newUsers }));
                } else if (target === 'answersViewersUser') {
                    const d = response.data.data;
                    const newUsers = [
                        ...d
                            .filter((u) => !protocol.answersViewersUser.includes(u.id))
                            .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                        ...searchedOptions.answersViewersUser
                            .filter((u) => protocol.answersViewersUser.includes(u.id))
                            .sort((a, b) => a.username.localeCompare(b.username)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, answersViewersUser: newUsers }));
                } else if (target === 'appliers') {
                    const d = response.data.data;
                    const newUsers = [
                        ...d
                            .filter((u) => !protocol.appliers.includes(u.id))
                            .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                        ...searchedOptions.appliers
                            .filter((u) => protocol.appliers.includes(u.id))
                            .sort((a, b) => a.username.localeCompare(b.username)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, appliers: newUsers }));
                }
            })
            .catch((error) => showAlert({ headerText: 'Erro ao buscar usuários.', bodyText: error.response?.data.message }));
    };

    const searchClassrooms = (term, target) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${baseUrl}api/classroom/searchClassroomByName`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const d = response.data.data;
                if (target === 'viewersClassroom') {
                    const newClassrooms = d
                        .filter((c) => !protocol.viewersClassroom.includes(c.id))
                        .map(({ id, name, users }) => ({ id, name, users }));
                    const concatenedClassrooms = [
                        ...newClassrooms,
                        ...searchedOptions.viewersClassroom
                            .filter((c) => protocol.viewersClassroom.includes(c.id))
                            .sort((a, b) => a.name.localeCompare(b.name)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, viewersClassroom: concatenedClassrooms }));
                } else if (target === 'answersViewersClassroom') {
                    const d = response.data.data;
                    const newClassrooms = d
                        .filter((c) => !protocol.answersViewersClassroom.includes(c.id))
                        .map(({ id, name, users }) => ({ id, name, users }));
                    const concatenedClassrooms = [
                        ...newClassrooms,
                        ...searchedOptions.answersViewersClassroom
                            .filter((c) => protocol.answersViewersClassroom.includes(c.id))
                            .sort((a, b) => a.name.localeCompare(b.name)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, answersViewersClassroom: concatenedClassrooms }));
                }
            })
            .catch((error) => showAlert({ headerText: 'Erro ao buscar grupos.', bodyText: error.response?.data.message }));
    };

    const unselectUser = (id, target) => {
        if (target === 'viewersUser') {
            setProtocol((prev) => ({
                ...prev,
                viewersUser: prev.viewersUser.filter((u) => u !== id),
                viewersClassroom: searchedOptions.viewersClassroom
                    .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.viewersClassroom.includes(c.id))
                    .map((c) => c.id),
            }));
        } else if ('answersViewersUser') {
            setProtocol((prev) => ({
                ...prev,
                answersViewersUser: prev.answersViewersUser.filter((u) => u !== id),
                answersViewersClassroom: searchedOptions.answersViewersClassroom
                    .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.answersViewersClassroom.includes(c.id))
                    .map((c) => c.id),
            }));
        }
    };

    const selectClassroom = (id, target) => {
        if (target === 'viewersClassroom') {
            const c = searchedOptions.viewersClassroom.find((c) => c.id === id);
            const newUsers = c.users
                .filter((u) => !protocol.viewersUser.includes(u.id))
                .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
            setSearchedOptions((prev) => ({
                ...prev,
                viewersUser: [
                    ...prev.viewersUser.map((u) => {
                        if (newUsers.map((u) => u.id).includes(u.id)) {
                            return { ...u, classrooms: [...u.classrooms, c.id] };
                        }
                        return u;
                    }),
                    ...newUsers.filter((u) => !prev.viewersUser.map((u) => u.id).includes(u.id)),
                ],
            }));
            setProtocol((prev) => ({
                ...prev,
                viewersClassroom: [...prev.viewersClassroom, id],
                viewersUser: [
                    ...prev.viewersUser,
                    ...searchedOptions.viewersClassroom
                        .find((c) => c.id === id)
                        .users.filter((u) => !prev.viewersUser.includes(u.id))
                        .map((u) => u.id),
                ],
            }));
        } else if (target === 'answersViewersClassroom') {
            const c = searchedOptions.answersViewersClassroom.find((c) => c.id === id);
            const newUsers = c.users
                .filter((u) => !protocol.answersViewersUser.includes(u.id))
                .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
            setSearchedOptions((prev) => ({
                ...prev,
                answersViewersUser: [
                    ...prev.answersViewersUser.map((u) => {
                        if (newUsers.map((u) => u.id).includes(u.id)) {
                            return { ...u, classrooms: [...u.classrooms, c.id] };
                        }
                        return u;
                    }),
                    ...newUsers.filter((u) => !prev.answersViewersUser.map((u) => u.id).includes(u.id)),
                ],
            }));
            setProtocol((prev) => ({
                ...prev,
                answersViewersClassroom: [...prev.answersViewersClassroom, id],
                answersViewersUser: [
                    ...prev.answersViewersUser,
                    ...searchedOptions.answersViewersClassroom
                        .find((c) => c.id === id)
                        .users.filter((u) => !prev.answersViewersUser.includes(u.id))
                        .map((u) => u.id),
                ],
            }));
        }
    };

    return (
        <div className="flex-grow-1 mb-3">
            <label htmlFor="title" className="form-label color-steel-blue fs-5 fw-medium me-1">
                Título do protocolo
            </label>
            <MaterialSymbol
                icon="question_mark"
                size={13}
                weight={700}
                fill
                color="#FFFFFF"
                data-bs-toggle="tooltip"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="Texto curto que identifique o protocolo com no máximo 255 caracteres."
                className="bg-steel-blue title-tooltip p-1 rounded-circle"
            />
            <input
                className="form-control rounded-4 pastel-blue-input fs-5 mb-3"
                id="title"
                type="text"
                value={protocol.title || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, title: event.target.value }))}
                minLength="3"
                required
            ></input>
            <label htmlFor="description" className="form-label color-steel-blue fs-5 fw-medium me-1">
                Descrição do protocolo
            </label>
            <MaterialSymbol
                icon="question_mark"
                size={13}
                weight={700}
                fill
                color="#FFFFFF"
                data-bs-toggle="tooltip"
                data-bs-custom-class="description-tooltip"
                data-bs-title="Texto que descreva a finalidade do protocolo e/ou instruções para sua execução. Suporta Markdown com até 3000 caracteres."
                className="bg-steel-blue description-tooltip p-1 rounded-circle"
            />
            <textarea
                className="form-control rounded-4 pastel-blue-input fs-5 mb-3"
                id="description"
                rows="4"
                value={protocol.description || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, description: event.target.value }))}
            ></textarea>
            <div className="form-check form-switch fs-5 mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="enabled"
                    checked={protocol.enabled}
                    onChange={(event) => setProtocol((prev) => ({ ...prev, enabled: !prev.enabled }))}
                />
                <label className="form-check-label color-steel-blue fs-5 fw-medium me-2" htmlFor="enabled">
                    Habilitado
                </label>
                <MaterialSymbol
                    icon="question_mark"
                    size={13}
                    weight={700}
                    fill
                    color="#FFFFFF"
                    data-bs-toggle="tooltip"
                    data-bs-custom-class="enabled-tooltip"
                    data-bs-title="Se o protocolo aceitará respostas e aplicações."
                    className="bg-steel-blue enabled-tooltip p-1 rounded-circle"
                />
            </div>
            <div className="form-check form-switch fs-5 mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="replicable"
                    checked={protocol.replicable}
                    onChange={(event) => setProtocol((prev) => ({ ...prev, replicable: !prev.replicable }))}
                />
                <label className="form-check-label color-steel-blue fs-5 fw-medium me-2" htmlFor="enabled">
                    Replicável
                </label>
                <MaterialSymbol
                    icon="question_mark"
                    size={13}
                    weight={700}
                    fill
                    color="#FFFFFF"
                    data-bs-toggle="tooltip"
                    data-bs-custom-class="replicable-tooltip"
                    data-bs-title="Se os aplicadores poderão criar réplicas do protocolo. Uma réplica possui os mesmos itens e estrutura do protocolo original, mas com regras (acesso, replicabilidade, etc) definidas pelo usuário que replicou, sem controle do criador original. A réplica não acompanhará futuras alterações deste protocolo."
                    className="bg-steel-blue replicable-tooltip p-1 rounded-circle"
                />
            </div>
            <label htmlFor="visibility" className="form-label color-steel-blue fs-5 fw-medium me-2">
                Visibilidade
            </label>
            <MaterialSymbol
                icon="question_mark"
                size={13}
                weight={700}
                fill
                color="#FFFFFF"
                data-bs-toggle="tooltip"
                data-bs-custom-class="visibility-tooltip"
                data-bs-title="Quem poderá visualizar o protocolo. Um protocolo público é acessível para todos os usuários, enquanto o protocolo restrito só é acessível para os usuários e grupos que você selecionar. Aplicações definidas como mais restritas podem não ser acessíveis para todos os usuários definidos aqui."
                className="bg-steel-blue visibility-tooltip p-1 rounded-circle"
            />
            <select
                className="form-select rounded-4 pastel-blue-input fs-5 mb-3"
                id="visibility"
                value={protocol.visibility || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, visibility: event.target.value }))}
                required
            >
                <option value="">Selecione...</option>
                <option value="PUBLIC">Público</option>
                <option value="RESTRICT">Restrito</option>
            </select>
            {protocol.visibility === 'RESTRICT' && (
                <fieldset>
                    <div className="row gx-2 gy-0">
                        <div className="col-12 col-xl-auto">
                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                Selecione os usuários que poderão visualizar o protocolo:
                            </p>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name="users-search"
                                value={searchInputs.viewersUser}
                                id="users-search"
                                placeholder="Buscar por nome de usuário"
                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                onChange={(e) =>
                                    setSearchInputs((prev) => ({
                                        ...prev,
                                        viewersUser: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') searchUsers(searchInputs.viewersUser, 'viewersUser');
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() => searchUsers(searchInputs.viewersUser, 'viewersUser')}
                                icon="search"
                            />
                        </div>
                    </div>
                    <div className="row gy-2 mb-3">
                        {searchedOptions.viewersUser.map((u) => (
                            <div key={'viewer-user-' + u.id + '-option'} className="col-6 col-md-4 col-lg-3">
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="viewers-user"
                                    id={`viewer-user-${u.id}`}
                                    value={u.id}
                                    checked={protocol.viewersUser.includes(u.id)}
                                    className="form-check-input bg-grey"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setProtocol((prev) => ({
                                                ...prev,
                                                viewersUser: [...prev.viewersUser, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            unselectUser(parseInt(e.target.value), 'viewersUser');
                                        }
                                    }}
                                />
                                <label htmlFor={`viewer-user-${u.id}`} className="font-barlow color-grey text-break fw-medium ms-2 fs-6">
                                    {u.username}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}
            {protocol.visibility === 'RESTRICT' && (
                <fieldset>
                    <div className="row gx-2 gy-0">
                        <div className="col-12 col-xl-auto">
                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                Selecione os grupos que poderão visualizar o protocolo:
                            </p>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name="users-search"
                                value={searchInputs.viewersClassroom}
                                id="users-search"
                                placeholder="Buscar por nome do grupo"
                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                onChange={(e) =>
                                    setSearchInputs({
                                        ...searchInputs,
                                        viewersClassroom: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') searchClassrooms(searchInputs.viewersClassroom, 'viewersClassroom');
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() => searchClassrooms(searchInputs.viewersClassroom, 'viewersClassroom')}
                                icon="search"
                            />
                        </div>
                    </div>
                    <div className="row gy-2 mb-3">
                        {searchedOptions.viewersClassroom.map((c) => (
                            <div key={'viewer-classroom-' + c.id + '-option'} className="col-6 col-md-4 col-lg-3">
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="viewers-classroom"
                                    id={`viewer-classroom-${c.id}`}
                                    className="form-check-input bg-grey"
                                    value={c.id}
                                    checked={protocol.viewersClassroom.includes(c.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            selectClassroom(parseInt(e.target.value), 'viewersClassroom');
                                        } else {
                                            setProtocol((prev) => ({
                                                ...prev,
                                                viewersClassroom: prev.viewersClassroom.filter((id) => id !== parseInt(e.target.value)),
                                            }));
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`viewer-classroom-${c.id}`}
                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                >
                                    {c.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}
            <label htmlFor="applicability" className="form-label color-steel-blue fs-5 fw-medium me-2">
                Aplicabilidade
            </label>
            <MaterialSymbol
                icon="question_mark"
                size={13}
                weight={700}
                fill
                color="#FFFFFF"
                data-bs-toggle="tooltip"
                data-bs-custom-class="applicability-tooltip"
                data-bs-title="Quem poderá aplicar o protocolo. Um protocolo público é aplicável por todos os usuários, enquanto o protocolo restrito só é aplicável pelos usuários e grupos que você selecionar. A aplicação herda as restrições de visibilidade do protocolo, mas pode ser definida para ser ainda mais restrita. O criador do protocolo terá acesso às respostas de todas as aplicações."
                className="bg-steel-blue applicability-tooltip p-1 rounded-circle"
            />
            <select
                className="form-select rounded-4 pastel-blue-input fs-5 mb-3"
                id="applicability"
                value={protocol.applicability || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, applicability: event.target.value }))}
                required
            >
                <option value="">Selecione...</option>
                <option value="PUBLIC">Público</option>
                <option value="RESTRICT">Restrito</option>
            </select>
            {protocol.applicability === 'RESTRICT' && (
                <fieldset>
                    <div className="row gx-2 gy-0">
                        <div className="col-12 col-xl-auto">
                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                Selecione os usuários que poderão aplicar o protocolo:
                            </p>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name="users-search"
                                value={searchInputs.appliers}
                                id="users-search"
                                placeholder="Buscar por nome de usuário"
                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                onChange={(e) => setSearchInputs({ ...searchInputs, appliers: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') searchUsers(searchInputs.appliers, 'appliers');
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() => searchUsers(searchInputs.appliers, 'appliers')}
                                icon="search"
                            />
                        </div>
                    </div>
                    <div className="row gy-2 mb-3">
                        {searchedOptions.appliers
                            .filter((u) => u.role !== 'USER' && u.role !== 'ADMIN')
                            .map((u) => (
                                <div key={'applier-' + u.id + '-option'} className="col-6 col-md-4 col-lg-3">
                                    <input
                                        form="application-form"
                                        type="checkbox"
                                        name="applier"
                                        id={`applier-${u.id}`}
                                        className="form-check-input bg-grey"
                                        value={u.id}
                                        checked={protocol.appliers.includes(u.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setProtocol((prev) => ({
                                                    ...prev,
                                                    appliers: [...prev.appliers, parseInt(e.target.value)],
                                                }));
                                            } else {
                                                setProtocol((prev) => ({
                                                    ...prev,
                                                    appliers: prev.appliers.filter((id) => id !== parseInt(e.target.value)),
                                                }));
                                            }
                                        }}
                                    />
                                    <label htmlFor={`applier-${u.id}`} className="font-barlow color-grey text-break fw-medium ms-2 fs-6">
                                        {u.username}
                                    </label>
                                </div>
                            ))}
                    </div>
                </fieldset>
            )}
            <label htmlFor="answer-visiblity" className="form-label color-steel-blue fs-5 fw-medium me-2">
                Visibilidade das respostas
            </label>
            <MaterialSymbol
                icon="question_mark"
                size={13}
                weight={700}
                fill
                color="#FFFFFF"
                data-bs-toggle="tooltip"
                data-bs-custom-class="answer-visiblity-tooltip"
                data-bs-title="Quem poderá visualizar as respostas do protocolo. Um protocolo público permite que todos os usuários vejam suas respostas, enquanto o protocolo restrito só permite que os usuários e grupos que você selecionar vejam as respostas. Respostas de aplicações definidas como mais restritas que o protocolo não serão visíveis por todos os usuários definidos aqui."
                className="bg-steel-blue answer-visiblity-tooltip p-1 rounded-circle"
            />
            <select
                className="form-select rounded-4 pastel-blue-input fs-5 mb-3"
                id="answer-visiblity"
                value={protocol.answersVisibility || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, answersVisibility: event.target.value }))}
                required
            >
                <option value="">Selecione...</option>
                <option value="PUBLIC">Público</option>
                <option value="RESTRICT">Restrito</option>
            </select>
            {protocol.answersVisibility === 'RESTRICT' && (
                <fieldset>
                    <div className="row gx-2 gy-0">
                        <div className="col-12 col-xl-auto">
                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                Selecione os usuários que poderão visualizar as respostas do protocolo:
                            </p>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name="users-search"
                                value={searchInputs.answersViewersUser}
                                id="users-search"
                                placeholder="Buscar por nome de usuário"
                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                onChange={(e) =>
                                    setSearchInputs((prev) => ({
                                        ...prev,
                                        answersViewersUser: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') searchUsers(searchInputs.answersViewersUser, 'answersViewersUser');
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() => searchUsers(searchInputs.answersViewersUser, 'answersViewersUser')}
                                icon="search"
                            />
                        </div>
                    </div>
                    <div className="row gy-2 mb-3">
                        {searchedOptions.answersViewersUser.map((u) => (
                            <div key={'answer-viewer-user-' + u.id + '-option'} className="col-6 col-md-4 col-lg-3">
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="answer-viewers-user"
                                    id={`answer-viewer-user-${u.id}`}
                                    className="form-check-input bg-grey"
                                    value={u.id}
                                    checked={protocol.answersViewersUser.includes(u.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setProtocol((prev) => ({
                                                ...prev,
                                                answersViewersUser: [...prev.answersViewersUser, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            unselectUser(parseInt(e.target.value), 'answersViewersUser');
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`answer-viewer-user-${u.id}`}
                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                >
                                    {u.username}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}
            {protocol.answersVisibility === 'RESTRICT' && (
                <fieldset>
                    <div className="row gx-2 gy-0">
                        <div className="col-12 col-xl-auto">
                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                Selecione os grupos que poderão visualizar as respostas do protocolo:
                            </p>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name="users-search"
                                value={searchInputs.answersViewersClassroom}
                                id="users-search"
                                placeholder="Buscar por nome do grupo"
                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                onChange={(e) => setSearchInputs({ answersViewersClassroom: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter')
                                        searchClassrooms(searchInputs.answersViewersClassroom, 'answersViewersClassroom');
                                }}
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() => searchClassrooms(searchInputs.answersViewersClassroom, 'answersViewersClassroom')}
                                icon="search"
                            />
                        </div>
                    </div>
                    <div className="row gy-2 mb-3">
                        {searchedOptions.answersViewersClassroom.map((c) => (
                            <div key={'answer-viewer-classroom-' + c.id + '-option'} className="col-6 col-md-4 col-lg-3">
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="answer-viewers-classroom"
                                    id={`answer-viewer-classroom-${c.id}`}
                                    className="form-check-input bg-grey"
                                    value={c.id}
                                    checked={protocol.answersViewersClassroom.includes(c.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            selectClassroom(parseInt(e.target.value), 'answersViewersClassroom');
                                        } else {
                                            setProtocol((prev) => ({
                                                ...prev,
                                                answersViewersClassroom: prev.answersViewersClassroom.filter(
                                                    (id) => id !== parseInt(e.target.value)
                                                ),
                                            }));
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`answer-viewer-classroom-${c.id}`}
                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                >
                                    {c.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}
        </div>
    );
}

export default CreateProtocolProperties;
