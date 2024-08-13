import axios from 'axios';
import { serialize } from 'object-to-formdata';
import React, { useContext, useEffect, useState } from 'react';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import SplashPage from './SplashPage';

function CreateApplicationPage(props) {
    const { applicationId, protocolId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);

    const [application, setApplication] = useState({
        protocolId: protocolId,
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
    });

    const [protocolVisibility, setProtocolVisibility] = useState([]);
    const [protocolAnswersVisibility, setProtocolAnswersVisibility] = useState([]);
    const [viewersUser, setViewersUser] = useState([]);
    const [viewersClassroom, setViewersClassroom] = useState([]);
    const [answersViewersUser, setAnswersViewersUser] = useState([]);
    const [answersViewersClassroom, setAnswersViewersClassroom] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && user.role === 'USER') {
                setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para criar aplicações',
                });
                return;
            } else if (isEditing && user.role === 'USER') {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar esta aplicação' });
                return;
            }
            const promises = [];
            let reqProtocolId = protocolId;
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/application/getApplication/${applicationId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            reqProtocolId = d.protocol.id;
                            if (d.applier.id !== user.id && user.role !== 'ADMIN') {
                                setError({
                                    text: 'Operação não permitida',
                                    description: 'Você não tem permissão para editar esta aplicação',
                                });
                                return;
                            }
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
                            alert('Erro ao buscar aplicação. ' + error.response?.data.message || '');
                        })
                );
            }
            Promise.all(promises).then(() => {
                axios
                    .get(`${baseUrl}api/protocol/getProtocol/${reqProtocolId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setViewersUser(d.viewersUser.map((u) => ({ id: u.id, username: u.username })));
                        setViewersClassroom(d.viewersClassroom.map((c) => ({ id: c.id, name: c.name })));
                        setAnswersViewersUser(d.answersViewersUser.map((u) => ({ id: u.id, username: u.username })));
                        setAnswersViewersClassroom(d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name })));
                        setProtocolVisibility(d.visibility);
                        setProtocolAnswersVisibility(d.answersVisibility);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        alert('Erro ao buscar visualizadores do protocolo. ' + error.response?.data.message || '');
                    });
            });
        }
    }, [isEditing, isLoading, user.status, user.institutionId, user.token, user.role, applicationId, protocolId, user.id]);

    const submitApplication = (e) => {
        e.preventDefault();
        const formData = serialize(application, { indices: true });
        if (isEditing) {
            axios
                .put(`${baseUrl}api/application/updateApplication/${applicationId}`, formData, {
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
                    alert('Erro ao atualizar aplicação. ' + error.response?.data.message || '');
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
                    alert('Erro ao criar aplicação. ' + error.response?.data.message || '');
                });
        }
    };

    const deleteApplication = () => {
        axios
            .delete(`${baseUrl}api/application/deleteApplication/${applicationId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Aplicação excluída com sucesso');
                navigate(`/dash/applications/`);
            })
            .catch((error) => {
                alert('Erro ao excluir aplicação. ' + error.response?.data.message || '');
            });
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de instituição..." />;
    }

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
                        {protocolVisibility === 'PUBLIC' && <option value="PUBLIC">Visível para todos</option>}
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
                        {protocolAnswersVisibility === 'PUBLIC' && <option value="PUBLIC">Visível para todos</option>}
                        <option value="RESTRICT">Restringir visualizadores</option>
                    </select>
                </div>
                <div>
                    <fieldset>
                        <span>Selecione os usuários visualizadores</span>
                        {viewersUser.map((u) => (
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
                        <span>Selecione os grupos visualizadores</span>
                        {viewersClassroom.map((c) => (
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
                                <label htmlFor={`viewer-classroom-${c.id}`}>{c.name}</label>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div>
                    <fieldset>
                        <span>Selecione os usuários visualizadores de resposta</span>
                        {answersViewersUser.map((u) => (
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
                        <span>Selecione os grupos visualizadores de resposta</span>
                        {answersViewersClassroom.map((c) => (
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
                                <label htmlFor={`answer-viewer-classroom-${c.id}`}>{c.name}</label>
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
            {isEditing && (
                <div>
                    <button type="button" onClick={deleteApplication}>
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}

export default CreateApplicationPage;
