import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import RoundedButton from './RoundedButton';
import { serialize } from 'object-to-formdata';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import iconSearch from '../assets/images/iconSearch.svg';

function CreateProtocolProperties(props) {
    const { setSearchedOptions, searchedOptions, protocol, setProtocol, setSearchInputs, searchInputs } = props;

    const { showAlert } = useContext(AlertContext);
    const { user } = useContext(AuthContext);

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
            .catch((error) => {
                alert('Erro ao buscar usuários. ' + error.response?.data.message || '');
            });
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
            .catch((error) => {
                alert('Erro ao buscar grupos. ' + error.response?.data.message || '');
            });
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
            <label htmlFor="title" className="form-label color-steel-blue fs-5 fw-medium">
                Título do protocolo:
            </label>
            <input
                className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="title"
                type="text"
                value={protocol.title || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, title: event.target.value }))}
            ></input>
            <label htmlFor="description" className="form-label color-steel-blue fs-5 fw-medium">
                Descrição do protocolo:
            </label>
            <textarea
                className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="description"
                rows="6"
                value={protocol.description || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, description: event.target.value }))}
            ></textarea>
            <label htmlFor="enabled" className="form-label color-steel-blue fs-5 fw-medium">
                Habilitado:
            </label>
            <select
                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="enabled"
                value={protocol.enabled ? 'true' : 'false'}
                onChange={(event) => setProtocol((prev) => ({ ...prev, enabled: event.target.value === 'true' }))}
            >
                <option value="">Selecione...</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
            </select>
            <label htmlFor="visibility" className="form-label color-steel-blue fs-5 fw-medium">
                Visibilidade:
            </label>
            <select
                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="visibility"
                value={protocol.visibility || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, visibility: event.target.value }))}
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
                                icon={iconSearch}
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
                                icon={iconSearch}
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
            <label htmlFor="applicability" className="form-label color-steel-blue fs-5 fw-medium">
                Aplicabilidade:
            </label>
            <select
                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="applicability"
                value={protocol.applicability || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, applicability: event.target.value }))}
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
                                icon={iconSearch}
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
            <label htmlFor="answer-visiblity" className="form-label color-steel-blue fs-5 fw-medium">
                Visibilidade das respostas:
            </label>
            <select
                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="answer-visiblity"
                value={protocol.answersVisibility || ''}
                onChange={(event) => setProtocol((prev) => ({ ...prev, answersVisibility: event.target.value }))}
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
                                icon={iconSearch}
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
                                icon={iconSearch}
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
            <label htmlFor="replicable" className="form-label color-steel-blue fs-5 fw-medium">
                Replicabilidade:
            </label>
            <select
                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                id="replicable"
                value={protocol.replicable ? 'true' : 'false'}
                onChange={(event) => setProtocol((prev) => ({ ...prev, replicable: event.target.value === 'true' }))}
            >
                <option value="">Selecione...</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
            </select>
        </div>
    );
}

export default CreateProtocolProperties;
