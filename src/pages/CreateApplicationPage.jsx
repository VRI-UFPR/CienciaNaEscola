import axios from 'axios';
import { serialize } from 'object-to-formdata';
import React, { useContext, useEffect, useState, useRef } from 'react';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import SplashPage from './SplashPage';
import { AlertContext } from '../contexts/AlertContext';
import { StorageContext } from '../contexts/StorageContext';
import TextButton from '../components/TextButton';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import { AlertContext } from '../contexts/AlertContext';
import RoundedButton from '../components/RoundedButton';
import iconSearch from '../assets/images/iconSearch.svg';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    
    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
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

function CreateApplicationPage(props) {
    const { applicationId, protocolId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const { clearLocalApplications } = useContext(StorageContext);
    const formRef = useRef(null);

    const [application, setApplication] = useState({
        protocolId: protocolId,
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
    });

    const [protocol, setProtocol] = useState({
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
    });

    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchedClassrooms, setSearchedClassrooms] = useState([]);
    const [searchedAnswerUsers, setSearchedAnswerUsers] = useState([]);
    const [searchedAnswerClassrooms, setSearchedAnswerClassrooms] = useState([]);

    const [VCSearchInput, setVCSearchInput] = useState('');
    const [VUSearchInput, setVUSearchInput] = useState('');
    const [AVUSearchInput, setAVUSearchInput] = useState('');
    const [AVCSearchInput, setAVCSearchInput] = useState('');

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
                            setSearchedClassrooms(d.viewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })));
                            setSearchedUsers(d.viewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })));
                            setSearchedAnswerClassrooms(d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })));
                            setSearchedAnswerUsers(
                                d.answersViewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms }))
                            );
                        })
                        .catch((error) => {
                            showAlert({
                                title: 'Erro ao buscar aplicação.',
                                description: error.response?.data.message,
                                dismissHsl: [97, 43, 70],
                                dismissText: 'Ok',
                                dismissible: true,
                            });
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
                        setProtocol({
                            viewersUser: d.viewersUser.map((u) => ({ id: u.id, username: u.username })),
                            viewersClassroom: d.viewersClassroom.map((c) => ({ id: c.id, name: c.name })),
                            answersViewersUser: d.answersViewersUser.map((u) => ({ id: u.id, username: u.username })),
                            answersViewersClassroom: d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name })),
                            visibility: d.visibility,
                            answersVisibility: d.answersVisibility,
                        });
                        if (!isEditing) {
                            if (d.visibility === 'RESTRICT') {
                                setApplication((prev) => ({
                                    ...prev,
                                    viewersUser: d.viewersUser.map((u) => u.id),
                                    viewersClassroom: d.viewersClassroom.map((c) => c.id),
                                }));
                                setSearchedUsers(d.viewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })));
                                setSearchedClassrooms(d.viewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })));
                            }
                            if (d.answersVisibility === 'RESTRICT') {
                                setApplication((prev) => ({
                                    ...prev,
                                    answersViewersUser: d.answersViewersUser.map((u) => u.id),
                                    answersViewersClassroom: d.answersViewersClassroom.map((c) => c.id),
                                }));
                                setSearchedAnswerUsers(
                                    d.answersViewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms }))
                                );
                                setSearchedAnswerClassrooms(
                                    d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users }))
                                );
                            }
                        }
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        showAlert({
                            title: 'Erro ao buscar visualizadores do protocolo.',
                            description: error.response?.data.message,
                            dismissHsl: [97, 43, 70],
                            dismissText: 'Ok',
                            dismissible: true,
                        });
                    });
            });
        }
    }, [isEditing, isLoading, user.status, user.institutionId, user.token, user.role, applicationId, protocolId, user.id, showAlert]);

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
                    clearLocalApplications();
                    showAlert({
                        title: 'Aplicação atualizada com sucesso.',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                    navigate(`/dash/applications/${response.data.data.id}`);
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao atualizar aplicação.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
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
                    showAlert({
                        title: 'Aplicação criada com sucesso.',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                    navigate(`/dash/applications/${response.data.data.id}`);
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao criar aplicação.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
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
                clearLocalApplications();
                showAlert({
                    title: 'Aplicação excluída com sucesso.',
                    dismissHsl: [97, 43, 70],
                    dismissText: 'Ok',
                    dismissible: true,
                });
                navigate(`/dash/applications/`);
            })
            .catch((error) => {
                showAlert({
                    title: 'Erro ao excluir aplicação.',
                    description: error.response?.data.message,
                    dismissHsl: [97, 43, 70],
                    dismissText: 'Ok',
                    dismissible: true,
                });
            });
    };

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
                        .filter(
                            (u) =>
                                !application.viewersUser.includes(u.id) &&
                                (protocol.visibility === 'PUBLIC' || protocol.viewersUser.map((v) => v.id).includes(u.id))
                        )
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedUsers
                        .filter((u) => application.viewersUser.includes(u.id))
                        .sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedUsers(newUsers);
            })
            .catch((error) => {
                alert('Erro ao buscar usuários. ' + error.response?.data.message || '');
            });
    };

    const searchAnswerUsers = (term) => {
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
                        .filter(
                            (u) =>
                                !application.answersViewersUser.includes(u.id) &&
                                (protocol.answersVisibility === 'PUBLIC' || protocol.answersViewersUser.map((v) => v.id).includes(u.id))
                        )
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedAnswerUsers
                        .filter((u) => application.answersViewersUser.includes(u.id))
                        .sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedAnswerUsers(newUsers);
            })
            .catch((error) => {
                alert('Erro ao buscar usuários. ' + error.response?.data.message || '');
            });
    };

    const searchClassrooms = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${baseUrl}api/classroom/searchClassroomByName`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const d = response.data.data;
                const newClassrooms = d
                    .filter(
                        (c) =>
                            !application.viewersClassroom.includes(c.id) &&
                            (protocol.visibility === 'PUBLIC' || protocol.viewersClassroom.map((v) => v.id).includes(c.id))
                    )
                    .map(({ id, name, users }) => ({ id, name, users }));
                const concatenedClassrooms = [
                    ...newClassrooms,
                    ...searchedClassrooms
                        .filter((c) => application.viewersClassroom.includes(c.id))
                        .sort((a, b) => a.name.localeCompare(b.name)),
                ];
                // for (const c of newClassrooms) {
                //     const newUsers = c.users
                //         .filter((u) => !application.viewersUser.includes(u.id))
                //         .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
                //     setSearchedUsers((prev) =>
                //         [
                //             ...prev.map((u) => {
                //                 if (newUsers.includes(u.id)) {
                //                     return { ...u, classrooms: [...u.classrooms, c.id] };
                //                 }
                //                 return u;
                //             }),
                //             ...newUsers,
                //         ].sort((a, b) => a.username.localeCompare(b.username))
                //     );
                // }
                setSearchedClassrooms(concatenedClassrooms);
            })
            .catch((error) => {
                alert('Erro ao buscar grupos. ' + error.response?.data.message || '');
            });
    };

    const searchAnswerClassrooms = (term) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${baseUrl}api/classroom/searchClassroomByName`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const d = response.data.data;
                const newClassrooms = d
                    .filter(
                        (c) =>
                            !application.answersViewersClassroom.includes(c.id) &&
                            (protocol.answersVisibility === 'PUBLIC' || protocol.answersViewersClassroom.map((v) => v.id).includes(c.id))
                    )
                    .map(({ id, name, users }) => ({ id, name, users }));
                const concatenedClassrooms = [
                    ...newClassrooms,
                    ...searchedAnswerClassrooms
                        .filter((c) => application.answersViewersClassroom.includes(c.id))
                        .sort((a, b) => a.name.localeCompare(b.name)),
                ];
                // for (const c of newClassrooms) {
                //     const newUsers = c.users
                //         .filter((u) => !application.answersViewersUser.includes(u.id))
                //         .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
                //     setSearchedAnswerUsers((prev) =>
                //         [
                //             ...prev.map((u) => {
                //                 if (newUsers.includes(u.id)) {
                //                     return { ...u, classrooms: [...u.classrooms, c.id] };
                //                 }
                //                 return u;
                //             }),
                //             ...newUsers,
                //         ].sort((a, b) => a.username.localeCompare(b.username))
                //     );
                // }
                setSearchedAnswerClassrooms(concatenedClassrooms);
            })
            .catch((error) => {
                alert('Erro ao buscar grupos. ' + error.response?.data.message || '');
            });
    };

    const unselectUser = (id) => {
        setApplication((prev) => ({
            ...prev,
            viewersUser: prev.viewersUser.filter((u) => u !== id),
            viewersClassroom: searchedClassrooms
                .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.viewersClassroom.includes(c.id))
                .map((c) => c.id),
        }));
    };

    const selectClassroom = (id) => {
        const c = searchedClassrooms.find((c) => c.id === id);
        const newUsers = c.users
            .filter((u) => !application.viewersUser.includes(u.id))
            .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
        setSearchedUsers((prev) =>
            [
                ...prev.map((u) => {
                    if (newUsers.includes(u.id)) {
                        return { ...u, classrooms: [...u.classrooms, c.id] };
                    }
                    return u;
                }),
                ...newUsers.filter((u) => !prev.map((u) => u.id).includes(u.id)),
            ].sort((a, b) => a.username.localeCompare(b.username))
        );
        setApplication((prev) => ({
            ...prev,
            viewersClassroom: [...prev.viewersClassroom, id],
            viewersUser: [
                ...prev.viewersUser,
                ...searchedClassrooms
                    .find((c) => c.id === id)
                    .users.filter((u) => !prev.viewersUser.includes(u.id))
                    .map((u) => u.id),
            ],
        }));
    };

    const unselectAnswerUser = (id) => {
        setApplication((prev) => ({
            ...prev,
            answersViewersUser: prev.answersViewersUser.filter((u) => u !== id),
            answersViewersClassroom: searchedAnswerClassrooms
                .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.answersViewersClassroom.includes(c.id))
                .map((c) => c.id),
        }));
    };

    const selectAnswerClassroom = (id) => {
        const c = searchedAnswerClassrooms.find((c) => c.id === id);
        const newUsers = c.users
            .filter((u) => !application.answersViewersUser.includes(u.id))
            .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
        setSearchedAnswerUsers((prev) =>
            [
                ...prev.map((u) => {
                    if (newUsers.includes(u.id)) {
                        return { ...u, classrooms: [...u.classrooms, c.id] };
                    }
                    return u;
                }),
                ...newUsers.filter((u) => !prev.map((u) => u.id).includes(u.id)),
            ].sort((a, b) => a.username.localeCompare(b.username))
        );
        setApplication((prev) => ({
            ...prev,
            answersViewersClassroom: [...prev.answersViewersClassroom, id],
            answersViewersUser: [
                ...prev.answersViewersUser,
                ...searchedAnswerClassrooms
                    .find((c) => c.id === id)
                    .users.filter((u) => !prev.answersViewersUser.includes(u.id))
                    .map((u) => u.id),
            ],
        }));
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de instituição..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column overflow-x-hidden h-100 p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow m-0">
                        <div className="col-12 col-md-10 p-4 pb-0">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">{isEditing ? 'Editar' : 'Criar'} aplicação</h1>
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-grow-1 overflow-x-scroll scrollbar-none">
                        <div className="row justify-content-center flex-grow-1 font-barlow gx-0">
                            <div className="col col-md-10 d-flex flex-column h-100 p-4">
                                <div>
                                    <form
                                        name="application-form"
                                        id="application-form"
                                        ref={formRef}
                                        action="/submit"
                                        onSubmit={(e) => submitApplication(e)}
                                    >
                                        <div>
                                            <label label="visibility" className="form-label color-steel-blue fs-5 fw-medium">
                                                Selecione a visibilidade da aplicação
                                            </label>
                                            <select
                                                name="visibility"
                                                value={application.visibility || ''}
                                                id="visibility"
                                                form="application-form"
                                                className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0 mb-3"
                                                onChange={(e) =>
                                                    setApplication((prev) => ({ ...prev, visibility: e.target.value || undefined }))
                                                }
                                            >
                                                <option value="">Selecione uma opção:</option>
                                                {protocol.visibility === 'PUBLIC' && <option value="PUBLIC">Visível para todos</option>}
                                                <option value="RESTRICT">Restringir visualizadores</option>
                                            </select>
                                        </div>
                                        {application.visibility === 'RESTRICT' && (
                                            <div>
                                                <fieldset>
                                                    <div className="row gx-2 gy-0">
                                                        <div className="col-12 col-md-auto">
                                                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                Selecione os usuários que visualizarão a aplicação:
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <input
                                                                type="text"
                                                                name="users-search"
                                                                value={VUSearchInput || ''}
                                                                id="users-search"
                                                                placeholder="Buscar por nome de usuário"
                                                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                                onChange={(e) => setVUSearchInput(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        searchUsers(VUSearchInput);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <RoundedButton
                                                                hsl={[197, 43, 52]}
                                                                onClick={() => searchUsers(VUSearchInput)}
                                                                icon={iconSearch}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row gy-2 mb-3">
                                                        {searchedUsers.map((u) => (
                                                            <div key={'viewer-user-' + u.id} className="col-6 col-md-4 col-lg-3">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="viewers-user"
                                                                    id={`viewer-user-${u.id}`}
                                                                    value={u.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.viewersUser.includes(u.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                viewersUser: [
                                                                                    ...prev.viewersUser,
                                                                                    parseInt(e.target.value),
                                                                                ],
                                                                            }));
                                                                        } else {
                                                                            unselectUser(parseInt(e.target.value));
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`viewer-user-${u.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {u.username}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </fieldset>
                                            </div>
                                        )}
                                        {application.visibility === 'RESTRICT' && (
                                            <div>
                                                <fieldset>
                                                    <div className="row gx-2 gy-0">
                                                        <div className="col-12 col-md-auto">
                                                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                Selecione os grupos que visualizarão a aplicação:
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <input
                                                                type="text"
                                                                name="classrooms-search"
                                                                value={VCSearchInput || ''}
                                                                id="classrooms-search"
                                                                placeholder="Buscar por nome do grupo"
                                                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                                onChange={(e) => setVCSearchInput(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        searchClassrooms(VCSearchInput);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <RoundedButton
                                                                hsl={[197, 43, 52]}
                                                                onClick={() => searchClassrooms(VCSearchInput)}
                                                                icon={iconSearch}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row gy-2 mb-3">
                                                        {searchedClassrooms.map((c) => (
                                                            <div key={'viewer-classroom-' + c.id} className="col-6 col-md-4 col-lg-3">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="viewers-classroom"
                                                                    id={`viewer-classroom-${c.id}`}
                                                                    value={c.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.viewersClassroom.includes(c.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            selectClassroom(parseInt(e.target.value));
                                                                        } else {
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                viewersClassroom: prev.viewersClassroom.filter(
                                                                                    (id) => id !== parseInt(e.target.value)
                                                                                ),
                                                                            }));
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`viewer-classroom-${c.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {c.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </fieldset>
                                            </div>
                                        )}

                                        <div>
                                            <label label="answer-visibility" className="form-label color-steel-blue fs-5 fw-medium">
                                                Selecione a visibilidade das respostas da aplicação
                                            </label>
                                            <select
                                                name="answer-visibility"
                                                value={application.answersVisibility || ''}
                                                id="answer-visibility"
                                                form="application-form"
                                                className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0 mb-3"
                                                onChange={(e) =>
                                                    setApplication((prev) => ({ ...prev, answersVisibility: e.target.value || undefined }))
                                                }
                                            >
                                                <option value="">Selecione uma opção:</option>
                                                {protocol.answersVisibility === 'PUBLIC' && (
                                                    <option value="PUBLIC">Visível para todos</option>
                                                )}
                                                <option value="RESTRICT">Restringir visualizadores</option>
                                            </select>
                                        </div>
                                        {application.answersVisibility === 'RESTRICT' && (
                                            <div>
                                                <fieldset>
                                                    <div className="row gx-2 gy-0">
                                                        <div className="col-12 col-md-auto">
                                                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                Selecione os usuários que visualizarão as respostas da aplicação:
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <input
                                                                type="text"
                                                                name="answer-users-search"
                                                                value={AVUSearchInput || ''}
                                                                id="answer-users-search"
                                                                placeholder="Buscar por nome de usuário"
                                                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                                onChange={(e) => setAVUSearchInput(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        searchAnswerUsers(AVUSearchInput);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <RoundedButton
                                                                hsl={[197, 43, 52]}
                                                                onClick={() => searchAnswerUsers(AVUSearchInput)}
                                                                icon={iconSearch}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row gy-2 mb-3">
                                                        {searchedAnswerUsers.map((u) => (
                                                            <div key={'answer-viewer-user-' + u.id} className="col-6 col-md-4 col-lg-3">
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="answer-viewers-user"
                                                                    id={`answer-viewer-user-${u.id}`}
                                                                    value={u.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.answersViewersUser.includes(u.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                answersViewersUser: [
                                                                                    ...prev.answersViewersUser,
                                                                                    parseInt(e.target.value),
                                                                                ],
                                                                            }));
                                                                        } else {
                                                                            unselectAnswerUser(parseInt(e.target.value));
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`answer-viewer-user-${u.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {u.username}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </fieldset>
                                            </div>
                                        )}
                                        {application.answersVisibility === 'RESTRICT' && (
                                            <div>
                                                <fieldset>
                                                    <div className="row gx-2 gy-0">
                                                        <div className="col-12 col-md-auto">
                                                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                Selecione os grupos que visualizarão as respostas da aplicação:
                                                            </p>
                                                        </div>
                                                        <div className="col">
                                                            <input
                                                                type="text"
                                                                name="answer-classrooms-search"
                                                                value={AVCSearchInput || ''}
                                                                id="answer-classrooms-search"
                                                                placeholder="Buscar por nome do grupo"
                                                                className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                                onChange={(e) => setAVCSearchInput(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        searchAnswerClassrooms(AVCSearchInput);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <RoundedButton
                                                                hsl={[197, 43, 52]}
                                                                onClick={() => searchAnswerClassrooms(AVCSearchInput)}
                                                                icon={iconSearch}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row gy-2 mb-3">
                                                        {searchedAnswerClassrooms.map((c) => (
                                                            <div
                                                                key={'answer-viewer-classroom-' + c.id}
                                                                className="col-6 col-md-4 col-lg-3"
                                                            >
                                                                <input
                                                                    form="application-form"
                                                                    type="checkbox"
                                                                    name="answer-viewers-classroom"
                                                                    id={`answer-viewer-classroom-${c.id}`}
                                                                    value={c.id}
                                                                    className="form-check-input bg-grey"
                                                                    checked={application.answersViewersClassroom.includes(c.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            selectAnswerClassroom(parseInt(e.target.value));
                                                                        } else {
                                                                            setApplication((prev) => ({
                                                                                ...prev,
                                                                                answersViewersClassroom:
                                                                                    prev.answersViewersClassroom.filter(
                                                                                        (id) => id !== parseInt(e.target.value)
                                                                                    ),
                                                                            }));
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`answer-viewer-classroom-${c.id}`}
                                                                    className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                >
                                                                    {c.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </fieldset>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center font-barlow gx-0">
                            <div className="col col-md-10 d-flex flex-column h-100 px-4">
                                <div className="row justify-content-center justify-content-md-start gx-2 gy-4 mb-4">
                                    <div className="col-3 col-md-2">
                                        <TextButton
                                            text={isEditing ? 'Concluir' : 'Criar'}
                                            hsl={[97, 43, 70]}
                                            onClick={() => {
                                                showAlert({
                                                    title: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} a sala de aula?`,
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
                                                        title: `Tem certeza que deseja excluir a sala de aula?`,
                                                        dismissHsl: [355, 78, 66],
                                                        dismissText: 'Não',
                                                        actionHsl: [97, 43, 70],
                                                        actionText: 'Sim',
                                                        dismissible: true,
                                                        actionOnClick: () => {
                                                            deleteApplication();
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
            </div>
            <style>{style}</style>
        </div>
    );
}

export default CreateApplicationPage;
