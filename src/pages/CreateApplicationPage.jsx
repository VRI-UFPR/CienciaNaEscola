import axios from 'axios';
import { serialize } from 'object-to-formdata';
import React, { useContext, useEffect, useState } from 'react';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

function CreateApplicationPage(props) {
    const { id } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);

    const [application, setApplication] = useState({
        protocolId: id,
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
    });
    const [institutionUsers, setInstitutionUsers] = useState([]);
    const [institutionClassrooms, setInstitutionClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.token) {
            const promises = [];
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/application/getApplication/${id}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setApplication({
                                visibility: d.visibility,
                                answersVisibility: d.answersVisibility,
                                viewersUser: d.viewersUser.map((v) => v.id),
                                viewersClassroom: d.viewersClassroom.map((v) => v.id),
                                answersViewersUser: d.answersViewersUser.map((v) => v.id),
                                answersViewersClassroom: d.answersViewersClassroom.map((v) => v.id),
                            });
                        })
                        .catch((error) => {
                            alert('Erro ao buscar aplicação');
                        })
                );
            }
            promises.push(
                axios
                    .get(`${baseUrl}api/institution/getInstitution/${user.institutionId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setInstitutionUsers(d.users.map((u) => ({ id: u.id, username: u.username })));
                    })
                    .catch((error) => {
                        alert('Erro ao buscar usuários da instituição');
                    })
            );
            promises.push(
                axios
                    .get(`${baseUrl}api/institution/getInstitution/${user.institutionId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setInstitutionClassrooms(d.classrooms.map((c) => ({ id: c.id })));
                    })
                    .catch((error) => {
                        alert('Erro ao buscar salas de aula da instituição');
                    })
            );
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [id, isEditing, isLoading, user.token, user.institutionId]);

    const submitApplication = (e) => {
        e.preventDefault();
        const formData = serialize(application, { indices: true });
        if (isEditing) {
            axios
                .put(`${baseUrl}api/application/updateApplication/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Aplicação atualizada com sucesso');
                    navigate(`/dash/applications/${response.data.data.id}`);
                })
                .catch((error) => {
                    alert('Erro ao atualizarr aplicação');
                });
        } else {
            axios
                .post(`${baseUrl}api/application/createApplication`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Aplicação criada com sucesso');
                    navigate(`/dash/applications/${response.data.data.id}`);
                })
                .catch((error) => {
                    alert('Erro ao criar aplicação');
                });
        }
    };

    const deleteApplication = () => {
        axios
            .delete(`${baseUrl}api/application/deleteApplication/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Aplicação excluída com sucesso');
                navigate(`/dash/applications/`);
            })
            .catch((error) => {
                alert('Erro ao excluir aplicação');
            });
    };

    return (
        <div>
            <form name="application-form" id="application-form" onSubmit={(e) => submitApplication(e)}>
                <div>
                    <label label="visibility">Selecione a visibilidade da aplicação</label>
                    <select
                        name="visibility"
                        value={application.visibility || ''}
                        id="visibility"
                        form="application-form"
                        onChange={(e) => setApplication((prev) => ({ ...prev, visibility: e.target.value || undefined }))}
                    >
                        <option value="">Selecione uma opção:</option>
                        <option value="PUBLIC">Visível para todos</option>
                        <option value="RESTRICT">Restringir visualizadores</option>
                    </select>
                </div>
                <div>
                    <label label="answer-visibility">Selecione a visibilidade das respostas da aplicação</label>
                    <select
                        name="answer-visibility"
                        value={application.answersVisibility || ''}
                        id="answer-visibility"
                        form="application-form"
                        onChange={(e) => setApplication((prev) => ({ ...prev, answersVisibility: e.target.value || undefined }))}
                    >
                        <option value="">Selecione uma opção:</option>
                        <option value="PUBLIC">Visível para todos</option>
                        <option value="RESTRICT">Restringir visualizadores</option>
                    </select>
                </div>
                <div>
                    <fieldset>
                        <span>Selecione os usuários visualizadores</span>
                        {institutionUsers.map((u) => (
                            <div key={'viewer-user-' + u.id}>
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="viewers-user"
                                    id={`viewer-user-${u.id}`}
                                    value={u.id}
                                    checked={application.viewersUser.includes(u.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setApplication((prev) => ({
                                                ...prev,
                                                viewersUser: [...prev.viewersUser, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            setApplication((prev) => ({
                                                ...prev,
                                                viewersUser: prev.viewersUser.filter((id) => id !== parseInt(e.target.value)),
                                            }));
                                        }
                                    }}
                                />
                                <label htmlFor={`viewer-user-${u.id}`}>{u.username}</label>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div>
                    <fieldset>
                        <span>Selecione as salas de aula visualizadoras</span>
                        {institutionClassrooms.map((c) => (
                            <div key={'viewer-classroom-' + c.id}>
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="viewers-classroom"
                                    id={`viewer-classroom-${c.id}`}
                                    value={c.id}
                                    checked={application.viewersClassroom.includes(c.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setApplication((prev) => ({
                                                ...prev,
                                                viewersClassroom: [...prev.viewersClassroom, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            setApplication((prev) => ({
                                                ...prev,
                                                viewersClassroom: prev.viewersClassroom.filter((id) => id !== parseInt(e.target.value)),
                                            }));
                                        }
                                    }}
                                />
                                <label htmlFor={`viewer-classroom-${c.id}`}>{c.id}</label>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div>
                    <fieldset>
                        <span>Selecione os usuários visualizadores de resposta</span>
                        {institutionUsers.map((u) => (
                            <div key={'answer-viewer-user-' + u.id}>
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="answer-viewers-user"
                                    id={`answer-viewer-user-${u.id}`}
                                    value={u.id}
                                    checked={application.answersViewersUser.includes(u.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setApplication((prev) => ({
                                                ...prev,
                                                answersViewersUser: [...prev.answersViewersUser, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            setApplication((prev) => ({
                                                ...prev,
                                                answersViewersUser: prev.answersViewersUser.filter((id) => id !== parseInt(e.target.value)),
                                            }));
                                        }
                                    }}
                                />
                                <label htmlFor={`answer-viewer-user-${u.id}`}>{u.username}</label>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div>
                    <fieldset>
                        <span>Selecione as salas de aula visualizadoras de resposta</span>
                        {institutionClassrooms.map((c) => (
                            <div key={'answer-viewer-classroom-' + c.id}>
                                <input
                                    form="application-form"
                                    type="checkbox"
                                    name="answer-viewers-classroom"
                                    id={`answer-viewer-classroom-${c.id}`}
                                    value={c.id}
                                    checked={application.answersViewersClassroom.includes(c.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setApplication((prev) => ({
                                                ...prev,
                                                answersViewersClassroom: [...prev.answersViewersClassroom, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            setApplication((prev) => ({
                                                ...prev,
                                                answersViewersClassroom: prev.answersViewersClassroom.filter(
                                                    (id) => id !== parseInt(e.target.value)
                                                ),
                                            }));
                                        }
                                    }}
                                />
                                <label htmlFor={`answer-viewer-classroom-${c.id}`}>{c.id}</label>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
            <div>
                <p>{JSON.stringify(application, null, 2)}</p>
            </div>
            <div>
                <button type="button" onClick={deleteApplication}>
                    Excluir
                </button>
            </div>
        </div>
    );
}

export default CreateApplicationPage;
