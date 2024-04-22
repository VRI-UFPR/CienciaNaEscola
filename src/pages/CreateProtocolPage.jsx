import { React, useState, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import { ReactComponent as IconPlus } from '../assets/images/iconPlus.svg';
import TextButton from '../components/TextButton';
import CreateMultipleInputItens from '../components/inputs/protocol/CreateMultipleInputItens';
import CreateTextBoxInput from '../components/inputs/protocol/CreateTextBoxInput';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
// import SplashPage from './SplashPage';
// import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import { defaultNewInput } from '../utils/constants';
import { serialize } from 'object-to-formdata';

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

    .bg-pastel-blue {
        background-color: #91CAD6;
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
    const [protocol, setProtocol] = useState({
        title: '',
        description: '',
        enabled: true,
        pages: [{ type: 'ITEMS', itemGroups: [{ type: 'MULTIPLE_ITEMS', isRepeatable: false, items: [] }] }],
    });

    const navigate = useNavigate();
    // const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    // const { edit } = props;
    // const { id } = useParams();
    const modalRef = useRef(null);

    const updateTitle = (title) => {
        setProtocol({ ...protocol, title: title });
    };

    const updateDescription = (description) => {
        setProtocol({ ...protocol, description: description });
    };

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

    const handleSubmit = (event) => {
        event.preventDefault();

        const placedProtocol = {
            ...protocol,
            owners: [user.id],
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

        axios
            .post(baseUrl + 'api/protocol/createProtocol', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                modalRef.current.showModal({ title: 'Formulário criado com sucesso.', onHide: () => navigate('/home') });
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    // if (isLoading) {
    //     return <SplashPage />;
    // }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 font-barlow p-4 p-lg-5">
                <div className="row m-0">
                    <div className="col-lg-5 col-md-5">
                        <h1 className="font-century-gothic color-grey fs-3 fw-bold p-0 pb-4 pb-lg-5 m-0 titulo-form">
                            Gerador de formulários
                        </h1>
                    </div>
                    <div className="col-lg-3 col-md-1"></div>
                    <div id="button" className="col-lg-2 col-md-3 botao-form">
                        <TextButton type="submit" hsl={[6, 84, 75]} text="Estatísticas" />
                    </div>
                    <div id="button1" className="col-lg-2 col-md-3 botao-form">
                        <TextButton type="submit" hsl={[37, 98, 76]} text="Respostas" />
                    </div>
                </div>

                <div className="row flex-grow-1 m-0">
                    <div className="col-12 col-lg-auto p-0 pb-4">
                        <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-4 p-4">
                            <h1 className="font-century-gothic fs-3 fw-bold text-white">Adicionar</h1>
                            <button
                                type="button"
                                className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                onClick={() => insertItem('TEXTBOX', 0, 0)}
                            >
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Caixa de texto</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                onClick={() => insertItem('SELECT', 0, 0)}
                            >
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Lista suspensa</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                onClick={() => insertItem('RADIO', 0, 0)}
                            >
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Seleção única</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                onClick={() => insertItem('CHECKBOX', 0, 0)}
                            >
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Múltipla escolha</span>
                            </button>
                        </div>
                    </div>
                    <div className="col d-flex flex-column p-0 ps-lg-5">
                        <form className="d-flex flex-column flex-grow-1" onSubmit={handleSubmit}>
                            <div className="flex-grow-1 mb-3">
                                <label htmlFor="title" className="form-label fs-5 fw-medium">
                                    Título do formulário
                                </label>
                                <textarea
                                    className="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="title"
                                    rows="3"
                                    onChange={(event) => updateTitle(event.target.value)}
                                ></textarea>
                                <label htmlFor="description" className="form-label fs-5 fw-medium">
                                    Descrição do formulário
                                </label>
                                <textarea
                                    className="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="description"
                                    rows="6"
                                    onChange={(event) => updateDescription(event.target.value)}
                                ></textarea>
                            </div>
                            {protocol.pages?.map((page, pageIndex) => {
                                return page.itemGroups?.map((group, groupIndex) => {
                                    return group.items?.map((item, itemIndex) => {
                                        switch (item.type) {
                                            case 'TEXTBOX':
                                                return (
                                                    <CreateTextBoxInput
                                                        key={itemIndex}
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
                                    });
                                });
                            })}
                            <div className="row justify-content-center m-0">
                                <div className="col-8 col-lg-4">
                                    <TextButton type="submit" hsl={[97, 43, 70]} text="Finalizar protocolo" />
                                </div>
                            </div>
                        </form>
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
    edit: false,
};

export default CreateProtocolPage;
