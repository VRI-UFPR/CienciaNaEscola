import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import SplashPage from './SplashPage';
import ErrorPage from './ErrorPage';

function CreateUserPage(props) {
    const { institutionId, userId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);

    const [newUser, setNewUser] = useState({ institutionId, classrooms: [] });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [institutionClassrooms, setInstitutionClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && user.role !== 'ADMIN' && (user.role === 'USER' || user.institutionId !== parseInt(institutionId))) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para criar usuários nesta instituição' });
                return;
            } else if (isEditing && user.role !== 'ADMIN' && user.id !== parseInt(userId)) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar este usuário' });
                return;
            }
            const promises = [];
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/user/getUser/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setNewUser({
                                name: d.name,
                                username: d.username,
                                role: d.role,
                                hash: d.hash,
                                classrooms: d.classrooms.map((c) => c.id),
                            });
                        })
                        .catch((error) => {
                            setError({ text: 'Erro ao carregar criação de usuário', description: error.response?.data.message || '' });
                        })
                );
            }
            if (user.role !== 'USER') {
                promises.push(
                    axios
                        .get(`${baseUrl}api/institution/getInstitution/${institutionId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setInstitutionClassrooms(d.classrooms.map((c) => ({ id: c.id })));
                        })
                        .catch((error) => {
                            setError({ text: 'Erro ao carregar criação de usuário', description: error.response?.data.message || '' });
                        })
                );
            }
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [userId, isEditing, isLoading, user.token, institutionId, user.status, user.role, user.id, user.institutionId]);

    const submitNewUser = (e) => {
        e.preventDefault();
        const formData = serialize(newUser, { indices: true });
        if (isEditing) {
            axios
                .put(`${baseUrl}api/user/updateUser/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Usuário atualizado com sucesso');
                    navigate(`/dash/institutions/${institutionId}`);
                })
                .catch((error) => {
                    alert('Erro ao atualizar usuário. ' + error.response?.data.message || '');
                });
        } else {
            axios
                .post(`${baseUrl}api/user/createUser`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Usuário criado com sucesso');
                    navigate(`/dash/institutions/${institutionId}`);
                })
                .catch((error) => {
                    alert('Erro ao criar usuário. ' + error.response?.data.message || '');
                });
        }
    };

    const deleteUser = () => {
        axios
            .delete(`${baseUrl}api/user/deleteUser/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Usuário excluído com sucesso');
                navigate(`/dash/institutions/${institutionId}`);
            })
            .catch((error) => {
                alert('Erro ao excluir usuário. ' + error.response?.data.message || '');
            });
    };

    const generateRandomHash = () => {
        //Random hash with special chars and exactly 12 characters
        const randomHash = Array.from({ length: 12 }, () => String.fromCharCode(Math.floor(Math.random() * 93) + 33)).join('');
        setNewUser((prev) => ({ ...prev, hash: randomHash }));
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de usuário..." />;
    }

    return (
        <div>
            <form name="user-form" id="user-form" onSubmit={(e) => submitNewUser(e)}>
                <div>
                    <label label="name">Nome:</label>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name || ''}
                        form="user-form"
                        id="name"
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                </div>
                <div>
                    <label label="username">Nome de usuário:</label>
                    <input
                        type="text"
                        name="username"
                        value={newUser.username || ''}
                        form="user-form"
                        id="username"
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                </div>
                <div>
                    <label label="hash">Senha:</label>
                    <input
                        type={passwordVisibility ? 'text' : 'password'}
                        name="hash"
                        value={newUser.hash || ''}
                        form="user-form"
                        id="hash"
                        onChange={(e) => setNewUser({ ...newUser, hash: e.target.value })}
                    />
                    <button type="button" onClick={() => setPasswordVisibility((prev) => !prev)}>
                        Ver senha
                    </button>
                    <button type="button" onClick={generateRandomHash}>
                        Gerar senha
                    </button>
                </div>
                {(user.role === 'ADMIN' || !isEditing) && (
                    <div>
                        <label label="role">Selecione o papel do usuário</label>
                        <select
                            name="role"
                            id="role"
                            form="user-form"
                            onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value || undefined }))}
                            value={newUser.role || ''}
                        >
                            <option value="">Selecione uma opção:</option>
                            <option value="USER">Usuário</option>
                            {(user.role === 'ADMIN' || user.role === 'COORDINATOR') && <option value="APPLIER">Aplicador</option>}
                            {(user.role === 'ADMIN' || user.role === 'COORDINATOR') && <option value="PUBLISHER">Publicador</option>}
                            {user.role === 'ADMIN' && <option value="COORDINATOR">Coordenador</option>}
                        </select>
                    </div>
                )}
                {(user.role === 'ADMIN' || user.role === 'COORDINATOR' || !isEditing) && (
                    <div>
                        <fieldset>
                            <span>Selecione as salas de aula do usuário</span>
                            {institutionClassrooms.map((c) => (
                                <div key={c}>
                                    <input
                                        form="user-form"
                                        type="checkbox"
                                        name="classrooms"
                                        id={`classroom-${c.id}`}
                                        value={c.id}
                                        checked={newUser.classrooms.includes(c.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    classrooms: [...prev.classrooms, parseInt(e.target.value)],
                                                }));
                                            } else {
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    classrooms: prev.classrooms.filter((id) => id !== parseInt(e.target.value)),
                                                }));
                                            }
                                        }}
                                    />
                                    <label htmlFor={`classroom-${c.id}`}>{c.name}</label>
                                </div>
                            ))}
                        </fieldset>
                    </div>
                )}
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
            <div>
                <p>{JSON.stringify(newUser)}</p>
            </div>
            {isEditing && (
                <div>
                    <button type="button" onClick={deleteUser}>
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}

export default CreateUserPage;
