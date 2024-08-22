import { React, useState, useContext, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import { ReactComponent as IconPlus } from '../assets/images/iconPlus.svg';
import TextButton from '../components/TextButton';
import CreateMultipleInputItens from '../components/inputs/protocol/CreateMultipleInputItens';
import CreateTextBoxInput from '../components/inputs/protocol/CreateTextBoxInput';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import SplashPage from './SplashPage';
import Sidebar from '../components/Sidebar';
import { defaultNewInput } from '../utils/constants';
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';
import CreateRangeInput from '../components/inputs/protocol/CreateRangeInput';
import RoundedButton from '../components/RoundedButton';
import iconSearch from '../assets/images/iconSearch.svg';
import iconArrowUp from '../assets/images/iconArrowUp.svg';
import iconArrowDown from '../assets/images/iconArrowDown.svg';
import iconDependency from '../assets/images/iconDependency.svg';
import iconTrash from '../assets/images/iconTrash.svg';
import ExitIcon from '../assets/images/ExitSidebarIcon.svg';

const CreateProtocolStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey{
        color: #535353;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .bg-light-grey:focus{
        background-color: #D9D9D9 !important;
    }

    .bg-light-pastel-blue{
        background-color: #d8ecec;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-light-pastel-blue:focus{
        background-color: #d8ecec;
    }

    .icon-plus {
        min-width: 15px;
        width: 20px;
    }

    @media (max-width: 767px) {
        .botao-form {
            margin-bottom: 10px;
        }

        .titulo-form {
            text-align: center;
        }
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey {
        color: #535353;
    }

    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }

      .h-lg-100 {
        height: 100% !important;
      }
    }
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
        .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .text-steel-blue {
        color: #4E9BB9;
    }

    .border-steel-blue{
        border-color: #4E9BB9 !important;
    }

    .form-check-input {
        background-color: #D9D9D9;
    }
