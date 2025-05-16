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
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';
import SplashPage from './SplashPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import { AlertContext } from '../contexts/AlertContext';
import RoundedButton from '../components/RoundedButton';
import CustomContainer from '../components/CustomContainer';

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
    .bg-light-grey:disabled{
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

    .bg-light-grey:disabled{
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
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

    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
`;

/**
 * Permite a criação e edição de grupos dentro de uma instituição.
 * @param {Object} props - Propriedades do componente.
 * @param {boolean} props.isEditing - Indica se a página está em modo de edição.
 */
function CreateClassroomPage(props) {
    const { classroomId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const formRef = useRef(null);

    const [classroom, setClassroom] = useState({ institutionId: undefined, users: [] });
    const [institutionUsers, setInstitutionUsers] = useState(undefined);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    /** useEffect responsável por carregar os dados da sala de aula e seus usuários. */
    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && (user.role === 'USER' || user.role === 'GUEST'))
                return setError({ text: 'Operação não permitida', description: 'Você não tem permissão para criar grupos' });

            const promises = [];
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${process.env.REACT_APP_API_URL}api/classroom/getClassroom/${classroomId}`, {
                            headers: { Authorization: `Bearer ${user.token}` },
                        })
                        .then((response) => {
                            const { name, users, institution, actions } = response.data.data;
                            if (actions.toUpdate !== true)
                                return Promise.reject({
                                    text: 'Operação não permitida',
                                    description: 'Você não tem permissão para editar este grupo',
                                });
                            const usersIds = users.map(({ id }) => id);
                            setClassroom({ name, users: usersIds, institutionId: institution?.id, actions });
                            setSearchedUsers(users.map(({ id, username, classrooms }) => ({ id, username, classrooms })));
                        })
                        .catch((error) =>
                            Promise.reject(
                                error.text
                                    ? error
                                    : { text: 'Erro ao obter informações do grupo', description: error.response?.data.message }
                            )
                        )
                );
            }
            Promise.all(promises)
                .then(() => setIsLoading(false))
                .catch((error) => setError(error));
        }
    }, [classroomId, isEditing, isLoading, user.token, user.status, user.role, user.institutionId, showAlert, classroom.institutionId]);

    /**
     * Busca usuários pelo nome.
     * @param {string} term - Termo de busca.
     */
    const searchUsers = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/user/searchUserByUsername`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            })
            .then((response) =>
                concatenateUsers(
                    response.data.data.map(({ id, username, classrooms, institution }) => ({ id, username, classrooms, institution }))
                )
            )
            .catch((error) => showAlert({ headerText: 'Erro ao buscar usuários.', bodyText: error.response?.data.message }));
    };

    /** * Busca usuários da instituição. */
    const searchInstitutionUsers = async () => {
        if (!classroom.institutionId && !user.institutionId) return;
        if (institutionUsers === undefined)
            await axios
                .get(`${process.env.REACT_APP_API_URL}api/institution/getInstitution/${classroom.institutionId || user.institutionId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    const users = response.data.data.users.map(({ id, username, classrooms }) => ({
                        id,
                        username,
                        classrooms,
                        institution: { id: classroom.institutionId || user.institutionId },
                    }));
                    setInstitutionUsers(users);
                    concatenateUsers(users);
                })
                .catch((error) =>
                    showAlert({
                        headerText: 'Houve um problema ao buscar os usuários da sua instituição',
                        bodyText: `Você ainda poderá ${
                            isEditing ? 'editar' : 'criar'
                        } o grupo, mas alguns usuários podem estar inacessíveis. Deseja continuar?`,
                        primaryBtnLabel: 'Sim',
                        primaryBtnHsl: [97, 43, 70],
                        secondaryBtnLabel: 'Não',
                        secondaryBtnHsl: [355, 78, 66],
                        onSecondaryBtnClick: () => navigate('/dash/applications'),
                    })
                );
        else concatenateUsers(institutionUsers);
    };

    /**
     * Concatena lista de usuários baseados em condições específicas
     *
     * @param {Array} users - A lista de usuários a ser filtrada e concatenada.
     * @param {Object} users[].id - O identificador único de um usuário.
     * @param {Object} users[].institution - O objeto de instituição associado ao usuário.
     * @param {string} users[].institution.id - O identificador único da instituição do usuário.
     *
     * @returns {void} Esta função não retorna um valor. Ela atualiza o estado de `searchedUsers` e redefine `userSearchTerm`.
     */
    const concatenateUsers = (users) => {
        const newUsers = users.filter(
            (u) =>
                !classroom.users.includes(u.id) && (classroom.institutionId === undefined || u.institution?.id === classroom.institutionId)
        );
        const concatenedUsers = [
            ...newUsers,
            ...searchedUsers.filter((c) => classroom.users.includes(c.id)).sort((a, b) => a.username.localeCompare(b.username)),
        ];
        setSearchedUsers(concatenedUsers);
        setUserSearchTerm('');
    };

    /** Submete o formulário de criação ou edição do grupo. */
    const submitClassroom = (e) => {
        e.preventDefault();
        const formData = serialize({ ...classroom, actions: undefined }, { indices: true });
        if (classroom.users.length >= 2) {
            if (isEditing) {
                axios
                    .put(`${process.env.REACT_APP_API_URL}api/classroom/updateClassroom/${classroomId}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                    })
                    .then(() =>
                        showAlert({ headerText: 'Grupo atualizado com sucesso!', onPrimaryBtnClick: () => navigate(`/dash/users`) })
                    )
                    .catch((error) => showAlert({ headerText: 'Erro ao atualizar grupo', bodyText: error.response?.data.message }));
            } else {
                axios
                    .post(`${process.env.REACT_APP_API_URL}api/classroom/createClassroom`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                    })
                    .then(() => showAlert({ headerText: 'Grupo criado com sucesso', onPrimaryBtnClick: () => navigate(`/dash/users`) }))
                    .catch((error) => showAlert({ headerText: 'Erro ao criar grupo', bodyText: error.response?.data.message }));
            }
        } else showAlert({ headerText: 'Adicione pelo menos dois usuários no grupo!' });
    };

    /** Exclui a sala. */
    const deleteClassroom = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}api/classroom/deleteClassroom/${classroomId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then(() => showAlert({ headerText: 'Grupo excluído com sucesso', onPrimaryBtnClick: () => navigate(`/dash/users`) }))
            .catch((error) => showAlert({ headerText: 'Erro ao excluir grupo', bodyText: error.response?.data.message }));
    };

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text={`Carregando ${isEditing ? 'edição' : 'criação'} de grupo...`} />;

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
                        <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">{isEditing ? 'Editar' : 'Criar'} grupo</h1>
                        <div className="d-flex flex-column flex-grow-1">
                            <form
                                name="classroom-form"
                                id="classroom-form"
                                className="flex-grow-1 mb-4"
                                ref={formRef}
                                action="/submit"
                                onSubmit={(e) => submitClassroom(e)}
                            >
                                <div className="mb-3">
                                    <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                        Nome do grupo:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={classroom.name || ''}
                                        form="classroom-form"
                                        id="name"
                                        className="form-control bg-light-pastel-blue fs-5 border-0 rounded-4"
                                        onChange={(e) => setClassroom({ ...classroom, name: e.target.value })}
                                        minLength="3"
                                        maxLength="20"
                                        required
                                    />
                                </div>
                                {user.institutionId && user.role !== 'ADMIN' && (
                                    <div className="mb-3">
                                        <div className="form-check form-switch fs-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                name="institution"
                                                id="institution"
                                                checked={classroom.institutionId !== undefined}
                                                onChange={(event) => {
                                                    setClassroom((prev) => ({
                                                        ...prev,
                                                        institutionId: event.target.checked ? user.institutionId : undefined,
                                                        users: event.target.checked
                                                            ? prev.users.filter((u) => institutionUsers.map(({ id }) => id).includes(u))
                                                            : prev.users,
                                                    }));
                                                    setSearchedUsers((prev) =>
                                                        event.target.checked
                                                            ? prev.filter((u) => institutionUsers.map(({ id }) => id).includes(u.id))
                                                            : prev
                                                    );
                                                }}
                                            />
                                            <label className="form-check-label color-steel-blue fs-5 fw-medium me-2" htmlFor="enabled">
                                                Pertencente à minha instituição
                                            </label>
                                        </div>
                                    </div>
                                )}
                                {user.role === 'ADMIN' && (
                                    <div className="mb-3">
                                        <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                            Instituição do grupo:
                                        </label>
                                        <input
                                            type="number"
                                            name="institution"
                                            value={classroom.institutionId || ''}
                                            form="classroom-form"
                                            id="institution"
                                            className="form-control bg-light-pastel-blue fs-5 border-0 rounded-4"
                                            onChange={(e) => {
                                                setClassroom((prev) => ({ ...prev, institutionId: e.target.value, users: [] }));
                                                setInstitutionUsers(undefined);
                                                setSearchedUsers([]);
                                            }}
                                        />
                                    </div>
                                )}
                                <div>
                                    <fieldset>
                                        <div className="row gx-2 gy-0 mb-2 align-items-center">
                                            <div className="col-12 col-sm-auto">
                                                <p className="form-label color-steel-blue fs-5 fw-medium mb-0">
                                                    Selecione os usuários do grupo:
                                                </p>
                                            </div>
                                            <div className="col">
                                                <input
                                                    type="text"
                                                    name="users-search"
                                                    value={userSearchTerm || ''}
                                                    id="users-search"
                                                    placeholder="Buscar por nome de usuário"
                                                    className="form-control form-control-sm color-grey bg-light-grey fw-medium border-0 rounded-4"
                                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter')
                                                            String(userSearchTerm).length >= 3
                                                                ? searchUsers(userSearchTerm)
                                                                : showAlert({ headerText: 'Insira pelo menos 3 caracteres' });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <RoundedButton
                                                    hsl={[197, 43, 52]}
                                                    className="text-white"
                                                    onClick={() =>
                                                        String(userSearchTerm).length >= 3
                                                            ? searchUsers(userSearchTerm)
                                                            : showAlert({ headerText: 'Insira pelo menos 3 caracteres' })
                                                    }
                                                    icon="person_search"
                                                />
                                            </div>
                                        </div>
                                        {classroom.users.length < 2 && (
                                            <div className="mb-2">
                                                <p id="questionHelp" className="form-text text-danger fs-6 fw-medium lh-sm m-0">
                                                    *Um grupo deve conter ao menos dois usuários.
                                                </p>
                                            </div>
                                        )}
                                        {searchedUsers.length > 0 && (
                                            <div className="row gy-2 mb-2">
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
                                                                            users: prev.users.filter(
                                                                                (id) => id !== parseInt(e.target.value)
                                                                            ),
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
                                        )}
                                        {user.institutionId && classroom.institutionId && (
                                            <div>
                                                <TextButton
                                                    className="fs-6 w-auto p-2 py-0"
                                                    hsl={[190, 46, 70]}
                                                    text={`Ver usuários da instituição`}
                                                    onClick={searchInstitutionUsers}
                                                />
                                            </div>
                                        )}
                                    </fieldset>
                                </div>
                            </form>
                            <div className="row justify-content-center justify-content-lg-start gx-2">
                                <div className="col-5 col-sm-3 col-xl-2">
                                    <TextButton
                                        text={isEditing ? 'Concluir' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={() => {
                                            showAlert({
                                                headerText: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} o grupo?`,
                                                primaryBtnHsl: [355, 78, 66],
                                                primaryBtnLabel: 'Não',
                                                secondaryBtnHsl: [97, 43, 70],
                                                secondaryBtnLabel: 'Sim',
                                                onSecondaryBtnClick: () => formRef.current.requestSubmit(),
                                            });
                                        }}
                                    />
                                </div>
                                {isEditing && classroom.actions.toDelete === true && (
                                    <div className="col-5 col-sm-3 col-xl-2">
                                        <TextButton
                                            text={'Excluir'}
                                            hsl={[355, 78, 66]}
                                            onClick={() => {
                                                showAlert({
                                                    headerText: `Tem certeza que deseja excluir o grupo?`,
                                                    primaryBtnHsl: [355, 78, 66],
                                                    primaryBtnLabel: 'Não',
                                                    secondaryBtnHsl: [97, 43, 70],
                                                    secondaryBtnLabel: 'Sim',
                                                    onSecondaryBtnClick: () => deleteClassroom(),
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

export default CreateClassroomPage;
