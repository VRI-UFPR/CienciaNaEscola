import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';
import SplashPage from './SplashPage';

function CreateClassroomPage(props) {
    const { institutionId, classroomId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);

    const [classroom, setClassroom] = useState({ institutionId: institutionId, users: [] });
    const [institutionUsers, setInstitutionUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && user.role !== 'ADMIN' && (user.role === 'USER' || user.institutionId !== parseInt(institutionId))) {
                setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para criar salas de aula nesta instituição',
                });
                return;
            } else if (
                isEditing &&
                user.role !== 'ADMIN' &&
                (user.role === 'USER' || user.role === 'APPLIER' || user.institutionId !== parseInt(institutionId))
            ) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar esta sala de aula' });
                return;
            }
            const promises = [];
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/classroom/getClassroom/${classroomId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setClassroom({ users: d.users.map((u) => u.id) });
                        })
                        .catch((error) => {
                            alert('Erro ao buscar sala de aula. ' + error.response?.data.message || '');
                        })
                );
            }
            promises.push(
                axios
                    .get(`${baseUrl}api/institution/getInstitution/${institutionId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setInstitutionUsers(d.users.map((u) => ({ id: u.id, username: u.username })));
                    })
                    .catch((error) => {
                        alert('Erro ao buscar usuários da instituição. ' + error.response?.data.message || '');
                    })
            );
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [classroomId, isEditing, isLoading, user.token, institutionId, user.status, user.role, user.institutionId]);

    const submitClassroom = (e) => {
        e.preventDefault();
        const formData = serialize(classroom, { indices: true });
        if (isEditing) {
            axios
                .put(`${baseUrl}api/classroom/updateClassroom/${classroomId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Sala de aula atualizada com sucesso');
                    navigate(`/dash/institutions/${institutionId}`);
                })
                .catch((error) => {
                    alert('Erro ao atualizar sala de aula. ' + error.response?.data.message || '');
                });
        } else {
            axios
                .post(`${baseUrl}api/classroom/createClassroom`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Sala de aula criada com sucesso');
                    navigate(`/dash/institutions/${institutionId}`);
                })
                .catch((error) => {
                    alert('Erro ao criar sala de aula. ' + error.response?.data.message || '');
                });
        }
    };

    const deleteClassroom = () => {
        axios
            .delete(`${baseUrl}api/classroom/deleteClassroom/${classroomId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Sala de aula excluída com sucesso');
                navigate(`/dash/institutions/${institutionId}`);
            })
            .catch((error) => {
                alert('Erro ao excluir sala de aula. ' + error.response?.data.message || '');
            });
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de sala de aula..." />;
    }

    return (
        <div>
            <form name="classroom-form" id="classroom-form" onSubmit={(e) => submitClassroom(e)}>
                <div>
                    <fieldset>
                        <span>Selecione os alunos da sala</span>
                        {institutionUsers.map((u) => (
                            <div key={u.id}>
                                <input
                                    form="classroom-form"
                                    type="checkbox"
                                    name="users"
                                    id={`user-${u.id}`}
                                    value={u.id}
                                    checked={classroom.users.includes(u.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setClassroom((prev) => ({
                                                ...prev,
                                                users: [...prev.users, parseInt(e.target.value)],
                                            }));
                                        } else {
                                            setClassroom((prev) => ({
                                                ...prev,
                                                users: prev.users.filter((id) => id !== parseInt(e.target.value)),
                                            }));
                                        }
                                    }}
                                />
                                <label htmlFor={`user-${u.id}`}>{u.username}</label>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
            <div>
                <p>{JSON.stringify(classroom)}</p>
            </div>
            {isEditing && (
                <div>
                    <button type="button" onClick={deleteClassroom}>
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}

export default CreateClassroomPage;
