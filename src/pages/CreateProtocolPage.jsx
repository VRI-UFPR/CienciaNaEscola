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
import baseUrl from '../contexts/RouteContext';
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
    .bg-light-grey:focus,
    .bg-light-grey:active {
        background-color: #D9D9D9;
        border-color: #D9D9D9;
    }

    .bg-light-grey:focus,
    .bg-light-grey:active,
    .bg-light-pastel-blue:focus,
    .bg-light-pastel-blue:active {
        box-shadow: inset 0px 4px 4px 0px #00000040;
    }

    .bg-light-grey:disabled,
    .bg-light-pastel-blue:disabled{
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
    }

    .bg-light-pastel-blue,
    .bg-light-pastel-blue:focus,
    .bg-light-pastel-blue:active {
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
        if (page === '') {
            showAlert({ headerText: 'Nenhuma página selecionada. Selecione ou crie a página onde deseja adicionar o item.' });
            return;
        }
        if (group === '') {
            showAlert({ headerText: 'Nenhum grupo selecionado. Selecione ou crie o grupo onde deseja adicionar o item.' });
            return;
        }
        const groupType = protocol.pages[page].itemGroups[group].type;
        if (groupType !== 'ONE_DIMENSIONAL' && type !== 'TABLEROW') {
            showAlert({
                title: 'Selecione um grupo que não seja do tipo tabela.',
                dismissible: true,
            });
            return;
        }
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
            for (const [i, page] of newProtocol.pages.entries()) {
                if (i >= index) page.placement--;
            }
            setProtocol(newProtocol);
        },
        [protocol]
    );

    const insertItemGroup = useCallback(
        (type, page) => {
            if (page === '') {
                showAlert({ headerText: 'Nenhuma página selecionada. Selecione ou crie a página onde deseja adicionar o grupo.' });
                return;
            }
            const newProtocol = { ...protocol };
            newProtocol.pages[page].itemGroups.push(defaultNewItemGroup(type, newProtocol.pages[page].itemGroups.length + 1));
            setProtocol(newProtocol);
            setItemTarget((prev) => ({ ...prev, group: newProtocol.pages[page].itemGroups.length - 1 }));
        },
        [protocol, showAlert]
    );

    const insertDependency = useCallback(
        (pageIndex, groupIndex) => {
            if (pageIndex === '') {
                showAlert({ headerText: 'Nenhuma página selecionada. Selecione ou crie a página onde deseja adicionar a dependência.' });
                return;
            }
            if (groupIndex !== undefined && groupIndex === '') {
                showAlert({ headerText: 'Nenhum grupo selecionado. Selecione ou crie o grupo onde deseja adicionar a dependência.' });
                return;
            }
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
                    clearLocalApplications();
                    showAlert({ headerText: 'Formulário atualizado com sucesso.', onPrimaryBtnClick: () => navigate('/dash/protocols') });
                })
                .catch((error) => {
                    showAlert({ headerText: 'Erro ao atualizar protocolo.', bodyText: error.response?.data.message || '' });
                });
        } else {
            axios
                .post(baseUrl + 'api/protocol/createProtocol', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) =>
                    showAlert({ headerText: 'Protocolo criado com sucesso.', onPrimaryBtnClick: () => navigate('/dash/protocols') })
                )
                .catch((error) => showAlert({ headerText: 'Erro ao criar protocolo.', bodyText: error.response?.data.message || '' }));
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
                clearLocalApplications();
                showAlert({ headerText: 'Protocolo excluído com sucesso.', onPrimaryBtnClick: () => navigate('/dash/protocols') });
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir protocolo.', bodyText: error.response?.data.message }));
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
                                                    files: o.files.map((f) => ({ id: f.id, path: f.path })),
                                                })),
                                                files: i.files.map((f) => ({ id: f.id, path: f.path })),
                                                itemValidations: i.itemValidations.map((v) => ({
                                                    ...v,
                                                    tempId: Math.floor(Date.now() + Math.random() * 1000),
                                                })),
                                            };
                                        }),
                                        tableColumns: g.tableColumns.map((c) => {
                                            return {
                                                id: c.id,
                                                text: c.text,
                                                placement: c.placement,
                                            };
                                        }),
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
                                                                        if (String(protocol.title).length < 3) {
                                                                            showAlert({
                                                                                headerText: 'Insira pelo menos 3 caracteres no título',
                                                                            });
                                                                        } else if (protocol.visibility === '') {
                                                                            showAlert({
                                                                                headerText: 'Selecione uma opção válida em Visibilidade',
                                                                            });
                                                                        } else if (protocol.applicability === '') {
                                                                            showAlert({
                                                                                headerText: 'Selecione uma opção válida em Aplicabilidade',
                                                                            });
                                                                        } else if (protocol.answersVisibility === '') {
                                                                            showAlert({
                                                                                headerText:
                                                                                    'Selecione uma opção válida em Visibilidade das respostas',
                                                                            });
                                                                        } else {
                                                                            setCreationMode('children');
                                                                        }
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
                                                                    onClick={() => {
                                                                        showAlert({
                                                                            headerText: `Tem certeza que deseja ${
                                                                                isEditing ? 'editar' : 'criar'
                                                                            } o protocolo?`,
                                                                            primaryBtnHsl: [355, 78, 66],
                                                                            primaryBtnLabel: 'Não',
                                                                            secondaryBtnHsl: [97, 43, 70],
                                                                            secondaryBtnLabel: 'Sim',
                                                                            onSecondaryBtnClick: () => formRef.current.requestSubmit(),
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-4 col-xl-2">
                                                                <TextButton
                                                                    type="button"
                                                                    hsl={[97, 43, 70]}
                                                                    text={'Voltar'}
                                                                    onClick={() => {
                                                                        setCreationMode('properties');
                                                                    }}
                                                                />
                                                            </div>
                                                            {isEditing && (
                                                                <div className="col-4 col-xl-2">
                                                                    <TextButton
                                                                        text={'Excluir'}
                                                                        hsl={[355, 78, 66]}
                                                                        onClick={() => {
                                                                            showAlert({
                                                                                headerText: `Tem certeza que deseja excluir o protocolo?`,
                                                                                primaryBtnHsl: [97, 43, 70],
                                                                                primaryBtnLabel: 'Não',
                                                                                secondaryBtnHsl: [355, 78, 66],
                                                                                secondaryBtnLabel: 'Sim',
                                                                                onSecondaryBtnClick: () => deleteProtocol(),
                                                                            });
                                                                        }}
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
                                    <div className="offcanvas-lg bg-pastel-blue offcanvas-end h-100 w-auto" tabIndex="-1" id="addbar">
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