`;

function CreateProtocolPage(props) {
    const { protocolId } = useParams();
    const { isEditing = false } = props;
    const { user } = useContext(AuthContext);

    const [protocol, setProtocol] = useState({
        title: '',
        description: '',
        enabled: true,
        visibility: 'PUBLIC',
        applicability: 'PUBLIC',
        answersVisibility: 'PUBLIC',
        replicable: true,
        viewersUser: [],
        viewersClassroom: [],
        answersViewersUser: [],
        answersViewersClassroom: [],
        appliers: [],
        pages: [],
    });
    const [itemTarget, setItemTarget] = useState({ page: '', group: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const formRef = useRef();

    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchedClassrooms, setSearchedClassrooms] = useState([]);
    const [searchedAnswerUsers, setSearchedAnswerUsers] = useState([]);
    const [searchedAnswerClassrooms, setSearchedAnswerClassrooms] = useState([]);
    const [searchedAppliers, setSearchedAppliers] = useState([]);

    const [VCSearchInput, setVCSearchInput] = useState('');
    const [VUSearchInput, setVUSearchInput] = useState('');
    const [AVUSearchInput, setAVUSearchInput] = useState('');
    const [AVCSearchInput, setAVCSearchInput] = useState('');
    const [ASearchInput, setASearchInput] = useState('');

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

    const updateGroupPlacement = useCallback(
        (newPlacement, oldPlacement, pageIndex, groupIndex) => {
            if (newPlacement < 1 || newPlacement > protocol.pages[pageIndex].itemGroups.length) return;
            const newProtocol = { ...protocol };
            if (newPlacement > oldPlacement) {
                for (const g of newProtocol.pages[pageIndex].itemGroups)
                    if (g.placement > oldPlacement && g.placement <= newPlacement) g.placement--;
            } else {
                for (const g of newProtocol.pages[pageIndex].itemGroups)
                    if (g.placement >= newPlacement && g.placement < oldPlacement) g.placement++;
            }
            newProtocol.pages[pageIndex].itemGroups[groupIndex].placement = newPlacement;
            newProtocol.pages[pageIndex].itemGroups.sort((a, b) => a.placement - b.placement);
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const updateItemPlacement = useCallback(
        (newPlacement, oldPlacement, pageIndex, groupIndex, itemIndex) => {
            if (newPlacement < 1 || newPlacement > protocol.pages[pageIndex].itemGroups[groupIndex].items.length) return;
            const newProtocol = { ...protocol };
            if (newPlacement > oldPlacement) {
                for (const i of newProtocol.pages[pageIndex].itemGroups[groupIndex].items)
                    if (i.placement > oldPlacement && i.placement <= newPlacement) i.placement--;
            } else {
                for (const i of newProtocol.pages[pageIndex].itemGroups[groupIndex].items)
                    if (i.placement >= newPlacement && i.placement < oldPlacement) i.placement++;
            }
            newProtocol.pages[pageIndex].itemGroups[groupIndex].items[itemIndex].placement = newPlacement;
            newProtocol.pages[pageIndex].itemGroups[groupIndex].items.sort((a, b) => a.placement - b.placement);
            const procolo = { ...newProtocol };
            setProtocol(procolo);
        },
        [protocol]
    );

    const insertItem = (type, page, group) => {
        const newProtocol = { ...protocol };
        const newPlacement = newProtocol.pages[page].itemGroups[group].items.length + 1;
        newProtocol.pages[page].itemGroups[group].items.push({ ...defaultNewInput(type), placement: newPlacement });
        setProtocol(newProtocol);
    };

    const updateItem = useCallback((item, page, group, index) => {
        setProtocol((prev) => {
            const newProtocol = { ...prev };
            newProtocol.pages[page].itemGroups[group].items[index] = item;
            return newProtocol;
        });
    }, []);

    const removeItem = useCallback(
        (page, group, index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups[group].items.splice(index, 1);
            for (const [i, item] of newProtocol.pages[page].itemGroups[group].items.entries()) {
                if (i >= index) item.placement--;
            }
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertPage = useCallback(() => {
        const newProtocol = { ...protocol };
        const newPlacement = newProtocol.pages.length + 1;
        const tempId = Date.now() + Math.random() * 1000;
        newProtocol.pages.push({ type: 'ITEMS', itemGroups: [], dependencies: [], placement: newPlacement, tempId: tempId });
        setProtocol(newProtocol);
        setItemTarget({ page: newProtocol.pages.length - 1, group: '' });
    }, [protocol]);

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
            const newPlacement = newProtocol.pages[page].itemGroups.length + 1;
            const tempId = Date.now() + Math.random() * 1000;
            newProtocol.pages[page].itemGroups.push({
                type: 'ONE_DIMENSIONAL',
                isRepeatable: false,
                items: [],
                dependencies: [],
                placement: newPlacement,
                tempId: tempId,
            });
            setProtocol(newProtocol);
            setItemTarget((prev) => ({ ...prev, group: newProtocol.pages[page].itemGroups.length - 1 }));
        },
        [protocol]
    );

    const removeItemGroup = useCallback(
        (page, index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups.splice(index, 1);
            for (const [i, group] of newProtocol.pages[page].itemGroups.entries()) {
                if (i >= index) group.placement--;
            }
            setProtocol(newProtocol);
            if (itemTarget.group >= newProtocol.pages[page].itemGroups.length) {
                if (newProtocol.pages[page].itemGroups.length > 0) {
                    setItemTarget((prev) => ({ ...prev, group: newProtocol.pages[page].itemGroups.length - 1 }));
                } else {
                    setItemTarget((prev) => ({ ...prev, group: '' }));
                }
            }
        },
        [protocol, itemTarget.group]
    );

    const insertItemGroupDependency = useCallback(
        (page, group) => {
            const newProtocol = { ...protocol };
            const tempId = Date.now() + Math.random() * 1000;
            newProtocol.pages[page].itemGroups[group].dependencies.push({
                type: '',
                argument: '',
                itemTempId: '',
                customMessage: '',
                tempId: tempId,
            });
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const removeItemGroupDependency = useCallback(
        (page, group, index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups[group].dependencies.splice(index, 1);
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertPageDependency = useCallback(
        (pageIndex) => {
            const newProtocol = { ...protocol };
            const tempId = Date.now() + Math.random() * 1000;
            newProtocol.pages[pageIndex].dependencies.push({
                type: '',
                argument: '',
                itemTempId: '',
                customMessage: '',
                tempId: tempId,
            });
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const removePageDependency = useCallback(
        (page, index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].dependencies.splice(index, 1);
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertItemValidation = useCallback(
        (page, group, item) => {
            const newProtocol = { ...protocol };
            const tempId = Date.now() + Math.random() * 1000;
            newProtocol.pages[page].itemGroups[group].items[item].itemValidations.push({
                type: '',
                argument: '',
                customMessage: '',
                tempId: tempId,
            });
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const removeItemValidation = useCallback(
        (page, group, item, index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups[group].items[item].itemValidations.splice(index, 1);
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
                            setSearchedClassrooms(d.viewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })));
                            setSearchedUsers(d.viewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })));
                            setSearchedAnswerClassrooms(d.answersViewersClassroom.map((c) => ({ id: c.id, name: c.name, users: c.users })));
                            setSearchedAnswerUsers(
                                d.answersViewersUser.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms }))
                            );
                            setSearchedAppliers(d.appliers.map((u) => ({ id: u.id, username: u.username, classrooms: u.classrooms })));
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
                        .filter((u) => !protocol.viewersUser.includes(u.id))
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedUsers
                        .filter((u) => protocol.viewersUser.includes(u.id))
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
                        .filter((u) => !protocol.answersViewersUser.includes(u.id))
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedAnswerUsers
                        .filter((u) => protocol.answersViewersUser.includes(u.id))
                        .sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedAnswerUsers(newUsers);
            })
            .catch((error) => {
                alert('Erro ao buscar usuários. ' + error.response?.data.message || '');
            });
    };

    const searchAppliers = (term) => {
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
                        .filter((u) => !protocol.appliers.includes(u.id))
                        .map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                    ...searchedAppliers
                        .filter((u) => protocol.appliers.includes(u.id))
                        .sort((a, b) => a.username.localeCompare(b.username)),
                ];
                setSearchedAppliers(newUsers);
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
                    .filter((c) => !protocol.viewersClassroom.includes(c.id))
                    .map(({ id, name, users }) => ({ id, name, users }));
                const concatenedClassrooms = [
                    ...newClassrooms,
                    ...searchedClassrooms
                        .filter((c) => protocol.viewersClassroom.includes(c.id))
                        .sort((a, b) => a.name.localeCompare(b.name)),
                ];
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
                    .filter((c) => !protocol.answersViewersClassroom.includes(c.id))
                    .map(({ id, name, users }) => ({ id, name, users }));
                const concatenedClassrooms = [
                    ...newClassrooms,
                    ...searchedAnswerClassrooms
                        .filter((c) => protocol.answersViewersClassroom.includes(c.id))
                        .sort((a, b) => a.name.localeCompare(b.name)),
                ];
                setSearchedAnswerClassrooms(concatenedClassrooms);
            })
            .catch((error) => {
                alert('Erro ao buscar grupos. ' + error.response?.data.message || '');
            });
    };

    const unselectUser = (id) => {
        setProtocol((prev) => ({
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
            .filter((u) => !protocol.viewersUser.includes(u.id))
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
        setProtocol((prev) => ({
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
        setProtocol((prev) => ({
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
            .filter((u) => !protocol.answersViewersUser.includes(u.id))
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
        setProtocol((prev) => ({
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
                                                                        value={VUSearchInput}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome de usuário"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) => setVUSearchInput(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') searchUsers(VUSearchInput);
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
                                                                        value={VCSearchInput}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome do grupo"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) => setVCSearchInput(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') searchClassrooms(VCSearchInput);
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
                                                                                    selectClassroom(parseInt(e.target.value));
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
                                                                        value={ASearchInput}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome de usuário"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) => setASearchInput(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') searchAppliers(ASearchInput);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-auto">
                                                                    <RoundedButton
                                                                        hsl={[197, 43, 52]}
                                                                        onClick={() => searchAppliers(ASearchInput)}
                                                                        icon={iconSearch}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="row gy-2 mb-3">
                                                                {searchedAppliers
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
                                                                        value={AVUSearchInput}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome de usuário"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) => setAVUSearchInput(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') searchAnswerUsers(AVUSearchInput);
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
                                                                        value={AVCSearchInput}
                                                                        id="users-search"
                                                                        placeholder="Buscar por nome do grupo"
                                                                        className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0 mb-3"
                                                                        onChange={(e) => setAVCSearchInput(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') searchAnswerClassrooms(AVCSearchInput);
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
                                                                                    selectAnswerClassroom(parseInt(e.target.value));
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
                                                    <div className="mb-2" key={'page-' + protocol.pages[itemTarget.page].tempId}>
                                                        <div className="row gx-2 align-items-center mb-3">
                                                            <div className="col-auto">
                                                                <p className="color-grey font-century-gothic text-nowrap fw-bold fs-3 m-0">
                                                                    Página {Number(itemTarget.page) + 1}
                                                                </p>
                                                            </div>
                                                            <div className="col"></div>
                                                            <div className="col-auto">
                                                                <RoundedButton
                                                                    hsl={[197, 43, 52]}
                                                                    onClick={() =>
                                                                        updatePagePlacement(
                                                                            protocol.pages[itemTarget.page].placement + 1,
                                                                            protocol.pages[itemTarget.page].placement,
                                                                            itemTarget.page
                                                                        )
                                                                    }
                                                                    icon={iconArrowDown}
                                                                />
                                                            </div>
                                                            <div className="col-auto">
                                                                <RoundedButton
                                                                    hsl={[197, 43, 52]}
                                                                    onClick={() =>
                                                                        updatePagePlacement(
                                                                            protocol.pages[itemTarget.page].placement - 1,
                                                                            protocol.pages[itemTarget.page].placement,
                                                                            itemTarget.page
                                                                        )
                                                                    }
                                                                    icon={iconArrowUp}
                                                                />
                                                            </div>
                                                            <div className="col-auto">
                                                                <RoundedButton
                                                                    hsl={[197, 43, 52]}
                                                                    onClick={() => insertPageDependency(itemTarget.page)}
                                                                    icon={iconDependency}
                                                                />
                                                            </div>
                                                            <div className="col-auto">
                                                                <RoundedButton
                                                                    hsl={[197, 43, 52]}
                                                                    onClick={() => removePage(itemTarget.page)}
                                                                    icon={iconTrash}
                                                                />
                                                            </div>
                                                        </div>
                                                        {protocol.pages[itemTarget.page].dependencies?.map(
                                                            (dependency, dependencyIndex) => (
                                                                <div className="mb-4" key={'page-dependency-' + dependency.tempId}>
                                                                    <div className="row gx-2 pb-2">
                                                                        <div className="col">
                                                                            <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                                                                                Dependência {Number(dependencyIndex) + 1} (Página{' '}
                                                                                {Number(itemTarget.page) + 1})
                                                                            </h1>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <RoundedButton
                                                                                hsl={[190, 46, 70]}
                                                                                icon={iconTrash}
                                                                                onClick={() =>
                                                                                    removePageDependency(itemTarget.page, dependencyIndex)
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor="page-dependency-type"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Tipo de dependência
                                                                            </label>
                                                                            <select
                                                                                className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                                                                                id="page-dependency-type"
                                                                                value={dependency.type || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[itemTarget.page].dependencies[
                                                                                            dependencyIndex
                                                                                        ].type = event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option value="">Selecione...</option>
                                                                                <option value="IS_ANSWERED">Resposta obrigatória</option>
                                                                                <option value="EXACT_ANSWER">Resposta exata</option>
                                                                                <option value="OPTION_SELECTED">Opção selecionada</option>
                                                                                <option value="MIN">
                                                                                    Mínimo (numérico, caracteres ou opções)
                                                                                </option>
                                                                                <option value="MAX">
                                                                                    Máximo (numérico, caracteres ou opções)
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor="page-dependency-argument"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Argumento
                                                                            </label>
                                                                            <input
                                                                                className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                                                                id="page-dependency-argument"
                                                                                type={
                                                                                    dependency.type === 'MIN' || dependency.type === 'MAX'
                                                                                        ? 'number'
                                                                                        : 'text'
                                                                                }
                                                                                value={dependency.argument || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[itemTarget.page].dependencies[
                                                                                            dependencyIndex
                                                                                        ].argument = event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor="page-dependency-target"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Alvo da dependência
                                                                            </label>
                                                                            <select
                                                                                className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                                                                                id="page-dependency-target"
                                                                                value={dependency.itemTempId || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[itemTarget.page].dependencies[
                                                                                            dependencyIndex
                                                                                        ].itemTempId = event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option value="">Selecione...</option>
                                                                                {protocol.pages
                                                                                    .filter((p, i) => i < itemTarget.page)
                                                                                    .map((p, i) =>
                                                                                        p.itemGroups.map((g, j) =>
                                                                                            g.items
                                                                                                .filter(
                                                                                                    (it, k) =>
                                                                                                        ((dependency.type === 'MIN' ||
                                                                                                            dependency.type === 'MAX') &&
                                                                                                            (it.type === 'CHECKBOX' ||
                                                                                                                it.type === 'NUMBERBOX' ||
                                                                                                                it.type === 'TEXTBOX' ||
                                                                                                                it.type === 'RANGE')) ||
                                                                                                        (dependency.type ===
                                                                                                            'OPTION_SELECTED' &&
                                                                                                            (it.type === 'SELECT' ||
                                                                                                                it.type === 'RADIO' ||
                                                                                                                it.type === 'CHECKBOX')) ||
                                                                                                        (dependency.type ===
                                                                                                            'EXACT_ANSWER' &&
                                                                                                            (it.type === 'NUMBERBOX' ||
                                                                                                                it.type === 'TEXTBOX' ||
                                                                                                                it.type === 'RANGE')) ||
                                                                                                        dependency.type === 'IS_ANSWERED'
                                                                                                )
                                                                                                .map((it, k) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            'dependency-' +
                                                                                                            dependency.tempId +
                                                                                                            '-target-' +
                                                                                                            it.tempId +
                                                                                                            '-option'
                                                                                                        }
                                                                                                        value={it.tempId}
                                                                                                    >
                                                                                                        {it.text}
                                                                                                    </option>
                                                                                                ))
                                                                                        )
                                                                                    )}
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label
                                                                                htmlFor="page-dependency-custom-message"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Mensagem personalizada
                                                                            </label>
                                                                            <input
                                                                                className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                                                                id="page-dependency-custom-message"
                                                                                type="text"
                                                                                value={dependency.customMessage || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[itemTarget.page].dependencies[
                                                                                            dependencyIndex
                                                                                        ].customMessage = event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                        {protocol.pages[itemTarget.page].itemGroups[itemTarget.group] && (
                                                            <div className="mb-3" key={'group-' + itemTarget.group}>
                                                                <div className="row gx-2 align-items-center mb-3">
                                                                    <div className="col-auto">
                                                                        <p className="font-century-gothic color-steel-blue fs-3 fw-bold mb-2 m-0 p-0">
                                                                            Grupo {Number(itemTarget.group) + 1}
                                                                        </p>
                                                                    </div>
                                                                    <div className="col"></div>
                                                                    <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[197, 43, 52]}
                                                                            onClick={() =>
                                                                                updateGroupPlacement(
                                                                                    protocol.pages[itemTarget.page].itemGroups[
                                                                                        itemTarget.group
                                                                                    ].placement + 1,
                                                                                    protocol.pages[itemTarget.page].itemGroups[
                                                                                        itemTarget.group
                                                                                    ].placement,
                                                                                    itemTarget.page,
                                                                                    itemTarget.group
                                                                                )
                                                                            }
                                                                            icon={iconArrowDown}
                                                                        />
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[197, 43, 52]}
                                                                            onClick={() =>
                                                                                updateGroupPlacement(
                                                                                    protocol.pages[itemTarget.page].itemGroups[
                                                                                        itemTarget.group
                                                                                    ].placement - 1,
                                                                                    protocol.pages[itemTarget.page].itemGroups[
                                                                                        itemTarget.group
                                                                                    ].placement,
                                                                                    itemTarget.page,
                                                                                    itemTarget.group
                                                                                )
                                                                            }
                                                                            icon={iconArrowUp}
                                                                        />
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[197, 43, 52]}
                                                                            onClick={() =>
                                                                                insertItemGroupDependency(itemTarget.page, itemTarget.group)
                                                                            }
                                                                            icon={iconDependency}
                                                                        />
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[197, 43, 52]}
                                                                            onClick={() =>
                                                                                removeItemGroup(itemTarget.page, itemTarget.group)
                                                                            }
                                                                            icon={iconTrash}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {protocol.pages[itemTarget.page].itemGroups[
                                                                    itemTarget.group
                                                                ].dependencies?.map((dependency, dependencyIndex) => (
                                                                    <div className="mb-4" key={'group-dependency-' + dependency.tempId}>
                                                                        <div className="row gx-2 pb-2">
                                                                            <div className="col">
                                                                                <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                                                                                    Dependência {Number(dependencyIndex) + 1} (Grupo{' '}
                                                                                    {Number(itemTarget.group) + 1})
                                                                                </h1>
                                                                            </div>
                                                                            <div className="col-auto">
                                                                                <RoundedButton
                                                                                    hsl={[190, 46, 70]}
                                                                                    icon={iconTrash}
                                                                                    onClick={() =>
                                                                                        removeItemGroupDependency(
                                                                                            itemTarget.group,
                                                                                            dependencyIndex
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="group-dependency-type"
                                                                                    className="form-label fs-5 fw-medium"
                                                                                >
                                                                                    Tipo de dependência
                                                                                </label>
                                                                                <select
                                                                                    className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                                                                                    id="group-dependency-type"
                                                                                    value={dependency.type || ''}
                                                                                    onChange={(event) => {
                                                                                        setProtocol((prev) => {
                                                                                            const newProtocol = { ...prev };
                                                                                            newProtocol.pages[itemTarget.page].itemGroups[
                                                                                                itemTarget.group
                                                                                            ].dependencies[dependencyIndex].type =
                                                                                                event.target.value;
                                                                                            return newProtocol;
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <option value="">Selecione...</option>
                                                                                    <option value="IS_ANSWERED">
                                                                                        Resposta obrigatória
                                                                                    </option>
                                                                                    <option value="EXACT_ANSWER">Resposta exata</option>
                                                                                    <option value="OPTION_SELECTED">
                                                                                        Opção selecionada
                                                                                    </option>
                                                                                    <option value="MIN">
                                                                                        Mínimo (numérico, caracteres ou opções)
                                                                                    </option>
                                                                                    <option value="MAX">
                                                                                        Máximo (numérico, caracteres ou opções)
                                                                                    </option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="page-dependency-argument"
                                                                                    className="form-label fs-5 fw-medium"
                                                                                >
                                                                                    Argumento
                                                                                </label>
                                                                                <input
                                                                                    className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                                                                    id="page-dependency-argument"
                                                                                    type={
                                                                                        dependency.type === 'MIN' ||
                                                                                        dependency.type === 'MAX'
                                                                                            ? 'number'
                                                                                            : 'text'
                                                                                    }
                                                                                    value={dependency.argument || ''}
                                                                                    onChange={(event) => {
                                                                                        setProtocol((prev) => {
                                                                                            const newProtocol = { ...prev };
                                                                                            newProtocol.pages[itemTarget.page].itemGroups[
                                                                                                itemTarget.group
                                                                                            ].dependencies[dependencyIndex].argument =
                                                                                                event.target.value;
                                                                                            return newProtocol;
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="page-dependency-target"
                                                                                    className="form-label fs-5 fw-medium"
                                                                                >
                                                                                    Alvo da dependência
                                                                                </label>
                                                                                <select
                                                                                    className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                                                                                    id="page-dependency-target"
                                                                                    value={dependency.itemTempId || ''}
                                                                                    onChange={(event) => {
                                                                                        setProtocol((prev) => {
                                                                                            const newProtocol = { ...prev };
                                                                                            newProtocol.pages[itemTarget.page].itemGroups[
                                                                                                itemTarget.group
                                                                                            ].dependencies[dependencyIndex].itemTempId =
                                                                                                event.target.value;
                                                                                            return newProtocol;
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <option value="">Selecione...</option>
                                                                                    {protocol.pages
                                                                                        .filter((p, i) => i <= itemTarget.page)
                                                                                        .map((p, i) =>
                                                                                            p.itemGroups
                                                                                                .filter(
                                                                                                    (g, j) =>
                                                                                                        i < itemTarget.page ||
                                                                                                        (i === itemTarget.page &&
                                                                                                            j < itemTarget.group)
                                                                                                )
                                                                                                .map((g, j) =>
                                                                                                    g.items
                                                                                                        .filter(
                                                                                                            (it, k) =>
                                                                                                                ((dependency.type ===
                                                                                                                    'MIN' ||
                                                                                                                    dependency.type ===
                                                                                                                        'MAX') &&
                                                                                                                    (it.type ===
                                                                                                                        'CHECKBOX' ||
                                                                                                                        it.type ===
                                                                                                                            'NUMBERBOX' ||
                                                                                                                        it.type ===
                                                                                                                            'TEXTBOX' ||
                                                                                                                        it.type ===
                                                                                                                            'RANGE')) ||
                                                                                                                (dependency.type ===
                                                                                                                    'OPTION_SELECTED' &&
                                                                                                                    (it.type === 'SELECT' ||
                                                                                                                        it.type ===
                                                                                                                            'RADIO' ||
                                                                                                                        it.type ===
                                                                                                                            'CHECKBOX')) ||
                                                                                                                (dependency.type ===
                                                                                                                    'EXACT_ANSWER' &&
                                                                                                                    (it.type ===
                                                                                                                        'NUMBERBOX' ||
                                                                                                                        it.type ===
                                                                                                                            'TEXTBOX' ||
                                                                                                                        it.type ===
                                                                                                                            'RANGE')) ||
                                                                                                                dependency.type ===
                                                                                                                    'IS_ANSWERED'
                                                                                                        )
                                                                                                        .map((it, k) => (
                                                                                                            <option
                                                                                                                key={
                                                                                                                    'dependency-' +
                                                                                                                    dependency.tempId +
                                                                                                                    '-target-' +
                                                                                                                    it.tempId +
                                                                                                                    '-option'
                                                                                                                }
                                                                                                                value={it.tempId}
                                                                                                            >
                                                                                                                {it.text}
                                                                                                            </option>
                                                                                                        ))
                                                                                                )
                                                                                        )}
                                                                                </select>
                                                                            </div>
                                                                            <div>
                                                                                <label
                                                                                    htmlFor="page-dependency-custom-message"
                                                                                    className="form-label fs-5 fw-medium"
                                                                                >
                                                                                    Mensagem personalizada
                                                                                </label>
                                                                                <input
                                                                                    className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                                                                    id="page-dependency-custom-message"
                                                                                    type="text"
                                                                                    value={dependency.customMessage || ''}
                                                                                    onChange={(event) => {
                                                                                        setProtocol((prev) => {
                                                                                            const newProtocol = { ...prev };
                                                                                            newProtocol.pages[itemTarget.page].itemGroups[
                                                                                                itemTarget.group
                                                                                            ].dependencies[dependencyIndex].customMessage =
                                                                                                event.target.value;
                                                                                            return newProtocol;
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {protocol.pages[itemTarget.page].itemGroups[itemTarget.group].items?.map(
                                                                    (item, itemIndex) => (
                                                                        <div key={'item-' + item.tempId}>
                                                                            {(() => {
                                                                                switch (item.type) {
                                                                                    case 'TEXTBOX':
                                                                                        return (
                                                                                            <CreateTextBoxInput
                                                                                                currentItem={item}
                                                                                                pageIndex={itemTarget.page}
                                                                                                groupIndex={itemTarget.group}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                updateItemPlacementUp={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement - 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                updateItemPlacementDown={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement + 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                insertItemValidation={() =>
                                                                                                    insertItemValidation(
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    case 'NUMBERBOX':
                                                                                        return (
                                                                                            <CreateTextBoxInput
                                                                                                currentItem={item}
                                                                                                pageIndex={itemTarget.page}
                                                                                                groupIndex={itemTarget.group}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                isNumberBox={true}
                                                                                                updateItemPlacementUp={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement - 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                updateItemPlacementDown={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement + 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                insertItemValidation={() =>
                                                                                                    insertItemValidation(
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    case 'RANGE':
                                                                                        return (
                                                                                            <CreateRangeInput
                                                                                                currentItem={item}
                                                                                                pageIndex={itemTarget.page}
                                                                                                groupIndex={itemTarget.group}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                updateItemPlacementUp={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement - 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                updateItemPlacementDown={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement + 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                insertItemValidation={() =>
                                                                                                    insertItemValidation(
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    case 'SELECT':
                                                                                        return (
                                                                                            <CreateMultipleInputItens
                                                                                                type={item.type}
                                                                                                currentItem={item}
                                                                                                pageIndex={itemTarget.page}
                                                                                                groupIndex={itemTarget.group}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                updateItemPlacementUp={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement - 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                updateItemPlacementDown={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement + 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                insertItemValidation={() =>
                                                                                                    insertItemValidation(
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    case 'RADIO':
                                                                                        return (
                                                                                            <CreateMultipleInputItens
                                                                                                type={item.type}
                                                                                                currentItem={item}
                                                                                                pageIndex={itemTarget.page}
                                                                                                groupIndex={itemTarget.group}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                updateItemPlacementUp={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement - 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                updateItemPlacementDown={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement + 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                insertItemValidation={() =>
                                                                                                    insertItemValidation(
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    case 'CHECKBOX':
                                                                                        return (
                                                                                            <CreateMultipleInputItens
                                                                                                type={item.type}
                                                                                                currentItem={item}
                                                                                                pageIndex={itemTarget.page}
                                                                                                groupIndex={itemTarget.group}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                updateItemPlacementUp={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement - 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                updateItemPlacementDown={() =>
                                                                                                    updateItemPlacement(
                                                                                                        item.placement + 1,
                                                                                                        item.placement,
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                                insertItemValidation={() =>
                                                                                                    insertItemValidation(
                                                                                                        itemTarget.page,
                                                                                                        itemTarget.group,
                                                                                                        itemIndex
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    default:
                                                                                        return null;
                                                                                }
                                                                            })()}
                                                                            {item.itemValidations
                                                                                ?.filter(
                                                                                    (v) =>
                                                                                        (item.type === 'NUMBERBOX' ||
                                                                                            item.type === 'CHECKBOX' ||
                                                                                            item.type === 'TEXTBOX') &&
                                                                                        v.type !== 'MANDATORY'
                                                                                )
                                                                                .map((validation, validationIndex) => (
                                                                                    <div
                                                                                        className="mb-3"
                                                                                        key={'validation-' + validation.tempId}
                                                                                    >
                                                                                        <div className="row gx-2 pb-2">
                                                                                            <div className="col">
                                                                                                <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                                                                                                    Validação {Number(validationIndex) + 1}{' '}
                                                                                                    (Item {Number(itemIndex) + 1})
                                                                                                </h1>
                                                                                            </div>
                                                                                            <div className="col-auto">
                                                                                                <RoundedButton
                                                                                                    hsl={[190, 46, 70]}
                                                                                                    icon={iconTrash}
                                                                                                    onClick={() =>
                                                                                                        removeItemValidation(
                                                                                                            itemTarget.page,
                                                                                                            itemTarget.group,
                                                                                                            itemIndex,
                                                                                                            validationIndex
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="validation-type"
                                                                                                    className="form-label fs-5 fw-medium"
                                                                                                >
                                                                                                    Tipo de validação
                                                                                                </label>
                                                                                                <select
                                                                                                    className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                                                                                                    id="validation-type"
                                                                                                    value={validation.type || ''}
                                                                                                    onChange={(event) => {
                                                                                                        setProtocol((prev) => {
                                                                                                            const newProtocol = { ...prev };
                                                                                                            newProtocol.pages[
                                                                                                                itemTarget.page
                                                                                                            ].itemGroups[
                                                                                                                itemTarget.group
                                                                                                            ].items[
                                                                                                                itemIndex
                                                                                                            ].itemValidations[
                                                                                                                validationIndex
                                                                                                            ].type = event.target.value;
                                                                                                            return newProtocol;
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    <option value="">Selecione...</option>
                                                                                                    {item.type === 'NUMBERBOX' && (
                                                                                                        <>
                                                                                                            <option value="MIN">
                                                                                                                Número mínimo
                                                                                                            </option>
                                                                                                            <option value="MAX">
                                                                                                                Número máximo
                                                                                                            </option>
                                                                                                        </>
                                                                                                    )}

                                                                                                    {item.type === 'TEXTBOX' && (
                                                                                                        <>
                                                                                                            <option value="MIN">
                                                                                                                Mínimo de caracteres
                                                                                                            </option>
                                                                                                            <option value="MAX">
                                                                                                                Máximo de caracteres
                                                                                                            </option>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {item.type === 'CHECKBOX' && (
                                                                                                        <>
                                                                                                            <option value="MIN">
                                                                                                                Mínimo de escolhas
                                                                                                            </option>
                                                                                                            <option value="MAX">
                                                                                                                Máximo de escolhas
                                                                                                            </option>
                                                                                                        </>
                                                                                                    )}
                                                                                                </select>
                                                                                            </div>
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="validation-argument"
                                                                                                    className="form-label fs-5 fw-medium"
                                                                                                >
                                                                                                    Argumento
                                                                                                </label>
                                                                                                <input
                                                                                                    className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                                                                                    id="validation-argument"
                                                                                                    type="number"
                                                                                                    value={validation.argument || ''}
                                                                                                    onChange={(event) => {
                                                                                                        setProtocol((prev) => {
                                                                                                            const newProtocol = { ...prev };
                                                                                                            newProtocol.pages[
                                                                                                                itemTarget.page
                                                                                                            ].itemGroups[
                                                                                                                itemTarget.group
                                                                                                            ].items[
                                                                                                                itemIndex
                                                                                                            ].itemValidations[
                                                                                                                validationIndex
                                                                                                            ].argument = event.target.value;
                                                                                                            return newProtocol;
                                                                                                        });
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="validation-custom-message"
                                                                                                    className="form-label fs-5 fw-medium"
                                                                                                >
                                                                                                    Mensagem personalizada
                                                                                                </label>
                                                                                                <input
                                                                                                    className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                                                                                    id="validation-custom-message"
                                                                                                    type="text"
                                                                                                    value={validation.customMessage || ''}
                                                                                                    onChange={(event) => {
                                                                                                        setProtocol((prev) => {
                                                                                                            const newProtocol = { ...prev };
                                                                                                            newProtocol.pages[
                                                                                                                itemTarget.page
                                                                                                            ].itemGroups[
                                                                                                                itemTarget.group
                                                                                                            ].items[
                                                                                                                itemIndex
                                                                                                            ].itemValidations[
                                                                                                                validationIndex
                                                                                                            ].customMessage =
                                                                                                                event.target.value;
                                                                                                            return newProtocol;
                                                                                                        });
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="row justify-content-center">
                                                    <div className="col-8 col-lg-4">
                                                        <TextButton
                                                            type="button"
                                                            hsl={[97, 43, 70]}
                                                            text="Finalizar protocolo"
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
                                                </div>
                                                {isEditing && (
                                                    <div>
                                                        <button type="button" onClick={deleteProtocol}>
                                                            Excluir
                                                        </button>
                                                    </div>
                                                )}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto position-lg-sticky h-100 mh-100">
                                <div className="offcanvas-lg bg-pastel-blue offcanvas-end h-100 w-auto" tabIndex="-1" id="addbar">
                                    <div className="sidebar-wrapper bg-transparent d-flex flex-column h-100">
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-transparent rounded-circle border-0 d-lg-none"
                                                data-bs-dismiss="offcanvas"
                                                data-bs-target="#addbar"
                                            >
                                                <img className="exit-image" src={ExitIcon} alt="Exit Addbar Icon" />
                                            </button>
                                        </div>
                                        <div className="d-flex bg-transparent flex-column justify-content-center h-100">
                                            <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-start-4 p-4">
                                                <h1 className="font-century-gothic fs-3 fw-bold text-white mb-1">Adicionar</h1>
                                                <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">Ao protocolo</h1>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={insertPage}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Nova página</span>
                                                </button>
                                                <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">À página atual</h1>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItemGroup(itemTarget.page)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Novo grupo</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertPageDependency(itemTarget.page)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Dependência</span>
                                                </button>
                                                <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">Ao grupo atual</h1>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItem('TEXTBOX', itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Caixa de texto</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItem('NUMBERBOX', itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Caixa numérica</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItem('SELECT', itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Lista suspensa</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItem('RADIO', itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Seleção única</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItem('CHECKBOX', itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Múltipla escolha</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItem('RANGE', itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Intervalo numérico</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                                    onClick={() => insertItemGroupDependency(itemTarget.page, itemTarget.group)}
                                                >
                                                    <IconPlus className="icon-plus" />
                                                    <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Dependência</span>
                                                </button>
                                            </div>
                                            <div className="w-100 mt-2 px-3">
                                                <select
                                                    name="item-target-page"
                                                    id="item-target-page"
                                                    value={itemTarget.page}
                                                    className="form-select rounded-4 text-center text-white bg-steel-blue fs-5 fw-medium border-0"
                                                    onChange={(e) => setItemTarget((prev) => ({ group: '', page: e.target.value }))}
                                                >
                                                    <option value={''}>Página...</option>
                                                    {protocol.pages.map((page, index) => (
                                                        <option key={'page-' + page.tempId + '-option'} value={index}>
                                                            Página {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-100 mt-2 px-3">
                                                <select
                                                    name="item-target-group"
                                                    id="item-target-group"
                                                    value={itemTarget.group}
                                                    onChange={(e) => setItemTarget((prev) => ({ ...prev, group: e.target.value }))}
                                                    className="form-select rounded-4 text-center text-white bg-steel-blue fs-5 fw-medium border-0"
                                                >
                                                    <option value={''}>Grupo...</option>
                                                    {protocol.pages[itemTarget.page]?.itemGroups.map((group, index) => (
                                                        <option key={'group-' + group.tempId + '-option'} value={index}>
                                                            Grupo {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
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
