import { React, useState, useContext, useCallback, useEffect } from 'react';
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
import CreateTableInput from '../components/inputs/protocol/CreateTableInput';

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
    const [itemTarget, setItemTarget] = useState({ page: 0, group: 0 });
    const [institutionUsers, setInstitutionUsers] = useState([]);
    const [institutionClassrooms, setInstitutionClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
        const groupData = newProtocol.pages[page].itemGroups[group];
        const newPlacement = groupData.items.length + 1;

        const newItem = { ...defaultNewInput(type), placement: newPlacement };

        // Verificar se o grupo é do tipo TEXTBOX_TABLE, CHECKBOX_TABLE ou RADIO_TABLE
        if (['CHECKBOX_TABLE', 'RADIO_TABLE'].includes(groupData.type)) {
            const numColumns = groupData.tableColumns.length;

            // Se houver colunas, adicionar n opções ao item
            if (numColumns > 0) {
                newItem.itemOptions = Array.from({ length: numColumns }, (_, index) => ({
                    text: '',
                    placement: index + 1,
                    tempId: Date.now() + Math.random() * 1000,
                }));
            }
        }

        // Adicionar o item ao grupo de itens
        groupData.items.push(newItem);
        setProtocol(newProtocol);
    };

    const updateItem = useCallback((item, page, group, index) => {
        setProtocol((prev) => {
            const newProtocol = { ...prev };
            newProtocol.pages[page].itemGroups[group].items[index] = item;
            return newProtocol;
        });
    }, []);

    const removeItem = useCallback((page, group, index) => {
        setProtocol((prev) => {
            const newProtocol = { ...prev };
            newProtocol.pages[page].itemGroups[group].items.splice(index, 1);
            for (const [i, item] of newProtocol.pages[page].itemGroups[group].items.entries()) {
                if (i >= index) item.placement--;
            }
            return newProtocol;
        });
    }, []);

    const insertPage = useCallback(() => {
        const newProtocol = { ...protocol };
        const newPlacement = newProtocol.pages.length + 1;
        const tempId = Date.now() + Math.random() * 1000;
        newProtocol.pages.push({ type: 'ITEMS', itemGroups: [], dependencies: [], placement: newPlacement, tempId: tempId });
        setProtocol(newProtocol);
    }, [protocol]);

    const removePage = useCallback(
        (index) => {
            const newProtocol = { ...protocol };
            newProtocol.pages.splice(index, 1);
            for (const [i, page] of newProtocol.pages.entries()) {
                if (i >= index) page.placement--;
            }
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertItemGroup = useCallback(
        (type, page) => {
            const newProtocol = { ...protocol };
            const newPlacement = newProtocol.pages[page].itemGroups.length + 1;
            const tempId = Date.now() + Math.random() * 1000;
            newProtocol.pages[page].itemGroups.push({
                type: type,
                isRepeatable: false,
                items: [],
                dependencies: [],
                tableColumns: [],
                placement: newPlacement,
                tempId: tempId,
            });
            setProtocol(newProtocol);
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
        },
        [protocol]
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

    const insertTable = useCallback(
        (type, page) => {
            const newProtocol = { ...protocol };
            insertItemGroup(type, page);
            setProtocol(newProtocol);
        },
        [protocol, insertItemGroup]
    );

    const insertTableColumn = useCallback(
        (page, group) => {
            const newProtocol = { ...protocol };
            const groupData = newProtocol.pages[page].itemGroups[group];
            groupData.tableColumns.push({
                text: '',
                placement: groupData.tableColumns.length + 1,
            });

            setProtocol(newProtocol);
        },
        [protocol]
    );

    const removeTableColumn = useCallback(
        (page, group, index) => {
            const newProtocol = { ...protocol };
            const groupData = newProtocol.pages[page].itemGroups[group];
            groupData.tableColumns.splice(index, 1);

            groupData.tableColumns = groupData.tableColumns.map((column, newIndex) => ({
                ...column,
                placement: newIndex + 1, // Adjust placement to reflect the new index
            }));

            // Verifica se o grupo é "CHECKBOX_TABLE" ou "RADIO_TABLE"
            if (['CHECKBOX_TABLE', 'RADIO_TABLE'].includes(groupData.type)) {
                groupData.items?.map((item, itemIndex) => {
                    if (item.itemOptions.length > index) {
                        // Remove a opção do item correspondente ao índice da coluna removida
                        const updatedItemOptions = item.itemOptions.filter((_, optionIndex) => optionIndex !== index);

                        // Reajusta os placements das opções restantes
                        const adjustedItemOptions = updatedItemOptions.map((option, newOptionIndex) => ({
                            ...option,
                            placement: newOptionIndex + 1,
                        }));

                        const updatedItem = {
                            ...item,
                            itemOptions: adjustedItemOptions,
                        };

                        updateItem(updatedItem, page, group, itemIndex);

                        return updatedItem;
                    }
                    return item;
                });
            }

            setProtocol(newProtocol);
        },
        [protocol, updateItem]
    );

    const updateTableColumn = useCallback(
        (page, group, index, newText) => {
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups[group].tableColumns[index].text = newText;
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
                        })
                        .catch((error) => {
                            setError({ text: 'Erro ao carregar criação do protocolo', description: error.response?.data.message || '' });
                        })
                );
            }
            promises.push(
                axios
                    .get(`${baseUrl}api/institution/getInstitution/${user.institutionId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setInstitutionUsers(d.users.map((u) => ({ id: u.id, username: u.username, role: u.role })));
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar criação do protocolo', description: error.response?.data.message || '' });
                    })
            );
            promises.push(
                axios
                    .get(`${baseUrl}api/institution/getInstitution/${user.institutionId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setInstitutionClassrooms(d.classrooms.map((c) => ({ id: c.id, name: c.name })));
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar criação do protocolo', description: error.response?.data.message || '' });
                    })
            );
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [isLoading, user.token, isEditing, protocolId, user.institutionId, user.status, user.role, user.id]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de protocolo..." />;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 font-barlow p-4 p-lg-5">
                <div className="row flex-grow-1 justify-content-center m-0">
                    <div className="col col-md-10">
                        <div className="row m-0">
                            <h1 className="font-century-gothic color-grey fs-3 fw-bold p-0 pb-4 pb-lg-5 m-0 titulo-form">
                                Gerador de formulários
                            </h1>
                        </div>
                        <div className="row flex-grow-1 m-0">
                            <div className="col-12 col-lg-auto p-0 pb-4">
                                <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-4 p-4">
                                    <h1 className="font-century-gothic fs-3 fw-bold text-white">Adicionar</h1>
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
                                        onClick={() => insertTable('TEXTBOX_TABLE', itemTarget.page)}
                                    >
                                        <IconPlus className="icon-plus" />
                                        <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Tabela de texto</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                        onClick={() => insertTable('RADIO_TABLE', itemTarget.page)}
                                    >
                                        <IconPlus className="icon-plus" />
                                        <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Tabela de escolha simples</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                        onClick={() => insertTable('CHECKBOX_TABLE', itemTarget.page)}
                                    >
                                        <IconPlus className="icon-plus" />
                                        <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Tabela de múltipla escolha</span>
                                    </button>
                                    <label htmlFor="item-target-page" className="form-label fs-5 fw-medium">
                                        Página
                                    </label>
                                    <select
                                        name="item-target-page"
                                        id="item-target-page"
                                        onChange={(e) => setItemTarget((prev) => ({ ...prev, page: e.target.value }))}
                                    >
                                        <option value={''}>Selecione...</option>
                                        {protocol.pages.map((page, index) => (
                                            <option key={'page-' + page.tempId + '-option'} value={index}>
                                                Página {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="item-target-group" className="form-label fs-5 fw-medium">
                                        Grupo
                                    </label>
                                    <select
                                        name="item-target-group"
                                        id="item-target-group"
                                        onChange={(e) => setItemTarget((prev) => ({ ...prev, group: e.target.value }))}
                                    >
                                        <option value={''}>Selecione...</option>
                                        {protocol.pages[itemTarget.page]?.itemGroups.map((group, index) => (
                                            <option key={'group-' + group.tempId + '-option'} value={index}>
                                                Grupo {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col d-flex flex-column p-0 ps-lg-5">
                                <form className="d-flex flex-column flex-grow-1" onSubmit={handleSubmit}>
                                    <div className="flex-grow-1 mb-3">
                                        <label htmlFor="title" className="form-label fs-5 fw-medium">
                                            Título do formulário
                                        </label>
                                        <textarea
                                            className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                            id="title"
                                            rows="3"
                                            value={protocol.title || ''}
                                            onChange={(event) => setProtocol((prev) => ({ ...prev, title: event.target.value }))}
                                        ></textarea>
                                        <label htmlFor="description" className="form-label fs-5 fw-medium">
                                            Descrição do formulário
                                        </label>
                                        <textarea
                                            className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                            id="description"
                                            rows="6"
                                            value={protocol.description || ''}
                                            onChange={(event) => setProtocol((prev) => ({ ...prev, description: event.target.value }))}
                                        ></textarea>
                                        <label htmlFor="enabled" className="form-label fs-5 fw-medium">
                                            Habilitado
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
                                        <label htmlFor="visibility" className="form-label fs-5 fw-medium">
                                            Visibilidade
                                        </label>
                                        <select
                                            className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                            id="visibility"
                                            value={protocol.visibility || ''}
                                            onChange={(event) => setProtocol((prev) => ({ ...prev, visibility: event.target.value }))}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="PUBLIC">Público</option>
                                            <option value="RESTRICT">Restrito</option>
                                        </select>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione os usuários visualizadores</span>
                                            {institutionUsers.map((u) => (
                                                <div key={'viewer-user-' + u.id + '-option'}>
                                                    <input
                                                        form="application-form"
                                                        type="checkbox"
                                                        name="viewers-user"
                                                        id={`viewer-user-${u.id}`}
                                                        value={u.id}
                                                        checked={protocol.viewersUser.includes(u.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setProtocol((prev) => ({
                                                                    ...prev,
                                                                    viewersUser: [...prev.viewersUser, parseInt(e.target.value)],
                                                                }));
                                                            } else {
                                                                setProtocol((prev) => ({
                                                                    ...prev,
                                                                    viewersUser: prev.viewersUser.filter(
                                                                        (id) => id !== parseInt(e.target.value)
                                                                    ),
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`viewer-user-${u.id}`}>{u.username}</label>
                                                </div>
                                            ))}
                                        </fieldset>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione as salas de aula visualizadoras</span>
                                            {institutionClassrooms.map((c) => (
                                                <div key={'viewer-classroom-' + c.id + '-option'}>
                                                    <input
                                                        form="application-form"
                                                        type="checkbox"
                                                        name="viewers-classroom"
                                                        id={`viewer-classroom-${c.id}`}
                                                        value={c.id}
                                                        checked={protocol.viewersClassroom.includes(c.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setProtocol((prev) => ({
                                                                    ...prev,
                                                                    viewersClassroom: [...prev.viewersClassroom, parseInt(e.target.value)],
                                                                }));
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
                                                    <label htmlFor={`viewer-classroom-${c.id}`}>{c.name}</label>
                                                </div>
                                            ))}
                                        </fieldset>
                                        <label htmlFor="applicability" className="form-label fs-5 fw-medium">
                                            Aplicabilidade
                                        </label>
                                        <select
                                            className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                            id="applicability"
                                            value={protocol.applicability || ''}
                                            onChange={(event) => setProtocol((prev) => ({ ...prev, applicability: event.target.value }))}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="PUBLIC">Público</option>
                                            <option value="RESTRICT">Restrito</option>
                                        </select>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione os usuários aplicadores</span>
                                            {institutionUsers
                                                .filter((u) => u.role !== 'USER' && u.role !== 'ADMIN')
                                                .map((u) => (
                                                    <div key={'applier-' + u.id + '-option'}>
                                                        <input
                                                            form="application-form"
                                                            type="checkbox"
                                                            name="applier"
                                                            id={`applier-${u.id}`}
                                                            value={u.id}
                                                            checked={protocol.appliers.includes(u.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setProtocol((prev) => ({
                                                                        ...prev,
                                                                        appliers: [...prev.appliers, parseInt(e.target.value)],
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
                                                        <label htmlFor={`applier-${u.id}`}>{u.username}</label>
                                                    </div>
                                                ))}
                                        </fieldset>
                                        <label htmlFor="answer-visiblity" className="form-label fs-5 fw-medium">
                                            Visibilidade das respostas
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
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione os usuários visualizadores de resposta</span>
                                            {institutionUsers.map((u) => (
                                                <div key={'answer-viewer-user-' + u.id + '-option'}>
                                                    <input
                                                        form="application-form"
                                                        type="checkbox"
                                                        name="answer-viewers-user"
                                                        id={`answer-viewer-user-${u.id}`}
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
                                                                setProtocol((prev) => ({
                                                                    ...prev,
                                                                    answersViewersUser: prev.answersViewersUser.filter(
                                                                        (id) => id !== parseInt(e.target.value)
                                                                    ),
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`answer-viewer-user-${u.id}`}>{u.username}</label>
                                                </div>
                                            ))}
                                        </fieldset>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione as salas de aula visualizadoras de resposta</span>
                                            {institutionClassrooms.map((c) => (
                                                <div key={'answer-viewer-classroom-' + c.id + '-option'}>
                                                    <input
                                                        form="application-form"
                                                        type="checkbox"
                                                        name="answer-viewers-classroom"
                                                        id={`answer-viewer-classroom-${c.id}`}
                                                        value={c.id}
                                                        checked={protocol.answersViewersClassroom.includes(c.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setProtocol((prev) => ({
                                                                    ...prev,
                                                                    answersViewersClassroom: [
                                                                        ...prev.answersViewersClassroom,
                                                                        parseInt(e.target.value),
                                                                    ],
                                                                }));
                                                            } else {
                                                                setProtocol((prev) => ({
                                                                    ...prev,
                                                                    answersViewersClassroom: prev.answersViewersClassroom.filter(
                                                                        (id) => id !== parseInt(e.target.value)
                                                                    ),
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`answer-viewer-classroom-${c.id}`}>{c.name}</label>
                                                </div>
                                            ))}
                                        </fieldset>
                                        <label htmlFor="replicable" className="form-label fs-5 fw-medium">
                                            Replicável
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
                                    {protocol.pages?.map((page, pageIndex) => {
                                        return (
                                            <div className="bg-primary-subtle mb-2" key={'page-' + page.tempId}>
                                                <span>Página {pageIndex + 1}</span>
                                                <br />
                                                <button
                                                    type="button"
                                                    onClick={() => updatePagePlacement(page.placement - 1, page.placement, pageIndex)}
                                                >
                                                    Mover ⬆
                                                </button>
                                                <br />
                                                <button
                                                    type="button"
                                                    onClick={() => updatePagePlacement(page.placement + 1, page.placement, pageIndex)}
                                                >
                                                    Mover ⬇
                                                </button>
                                                <br />
                                                <button type="button" onClick={() => removePage(pageIndex)}>
                                                    X Página
                                                </button>
                                                <br />
                                                {page.dependencies?.map((dependency, dependencyIndex) => (
                                                    <div key={'page-dependency-' + dependency.tempId}>
                                                        <p className="m-0 p-0">Dependência {dependencyIndex + 1}</p>
                                                        <label htmlFor="dependency-type" className="form-label fs-5 fw-medium">
                                                            Tipo de dependência
                                                        </label>
                                                        <select
                                                            className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                            id="page-dependency-type"
                                                            value={dependency.type || ''}
                                                            onChange={(event) => {
                                                                setProtocol((prev) => {
                                                                    const newProtocol = { ...prev };
                                                                    newProtocol.pages[pageIndex].dependencies[dependencyIndex].type =
                                                                        event.target.value;
                                                                    return newProtocol;
                                                                });
                                                            }}
                                                        >
                                                            <option value="">Selecione...</option>
                                                            <option value="IS_ANSWERED">Resposta obrigatória</option>
                                                            <option value="EXACT_ANSWER">Resposta exata</option>
                                                            <option value="OPTION_SELECTED">Opção selecionada</option>
                                                            <option value="MIN">Mínimo (numérico, caracteres ou opções)</option>
                                                            <option value="MAX">Máximo (numérico, caracteres ou opções)</option>
                                                        </select>
                                                        <label htmlFor="page-dependency-argument" className="form-label fs-5 fw-medium">
                                                            Argumento
                                                        </label>
                                                        <input
                                                            className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                            id="page-dependency-argument"
                                                            type={
                                                                dependency.type === 'MIN' || dependency.type === 'MAX' ? 'number' : 'text'
                                                            }
                                                            value={dependency.argument || ''}
                                                            onChange={(event) => {
                                                                setProtocol((prev) => {
                                                                    const newProtocol = { ...prev };
                                                                    newProtocol.pages[pageIndex].dependencies[dependencyIndex].argument =
                                                                        event.target.value;
                                                                    return newProtocol;
                                                                });
                                                            }}
                                                        />
                                                        <label htmlFor="page-dependency-target" className="form-label fs-5 fw-medium">
                                                            Alvo da dependência
                                                        </label>
                                                        <select
                                                            className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                            id="page-dependency-target"
                                                            value={dependency.itemTempId || ''}
                                                            onChange={(event) => {
                                                                setProtocol((prev) => {
                                                                    const newProtocol = { ...prev };
                                                                    newProtocol.pages[pageIndex].dependencies[dependencyIndex].itemTempId =
                                                                        event.target.value;
                                                                    return newProtocol;
                                                                });
                                                            }}
                                                        >
                                                            <option value="">Selecione...</option>
                                                            {protocol.pages
                                                                .filter((p, i) => i < pageIndex)
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
                                                                                    (dependency.type === 'OPTION_SELECTED' &&
                                                                                        (it.type === 'SELECT' ||
                                                                                            it.type === 'RADIO' ||
                                                                                            it.type === 'CHECKBOX')) ||
                                                                                    (dependency.type === 'EXACT_ANSWER' &&
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
                                                        <label
                                                            htmlFor="page-dependency-custom-message"
                                                            className="form-label fs-5 fw-medium"
                                                        >
                                                            Mensagem personalizada
                                                        </label>
                                                        <input
                                                            className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                            id="page-dependency-custom-message"
                                                            type="text"
                                                            value={dependency.customMessage || ''}
                                                            onChange={(event) => {
                                                                setProtocol((prev) => {
                                                                    const newProtocol = { ...prev };
                                                                    newProtocol.pages[pageIndex].dependencies[
                                                                        dependencyIndex
                                                                    ].customMessage = event.target.value;
                                                                    return newProtocol;
                                                                });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePageDependency(pageIndex, dependencyIndex)}
                                                        >
                                                            X Dependência de página
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => insertPageDependency(pageIndex)}>
                                                    + Dependência de página
                                                </button>
                                                <br />
                                                {page.itemGroups?.map((group, groupIndex) => {
                                                    switch (group.type) {
                                                        case 'ONE_DIMENSIONAL':
                                                            return (
                                                                <div className="bg-light mb-3" key={'group-' + groupIndex}>
                                                                    <p className="m-0 p-0">Grupo {groupIndex + 1}</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateGroupPlacement(
                                                                                group.placement - 1,
                                                                                group.placement,
                                                                                pageIndex,
                                                                                groupIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        Mover ⬆
                                                                    </button>
                                                                    <br />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateGroupPlacement(
                                                                                group.placement + 1,
                                                                                group.placement,
                                                                                pageIndex,
                                                                                groupIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        Mover ⬇
                                                                    </button>
                                                                    <br />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeItemGroup(pageIndex, groupIndex)}
                                                                    >
                                                                        X Grupo
                                                                    </button>
                                                                    <br />
                                                                    {group.dependencies?.map((dependency, dependencyIndex) => (
                                                                        <div key={'group-dependency-' + dependency.tempId}>
                                                                            <p className="m-0 p-0">Dependência {dependencyIndex + 1}</p>
                                                                            <label
                                                                                htmlFor="dependency-type"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Tipo de dependência
                                                                            </label>
                                                                            <select
                                                                                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                id="dependency-type"
                                                                                value={dependency.type || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[pageIndex].itemGroups[
                                                                                            groupIndex
                                                                                        ].dependencies[dependencyIndex].type =
                                                                                            event.target.value;
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
                                                                            <label
                                                                                htmlFor="dependency-argument"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Argumento
                                                                            </label>
                                                                            <input
                                                                                className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                id="dependency-argument"
                                                                                type="text"
                                                                                value={dependency.argument || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[pageIndex].itemGroups[
                                                                                            groupIndex
                                                                                        ].dependencies[dependencyIndex].argument =
                                                                                            event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <label
                                                                                htmlFor="dependency-target"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Alvo da dependência
                                                                            </label>
                                                                            <select
                                                                                className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                id="dependency-target"
                                                                                value={dependency.itemTempId || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[pageIndex].itemGroups[
                                                                                            groupIndex
                                                                                        ].dependencies[dependencyIndex].itemTempId =
                                                                                            event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option value="">Selecione...</option>
                                                                                {protocol.pages
                                                                                    .filter((p, i) => i <= pageIndex)
                                                                                    .map((p, i) =>
                                                                                        p.itemGroups
                                                                                            .filter(
                                                                                                (g, j) =>
                                                                                                    i < pageIndex ||
                                                                                                    (i === pageIndex && j < groupIndex)
                                                                                            )
                                                                                            .map((g, j) =>
                                                                                                g.items
                                                                                                    .filter(
                                                                                                        (it, k) =>
                                                                                                            ((dependency.type === 'MIN' ||
                                                                                                                dependency.type ===
                                                                                                                    'MAX') &&
                                                                                                                (it.type === 'CHECKBOX' ||
                                                                                                                    it.type ===
                                                                                                                        'NUMBERBOX' ||
                                                                                                                    it.type === 'TEXTBOX' ||
                                                                                                                    it.type === 'RANGE')) ||
                                                                                                            (dependency.type ===
                                                                                                                'OPTION_SELECTED' &&
                                                                                                                (it.type === 'SELECT' ||
                                                                                                                    it.type === 'RADIO' ||
                                                                                                                    it.type ===
                                                                                                                        'CHECKBOX')) ||
                                                                                                            (dependency.type ===
                                                                                                                'EXACT_ANSWER' &&
                                                                                                                (it.type === 'NUMBERBOX' ||
                                                                                                                    it.type === 'TEXTBOX' ||
                                                                                                                    it.type === 'RANGE')) ||
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
                                                                            <label
                                                                                htmlFor="dependency-custom-message"
                                                                                className="form-label fs-5 fw-medium"
                                                                            >
                                                                                Mensagem personalizada
                                                                            </label>
                                                                            <input
                                                                                className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                id="dependency-custom-message"
                                                                                type="text"
                                                                                value={dependency.customMessage || ''}
                                                                                onChange={(event) => {
                                                                                    setProtocol((prev) => {
                                                                                        const newProtocol = { ...prev };
                                                                                        newProtocol.pages[pageIndex].itemGroups[
                                                                                            groupIndex
                                                                                        ].dependencies[dependencyIndex].customMessage =
                                                                                            event.target.value;
                                                                                        return newProtocol;
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeItemGroupDependency(
                                                                                        pageIndex,
                                                                                        groupIndex,
                                                                                        dependencyIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                X Dependência de grupo
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => insertItemGroupDependency(pageIndex, groupIndex)}
                                                                    >
                                                                        + Dependência de grupo
                                                                    </button>
                                                                    <br />
                                                                    {group.items?.map((item, itemIndex) => (
                                                                        <div key={'item-' + item.tempId}>
                                                                            <p className="p-0 m-0">Item {itemIndex + 1}</p>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    updateItemPlacement(
                                                                                        item.placement - 1,
                                                                                        item.placement,
                                                                                        pageIndex,
                                                                                        groupIndex,
                                                                                        itemIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                Mover ⬆
                                                                            </button>
                                                                            <br />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    updateItemPlacement(
                                                                                        item.placement + 1,
                                                                                        item.placement,
                                                                                        pageIndex,
                                                                                        groupIndex,
                                                                                        itemIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                Mover ⬇
                                                                            </button>
                                                                            {(() => {
                                                                                switch (item.type) {
                                                                                    case 'TEXTBOX':
                                                                                        return (
                                                                                            <CreateTextBoxInput
                                                                                                currentItem={item}
                                                                                                pageIndex={pageIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                            />
                                                                                        );
                                                                                    case 'NUMBERBOX':
                                                                                        return (
                                                                                            <CreateTextBoxInput
                                                                                                currentItem={item}
                                                                                                pageIndex={pageIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                                isNumberBox={true}
                                                                                            />
                                                                                        );
                                                                                    case 'RANGE':
                                                                                        return (
                                                                                            <CreateRangeInput
                                                                                                currentItem={item}
                                                                                                pageIndex={pageIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                            />
                                                                                        );
                                                                                    case 'SELECT':
                                                                                        return (
                                                                                            <CreateMultipleInputItens
                                                                                                type={item.type}
                                                                                                currentItem={item}
                                                                                                pageIndex={pageIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                            />
                                                                                        );
                                                                                    case 'RADIO':
                                                                                        return (
                                                                                            <CreateMultipleInputItens
                                                                                                type={item.type}
                                                                                                currentItem={item}
                                                                                                pageIndex={pageIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
                                                                                            />
                                                                                        );
                                                                                    case 'CHECKBOX':
                                                                                        return (
                                                                                            <CreateMultipleInputItens
                                                                                                type={item.type}
                                                                                                currentItem={item}
                                                                                                pageIndex={pageIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                itemIndex={itemIndex}
                                                                                                updateItem={updateItem}
                                                                                                removeItem={removeItem}
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
                                                                                    <div key={'validation-' + validation.tempId}>
                                                                                        <p className="m-0 p-0">
                                                                                            Validação {validationIndex + 1}
                                                                                        </p>
                                                                                        <label
                                                                                            htmlFor="validation-type"
                                                                                            className="form-label fs-5 fw-medium"
                                                                                        >
                                                                                            Tipo de validação
                                                                                        </label>
                                                                                        <select
                                                                                            className="form-select rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                            id="validation-type"
                                                                                            value={validation.type || ''}
                                                                                            onChange={(event) => {
                                                                                                setProtocol((prev) => {
                                                                                                    const newProtocol = { ...prev };
                                                                                                    newProtocol.pages[pageIndex].itemGroups[
                                                                                                        groupIndex
                                                                                                    ].items[itemIndex].itemValidations[
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
                                                                                        <label
                                                                                            htmlFor="validation-argument"
                                                                                            className="form-label fs-5 fw-medium"
                                                                                        >
                                                                                            Argumento
                                                                                        </label>
                                                                                        <input
                                                                                            className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                            id="validation-argument"
                                                                                            type="number"
                                                                                            value={validation.argument || ''}
                                                                                            onChange={(event) => {
                                                                                                setProtocol((prev) => {
                                                                                                    const newProtocol = { ...prev };
                                                                                                    newProtocol.pages[pageIndex].itemGroups[
                                                                                                        groupIndex
                                                                                                    ].items[itemIndex].itemValidations[
                                                                                                        validationIndex
                                                                                                    ].argument = event.target.value;
                                                                                                    return newProtocol;
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                        <label
                                                                                            htmlFor="validation-custom-message"
                                                                                            className="form-label fs-5 fw-medium"
                                                                                        >
                                                                                            Mensagem personalizada
                                                                                        </label>
                                                                                        <input
                                                                                            className="form-control rounded-4 bg-light-pastel-blue fs-5 mb-3"
                                                                                            id="validation-custom-message"
                                                                                            type="text"
                                                                                            value={validation.customMessage || ''}
                                                                                            onChange={(event) => {
                                                                                                setProtocol((prev) => {
                                                                                                    const newProtocol = { ...prev };
                                                                                                    newProtocol.pages[pageIndex].itemGroups[
                                                                                                        groupIndex
                                                                                                    ].items[itemIndex].itemValidations[
                                                                                                        validationIndex
                                                                                                    ].customMessage = event.target.value;
                                                                                                    return newProtocol;
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                removeItemValidation(
                                                                                                    pageIndex,
                                                                                                    groupIndex,
                                                                                                    itemIndex,
                                                                                                    validationIndex
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            X Validação
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            {(item.type === 'CHECKBOX' ||
                                                                                item.type === 'NUMBERBOX' ||
                                                                                item.type === 'TEXTBOX') && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        insertItemValidation(
                                                                                            pageIndex,
                                                                                            groupIndex,
                                                                                            itemIndex
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    + Validação
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        case 'TEXTBOX_TABLE':
                                                            return (
                                                                <div className="bg-light mb-3" key={'group-' + groupIndex}>
                                                                    <CreateTableInput
                                                                        group={group}
                                                                        page={page}
                                                                        groupIndex={groupIndex}
                                                                        pageIndex={pageIndex}
                                                                        insertItem={insertItem}
                                                                        updateItem={updateItem}
                                                                        removeItem={removeItem}
                                                                        insertTableColumn={insertTableColumn}
                                                                        updateTableColumn={updateTableColumn}
                                                                        removeTableColumn={removeTableColumn}
                                                                        removeItemGroup={removeItemGroup}
                                                                    />
                                                                </div>
                                                            );

                                                        case 'RADIO_TABLE':
                                                            return (
                                                                <div className="bg-light mb-3" key={'group-' + groupIndex}>
                                                                    <CreateTableInput
                                                                        group={group}
                                                                        page={page}
                                                                        groupIndex={groupIndex}
                                                                        pageIndex={pageIndex}
                                                                        insertItem={insertItem}
                                                                        updateItem={updateItem}
                                                                        removeItem={removeItem}
                                                                        insertTableColumn={insertTableColumn}
                                                                        updateTableColumn={updateTableColumn}
                                                                        removeTableColumn={removeTableColumn}
                                                                        removeItemGroup={removeItemGroup}
                                                                    />
                                                                </div>
                                                            );

                                                        case 'CHECKBOX_TABLE':
                                                            return (
                                                                <div className="bg-light mb-3" key={'group-' + groupIndex}>
                                                                    <CreateTableInput
                                                                        group={group}
                                                                        page={page}
                                                                        groupIndex={groupIndex}
                                                                        pageIndex={pageIndex}
                                                                        insertItem={insertItem}
                                                                        updateItem={updateItem}
                                                                        removeItem={removeItem}
                                                                        insertTableColumn={insertTableColumn}
                                                                        updateTableColumn={updateTableColumn}
                                                                        removeTableColumn={removeTableColumn}
                                                                        removeItemGroup={removeItemGroup}
                                                                    />
                                                                </div>
                                                            );

                                                        default:
                                                            return null;
                                                    }
                                                })}
                                                <button type="button" onClick={() => insertItemGroup('ONE_DIMENSIONAL', pageIndex)}>
                                                    + Grupo
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button type="button" onClick={insertPage}>
                                        + Página
                                    </button>
                                    <div className="row justify-content-center m-0">
                                        <div className="col-8 col-lg-4">
                                            <TextButton type="submit" hsl={[97, 43, 70]} text="Finalizar protocolo" />
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
            </div>
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar showExitButton={true} />
            </div>
            <style>{CreateProtocolStyles}</style>
        </div>
    );
}

export default CreateProtocolPage;
