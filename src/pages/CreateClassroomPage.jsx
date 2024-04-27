import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { serialize } from 'object-to-formdata';

function CreateClassroomPage(props) {
    const { id: institutionId, classroomId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);

    const [classroom, setClassroom] = useState({ institutionId: institutionId, users: [] });
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            if (isEditing) {
                if (user.token) {
                    axios
                        .get(`${baseUrl}api/classroom/getClassroom/${classroomId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setClassroom({ users: d.users.map((u) => u.id) });
                            setIsLoading(false);
                        })
                        .catch((error) => {
                            alert('Erro ao buscar sala de aula');
                        });
                }
            } else {
                setIsLoading(false);
            }
        }
    }, [classroomId, isEditing, isLoading, user.token]);

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
                    alert('Erro ao atualizar sala de aula');
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
                    alert('Erro ao criar sala de aula');
                });
        }
    };

    return (
        <div>
            <form name="classroom-form" id="classroom-form" onSubmit={(e) => submitClassroom(e)}>
                <div>
                    <button type="button" onClick={(e) => setClassroom((prev) => ({ ...prev, users: [...(prev.users || []), ''] }))}>
                        Adicionar usuário
                    </button>
                    {classroom.users &&
                        classroom.users.map((user, index) => (
                            <div key={'classroom-user-' + index}>
                                <label label={`classroom-user-${index}`}>Digite o id do usuário {index + 1}</label>
                                <input
                                    type="number"
                                    name={`classroom-user-${index}`}
                                    id={`classroom-user-${index}`}
                                    form="classroom-form"
                                    value={user || ''}
                                    onChange={(e) =>
                                        setClassroom((prev) => ({
                                            ...prev,
                                            users: prev.users.map((v, i) => (i === index ? parseInt(e.target.value) : v)),
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setClassroom((prev) => ({ ...prev, users: prev.users.filter((v, i) => i !== index) }))}
                                >
                                    Remover usuário
                                </button>
                            </div>
                        ))}
                </div>
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default CreateClassroomPage;
