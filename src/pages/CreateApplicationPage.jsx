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
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            if (isEditing) {
                if (user.token) {
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
                        });
                }
            } else {
                setIsLoading(false);
            }
        }
    }, [id, isEditing, isLoading, user.token]);

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
                    <button
                        type="button"
                        onClick={() => setApplication((prev) => ({ ...prev, viewersUser: [...(prev.viewersUser || []), ''] }))}
                    >
                        Adicionar usuário visualizador
                    </button>
                </div>
                <div>
                    {application.viewersUser &&
                        application.viewersUser.map((viewer, index) => (
                            <div key={'viewer-user-' + index}>
                                <label label={`viewer-user-${index}`}>Digite o id do usuário {index + 1}</label>
                                <input
                                    type="number"
                                    name={`viewer-user-${index}`}
                                    id={`viewer-user-${index}`}
                                    form="application-form"
                                    value={viewer || ''}
                                    onChange={(e) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            viewersUser: prev.viewersUser.map((v, i) => (i === index ? parseInt(e.target.value) : v)),
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setApplication((prev) => ({ ...prev, viewersUser: prev.viewersUser.filter((v, i) => i !== index) }))
                                    }
                                >
                                    Remover visualizador
                                </button>
                            </div>
                        ))}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => setApplication((prev) => ({ ...prev, viewersClassroom: [...(prev.viewersClassroom || []), ''] }))}
                    >
                        Adicionar sala de aula visualizadora
                    </button>
                </div>
                <div>
                    {application.viewersClassroom &&
                        application.viewersClassroom.map((viewer, index) => (
                            <div key={'viewer-classroom-' + index}>
                                <label label={`viewer-classroom-${index}`}>Digite o id do usuário {index + 1}</label>
                                <input
                                    type="number"
                                    name={`viewer-classroom-${index}`}
                                    id={`viewer-classroom-${index}`}
                                    value={viewer || ''}
                                    onChange={(e) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            viewersClassroom: prev.viewersClassroom.map((v, i) =>
                                                i === index ? parseInt(e.target.value) : v
                                            ),
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            viewersClassroom: prev.viewersClassroom.filter((v, i) => i !== index),
                                        }))
                                    }
                                >
                                    Remover visualizador
                                </button>
                            </div>
                        ))}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            setApplication((prev) => ({ ...prev, answersViewersUser: [...(prev.answersViewersUser || []), ''] }))
                        }
                    >
                        Adicionar usuário visualizador de resposta
                    </button>
                </div>
                <div>
                    {application.answersViewersUser &&
                        application.answersViewersUser.map((viewer, index) => (
                            <div key={'answer-viewer-user-' + index}>
                                <label label={`viewer-user-${index}`}>Digite o id do usuário {index + 1}</label>
                                <input
                                    type="number"
                                    name={`answer-viewer-user-${index}`}
                                    id={`answer-viewer-user-${index}`}
                                    value={viewer || ''}
                                    onChange={(e) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            answersViewersUser: prev.answersViewersUser.map((v, i) =>
                                                i === index ? parseInt(e.target.value) : v
                                            ),
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            answersViewersUser: prev.answersViewersUser.filter((v, i) => i !== index),
                                        }))
                                    }
                                >
                                    Remover visualizador
                                </button>
                            </div>
                        ))}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            setApplication((prev) => ({ ...prev, answersViewersClassroom: [...(prev.answersViewersClassroom || []), ''] }))
                        }
                    >
                        Adicionar sala de aula visualizadora de resposta
                    </button>
                </div>
                <div>
                    {application.answersViewersClassroom &&
                        application.answersViewersClassroom.map((viewer, index) => (
                            <div key={'answer-viewer-classroom-' + index}>
                                <label label={`viewer-classroom-${index}`}>Digite o id do usuário {index + 1}</label>
                                <input
                                    type="number"
                                    name={`answer-viewer-classroom-${index}`}
                                    id={`answer-viewer-classroom-${index}`}
                                    value={viewer || ''}
                                    onChange={(e) =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            answersViewersClassroom: prev.answersViewersClassroom.map((v, i) =>
                                                i === index ? parseInt(e.target.value) : v
                                            ),
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setApplication((prev) => ({
                                            ...prev,
                                            answersViewersClassroom: prev.answersViewersClassroom.filter((v, i) => i !== index),
                                        }))
                                    }
                                >
                                    Remover visualizador
                                </button>
                            </div>
                        ))}
                </div>
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
            <p>{JSON.stringify(application, null, 2)}</p>
        </div>
    );
}

export default CreateApplicationPage;
