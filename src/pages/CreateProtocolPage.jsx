import { React, useState, useContext, useRef, useCallback, useEffect } from 'react';
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
import Alert from '../components/Alert';
import { defaultNewInput } from '../utils/constants';
import { serialize } from 'object-to-formdata';
import ErrorPage from './ErrorPage';

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
    const { id: protocolId } = useParams();
    const { isEditing } = props;
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
    const modalRef = useRef(null);

    const insertItem = (type, page, group) => {
        const newProtocol = { ...protocol };
        newProtocol.pages[page].itemGroups[group].items.push(defaultNewInput(type));
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
            return newProtocol;
        });
    }, []);

    const insertPage = () => {
        const newProtocol = { ...protocol };
        newProtocol.pages.push({ type: 'ITEMS', itemGroups: [] });
        setProtocol(newProtocol);
    };

    const removePage = (index) => {
        setProtocol((prev) => {
            const newProtocol = { ...prev };
            newProtocol.pages.splice(index, 1);
            return newProtocol;
        });
    };

    const insertItemGroup = (page) => {
        const newProtocol = { ...protocol };
        newProtocol.pages[page].itemGroups.push({ type: 'MULTIPLE_ITEMS', isRepeatable: false, items: [] });
        setProtocol(newProtocol);
    };

    const removeItemGroup = (page, index) => {
        setProtocol((prev) => {
            const newProtocol = { ...prev };
            newProtocol.pages[page].itemGroups.splice(index, 1);
            return newProtocol;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const placedProtocol = {
            ...protocol,
            creatorId: user.id,
            owners: [],
            pages: protocol.pages.map((page, index) => ({
                ...page,
                placement: index + 1,
                itemGroups: page.itemGroups.map((group, index) => ({
                    ...group,
                    placement: index + 1,
                    items: group.items.map((item, index) => ({
                        ...item,
                        placement: index + 1,
                        itemOptions: item.itemOptions?.map((option, index) => ({ ...option, placement: index + 1 })),
                    })),
                })),
            })),
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
                    modalRef.current.showModal({ title: 'Formulário atualizado com sucesso.', onHide: () => navigate('/dash/protocols') });
                })
                .catch((error) => {
                    console.error(error.message);
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
                    modalRef.current.showModal({ title: 'Formulário criado com sucesso.', onHide: () => navigate('/dash/protocols') });
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    };

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            const promises = [];
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
                                    type: p.type,
                                    itemGroups: p.itemGroups.map((g) => ({
                                        type: g.type,
                                        isRepeatable: g.isRepeatable,
                                        items: g.items.map((i) => ({
                                            text: i.text,
                                            description: i.description,
                                            type: i.type,
                                            enabled: i.enabled,
                                            itemOptions: i.itemOptions.map((o) => ({
                                                text: o.text,
                                                files: o.files.map((f) => ({ id: f.id, path: f.path })),
                                            })),
                                            files: i.files.map((f) => ({ id: f.id, path: f.path })),
                                        })),
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
                            setError({ text: 'Erro ao carregar criação do protocolo', description: error.response.data.message || '' });
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
                        setInstitutionUsers(d.users.map((u) => ({ id: u.id, username: u.username })));
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar criação do protocolo', description: error.response.data.message || '' });
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
                        setInstitutionClassrooms(d.classrooms.map((c) => ({ id: c.id })));
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar criação do protocolo', description: error.response.data.message || '' });
                    })
            );
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [isLoading, user.token, isEditing, protocolId, user.institutionId, user.status]);

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
                                    <label htmlFor="item-target-page" className="form-label fs-5 fw-medium">
                                        Página
                                    </label>
                                    <select
                                        name="item-target-page"
                                        id="item-target-page"
                                        onChange={(e) => setItemTarget((prev) => ({ ...prev, page: e.target.value }))}
                                    >
                                        {protocol.pages.map((page, index) => (
                                            <option key={index} value={index}>
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
                                        {protocol.pages[itemTarget.page]?.itemGroups.map((group, index) => (
                                            <option key={index} value={index}>
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
                                            <option value="PUBLIC">Público</option>
                                            <option value="RESTRICT">Restrito</option>
                                        </select>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione os usuários visualizadores</span>
                                            {institutionUsers.map((u) => (
                                                <div key={'viewer-user-' + u.id}>
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
                                                <div key={'viewer-classroom-' + c.id}>
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
                                                    <label htmlFor={`viewer-classroom-${c.id}`}>{c.id}</label>
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
                                            <option value="PUBLIC">Público</option>
                                            <option value="RESTRICT">Restrito</option>
                                        </select>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione os usuários aplicadores</span>
                                            {institutionUsers.map((u) => (
                                                <div key={'applier-' + u.id}>
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
                                                                    appliers: prev.appliers.filter((id) => id !== parseInt(e.target.value)),
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
                                            <option value="PUBLIC">Público</option>
                                            <option value="RESTRICT">Restrito</option>
                                        </select>
                                        <fieldset>
                                            <span className="fs-5 fw-medium">Selecione os usuários visualizadores de resposta</span>
                                            {institutionUsers.map((u) => (
                                                <div key={'answer-viewer-user-' + u.id}>
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
                                                <div key={'answer-viewer-classroom-' + c.id}>
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
                                                    <label htmlFor={`answer-viewer-classroom-${c.id}`}>{c.id}</label>
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
                                            <option value="true">Sim</option>
                                            <option value="false">Não</option>
                                        </select>
                                    </div>
                                    {protocol.pages?.map((page, pageIndex) => {
                                        return (
                                            <div>
                                                <p className="m-0 p-0">Página {pageIndex + 1}</p>
                                                <button type="button" onClick={() => removePage(pageIndex)}>
                                                    Remover página
                                                </button>
                                                {page.itemGroups?.map((group, groupIndex) => {
                                                    return (
                                                        <div>
                                                            <p className="m-0 p-0">Grupo {groupIndex + 1}</p>
                                                            <button type="button" onClick={() => removeItemGroup(pageIndex, groupIndex)}>
                                                                Remover grupo
                                                            </button>
                                                            {group.items?.map((item, itemIndex) => {
                                                                switch (item.type) {
                                                                    case 'TEXTBOX':
                                                                        return (
                                                                            <CreateTextBoxInput
                                                                                key={itemIndex}
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
                                                                                key={itemIndex}
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
                                                                                key={itemIndex}
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
                                                                                key={itemIndex}
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
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                                <button type="button" onClick={() => insertItemGroup(pageIndex)}>
                                                    Adicionar grupo
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button type="button" onClick={insertPage}>
                                        Adicionar página
                                    </button>
                                    <div className="row justify-content-center m-0">
                                        <div className="col-8 col-lg-4">
                                            <TextButton type="submit" hsl={[97, 43, 70]} text="Finalizar protocolo" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="CreateProtocolAlert" ref={modalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true} />
            </div>
            <style>{CreateProtocolStyles}</style>
        </div>
    );
}

CreateProtocolPage.defaultProps = {
    isEditing: false,
};

export default CreateProtocolPage;
