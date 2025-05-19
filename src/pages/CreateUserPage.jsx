/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import SplashPage from './SplashPage';
import ErrorPage from './ErrorPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import BlankProfilePic from '../assets/images/blankProfile.jpg';
import RoundedButton from '../components/RoundedButton';
import { AlertContext } from '../contexts/AlertContext';
import CustomContainer from '../components/CustomContainer';
import { hashSync } from 'bcryptjs';

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

    .bg-light-pastel-blue,
    .bg-light-pastel-blue:focus,
    .bg-light-pastel-blue:active {
        background-color: #b8d7e3;
        border-color: #b8d7e3;
    }

    .bg-light-pastel-blue:focus,
    .bg-light-pastel-blue:active,
    .bg-light-grey:focus,
    .bg-light-grey:active {
        box-shadow: inset 0px 4px 4px 0px #00000040;
    }

    .bg-light-pastel-blue:disabled,
    .bg-light-grey:disabled {
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
    }

    .bg-light-grey,
    .bg-light-grey:focus,
    .bg-light-grey:active {
        background-color: #D9D9D9;
        border-color: #D9D9D9;
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

    .profile-figure {
        max-width: 170px;
        border: 8px solid #4E9BB9;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
    }

    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
`;

/**
 * Página para criação ou edição de usuários.
 * @param {Object} props - Propriedades do componente.
 * @param {boolean} props.isEditing - Indica se está editando um usuário existente.
 */
function CreateUserPage(props) {
    const { userId } = useParams();
    const { isEditing } = props;
    const { user, renewUser, logout } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const formRef = useRef(null);
    const profilePicRef = useRef(null);

    const [newUser, setNewUser] = useState({ institutionId: undefined, classrooms: [] });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [institutionClassrooms, setInstitutionClassrooms] = useState(undefined);
    const [searchedClassrooms, setSearchedClassrooms] = useState([]);
    const [classroomSearchTerm, setClassroomSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateUserInstitution, setUpdateUserInstitution] = useState(true);

    const navigate = useNavigate();

    /** Carrega dados iniciais para criação ou edição do usuário. */
    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && user.role === 'USER')
                return setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para criar usuários nesta instituição',
                });
            if (isEditing && user.role === 'ADMIN' && user.id === Number(userId)) {
                return setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para editar este usuário.',
                });
            }
            const promises = [];
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${process.env.REACT_APP_API_URL}api/user/getUser/${userId || user.id}`, {
                            headers: { Authorization: `Bearer ${user.token}` },
                        })
                        .then((response) => {
                            const { name, username, role, classrooms, profileImageId, profileImage, institution, actions } =
                                response.data.data;
                            if (actions.toUpdate !== true)
                                return Promise.reject({
                                    text: 'Operação não permitida',
                                    description: 'Você não tem permissão para editar este usuário',
                                });
                            const ids = classrooms.map(({ id }) => id);
                            setNewUser({
                                name,
                                username,
                                role,
                                classrooms: ids,
                                profileImageId,
                                profileImage,
                                institutionId: institution?.id,
                                actions,
                            });
                            setSearchedClassrooms(classrooms.map(({ id, name, users }) => ({ id, name, users })));
                            if (!user.institutionId || user.role === 'ADMIN' || user.username === username) setUpdateUserInstitution(false);
                        })
                        .catch((error) =>
                            Promise.reject(
                                error.text
                                    ? error
                                    : {
                                          text: 'Erro ao obter informações do usuário',
                                          description: error.response?.data.message || '',
                                      }
                            )
                        )
                );
            }
            Promise.all(promises)
                .then(() => {
                    if (!user.institutionId || user.role === 'ADMIN') setUpdateUserInstitution(false);
                    setIsLoading(false);
                })
                .catch((error) => setError(error));
        }
    }, [userId, isEditing, isLoading, user.token, user.status, user.role, user.id, user.institutionId, user.username]);

    /**
     * Busca salas por nome a partir do termo digitado.
     * @param {string} term - Termo de busca.
     */
    const searchClassrooms = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/classroom/searchClassroomByName`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            })
            .then((response) =>
                concatenateClassrooms(response.data.data.map(({ id, name, users, institution }) => ({ id, name, users, institution })))
            )
            .catch((error) => showAlert({ headerText: 'Erro ao buscar grupos.', bodyText: error.response?.data.message }));
    };

    const removeInstitutionClassrooms = useCallback(() => {
        if (newUser.institutionId === undefined && institutionClassrooms !== undefined) {
            setNewUser((prev) => ({
                ...prev,
                classrooms: prev.classrooms.filter((c) => !institutionClassrooms?.map(({ id }) => id).includes(c)),
            }));
            setSearchedClassrooms((prev) => prev.filter((c) => !institutionClassrooms?.map(({ id }) => id).includes(c.id)));
        }
    }, [institutionClassrooms, newUser.institutionId]);

    useEffect(() => {
        removeInstitutionClassrooms();
    }, [removeInstitutionClassrooms, institutionClassrooms]);

    /** Busca grupos da instituição do usuário. */
    const searchInstitutionClassrooms = async () => {
        if ((!newUser.institutionId && !user.institutionId) || user.role === 'USER') return;
        if (institutionClassrooms === undefined)
            await axios
                .get(`${process.env.REACT_APP_API_URL}api/institution/getInstitution/${newUser.institutionId || user.institutionId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    const classrooms = response.data.data.classrooms.map(({ id, name, users }) => ({
                        id,
                        name,
                        users,
                        institution: { id: newUser.institutionId || user.institutionId },
                    }));
                    setInstitutionClassrooms(classrooms);
                    concatenateClassrooms(classrooms);
                })
                .catch((error) =>
                    showAlert({
                        headerText: 'Houve um problema ao buscar os grupos da sua instituição',
                        bodyText: `Você ainda poderá ${
                            isEditing ? 'editar' : 'criar'
                        } o usuário, mas alguns grupos podem estar inacessíveis. Deseja continuar?`,
                        primaryBtnLabel: 'Sim',
                        primaryBtnHsl: [97, 43, 70],
                        secondaryBtnLabel: 'Não',
                        secondaryBtnHsl: [355, 78, 66],
                        onSecondaryBtnClick: () => navigate('/dash/applications'),
                    })
                );
        else {
            concatenateClassrooms(institutionClassrooms);
        }
    };

    /** Concatena as salas de aula filtradas com as salas de aula do usuário. */
    const concatenateClassrooms = (classrooms) => {
        const newClassrooms = classrooms.filter(
            (c) => !newUser.classrooms.includes(c.id) && (c.institution?.id === newUser.institutionId || c.institution === null)
        );
        const concatenedClassrooms = [
            ...newClassrooms,
            ...searchedClassrooms.filter((c) => newUser.classrooms.includes(c.id)).sort((a, b) => a.name.localeCompare(b.name)),
        ];
        setSearchedClassrooms(concatenedClassrooms);
        setClassroomSearchTerm('');
    };

    /**
     * Submete os dados do novo usuário.
     * @param {Event} e - Evento de envio do formulário.
     */
    const submitNewUser = (e) => {
        e.preventDefault();
        const salt = process.env.REACT_APP_SALT;
        const processedUser = {
            ...(user.username === newUser.username ? (({ role, ...r }) => r)(newUser) : newUser),
            actions: undefined,
            hashValidation: undefined,
            profileImage: newUser.profileImage ? newUser.profileImage : undefined,
        };
        const formData = newUser.hash
            ? serialize({ ...processedUser, hash: hashSync(processedUser.hash, salt) })
            : serialize({ ...processedUser });
        if (isEditing) {
            axios
                .put(`${process.env.REACT_APP_API_URL}api/user/updateUser/${userId || user.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    showAlert({
                        headerText: 'Usuário atualizado com sucesso',
                        primaryBtnHsl: [97, 43, 70],
                        primaryBtnLabel: 'Ok',
                        onPrimaryBtnClick: () => {
                            if (!userId || userId === user.id) {
                                renewUser(response.data.data.username, response.data.data.role, response.data.data.profileImage?.path);
                                navigate(`/dash/profile`);
                            } else navigate(`/dash/users`);
                        },
                    });
                })
                .catch((error) => showAlert({ headerText: 'Erro ao atualizar usuário', bodyText: error.response?.data.message }));
        } else {
            axios
                .post(`${process.env.REACT_APP_API_URL}api/user/createUser`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) =>
                    showAlert({ headerText: 'Usuário criado com sucesso', onPrimaryBtnClick: () => navigate(`/dash/users`) })
                )
                .catch((error) => showAlert({ headerText: 'Erro ao criar usuário', bodyText: error.response?.data.message }));
        }
    };

    /** Exclui o usuário atual. */
    const deleteUser = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}api/user/deleteUser/${userId || user.id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                if (!userId || userId === user.id) {
                    showAlert({
                        headerText: 'Usuário excluído com sucesso',
                        onPrimaryBtnClick: () => {
                            logout();
                            navigate(`/dash/signin`);
                        },
                    });
                } else showAlert({ headerText: 'Usuário excluído com sucesso', onPrimaryBtnClick: () => navigate(`/dash/users`) });
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir usuário', bodyText: error.response?.data.message }));
    };

    /** Gera um hash aleatório com 12 caracteres. */
    const generateRandomHash = () => {
        /** Random hash with special chars and exactly 12 characters. */
        const randomHash = Array.from({ length: 12 }, () => String.fromCharCode(Math.floor(Math.random() * 93) + 33)).join('');
        setNewUser((prev) => ({ ...prev, hash: randomHash, hashValidation: randomHash }));
    };

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text={`Carregando ${isEditing ? 'edição' : 'criação'} de usuário...`} />;

    return (
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row align-items-stretch h-100 g-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <CustomContainer className="font-barlow flex-grow-1 overflow-y-scroll p-4" df="12" md="10">
                        <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">{isEditing ? 'Editar' : 'Criar'} usuário</h1>
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="row flex-grow-1 font-barlow gy-3 gx-4 mb-4">
                                <div className="col-12 col-lg-4 order-lg-2 d-flex flex-column align-items-center bg-white mh-100 h-lg-100">
                                    <div className="profile-figure ratio ratio-1x1 rounded-circle shadow-sm w-75 mb-3">
                                        <img
                                            src={
                                                !newUser.profileImage
                                                    ? BlankProfilePic
                                                    : newUser.profileImage.id
                                                    ? process.env.REACT_APP_API_URL + 'api/' + newUser.profileImage.path
                                                    : URL.createObjectURL(newUser.profileImage)
                                            }
                                            className="rounded-circle h-100 w-100"
                                            alt="Foto de perfil"
                                        />
                                    </div>
                                    <div className="row justify-content-center gx-2 gy-3 w-100">
                                        <div className="col-5 col-lg-12">
                                            <TextButton
                                                className="lh-1 px-3 py-2"
                                                hsl={[197, 43, 52]}
                                                text="Atualizar foto"
                                                onClick={() => profilePicRef.current.click()}
                                            />
                                        </div>
                                        {newUser.profileImage && (
                                            <div className="col-5 col-lg-12">
                                                <TextButton
                                                    className="lh-1 h-100 w-100 px-3 py-2"
                                                    hsl={[355, 78, 66]}
                                                    text="Remover"
                                                    onClick={() =>
                                                        setNewUser((prev) => ({
                                                            ...prev,
                                                            profileImage: undefined,
                                                            profileImageId: undefined,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12 col-lg-8 order-lg-1 d-flex flex-column mh-100 h-lg-100">
                                    <form name="user-form" ref={formRef} id="user-form" onSubmit={(e) => submitNewUser(e)}>
                                        <div className="mb-3">
                                            <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                                Nome:
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newUser.name || ''}
                                                form="user-form"
                                                id="name"
                                                className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                required
                                                minLength="3"
                                                maxLength="255"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label label="username" className="form-label color-steel-blue fs-5 fw-medium">
                                                Nome de usuário:
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={newUser.username || ''}
                                                form="user-form"
                                                id="username"
                                                className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                                autoComplete="off"
                                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                                required
                                                minLength="3"
                                                maxLength="20"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label label="hash" className="form-label color-steel-blue fs-5 fw-medium">
                                                Senha:
                                            </label>
                                            <div className="row align-items-center gx-1">
                                                <div className="col">
                                                    <input
                                                        type={passwordVisibility ? 'text' : 'password'}
                                                        name="hash"
                                                        value={newUser.hash || ''}
                                                        form="user-form"
                                                        id="hash"
                                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                                        autoComplete="new-password"
                                                        onChange={(e) => setNewUser({ ...newUser, hash: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        className="text-white"
                                                        icon="visibility"
                                                        onClick={() => setPasswordVisibility((prev) => !prev)}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        className="text-white"
                                                        icon="shuffle"
                                                        onClick={generateRandomHash}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label label="hash-validation" className="form-label color-steel-blue fs-5 fw-medium">
                                                Confirmar senha:
                                            </label>
                                            <div className="row align-items-center gx-1">
                                                <div className="col">
                                                    <input
                                                        type={passwordVisibility ? 'text' : 'password'}
                                                        name="validatehash"
                                                        value={newUser.hashValidation || ''}
                                                        form="user-form"
                                                        id="validatehash"
                                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                                        autoComplete="new-password"
                                                        onChange={(e) => setNewUser({ ...newUser, hashValidation: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {(!isEditing || (userId && userId !== user.id)) && (
                                            <div className="mb-3">
                                                <label label="role" className="form-label color-steel-blue fs-5 fw-medium">
                                                    Selecione o papel do usuário
                                                </label>
                                                <select
                                                    name="role"
                                                    value={newUser.role || ''}
                                                    id="role"
                                                    form="user-form"
                                                    className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0"
                                                    onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value || undefined }))}
                                                    required
                                                >
                                                    <option value="">Selecione uma opção:</option>
                                                    <option value="USER">Usuário</option>
                                                    {user.role !== 'APPLIER' && <option value="APPLIER">Aplicador</option>}
                                                    {user.role !== 'APPLIER' && user.role !== 'PUBLISHER' && (
                                                        <option value="PUBLISHER">Publicador</option>
                                                    )}
                                                    {user.role === 'ADMIN' && <option value="COORDINATOR">Coordenador</option>}
                                                </select>
                                            </div>
                                        )}
                                        {updateUserInstitution && (
                                            <div className="mb-3">
                                                <div className="form-check form-switch fs-5">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        name="institution"
                                                        id="institution"
                                                        checked={Boolean(newUser.institutionId)}
                                                        onChange={async (event) => {
                                                            if (institutionClassrooms === undefined) searchInstitutionClassrooms();
                                                            setNewUser((prev) => ({
                                                                ...prev,
                                                                institutionId: event.target.checked ? user.institutionId : undefined,
                                                            }));
                                                        }}
                                                    />
                                                    <label className="form-check-label color-steel-blue fs-5 fw-medium" htmlFor="enabled">
                                                        Pertencente à minha instituição
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <div className="mb-3">
                                                <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                                    Instituição do usuário:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="institution"
                                                    value={newUser.institutionId || ''}
                                                    form="user-form"
                                                    id="institution"
                                                    className="form-control bg-light-pastel-blue fs-5 border-0 rounded-4"
                                                    onChange={(e) => {
                                                        setNewUser((prev) => ({ ...prev, institutionId: e.target.value, classrooms: [] }));
                                                        setInstitutionClassrooms(undefined);
                                                        setSearchedClassrooms([]);
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <fieldset>
                                                <div className="row gx-2 gy-2 mb-2">
                                                    <div className="col-12 col-xl-auto">
                                                        <p className="form-label color-steel-blue fs-5 fw-medium">
                                                            Selecione os grupos do usuário:
                                                        </p>
                                                    </div>
                                                    <div className="col">
                                                        <input
                                                            type="text"
                                                            name="classrooms-search"
                                                            value={classroomSearchTerm || ''}
                                                            id="classrooms-search"
                                                            placeholder="Buscar por nome do grupo"
                                                            className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                            onChange={(e) => setClassroomSearchTerm(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter')
                                                                    String(classroomSearchTerm).length >= 3
                                                                        ? searchClassrooms(classroomSearchTerm)
                                                                        : showAlert({ headerText: 'Insira pelo menos 3 caracteres' });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-auto">
                                                        <RoundedButton
                                                            hsl={[197, 43, 52]}
                                                            className="text-white"
                                                            onClick={() =>
                                                                String(classroomSearchTerm).length >= 3
                                                                    ? searchClassrooms(classroomSearchTerm)
                                                                    : showAlert({ headerText: 'Insira pelo menos 3 caracteres' })
                                                            }
                                                            icon="search"
                                                        />
                                                    </div>
                                                </div>
                                                {searchedClassrooms.length > 0 && (
                                                    <div className="row gy-2 mb-3">
                                                        {searchedClassrooms.map((c) => (
                                                            <div key={c.id} className="col-6 col-md-4 col-xl-3">
                                                                <div className="form-check">
                                                                    <input
                                                                        form="user-form"
                                                                        type="checkbox"
                                                                        name="classrooms"
                                                                        id={`classroom-${c.id}`}
                                                                        value={c.id}
                                                                        className="form-check-input bg-grey"
                                                                        checked={newUser.classrooms.includes(c.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setNewUser((prev) => ({
                                                                                    ...prev,
                                                                                    classrooms: [
                                                                                        ...prev.classrooms,
                                                                                        parseInt(e.target.value),
                                                                                    ],
                                                                                }));
                                                                            } else {
                                                                                setNewUser((prev) => ({
                                                                                    ...prev,
                                                                                    classrooms: prev.classrooms.filter(
                                                                                        (id) => id !== parseInt(e.target.value)
                                                                                    ),
                                                                                }));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label
                                                                        htmlFor={`classroom-${c.id}`}
                                                                        className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                    >
                                                                        {c.name}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {user.institutionId && newUser.institutionId && (
                                                    <div>
                                                        <TextButton
                                                            className="fs-6 w-auto p-2 py-0"
                                                            hsl={[190, 46, 70]}
                                                            text={`Ver grupos da instituição`}
                                                            onClick={searchInstitutionClassrooms}
                                                        />
                                                    </div>
                                                )}
                                            </fieldset>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                name="profile-pic"
                                                id="profile-pic"
                                                form="user-form"
                                                accept="image/*"
                                                ref={profilePicRef}
                                                className="d-none"
                                                onChange={(e) =>
                                                    setNewUser({ ...newUser, profileImage: e.target.files[0], profileImageId: undefined })
                                                }
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="row justify-content-center justify-content-lg-start gx-2">
                                <div className="col-5 col-sm-3 col-xl-2">
                                    <TextButton
                                        text={isEditing ? 'Concluir' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={
                                            newUser.hash === newUser.hashValidation
                                                ? () => {
                                                      showAlert({
                                                          headerText: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} o usuário?`,
                                                          primaryBtnHsl: [355, 78, 66],
                                                          primaryBtnLabel: 'Não',
                                                          secondaryBtnHsl: [97, 43, 70],
                                                          secondaryBtnLabel: 'Sim',
                                                          onSecondaryBtnClick: () => formRef.current.requestSubmit(),
                                                      });
                                                  }
                                                : () => showAlert({ headerText: 'As senhas não coincidem' })
                                        }
                                    />
                                </div>
                                {isEditing && newUser.actions.toDelete === true && (
                                    <div className="col-5 col-sm-3 col-xl-2">
                                        <TextButton
                                            text={'Excluir'}
                                            hsl={[355, 78, 66]}
                                            onClick={() => {
                                                showAlert({
                                                    headerText: `Tem certeza que deseja excluir o usuário?`,
                                                    primaryBtnHsl: [355, 78, 66],
                                                    primaryBtnLabel: 'Não',
                                                    secondaryBtnHsl: [97, 43, 70],
                                                    secondaryBtnLabel: 'Sim',
                                                    onSecondaryBtnClick: () => deleteUser(),
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CustomContainer>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default CreateUserPage;
