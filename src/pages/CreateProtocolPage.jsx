import { React, useState, useContext, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import SplashPage from './SplashPage';
import Sidebar from '../components/Sidebar';
import { defaultNewDependency, defaultNewInput, defaultNewItemGroup, defaultNewPage, defaultNewProtocol } from '../utils/constants';
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';
import RoundedButton from '../components/RoundedButton';
import iconSearch from '../assets/images/iconSearch.svg';
// import iconDependency from '../assets/images/iconDependency.svg';
import AddBar from '../components/Addbar';
import CreatePage from '../components/CreatePage';

const CreateProtocolStyles = `
    @media (max-width: 767px) {
        .botao-form {
            margin-bottom: 10px;
        }

        .titulo-form {
            text-align: center;
        }
    }

    @media (min-width: 992px) {
        .h-lg-100 {
            height: 100% !important;
        }

        .position-lg-sticky {
            position: sticky !important;
            top: 0;
        }
    }

    .bg-light-grey {
        background-color: #D9D9D9;
    }

    .bg-light-grey:focus {
        background-color: #D9D9D9 !important;
    }

    .bg-light-pastel-blue {
        background-color: #b8d7e3;
    }

    .bg-light-pastel-blue:focus {
        background-color: #b8d7e3;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .border-steel-blue {
        border-color: #4E9BB9 !important;
    }

    .color-grey {
        color: #535353;
    }

    .color-grey:focus {
        color: #535353;
    }

    .color-steel-blue,
    .text-steel-blue {
        color: #4E9BB9;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .form-check-input {
        background-color: #D9D9D9;
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

    .icon-plus {
        min-width: 15px;
        width: 20px;
    }

    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
`;

function CreateProtocolPage(props) {
    const { protocolId } = useParams();
    const { isEditing = false } = props;
    const { user } = useContext(AuthContext);

    const [protocol, setProtocol] = useState(defaultNewProtocol);
    const [itemTarget, setItemTarget] = useState({ page: 0, group: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const formRef = useRef();

    const [searchedOptions, setSearchedOptions] = useState({
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
        appliers: [],
    });

    const [searchInputs, setSearchInputs] = useState({
        viewersUser: '',
        viewersClassroom: '',
        answersViewersUser: '',
        answersViewersClassroom: '',
        appliers: '',
    });

    const navigate = useNavigate();
    const { showAlert } = useContext(AlertContext);

    const updatePagePlacement = useCallback(
        (newPlacement, oldPlacement, pageIndex) => {
            if (newPlacement < 1 || newPlacement > protocol.pages.length) return;
            const newProtocol = { ...protocol };
            if (newPlacement > oldPlacement) {
                for (const p of newProtocol.pages) if (p.placement > oldPlacement && p.placement <= newPlacement) p.placement--;
            } else {
                for (const p of newProtocol.pages) if (p.placement >= newPlacement && p.placement < oldPlacement) p.placement++;
            }
            newProtocol.pages[pageIndex].placement = newPlacement;
            newProtocol.pages.sort((a, b) => a.placement - b.placement);
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertItem = (type, page, group) => {
        const newProtocol = { ...protocol };
        const newInput = {
            ...defaultNewInput(
                type,
                Math.floor(Date.now() + Math.random() * 1000),
                newProtocol.pages[page].itemGroups[group].items.length + 1
            ),
        };
        newProtocol.pages[page].itemGroups[group].items.push(newInput);
        console.log(newInput);
        console.log(newProtocol);
        setProtocol(newProtocol);
    };

    const insertPage = useCallback(() => {
        const newProtocol = { ...protocol };
        newProtocol.pages.push(defaultNewPage(newProtocol.pages.length + 1));
        setProtocol(newProtocol);
        setItemTarget({ page: newProtocol.pages.length - 1, group: '' });
    }, [protocol]);

    const updatePage = useCallback((page, pageIndex) => {
        setProtocol((prev) => {
            const newProtocol = { ...prev };
            newProtocol.pages[pageIndex] = page;
            return newProtocol;
        });
    }, []);

    const removePage = useCallback(
        (index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages.splice(index, 1);
            for (const [i, page] of newProtocol.pages.entries()) {
                if (i >= index) page.placement--;
            }
            setProtocol(newProtocol);
            if (itemTarget.page >= newProtocol.pages.length) {
                if (newProtocol.pages.length > 0) {
                    setItemTarget((prev) => ({ group: '', page: newProtocol.pages.length - 1 }));
                } else {
                    setItemTarget((prev) => ({ group: '', page: '' }));
                }
            }
        },
        [protocol, itemTarget.page]
    );

    const insertItemGroup = useCallback(
        (page) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups.push(defaultNewItemGroup(newProtocol.pages[page].itemGroups.length + 1));
            setProtocol(newProtocol);
            setItemTarget((prev) => ({ ...prev, group: newProtocol.pages[page].itemGroups.length - 1 }));
        },
        [protocol]
    );

    const insertDependency = useCallback(
        (pageIndex, groupIndex) => {
            const newProtocol = { ...protocol };
            if (groupIndex === undefined) newProtocol.pages[pageIndex].dependencies.push(defaultNewDependency());
            else newProtocol.pages[pageIndex].itemGroups[groupIndex].dependencies.push(defaultNewDependency());
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const handleSubmit = (event) => {
        event.preventDefault();

        const placedProtocol = {
            ...protocol,
            creatorId: user.id,
            owners: [],
        };

        const formData = serialize(placedProtocol, { indices: true });

        if (isEditing) {
            axios
                .put(baseUrl + 'api/protocol/updateProtocol/' + protocolId, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    showAlert({
                        title: 'Formulário atualizado com sucesso.',
                        onHide: () => navigate('/dash/protocols'),
                        dismissible: true,
                    });
                })
                .catch((error) => {
                    showAlert({
                        title: 'Erro ao atualizar protocolo.',
                        description: error.response?.data.message || '',
                        dismissible: true,
                    });
                });
        } else {
            axios
                .post(baseUrl + 'api/protocol/createProtocol', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    showAlert({ title: 'Protocolo criado com sucesso.', onHide: () => navigate('/dash/protocols'), dismissible: true });
                })
                .catch((error) => {
                    showAlert({ title: 'Erro ao criar protocolo.', description: error.response?.data.message || '', dismissible: true });
                });
        }
    };

    const deleteProtocol = () => {
        axios
            .delete(`${baseUrl}api/protocol/deleteProtocol/${protocolId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Protocolo excluído com sucesso');
                navigate(`/dash/protocols/`);
            })
            .catch((error) => {
                alert('Erro ao excluir protocolo. ' + error.response?.data.message || '');
            });
    };

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            const promises = [];
            if (!isEditing && (user.role === 'USER' || user.role === 'APPLIER')) {
                setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para criar protocolos',
                });
                return;
            } else if (isEditing && (user.role === 'USER' || user.role === 'APPLIER')) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar este protocolo' });
                return;
            }
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${baseUrl}api/protocol/getProtocol/${protocolId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            if (user.id !== d.creator.id && user.role !== 'ADMIN') {
                                setError({
                                    text: 'Operação não permitida',
                                    description: 'Você não tem permissão para editar este protocolo',
                                });
                                return;
                            }
                            const tempIdMap = {};
                            setProtocol({
                                id: d.id,
                                title: d.title,
                                description: d.description,
                                enabled: d.enabled,
                                replicable: d.replicable,
                                visibility: d.visibility,
                                applicability: d.applicability,
                                answersVisibility: d.answersVisibility,
                                pages: d.pages.map((p) => ({
                                    id: p.id,
                                    tempId: Date.now() + Math.random() * 1000,
                                    type: p.type,
                                    placement: p.placement,
                                    itemGroups: p.itemGroups.map((g) => ({
                                        id: g.id,
                                        tempId: Date.now() + Math.random() * 1000,
                                        type: g.type,
                                        isRepeatable: g.isRepeatable,
                                        placement: g.placement,
                                        items: g.items.map((i) => {
                                            const tempId = Date.now() + Math.random() * 1000;
                                            tempIdMap[i.id] = tempId;
                                            return {
                                                id: i.id,
                                                tempId: tempId,
                                                text: i.text,
                                                description: i.description,
                                                type: i.type,
                                                enabled: i.enabled,
                                                placement: i.placement,
                                                itemOptions: i.itemOptions.map((o) => ({
                                                    id: o.id,
                                                    tempId: Date.now() + Math.random() * 1000,
                                                    placement: o.placement,
                                                    text: o.text,
                                                    files: o.files.map((f) => ({ id: f.id, path: f.path })),
                                                })),
                                                files: i.files.map((f) => ({ id: f.id, path: f.path })),
                                                itemValidations: i.itemValidations.map((v) => ({
                                                    ...v,
                                                    tempId: Date.now() + Math.random() * 1000,
                                                })),
                                            };
                                        }),
                                        dependencies: g.dependencies.map((dep) => ({
                                            ...dep,
                                            itemTempId: tempIdMap[dep.itemId],
                                            tempId: Date.now() + Math.random() * 1000,
                                        })),
                                    })),
                                    dependencies: p.dependencies.map((dep) => ({
                                        ...dep,
                                        itemTempId: tempIdMap[dep.itemId],
                                        tempId: Date.now() + Math.random() * 1000,
                                    })),
                                })),
                                viewersUser: d.viewersUser.map((u) => u.id),
                                viewersClassroom: d.viewersClassroom.map((c) => c.id),
                                answersViewersUser: d.answersViewersUser.map((u) => u.id),
                                answersViewersClassroom: d.answersViewersClassroom.map((c) => c.id),
                                appliers: d.appliers.map((u) => u.id),
                            });
                            setSearchedOptions({
                                viewersUser: d.viewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })),
                                viewersClassroom: d.viewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })),
                                answersViewersUser: d.answersViewersUser.map((u) => ({
                                    id: u.id,
                                    username: u.username,
                                    classrooms: u.classrooms,
                                })),
                                answersViewersClassroom: d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })),
                                appliers: d.appliers.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })),
                            });
                        })
                        .catch((error) => {
                            setError({ text: 'Erro ao carregar criação do protocolo', description: error.response?.data.message || '' });
                        })
                );
            }
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [isLoading, user.token, isEditing, protocolId, user.institutionId, user.status, user.role, user.id]);

    const searchUsers = (term, target) => {
        const formData = serialize({ term }, { indices: true });
        axios
            .post(`${baseUrl}api/user/searchUserByUsername`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                if (target === 'viewersUser') {
                    const d = response.data.data;
                    const newUsers = [
                        ...d
                            .filter((u) => !protocol.viewersUser.includes(u.id))
                            .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                        ...searchedOptions.viewersUser
                            .filter((u) => protocol.viewersUser.includes(u.id))
                            .sort((a, b) => a.username.localeCompare(b.username)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, viewersUser: newUsers }));
                } else if (target === 'answersViewersUser') {
                    const d = response.data.data;
                    const newUsers = [
                        ...d
                            .filter((u) => !protocol.answersViewersUser.includes(u.id))
                            .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                        ...searchedOptions.answersViewersUser
                            .filter((u) => protocol.answersViewersUser.includes(u.id))
                            .sort((a, b) => a.username.localeCompare(b.username)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, answersViewersUser: newUsers }));
                } else if (target === 'appliers') {
                    const d = response.data.data;
                    const newUsers = [
                        ...d
                            .filter((u) => !protocol.appliers.includes(u.id))
                            .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                        ...searchedOptions.appliers
                            .filter((u) => protocol.appliers.includes(u.id))
                            .sort((a, b) => a.username.localeCompare(b.username)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, appliers: newUsers }));
                }
            })
            .catch((error) => {
                alert('Erro ao buscar usuários. ' + error.response?.data.message || '');
            });
    };

    const searchClassrooms = (term, target) => {
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
                if (target === 'viewersClassroom') {
                    const newClassrooms = d
                        .filter((c) => !protocol.viewersClassroom.includes(c.id))
                        .map(({ id, name, users }) => ({ id, name, users }));
                    const concatenedClassrooms = [
                        ...newClassrooms,
                        ...searchedOptions.viewersClassroom
                            .filter((c) => protocol.viewersClassroom.includes(c.id))
                            .sort((a, b) => a.name.localeCompare(b.name)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, viewersClassroom: concatenedClassrooms }));
                } else if (target === 'answersViewersClassroom') {
                    const d = response.data.data;
                    const newClassrooms = d
                        .filter((c) => !protocol.answersViewersClassroom.includes(c.id))
                        .map(({ id, name, users }) => ({ id, name, users }));
                    const concatenedClassrooms = [
                        ...newClassrooms,
                        ...searchedOptions.answersViewersClassroom
                            .filter((c) => protocol.answersViewersClassroom.includes(c.id))
                            .sort((a, b) => a.name.localeCompare(b.name)),
                    ];
                    setSearchedOptions((prev) => ({ ...prev, answersViewersClassroom: concatenedClassrooms }));
                }
            })
            .catch((error) => {
                alert('Erro ao buscar grupos. ' + error.response?.data.message || '');
            });
    };

    const unselectUser = (id, target) => {
        if (target === 'viewersUser') {
            setProtocol((prev) => ({
                ...prev,
                viewersUser: prev.viewersUser.filter((u) => u !== id),
                viewersClassroom: searchedOptions.viewersClassroom
                    .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.viewersClassroom.includes(c.id))
                    .map((c) => c.id),
            }));
        } else if ('answersViewersUser') {
            setProtocol((prev) => ({
                ...prev,
                answersViewersUser: prev.answersViewersUser.filter((u) => u !== id),
                answersViewersClassroom: searchedOptions.answersViewersClassroom
                    .filter((c) => !c.users.map((u) => u.id).includes(id) && prev.answersViewersClassroom.includes(c.id))
                    .map((c) => c.id),
            }));
        }
    };

    const selectClassroom = (id, target) => {
        if (target === 'viewersClassroom') {
            const c = searchedOptions.viewersClassroom.find((c) => c.id === id);
            const newUsers = c.users
                .filter((u) => !protocol.viewersUser.includes(u.id))
                .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
            setSearchedOptions((prev) => ({
                ...prev,
                viewersUser: [
                    ...prev.viewersUser.map((u) => {
                        if (newUsers.map((u) => u.id).includes(u.id)) {
                            return { ...u, classrooms: [...u.classrooms, c.id] };
                        }
                        return u;
                    }),
                    ...newUsers.filter((u) => !prev.viewersUser.map((u) => u.id).includes(u.id)),
                ],
            }));
            setProtocol((prev) => ({
                ...prev,
                viewersClassroom: [...prev.viewersClassroom, id],
                viewersUser: [
                    ...prev.viewersUser,
                    ...searchedOptions.viewersClassroom
                        .find((c) => c.id === id)
                        .users.filter((u) => !prev.viewersUser.includes(u.id))
                        .map((u) => u.id),
                ],
            }));
        } else if (target === 'answersViewersClassroom') {
            const c = searchedOptions.answersViewersClassroom.find((c) => c.id === id);
            const newUsers = c.users
                .filter((u) => !protocol.answersViewersUser.includes(u.id))
                .map((u) => ({ id: u.id, username: u.username, classrooms: [c.id] }));
            setSearchedOptions((prev) => ({
                ...prev,
                answersViewersUser: [
                    ...prev.answersViewersUser.map((u) => {
                        if (newUsers.map((u) => u.id).includes(u.id)) {
                            return { ...u, classrooms: [...u.classrooms, c.id] };
                        }
                        return u;
                    }),
                    ...newUsers.filter((u) => !prev.answersViewersUser.map((u) => u.id).includes(u.id)),
                ],
            }));
            setProtocol((prev) => ({
                ...prev,
                answersViewersClassroom: [...prev.answersViewersClassroom, id],
                answersViewersUser: [
                    ...prev.answersViewersUser,
                    ...searchedOptions.answersViewersClassroom
                        .find((c) => c.id === id)
                        .users.filter((u) => !prev.answersViewersUser.includes(u.id))
                        .map((u) => u.id),
                ],
            }));
        }
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de protocolo..." />;
    }

    return (
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row h-100 g-0">
                <div className="col-auto position-lg-sticky h-100">
                    <div className="offcanvas-lg offcanvas-start h-100 w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col h-100">
                    <div className="d-flex flex-column h-100">
                        <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                        <div className="row flex-grow-1 overflow-hidden g-0">
                            <div className="col h-100">
                                <div className="d-flex flex-column h-100">
                                    <div className="row justify-content-center font-barlow g-0">
                                        <div className="col-12 col-md-10">
                                            <div className="row justify-content-between align-items-center p-4">
                                                <div className="col-auto">
                                                    <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">
                                                        {isEditing ? 'Editar' : 'Criar'} protocolo
                                                    </h1>
                                                </div>
                                                <div className="col-5 d-lg-none">
                                                    <div data-bs-toggle="offcanvas" data-bs-target="#addbar" aria-controls="addbar">
                                                        <TextButton type="button" hsl={[197, 43, 52]} text="Adicionar..." />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center font-barlow flex-grow-1 overflow-hidden g-0">
                                        <div className="col col-md-10 h-100 overflow-y-scroll scrollbar-none">
                                            <form
                                                className="d-flex flex-column flex-grow-1 p-4 pt-0"
                                                ref={formRef}
                                                action="/submit"
                                                onSubmit={(e) => handleSubmit(e)}
                                                // onKeyDown={(e) => {
                                                //     if (e.key === 'Enter') e.preventDefault();
                                                // }}
                                            >
                                                <div className="flex-grow-1 mb-3">
                                                    <label htmlFor="title" className="form-label color-steel-blue fs-5 fw-medium">
                                                        Título do protocolo:
                                                    </label>
                                                    <input
                                                        className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="title"
                                                        type="text"
                                                        value={protocol.title || ''}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, title: event.target.value }))
                                                        }
                                                    ></input>
                                                    <label htmlFor="description" className="form-label color-steel-blue fs-5 fw-medium">
                                                        Descrição do protocolo:
                                                    </label>
                                                    <textarea
                                                        className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="description"
                                                        rows="6"
                                                        value={protocol.description || ''}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, description: event.target.value }))
                                                        }
                                                    ></textarea>
                                                    <label htmlFor="enabled" className="form-label color-steel-blue fs-5 fw-medium">
                                                        Habilitado:
                                                    </label>
                                                    <select
                                                        className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="enabled"
                                                        value={protocol.enabled ? 'true' : 'false'}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, enabled: event.target.value === 'true' }))
                                                        }
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="true">Sim</option>
                                                        <option value="false">Não</option>
                                                    </select>
                                                    <label htmlFor="visibility" className="form-label color-steel-blue fs-5 fw-medium">
                                                        Visibilidade:
                                                    </label>
                                                    <select
                                                        className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="visibility"
                                                        value={protocol.visibility || ''}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, visibility: event.target.value }))
                                                        }
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="PUBLIC">Público</option>
                                                        <option value="RESTRICT">Restrito</option>
                                                    </select>
                                                    {protocol.visibility === 'RESTRICT' && (
                                                        <fieldset>
                                                            <div className="row gx-2 gy-0">
                                                                <div className="col-12 col-xl-auto">
                                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                        Selecione os usuários que poderão visualizar o protocolo:
                                                                    </p>
                                                                </div>
                                                                <div className="col">
                                                                    <input
                                                                        type="text"
                                                                        name="users-search"
                                                                        value={searchInputs.viewersUser}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome de usuário"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) =>
                                                                            setSearchInputs((prev) => ({
                                                                                ...prev,
                                                                                viewersUser: e.target.value,
                                                                            }))
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter')
                                                                                searchUsers(searchInputs.viewersUser, 'viewersUser');
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-auto">
                                                                    <RoundedButton
                                                                        hsl={[197, 43, 52]}
                                                                        onClick={() => searchUsers(searchInputs.viewersUser, 'viewersUser')}
                                                                        icon={iconSearch}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="row gy-2 mb-3">
                                                                {searchedOptions.viewersUser.map((u) => (
                                                                    <div
                                                                        key={'viewer-user-' + u.id + '-option'}
                                                                        className="col-6 col-md-4 col-lg-3"
                                                                    >
                                                                        <input
                                                                            form="application-form"
                                                                            type="checkbox"
                                                                            name="viewers-user"
                                                                            id={`viewer-user-${u.id}`}
                                                                            value={u.id}
                                                                            checked={protocol.viewersUser.includes(u.id)}
                                                                            className="form-check-input bg-grey"
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setProtocol((prev) => ({
                                                                                        ...prev,
                                                                                        viewersUser: [
                                                                                            ...prev.viewersUser,
                                                                                            parseInt(e.target.value),
                                                                                        ],
                                                                                    }));
                                                                                } else {
                                                                                    unselectUser(parseInt(e.target.value), 'viewersUser');
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
                                                    )}
                                                    {protocol.visibility === 'RESTRICT' && (
                                                        <fieldset>
                                                            <div className="row gx-2 gy-0">
                                                                <div className="col-12 col-xl-auto">
                                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                        Selecione os grupos que poderão visualizar o protocolo:
                                                                    </p>
                                                                </div>
                                                                <div className="col">
                                                                    <input
                                                                        type="text"
                                                                        name="users-search"
                                                                        value={searchInputs.viewersClassroom}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome do grupo"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) =>
                                                                            setSearchInputs({
                                                                                ...searchInputs,
                                                                                viewersClassroom: e.target.value,
                                                                            })
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter')
                                                                                searchClassrooms(
                                                                                    searchInputs.viewersClassroom,
                                                                                    'viewersClassroom'
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-auto">
                                                                    <RoundedButton
                                                                        hsl={[197, 43, 52]}
                                                                        onClick={() =>
                                                                            searchClassrooms(
                                                                                searchInputs.viewersClassroom,
                                                                                'viewersClassroom'
                                                                            )
                                                                        }
                                                                        icon={iconSearch}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="row gy-2 mb-3">
                                                                {searchedOptions.viewersClassroom.map((c) => (
                                                                    <div
                                                                        key={'viewer-classroom-' + c.id + '-option'}
                                                                        className="col-6 col-md-4 col-lg-3"
                                                                    >
                                                                        <input
                                                                            form="application-form"
                                                                            type="checkbox"
                                                                            name="viewers-classroom"
                                                                            id={`viewer-classroom-${c.id}`}
                                                                            className="form-check-input bg-grey"
                                                                            value={c.id}
                                                                            checked={protocol.viewersClassroom.includes(c.id)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    selectClassroom(
                                                                                        parseInt(e.target.value),
                                                                                        'viewersClassroom'
                                                                                    );
                                                                                } else {
                                                                                    setProtocol((prev) => ({
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
                                                    )}
                                                    <label htmlFor="applicability" className="form-label color-steel-blue fs-5 fw-medium">
                                                        Aplicabilidade:
                                                    </label>
                                                    <select
                                                        className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="applicability"
                                                        value={protocol.applicability || ''}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, applicability: event.target.value }))
                                                        }
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="PUBLIC">Público</option>
                                                        <option value="RESTRICT">Restrito</option>
                                                    </select>
                                                    {protocol.applicability === 'RESTRICT' && (
                                                        <fieldset>
                                                            <div className="row gx-2 gy-0">
                                                                <div className="col-12 col-xl-auto">
                                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                        Selecione os usuários que poderão aplicar o protocolo:
                                                                    </p>
                                                                </div>
                                                                <div className="col">
                                                                    <input
                                                                        type="text"
                                                                        name="users-search"
                                                                        value={searchInputs.appliers}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome de usuário"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) =>
                                                                            setSearchInputs({ ...searchInputs, appliers: e.target.value })
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter')
                                                                                searchUsers(searchInputs.appliers, 'appliers');
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-auto">
                                                                    <RoundedButton
                                                                        hsl={[197, 43, 52]}
                                                                        onClick={() => searchUsers(searchInputs.appliers, 'appliers')}
                                                                        icon={iconSearch}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="row gy-2 mb-3">
                                                                {searchedOptions.appliers
                                                                    .filter((u) => u.role !== 'USER' && u.role !== 'ADMIN')
                                                                    .map((u) => (
                                                                        <div
                                                                            key={'applier-' + u.id + '-option'}
                                                                            className="col-6 col-md-4 col-lg-3"
                                                                        >
                                                                            <input
                                                                                form="application-form"
                                                                                type="checkbox"
                                                                                name="applier"
                                                                                id={`applier-${u.id}`}
                                                                                className="form-check-input bg-grey"
                                                                                value={u.id}
                                                                                checked={protocol.appliers.includes(u.id)}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setProtocol((prev) => ({
                                                                                            ...prev,
                                                                                            appliers: [
                                                                                                ...prev.appliers,
                                                                                                parseInt(e.target.value),
                                                                                            ],
                                                                                        }));
                                                                                    } else {
                                                                                        setProtocol((prev) => ({
                                                                                            ...prev,
                                                                                            appliers: prev.appliers.filter(
                                                                                                (id) => id !== parseInt(e.target.value)
                                                                                            ),
                                                                                        }));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <label
                                                                                htmlFor={`applier-${u.id}`}
                                                                                className="font-barlow color-grey text-break fw-medium ms-2 fs-6"
                                                                            >
                                                                                {u.username}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </fieldset>
                                                    )}
                                                    <label
                                                        htmlFor="answer-visiblity"
                                                        className="form-label color-steel-blue fs-5 fw-medium"
                                                    >
                                                        Visibilidade das respostas:
                                                    </label>
                                                    <select
                                                        className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="answer-visiblity"
                                                        value={protocol.answersVisibility || ''}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, answersVisibility: event.target.value }))
                                                        }
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="PUBLIC">Público</option>
                                                        <option value="RESTRICT">Restrito</option>
                                                    </select>
                                                    {protocol.answersVisibility === 'RESTRICT' && (
                                                        <fieldset>
                                                            <div className="row gx-2 gy-0">
                                                                <div className="col-12 col-xl-auto">
                                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                        Selecione os usuários que poderão visualizar as respostas do
                                                                        protocolo:
                                                                    </p>
                                                                </div>
                                                                <div className="col">
                                                                    <input
                                                                        type="text"
                                                                        name="users-search"
                                                                        value={searchInputs.answersViewersUser}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome de usuário"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) =>
                                                                            setSearchInputs((prev) => ({
                                                                                ...prev,
                                                                                answersViewersUser: e.target.value,
                                                                            }))
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter')
                                                                                searchUsers(
                                                                                    searchInputs.answersViewersUser,
                                                                                    'answersViewersUser'
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-auto">
                                                                    <RoundedButton
                                                                        hsl={[197, 43, 52]}
                                                                        onClick={() =>
                                                                            searchUsers(
                                                                                searchInputs.answersViewersUser,
                                                                                'answersViewersUser'
                                                                            )
                                                                        }
                                                                        icon={iconSearch}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="row gy-2 mb-3">
                                                                {searchedOptions.answersViewersUser.map((u) => (
                                                                    <div
                                                                        key={'answer-viewer-user-' + u.id + '-option'}
                                                                        className="col-6 col-md-4 col-lg-3"
                                                                    >
                                                                        <input
                                                                            form="application-form"
                                                                            type="checkbox"
                                                                            name="answer-viewers-user"
                                                                            id={`answer-viewer-user-${u.id}`}
                                                                            className="form-check-input bg-grey"
                                                                            value={u.id}
                                                                            checked={protocol.answersViewersUser.includes(u.id)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setProtocol((prev) => ({
                                                                                        ...prev,
                                                                                        answersViewersUser: [
                                                                                            ...prev.answersViewersUser,
                                                                                            parseInt(e.target.value),
                                                                                        ],
                                                                                    }));
                                                                                } else {
                                                                                    unselectUser(
                                                                                        parseInt(e.target.value),
                                                                                        'answersViewersUser'
                                                                                    );
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
                                                    )}
                                                    {protocol.answersVisibility === 'RESTRICT' && (
                                                        <fieldset>
                                                            <div className="row gx-2 gy-0">
                                                                <div className="col-12 col-xl-auto">
                                                                    <p className="form-label color-steel-blue fs-5 fw-medium mb-2">
                                                                        Selecione os grupos que poderão visualizar as respostas do
                                                                        protocolo:
                                                                    </p>
                                                                </div>
                                                                <div className="col">
                                                                    <input
                                                                        type="text"
                                                                        name="users-search"
                                                                        value={searchInputs.answersViewersClassroom}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome do grupo"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) =>
                                                                            setSearchInputs({ answersViewersClassroom: e.target.value })
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter')
                                                                                searchClassrooms(
                                                                                    searchInputs.answersViewersClassroom,
                                                                                    'answersViewersClassroom'
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-auto">
                                                                    <RoundedButton
                                                                        hsl={[197, 43, 52]}
                                                                        onClick={() =>
                                                                            searchClassrooms(
                                                                                searchInputs.answersViewersClassroom,
                                                                                'answersViewersClassroom'
                                                                            )
                                                                        }
                                                                        icon={iconSearch}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="row gy-2 mb-3">
                                                                {searchedOptions.answersViewersClassroom.map((c) => (
                                                                    <div
                                                                        key={'answer-viewer-classroom-' + c.id + '-option'}
                                                                        className="col-6 col-md-4 col-lg-3"
                                                                    >
                                                                        <input
                                                                            form="application-form"
                                                                            type="checkbox"
                                                                            name="answer-viewers-classroom"
                                                                            id={`answer-viewer-classroom-${c.id}`}
                                                                            className="form-check-input bg-grey"
                                                                            value={c.id}
                                                                            checked={protocol.answersViewersClassroom.includes(c.id)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    selectClassroom(
                                                                                        parseInt(e.target.value),
                                                                                        'answersViewersClassroom'
                                                                                    );
                                                                                } else {
                                                                                    setProtocol((prev) => ({
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
                                                    )}
                                                    <label htmlFor="replicable" className="form-label color-steel-blue fs-5 fw-medium">
                                                        Replicabilidade:
                                                    </label>
                                                    <select
                                                        className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                        id="replicable"
                                                        value={protocol.replicable ? 'true' : 'false'}
                                                        onChange={(event) =>
                                                            setProtocol((prev) => ({ ...prev, replicable: event.target.value === 'true' }))
                                                        }
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="true">Sim</option>
                                                        <option value="false">Não</option>
                                                    </select>
                                                </div>
                                                {protocol.pages[itemTarget.page] && (
                                                    <CreatePage
                                                        key={protocol.pages[itemTarget.page].tempId}
                                                        currentPage={protocol.pages[itemTarget.page]}
                                                        itemTarget={itemTarget}
                                                        updatePagePlacement={updatePagePlacement}
                                                        removePage={removePage}
                                                        protocol={protocol}
                                                        updatePage={updatePage}
                                                    />
                                                )}

                                                <div className="row justify-content-center">
                                                    <div className="col-4 col-md-2">
                                                        <TextButton
                                                            type="button"
                                                            hsl={[97, 43, 70]}
                                                            text={isEditing ? 'Editar' : 'Concluir'}
                                                            onClick={() => {
                                                                showAlert({
                                                                    title: `Tem certeza que deseja ${
                                                                        isEditing ? 'editar' : 'criar'
                                                                    } o protocolo?`,
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
                                                        <div className="col-4 col-md-2">
                                                            <TextButton
                                                                text={'Excluir'}
                                                                hsl={[355, 78, 66]}
                                                                onClick={() => {
                                                                    showAlert({
                                                                        title: `Tem certeza que deseja excluir o protocolo?`,
                                                                        dismissHsl: [97, 43, 70],
                                                                        dismissText: 'Não',
                                                                        actionHsl: [355, 78, 66],
                                                                        actionText: 'Sim',
                                                                        dismissible: true,
                                                                        actionOnClick: () => {
                                                                            deleteProtocol();
                                                                        },
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto position-lg-sticky h-100 mh-100">
                                <div className="offcanvas-lg bg-pastel-blue offcanvas-end h-100 w-auto" tabIndex="-1" id="addbar">
                                    <AddBar
                                        showExitButton={true}
                                        pageIndex={itemTarget.page}
                                        groupIndex={itemTarget.group}
                                        insertPage={insertPage}
                                        insertItemGroup={insertItemGroup}
                                        insertItem={insertItem}
                                        setItemTarget={setItemTarget}
                                        insertDependency={insertDependency}
                                        protocol={protocol}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{CreateProtocolStyles}</style>
        </div>
    );
}

export default CreateProtocolPage;
