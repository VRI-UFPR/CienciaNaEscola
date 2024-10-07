import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import SplashPage from './SplashPage';
import ErrorPage from './ErrorPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import BlankProfilePic from '../assets/images/blankProfile.jpg';
import RoundedButton from '../components/RoundedButton';
import iconVisibility from '../assets/images/visibilityIcon.svg';
import iconSearch from '../assets/images/iconSearch.svg';
import { AlertContext } from '../contexts/AlertContext';

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

function CreateUserPage(props) {
    const { institutionId, userId } = useParams();
    const { isEditing } = props;
    const { user, renewUser } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const formRef = useRef(null);
    const profilePicRef = useRef(null);

    const [newUser, setNewUser] = useState({ institutionId, classrooms: [] });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [institutionClassrooms, setInstitutionClassrooms] = useState([]);
    const [searchedClassrooms, setSearchedClassrooms] = useState([]);
    const [classroomSearchTerm, setClassroomSearchTerm] = useState('');
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
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para criar usuários nesta instituição' });
                return;
            } else if (isEditing && user.role !== 'ADMIN' && userId && user.id !== parseInt(userId)) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar este usuário' });
                return;
            }
            setNewUser((prev) => ({ ...prev, institutionId: institutionId || user.institutionId }));
            const promises = [];
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/user/getUser/${userId || user.id}`, {
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
                                profileImageId: d.profileImage?.id,
                                profileImage: d.profileImage,
                                institutionId: d.institution?.id,
                            });
                            setSearchedClassrooms(d.classrooms.map((c) => ({ id: c.id, name: c.name, users: c.users })));
                        })
                        .catch((error) => {
                            setError({ text: 'Erro ao carregar criação de usuário', description: error.response?.data.message || '' });
                        })
                );
            }
            if (user.role !== 'USER' && (institutionId || user.institutionId)) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/institution/getInstitution/${institutionId || user.institutionId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            setInstitutionClassrooms(d.classrooms.map((c) => ({ id: c.id, name: c.name, users: c.users })));
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
                const newClassroomss = [
                    ...d.filter((c) => !newUser.classrooms.includes(c.id)).map(({ id, name, users }) => ({ id, name, users })),
                    ...searchedClassrooms.filter((c) => newUser.classrooms.includes(c.id)).sort((a, b) => a.name.localeCompare(b.name)),
                ];
                setSearchedClassrooms(newClassroomss);
            })
            .catch((error) => {
                alert('Erro ao buscar grupos. ' + error.response?.data.message || '');
            });
    };

    const showInstitutionClassrooms = () => {
        const newClassrooms = institutionClassrooms.filter((c) => !newUser.classrooms.includes(c.id));
        const concatenedClassrooms = [
            ...newClassrooms,
            ...searchedClassrooms.filter((c) => newUser.classrooms.includes(c.id)).sort((a, b) => a.name.localeCompare(b.name)),
        ];
        setSearchedClassrooms(concatenedClassrooms);
        setClassroomSearchTerm('');
    };

    const submitNewUser = (e) => {
        e.preventDefault();
        const formData = serialize(newUser, { indices: true });
        if (isEditing) {
            axios
                .put(`${baseUrl}api/user/updateUser/${userId || user.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    showAlert({
                        title: 'Usuário atualizado com sucesso.',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                        onHide: () => {
                            if (response.data.data.id === user.id) {
                                renewUser(response.data.data.username, response.data.data.role, response.data.data.profileImage?.path);
                            }
                            navigate(`/dash/institutions/my`);
                        },
                    });
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao atualizar usuário.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
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
                    showAlert({
                        title: 'Usuário criado com sucesso.',
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
                        title: 'Erro ao criar usuário.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                });
        }
    };

    const deleteUser = () => {
        axios
            .delete(`${baseUrl}api/user/deleteUser/${userId || user.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                showAlert({
                    title: 'Usuário excluído com sucesso.',
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
                    title: 'Erro ao excluir usuário.',
                    description: error.response?.data.message,
                    dismissHsl: [97, 43, 70],
                    dismissText: 'Ok',
                    dismissible: true,
                });
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
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column overflow-x-hidden h-100 p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow gx-0">
                        <div className="col-12 col-md-10 p-4 pb-0">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">{isEditing ? 'Editar' : 'Criar'} usuário</h1>
                        </div>
                    </div>
                    <div className="row justify-content-center flex-grow-1 scrollbar-none overflow-scroll overflow-x-hidden font-barlow g-0">
                        <div className="col-12 col-lg-3 order-lg-2 d-flex flex-column align-items-center bg-white mh-100 h-lg-100 p-4">
                            <div className="profile-figure ratio ratio-1x1 rounded-circle shadow-sm w-75 mb-3">
                                <img
                                    src={
                                        !newUser.profileImage
                                            ? BlankProfilePic
                                            : newUser.profileImageId
                                            ? baseUrl + newUser.profileImage.path
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
                                        onClick={() => {
                                            profilePicRef.current.click();
                                        }}
                                    />
                                </div>
                                {newUser.profileImage && (
                                    <div className="col-5 col-lg-12">
                                        <TextButton
                                            className="lh-1 h-100 w-100 px-3 py-2"
                                            hsl={[355, 78, 66]}
                                            text="Remover"
                                            onClick={() =>
                                                setNewUser((prev) => ({ ...prev, profileImage: undefined, profileImageId: undefined }))
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-lg-7 order-lg-1 d-flex flex-column mh-100 h-lg-100 p-4 py-0 pt-lg-4">
                            <form name="user-form" ref={formRef} id="user-form" onSubmit={(e) => submitNewUser(e)}>
                                <div>
                                    <label label="name" className="form-label color-steel-blue fs-5 fw-medium">
                                        Nome:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name || ''}
                                        form="user-form"
                                        id="name"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium  fs-5 mb-3 border-0"
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label label="username" className="form-label color-steel-blue fs-5 fw-medium">
                                        Nome de usuário:
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={newUser.username || ''}
                                        form="user-form"
                                        id="username"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0 mb-3"
                                        autoComplete="off"
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label label="hash" className="form-label color-steel-blue fs-5 fw-medium">
                                        Senha:
                                    </label>
                                    <div className="row align-items-center gx-1 mb-3">
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
                                                icon={iconVisibility}
                                                onClick={() => setPasswordVisibility((prev) => !prev)}
                                            />
                                        </div>
                                        <div className="col-auto">
                                            <RoundedButton hsl={[197, 43, 52]} icon={iconSearch} onClick={generateRandomHash} />
                                        </div>
                                    </div>
                                </div>
                                {(user.role === 'ADMIN' || !isEditing) && (
                                    <div>
                                        <label label="role" className="form-label color-steel-blue fs-5 fw-medium">
                                            Selecione o papel do usuário
                                        </label>
                                        <select
                                            name="role"
                                            id="role"
                                            form="user-form"
                                            className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 border-0 mb-3"
                                            onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value || undefined }))}
                                            value={newUser.role || ''}
                                        >
                                            <option value="">Selecione uma opção:</option>
                                            <option value="USER">Usuário</option>
                                            {(user.role === 'ADMIN' || user.role === 'COORDINATOR') && (
                                                <option value="APPLIER">Aplicador</option>
                                            )}
                                            {(user.role === 'ADMIN' || user.role === 'COORDINATOR') && (
                                                <option value="PUBLISHER">Publicador</option>
                                            )}
                                            {user.role === 'ADMIN' && <option value="COORDINATOR">Coordenador</option>}
                                        </select>
                                    </div>
                                )}
                                {(institutionId || user.institutionId) && !isEditing && (
                                    <div className="form-check form-switch fs-5 mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="enabled"
                                            checked={newUser.institutionId === (institutionId || user.institutionId)}
                                            onChange={(event) =>
                                                setNewUser((prev) => ({
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
                                {(user.role === 'ADMIN' || user.role === 'COORDINATOR' || !isEditing) && (
                                    <div>
                                        <fieldset>
                                            <div className="row gx-2 gy-0 mb-2">
                                                <div className="col-12 col-md-auto">
                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                        Selecione os grupos do usuário:
                                                    </p>
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="classrooms-search"
                                                        value={classroomSearchTerm || ''}
                                                        id="classrooms-search"
                                                        placeholder="Buscar por nome de grupo"
                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                        onChange={(e) => setClassroomSearchTerm(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                searchClassrooms(classroomSearchTerm);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[197, 43, 52]}
                                                        onClick={() => searchClassrooms(classroomSearchTerm)}
                                                        icon={iconSearch}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row gy-2 mb-3">
                                                {searchedClassrooms.map((c) => (
                                                    <div key={c.id} className="col-6 col-md-4 col-lg-3">
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
                                                                        classrooms: [...prev.classrooms, parseInt(e.target.value)],
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
                                                ))}
                                            </div>
                                            {(institutionId || user.institutionId) && (
                                                <div className="mb-3">
                                                    <TextButton
                                                        className="fs-6 w-auto p-2 py-0"
                                                        hsl={[190, 46, 70]}
                                                        text={`Ver grupos da instituição`}
                                                        onClick={showInstitutionClassrooms}
                                                    />
                                                </div>
                                            )}
                                        </fieldset>
                                    </div>
                                )}
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
                    <div className="row justify-content-center font-barlow gx-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4">
                            <div className="row justify-content-center justify-content-lg-start gx-2 mt-0">
                                <div className="col-3 col-md-2">
                                    <TextButton
                                        text={isEditing ? 'Concluir' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={() => {
                                            showAlert({
                                                title: `Tem certeza que deseja ${isEditing ? 'editar' : 'criar'} o usuário?`,
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
                                                    title: `Tem certeza que deseja excluir o usuário?`,
                                                    dismissHsl: [97, 43, 70],
                                                    dismissText: 'Não',
                                                    actionHsl: [355, 78, 66],
                                                    actionText: 'Sim',
                                                    dismissible: true,
                                                    actionOnClick: () => {
                                                        deleteUser();
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

export default CreateUserPage;
