/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useContext, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SplashPage from './SplashPage';
import Sidebar from '../components/Sidebar';
import { defaultNewDependency, defaultNewInput, defaultNewItemGroup, defaultNewPage, defaultNewProtocol } from '../utils/constants';
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';
import AddBar from '../components/Addbar';
import CreatePage from '../components/CreatePage';
import CreateProtocolProperties from '../components/CreateProcotolProperties';
import { StorageContext } from '../contexts/StorageContext';

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

    .bg-light-grey,
    .light-grey-input,
    .light-grey-input:focus,
    .light-grey-input:active {
        background-color: #D9D9D9;
        border-color: #D9D9D9;
    }

    .light-grey-input:focus,
    .light-grey-input:active,
    .pastel-blue-input:focus,
    .pastel-blue-input:active {
        box-shadow: inset 0px 4px 4px 0px #00000040;
    }

    .light-grey-input:disabled,
    .pastel-blue-input:disabled{
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
    }

    .pastel-blue-input,
    .pastel-blue-input:focus,
    .pastel-blue-input:active {
        background-color: #b8d7e3;
        border-color: #b8d7e3;
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
        width: 15px;
    }

    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    .border-bottom.border-steel-blue:focus,
    .border-bottom.border-steel-blue:active {
        box-shadow: inset 0 -8px 8px -9px #00000040;
    }
