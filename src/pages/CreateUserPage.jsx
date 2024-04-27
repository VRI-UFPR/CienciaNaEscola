import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';

function CreateUserPage(props) {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [newUser, setNewUser] = useState({ institutionId: id, classrooms: [] });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const navigate = useNavigate();

    const submitNewUser = (e) => {
        e.preventDefault();
        const formData = serialize(newUser, { indices: true });
        axios
            .post(`${baseUrl}api/user/createUser`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Usuário criado com sucesso');
                navigate(`/dash/institutions/${id}`);
            })
            .catch((error) => {
                alert('Erro ao criar usuário');
            });
    };

    const generateRandomHash = () => {
        //Random hash with special chars and exactly 12 characters
        const randomHash = Array.from({ length: 12 }, () => String.fromCharCode(Math.floor(Math.random() * 93) + 33)).join('');
        setNewUser((prev) => ({ ...prev, hash: randomHash }));
    };

    return (
        <div>
            <form name="user-form" id="user-form" onSubmit={(e) => submitNewUser(e)}>
                <div>
                    <label label="name">Nome:</label>
                    <input
                        type="text"
                        name="name"
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
                        form="user-form"
                        id="hash"
                        value={newUser.hash || ''}
                        onChange={(e) => setNewUser({ ...newUser, hash: e.target.value })}
                    />
                    <button type="button" onClick={() => setPasswordVisibility((prev) => !prev)}>
                        Ver senha
                    </button>
                    <button type="button" onClick={generateRandomHash}>
                        Gerar senha
                    </button>
                </div>
                <div>
                    <label label="role">Selecione a visibilidade da aplicação</label>
                    <select
                        name="role"
                        id="role"
                        form="user-form"
                        onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value || undefined }))}
                    >
                        <option value="">Selecione uma opção:</option>
                        <option value="USER">Usuário</option>
                        <option value="APPLIER">Aplicador</option>
                        <option value="PUBLISHER">Publicador</option>
                    </select>
                </div>
                <div>
                    <button type="button" onClick={() => setNewUser((prev) => ({ ...prev, classrooms: [...(prev.classrooms || []), ''] }))}>
                        Adicionar sala de aula
                    </button>
                </div>
                <div>
                    {newUser.classrooms &&
                        newUser.classrooms.map((classroom, index) => (
                            <div key={'classroom-' + index}>
                                <label label={`classroom-${index}`}>Digite o id do usuário {index + 1}</label>
                                <input
                                    type="number"
                                    name={`classroom-${index}`}
                                    id={`classroom-${index}`}
                                    form="user-form"
                                    value={classroom || ''}
                                    onChange={(e) =>
                                        setNewUser((prev) => ({
                                            ...prev,
                                            classrooms: prev.classrooms.map((v, i) => (i === index ? parseInt(e.target.value) : v)),
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNewUser((prev) => ({ ...prev, classrooms: prev.classrooms.filter((v, i) => i !== index) }))
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
            <p>{JSON.stringify(newUser)}</p>
        </div>
    );
}

export default CreateUserPage;
