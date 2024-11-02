/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';
import SplashPage from './SplashPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import { AlertContext } from '../contexts/AlertContext';
import RoundedButton from '../components/RoundedButton';
import iconSearch from '../assets/images/iconSearch.svg';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
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

    .bg-light-pastel-blue{
        background-color: #b8d7e3;
    }

    .bg-light-pastel-blue:focus{
        background-color: #b8d7e3;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .bg-light-grey:focus{
        background-color: #D9D9D9;
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

function CreateClassroomPage(props) {
    const { institutionId, classroomId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const formRef = useRef(null);

    const [classroom, setClassroom] = useState({ institutionId: institutionId, users: [] });
    const [institutionUsers, setInstitutionUsers] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (
                !isEditing &&
                user.role !== 'ADMIN' &&
                (user.role === 'USER' || (institutionId && user.institutionId !== parseInt(institutionId)))
            ) {
                setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para criar grupos nesta instituição',
                });
                return;
            } else if (
                isEditing &&
                user.role !== 'ADMIN' &&
                (user.role === 'USER' || user.role === 'APPLIER' || (institutionId && user.institutionId !== parseInt(institutionId)))
            ) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar este grupo' });
                return;
            }
            setClassroom((prev) => ({ ...prev, institutionId: institutionId || user.institutionId }));
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
                            setClassroom({
                                name: d.name,
                                users: d.users.map((u) => u.id),
                                institutionId: d.institution?.id,
                            });
                            setSearchedUsers(d.users.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })));
                        })
                        .catch((error) => {
                            showAlert({
                                title: 'Erro ao buscar sala de aula.',
                                description: error.response?.data.message,
                                dismissHsl: [97, 43, 70],
                                dismissText: 'Ok',
                                dismissible: true,
                            });
                        })
                );
            }
            if (institutionId || user.institutionId) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/institution/getInstitution/${institutionId || user.institutionId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setInstitutionUsers(d.users.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })));
                        })
                        .catch((error) => {
                            showAlert({
                                title: 'Erro ao buscar usuários da instituição.',
                                description: error.response?.data.message,
                                dismissHsl: [97, 43, 70],
                                dismissText: 'Ok',
                                dismissible: true,
                            });
                        })
                );
            }
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [classroomId, isEditing, isLoading, user.token, institutionId, user.status, user.role, user.institutionId, showAlert]);

    const searchUsers = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${baseUrl}api/user/searchUserByUsername`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const d = response.data.data;
                const newUsers = [
                    ...d
                        .filter((u) => !classroom.users.includes(u.id))
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedUsers.filter((u) => classroom.users.includes(u.id)).sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedUsers(newUsers);
            })
            .catch((error) => {
                alert('Erro ao buscar usuários. ' + error.response?.data.message || '');
            });
    };

    const showInstitutionUsers = () => {
        const newUsers = institutionUsers.filter((c) => !classroom.users.includes(c.id));
        const concatenedUsers = [
            ...newUsers,
            ...searchedUsers.filter((c) => classroom.users.includes(c.id)).sort((a, b) => a.username.localeCompare(b.username)),
        ];
        setSearchedUsers(concatenedUsers);
        setUserSearchTerm('');
    };

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
                    showAlert({
                        title: 'Grupo atualizado com sucesso.',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                        onHide: () => {
                            navigate(`/dash/institutions/my`);
                        },
                    });
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao atualizar grupo.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
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
                    showAlert({
                        title: 'Grupo criado com sucesso.',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                        onHide: () => {
                            navigate(`/dash/institutions/my`);
                        },
                    });
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao criar grupo.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
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
                showAlert({
                    title: 'Grupo excluído com sucesso.',
                    dismissHsl: [97, 43, 70],
                    dismissText: 'Ok',
                    dismissible: true,
                    onHide: () => {
                        navigate(`/dash/institutions/my`);
                    },
                });
            })
            .catch((error) => {
                showAlert({
                    title: 'Erro ao excluir grupo.',
                    description: error.response?.data.message,
                    dismissHsl: [97, 43, 70],
                    dismissText: 'Ok',
                    dismissible: true,
                });
            });
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de grupo..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column overflow-x-hidden overflow-y-scroll h-100 p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow gx-0">
                        <div className="col-12 col-md-10">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0 p-4 pb-3">
                                {isEditing ? 'Editar' : 'Criar'} grupo
                            </h1>
                        </div>
                    </div>
                    <div className="row justify-content-center flex-grow-1 font-barlow gx-0">
                        <div className="col col-md-10 d-flex flex-column h-100 px-4">
                            <form
                                name="classroom-form"
                                id="classroom-form"
                                ref={formRef}
                                action="/submit"
                                onSubmit={(e) => submitClassroom(e)}
                            >
                                <div>
                                    <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                        Nome do grupo:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={classroom.name || ''}
                                        form="classroom-form"
                                        id="name"
                                        className="form-control bg-light-pastel-blue fs-5 border-0 rounded-4 mb-3"
                                        onChange={(e) => setClassroom({ ...classroom, name: e.target.value })}
                                    />
                                </div>
                                {(institutionId || user.institutionId) && (
                                    <div className="form-check form-switch fs-5 mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="enabled"
                                            checked={classroom.institutionId === (institutionId || user.institutionId)}
                                            onChange={(event) =>
                                                setClassroom((prev) => ({
                                                    ...prev,
                                                    institutionId: event.target.checked ? institutionId || user.institutionId : undefined,
                                                }))
                                            }
                                        />
                                        <label className="form-check-label color-steel-blue fs-5 fw-medium me-2" htmlFor="enabled">
                                            Pertencente à minha instituição
                                        </label>
                                    </div>
                                )}
                                <div>
                                    <fieldset>
                                        <div className="row gx-2 gy-0 mb-2">
                                            <div className="col-12 col-md-auto">
                                                <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                    Selecione os alunos do grupo:
                                                </p>
                                            </div>
                                            <div className="col">
                                                <input
                                                    type="text"
                                                    name="users-search"
                                                    value={userSearchTerm || ''}
                                                    id="users-search"
                                                    placeholder="Buscar por nome de usuário"
                                                    className="form-control form-control-sm color-grey bg-light-grey fw-medium border-0 rounded-4 mb-3"
                                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') searchUsers(userSearchTerm);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <RoundedButton
                                                    hsl={[197, 43, 52]}
                                                    onClick={() => searchUsers(userSearchTerm)}
                                                    icon={iconSearch}
                                                />
                                            </div>
                                        </div>
                                        <div className="row gy-2 gx-1 mb-3">
                                            {searchedUsers.map((u) => (
                                                <div key={u.id} className="col-6 col-md-4 col-xl-3">
                                                    <div className="form-check">
                                                        <input
                                                            form="classroom-form"
                                                            type="checkbox"
                                                            name="users"
                                                            id={`user-${u.id}`}
                                                            className="form-check-input bg-grey"
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
                                                        <label
                                                            htmlFor={`user-${u.id}`}
                                                            className="font-barlow color-grey text-break fw-medium fs-6"
                                                        >
                                                            {u.username}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {(institutionId || user.institutionId) && (
                                            <div>
                                                <TextButton
                                                    className="fs-6 w-auto p-2 py-0"
                                                    hsl={[190, 46, 70]}
                                                    text={`Ver usuários da instituição`}
                                                    onClick={showInstitutionUsers}
                                                />
                                            </div>
                                        )}
                                    </fieldset>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row justify-content-center font-barlow gx-0 mt-4">
                        <div className="col col-md-10 d-flex flex-column h-100 px-4">
                            <div className="row justify-content-center justify-content-md-start gx-2 gy-4 mb-4">
                                <div className="col-3 col-md-2">
                                    <TextButton
                                        text={isEditing ? 'Concluir' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={() => {
                                            showAlert({
                                                title: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} o grupo?`,
                                                dismissHsl: [355, 78, 66],
                                                dismissText: 'Não',
                                                actionHsl: [97, 43, 70],
                                                actionText: 'Sim',
                                                dismissible: true,
                                                actionOnClick: () => {
                                                    formRef.current.requestSubmit();
                                                },
                                            });
                                        }}
                                    />
                                </div>
                                {isEditing && (
                                    <div className="col-3 col-md-2">
                                        <TextButton
                                            text={'Excluir'}
                                            hsl={[355, 78, 66]}
                                            onClick={() => {
                                                showAlert({
                                                    title: `Tem certeza que deseja excluir o grupo?`,
                                                    dismissHsl: [355, 78, 66],
                                                    dismissText: 'Não',
                                                    actionHsl: [97, 43, 70],
                                                    actionText: 'Sim',
                                                    dismissible: true,
                                                    actionOnClick: () => {
                                                        deleteClassroom();
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default CreateClassroomPage;