`;

function CreateProtocolPage(props) {
    const { protocolId } = useParams();
    const { isEditing = false } = props;
    const { user } = useContext(AuthContext);
    const { clearLocalApplications } = useContext(StorageContext);

    const [protocol, setProtocol] = useState(defaultNewProtocol());
    const [itemTarget, setItemTarget] = useState({ page: '', group: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [creationMode, setCreationMode] = useState('properties');
    const [error, setError] = useState(null);
    const formRef = useRef();
    const currentPage = protocol.pages[itemTarget.page];

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
        if (page === '')
            return showAlert({ headerText: 'Nenhuma página selecionada. Selecione ou crie a página onde deseja adicionar o item.' });

        if (group === '')
            return showAlert({ headerText: 'Nenhum grupo selecionado. Selecione ou crie o grupo onde deseja adicionar o item.' });

        const groupType = protocol.pages[page].itemGroups[group].type;
        if (groupType !== 'ONE_DIMENSIONAL' && type !== 'TABLEROW')
            return showAlert({ title: 'Selecione um grupo que não seja do tipo tabela.', dismissible: true });

        const newProtocol = { ...protocol };
        const newInput = {
            ...defaultNewInput(
                type,
                Math.floor(Date.now() + Math.random() * 1000),
                newProtocol.pages[page].itemGroups[group].items.length + 1
            ),
        };
        newProtocol.pages[page].itemGroups[group].items.push(newInput);
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
            for (const [i, page] of newProtocol.pages.entries()) if (i >= index) page.placement--;
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertItemGroup = useCallback(
        (type, page) => {
            if (page === '')
                return showAlert({ headerText: 'Nenhuma página selecionada. Selecione ou crie a página onde deseja adicionar o grupo.' });
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups.push(defaultNewItemGroup(type, newProtocol.pages[page].itemGroups.length + 1));
            setProtocol(newProtocol);
            setItemTarget((prev) => ({ ...prev, group: newProtocol.pages[page].itemGroups.length - 1 }));
        },
        [protocol, showAlert]
    );

    const insertDependency = useCallback(
        (pageIndex, groupIndex) => {
            if (pageIndex === '')
                return showAlert({
                    headerText: 'Nenhuma página selecionada. Selecione ou crie a página onde deseja adicionar a dependência.',
                });

            if (groupIndex !== undefined && groupIndex === '')
                return showAlert({
                    headerText: 'Nenhum grupo selecionado. Selecione ou crie o grupo onde deseja adicionar a dependência.',
                });

            const newProtocol = { ...protocol };
            if (groupIndex === undefined) newProtocol.pages[pageIndex].dependencies.push(defaultNewDependency());
            else newProtocol.pages[pageIndex].itemGroups[groupIndex].dependencies.push(defaultNewDependency());
            setProtocol(newProtocol);
        },
        [protocol, showAlert]
    );

    const insertTable = useCallback(
        (type, page) => {
            const newProtocol = { ...protocol };
            insertItemGroup(type, page);
            setProtocol(newProtocol);
        },
        [protocol, insertItemGroup]
    );

    useEffect(() => {
        if (itemTarget.page >= protocol.pages.length && itemTarget.page !== '') {
            if (protocol.pages.length > 0) setItemTarget((prev) => ({ group: '', page: protocol.pages.length - 1 }));
            else setItemTarget((prev) => ({ group: '', page: '' }));
        } else if (itemTarget.group >= currentPage?.itemGroups.length && itemTarget.group !== '') {
            if (currentPage.itemGroups.length > 0) setItemTarget((prev) => ({ ...prev, group: currentPage.itemGroups.length - 1 }));
            else setItemTarget((prev) => ({ ...prev, group: '' }));
        }
    }, [itemTarget, protocol.pages, protocol.pages.length, currentPage?.itemGroups.length]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const placedProtocol = { ...protocol, creatorId: user.id, owners: [] };

        const formData = serialize(placedProtocol, { indices: true });

        if (isEditing) {
            axios
                .put(process.env.REACT_APP_API_URL + 'api/protocol/updateProtocol/' + protocolId, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    clearLocalApplications();
                    showAlert({ headerText: 'Protocolo atualizado com sucesso', onPrimaryBtnClick: () => navigate('/dash/protocols') });
                })
                .catch((error) => showAlert({ headerText: 'Erro ao atualizar protocolo', bodyText: error.response?.data.message || '' }));
        } else {
            axios
                .post(process.env.REACT_APP_API_URL + 'api/protocol/createProtocol', formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) =>
                    showAlert({ headerText: 'Protocolo criado com sucesso', onPrimaryBtnClick: () => navigate('/dash/protocols') })
                )
                .catch((error) => showAlert({ headerText: 'Erro ao criar protocolo', bodyText: error.response?.data.message || '' }));
        }
    };

    const deleteProtocol = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}api/protocol/deleteProtocol/${protocolId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                clearLocalApplications();
                showAlert({ headerText: 'Protocolo excluído com sucesso', onPrimaryBtnClick: () => navigate('/dash/protocols') });
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir protocolo', bodyText: error.response?.data.message }));
    };

    const moveItemBetweenPages = useCallback(
        (newPage, oldPage, groupIndex, itemIndex) => {
            if (newPage === oldPage) return;
            const newProtocol = { ...protocol };
            // Find the item
            const item = newProtocol.pages[oldPage].itemGroups[groupIndex].items[itemIndex];
            // Remove the item from the old page, update the placements of the remaining items and sort them (just in case)
            newProtocol.pages[oldPage].itemGroups[groupIndex].items.splice(itemIndex, 1);
            for (const [i, item] of newProtocol.pages[oldPage].itemGroups[groupIndex].items.entries()) item.placement = i + 1;
            newProtocol.pages[oldPage].itemGroups[groupIndex].items.sort((a, b) => a.placement - b.placement);
            if (newProtocol.pages[newPage].itemGroups.length > 0) {
                // If the new page has groups, add the item to the last group and sort the items (just in case)
                item.placement = newProtocol.pages[newPage].itemGroups[newProtocol.pages[newPage].itemGroups.length - 1].items.length + 1;
                newProtocol.pages[newPage].itemGroups[newProtocol.pages[newPage].itemGroups.length - 1].items.push(item);
            } else {
                // If the new page has no groups, create a new group and add the item to it
                item.placement = 1;
                newProtocol.pages[newPage].itemGroups = [defaultNewItemGroup('ONE_DIMENSIONAL', 1)];
                newProtocol.pages[newPage].itemGroups[0].items.push(item);
            }
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const moveGroupBetweenPages = useCallback(
        (newPage, oldPage, groupIndex) => {
            if (newPage === oldPage) return;
            const newProtocol = { ...protocol };
            // Find and update the group
            const group = newProtocol.pages[oldPage].itemGroups[groupIndex];
            group.placement = newProtocol.pages[newPage].itemGroups.length + 1;
            // Remove the group from the old page, update the placements of the remaining groups and sort them (just in case)
            newProtocol.pages[oldPage].itemGroups.splice(groupIndex, 1);
            for (const [i, group] of newProtocol.pages[oldPage].itemGroups.entries()) group.placement = i + 1;
            newProtocol.pages[oldPage].itemGroups.sort((a, b) => a.placement - b.placement);
            // Add the group to the new page
            newProtocol.pages[newPage].itemGroups.push(group);
            setProtocol(newProtocol);
        },
        [protocol]
    );

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            const promises = [];
            if (!isEditing && (user.role === 'USER' || user.role === 'APPLIER' || user.role === 'GUEST')) {
                setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para criar protocolos',
                });
                return;
            }
            if (isEditing) {
                promises.push(
                    axios
                        .get(`${process.env.REACT_APP_API_URL}api/protocol/getProtocol/${protocolId}`, {
                            headers: { Authorization: `Bearer ${user.token}` },
                        })
                        .then((response) => {
                            const d = response.data.data;
                            if (d.actions.toUpdate !== true)
                                return setError({
                                    text: 'Operação não permitida',
                                    description: 'Você não tem permissão para editar este protocolo',
                                });
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
                                    tempId: Math.floor(Date.now() + Math.random() * 1000),
                                    type: p.type,
                                    placement: p.placement,
                                    itemGroups: p.itemGroups.map((g) => ({
                                        id: g.id,
                                        tempId: Math.floor(Date.now() + Math.random() * 1000),
                                        type: g.type,
                                        isRepeatable: g.isRepeatable,
                                        placement: g.placement,
                                        items: g.items.map((i) => {
                                            const tempId = Math.floor(Date.now() + Math.random() * 1000);
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
                                                    tempId: Math.floor(Date.now() + Math.random() * 1000),
                                                    placement: o.placement,
                                                    text: o.text,
                                                    files: o.files.map(({ id, path }) => ({ id, path })),
                                                })),
                                                files: i.files.map((f) => ({ id: f.id, path: f.path })),
                                                itemValidations: i.itemValidations.map((v) => ({
                                                    ...v,
                                                    tempId: Math.floor(Date.now() + Math.random() * 1000),
                                                })),
                                            };
                                        }),
                                        tableColumns: g.tableColumns.map(({ id, text, placement }) => ({ id, text, placement })),
                                        dependencies: g.dependencies.map((dep) => ({
                                            ...dep,
                                            itemTempId: tempIdMap[dep.itemId],
                                            tempId: Math.floor(Date.now() + Math.random() * 1000),
                                        })),
                                    })),
                                    dependencies: p.dependencies.map((dep) => ({
                                        ...dep,
                                        itemTempId: tempIdMap[dep.itemId],
                                        tempId: Math.floor(Date.now() + Math.random() * 1000),
                                    })),
                                })),
                                viewersUser: d.viewersUser.map(({ id }) => id),
                                viewersClassroom: d.viewersClassroom.map(({ id }) => id),
                                answersViewersUser: d.answersViewersUser.map(({ id }) => id),
                                answersViewersClassroom: d.answersViewersClassroom.map(({ id }) => id),
                                appliers: d.appliers.map(({ id }) => id),
                            });
                            setSearchedOptions({
                                viewersUser: d.viewersUser.map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                                viewersClassroom: d.viewersClassroom.map(({ id, name, users }) => ({ id, name, users })),
                                answersViewersUser: d.answersViewersUser.map(({ id, username, classrooms }) => ({
                                    id,
                                    username,
                                    classrooms,
                                })),
                                answersViewersClassroom: d.answersViewersClassroom.map(({ id, name, users }) => ({ id, name, users })),
                                appliers: d.appliers.map(({ id, username, classrooms }) => ({ id, username, classrooms })),
                            });
                        })
                        .catch((error) =>
                            setError({ text: 'Erro ao obter informações do protocolo', description: error.response?.data.message || '' })
                        )
                );
            }
            Promise.all(promises).then(() => setIsLoading(false));
        }
    }, [isLoading, user.token, isEditing, protocolId, user.institutionId, user.status, user.role, user.id]);

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text={`Carregando ${isEditing ? 'edição' : 'criação'} de protocolo...`} />;

    return (
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row h-100 g-0">
                <div className="col-auto position-lg-sticky h-100">
                    <div className="offcanvas-lg offcanvas-start h-100 w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col overflow-hidden h-100">
                    <div className="d-flex flex-column h-100">
                        <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                        <div className="row flex-grow-1 overflow-hidden g-0">
                            <div className="col overflow-hidden h-100">
                                <div className="d-flex flex-column h-100">
                                    <div className="row justify-content-center font-barlow g-0">
                                        <div className="col-12 col-md-10">
                                            <div className="row justify-content-between align-items-center p-4">
                                                <div className="col-auto">
                                                    <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">
                                                        {isEditing ? 'Editar' : 'Criar'} protocolo
                                                    </h1>
                                                </div>
                                                {creationMode === 'children' && (
                                                    <div className="col-5 d-lg-none">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#addbar" aria-controls="addbar">
                                                            <TextButton type="button" hsl={[197, 43, 52]} text="Adicionar..." />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center font-barlow flex-grow-1 overflow-hidden g-0">
                                        <div className="col col-md-10 h-100">
                                            <div className="d-flex flex-column h-100 overflow-y-scroll scrollbar-none">
                                                <form
                                                    className="d-flex flex-column justify-content-between flex-grow-1 p-4 pt-0"
                                                    ref={formRef}
                                                    action="/submit"
                                                    onSubmit={(e) => handleSubmit(e)}
                                                >
                                                    {creationMode === 'properties' && (
                                                        <CreateProtocolProperties
                                                            setSearchedOptions={setSearchedOptions}
                                                            searchedOptions={searchedOptions}
                                                            protocol={protocol}
                                                            setProtocol={setProtocol}
                                                            setSearchInputs={setSearchInputs}
                                                            searchInputs={searchInputs}
                                                        />
                                                    )}
                                                    {currentPage && creationMode === 'children' && (
                                                        <CreatePage
                                                            key={currentPage.tempId}
                                                            currentPage={currentPage}
                                                            itemTarget={itemTarget}
                                                            updatePagePlacement={updatePagePlacement}
                                                            removePage={removePage}
                                                            protocol={protocol}
                                                            updatePage={updatePage}
                                                            insertItem={insertItem}
                                                            moveItemBetweenPages={moveItemBetweenPages}
                                                            moveGroupBetweenPages={moveGroupBetweenPages}
                                                            pagesQty={protocol.pages.length}
                                                        />
                                                    )}
                                                    {!currentPage && creationMode === 'children' && (
                                                        <div className="bg-light-grey rounded-4 p-4">
                                                            <p className="font-barlow fw-medium text-center fs-5 m-0">
                                                                Nenhuma página selecionada. Selecione ou crie uma por meio da aba Adicionar.
                                                            </p>
                                                        </div>
                                                    )}
                                                    {creationMode === 'properties' && (
                                                        <div className="row justify-content-center">
                                                            <div className="col-7 col-md-5 col-xl-3">
                                                                <TextButton
                                                                    type="button"
                                                                    hsl={[97, 43, 70]}
                                                                    text={'Adicionar itens'}
                                                                    onClick={() => {
                                                                        if (String(protocol.title).length < 3)
                                                                            showAlert({
                                                                                headerText: 'Insira pelo menos 3 caracteres no título',
                                                                            });
                                                                        else if (protocol.visibility === '')
                                                                            showAlert({
                                                                                headerText: 'Selecione uma opção válida em Visibilidade',
                                                                            });
                                                                        else if (protocol.applicability === '')
                                                                            showAlert({
                                                                                headerText: 'Selecione uma opção válida em Aplicabilidade',
                                                                            });
                                                                        else if (protocol.answersVisibility === '')
                                                                            showAlert({
                                                                                headerText:
                                                                                    'Selecione uma opção válida em Visibilidade das respostas',
                                                                            });
                                                                        else setCreationMode('children');
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {creationMode === 'children' && (
                                                        <div className="row justify-content-center">
                                                            <div className="col-4 col-xl-2">
                                                                <TextButton
                                                                    type="button"
                                                                    hsl={[97, 43, 70]}
                                                                    text={isEditing ? 'Editar' : 'Concluir'}
                                                                    onClick={() =>
                                                                        showAlert({
                                                                            headerText: `Tem certeza que deseja ${
                                                                                isEditing ? 'editar' : 'criar'
                                                                            } o protocolo?`,
                                                                            primaryBtnHsl: [355, 78, 66],
                                                                            primaryBtnLabel: 'Não',
                                                                            secondaryBtnHsl: [97, 43, 70],
                                                                            secondaryBtnLabel: 'Sim',
                                                                            onSecondaryBtnClick: () => formRef.current.requestSubmit(),
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="col-4 col-xl-2">
                                                                <TextButton
                                                                    type="button"
                                                                    hsl={[97, 43, 70]}
                                                                    text={'Voltar'}
                                                                    onClick={() => setCreationMode('properties')}
                                                                />
                                                            </div>
                                                            {isEditing && (
                                                                <div className="col-4 col-xl-2">
                                                                    <TextButton
                                                                        text={'Excluir'}
                                                                        hsl={[355, 78, 66]}
                                                                        onClick={() =>
                                                                            showAlert({
                                                                                headerText: `Tem certeza que deseja excluir o protocolo?`,
                                                                                primaryBtnHsl: [97, 43, 70],
                                                                                primaryBtnLabel: 'Não',
                                                                                secondaryBtnHsl: [355, 78, 66],
                                                                                secondaryBtnLabel: 'Sim',
                                                                                onSecondaryBtnClick: () => deleteProtocol(),
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {creationMode === 'children' && (
                                <div className="col-auto position-lg-sticky h-100 mh-100">
                                    <div
                                        className="offcanvas-lg bg-pastel-blue d-flex overflow-y-scroll offcanvas-end h-100 w-auto"
                                        tabIndex="-1"
                                        id="addbar"
                                    >
                                        <AddBar
                                            showExitButton={true}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            insertPage={insertPage}
                                            insertItemGroup={insertItemGroup}
                                            insertItem={insertItem}
                                            insertTable={insertTable}
                                            setItemTarget={setItemTarget}
                                            insertDependency={insertDependency}
                                            protocol={protocol}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{CreateProtocolStyles}</style>
        </div>
    );
}

export default CreateProtocolPage;
