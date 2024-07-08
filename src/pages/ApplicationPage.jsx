import { React, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StorageContext } from '../contexts/StorageContext';
import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import LocationInput from '../components/inputs/answers/LocationInput';
import ImageInput from '../components/inputs/answers/ImageInput';
import SelectInput from '../components/inputs/answers/SelectInput';
import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import GalleryModal from '../components/GalleryModal';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { serialize } from 'object-to-formdata';
import { LayoutContext } from '../contexts/LayoutContext';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';

const styles = `
    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-coral-red {
        background-color: #F59489;
    }

    .gray-color {
        color: #787878;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .name-col input:focus{
        outline: none;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

function ApplicationPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const { user, logout } = useContext(AuthContext);
    const [application, setApplication] = useState(undefined);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [itemAnswerGroups, setItemAnswerGroups] = useState({});
    const { applicationId } = useParams();
    const { connected, storeLocalApplication, storePendingRequest, localApplications } = useContext(StorageContext);
    const { showAlert } = useContext(AlertContext);
    const galleryModalRef = useRef(null);
    const navigate = useNavigate();
    const { isDashboard } = useContext(LayoutContext);

    const findAnswer = (id) => {
        for (const group in itemAnswerGroups) {
            let res = undefined;
            if (itemAnswerGroups[group].itemAnswers[id] !== undefined) {
                res = itemAnswerGroups[group].itemAnswers[id];
            }
            if (itemAnswerGroups[group].optionAnswers[id] !== undefined) {
                res = itemAnswerGroups[group].optionAnswers[id];
            }
            if (itemAnswerGroups[group].tableAnswers[id] !== undefined) {
                res = itemAnswerGroups[group].tableAnswers[id];
            }
            if (res !== undefined) {
                // Drop group and files from res
                let { group, files, ...answer } = res;
                return answer;
            }
        }
        return undefined;
    };

    const findItem = (id) => {
        for (const page of application.protocol.pages) {
            for (const group of page.itemGroups) {
                for (const item of group.items) {
                    if (item.id === id) {
                        return item;
                    }
                }
            }
        }
        return undefined;
    };

    const isDependenciesAttended = (dependencies) => {
        let dependencyAttended = true;
        for (const dependency of dependencies) {
            const item = findItem(dependency.itemId);
            const answer = findAnswer(dependency.itemId);
            switch (dependency.type) {
                case 'EXACT_ANSWER':
                    if (
                        item.type === 'TEXTBOX' ||
                        item.type === 'NUMBERBOX' ||
                        item.type === 'DATEBOX' ||
                        item.type === 'TIMEBOX' ||
                        item.type === 'LOCATIONBOX'
                    ) {
                        if (!answer || answer.text !== dependency.argument) {
                            dependencyAttended = false;
                        }
                    } else if (item.type === 'CHECKBOX' || item.type === 'RADIO' || item.type === 'SELECT') {
                        if (
                            !answer ||
                            item.itemOptions
                                .filter((o) => Object.keys(answer).includes(o.id.toString()))
                                .map((o) => o.text)
                                .includes(dependency.argument) === false
                        ) {
                            dependencyAttended = false;
                        }
                    }
                    break;
                case 'OPTION_SELECTED':
                    if (item.type === 'CHECKBOX' || item.type === 'RADIO' || item.type === 'SELECT') {
                        if (
                            !answer ||
                            item.itemOptions
                                .filter((o) => Object.keys(answer).includes(o.id.toString()))
                                .map((o) => o.text)
                                .includes(dependency.argument) === false
                        ) {
                            dependencyAttended = false;
                        }
                    }
                    break;
                case 'MIN':
                    if (item.type === 'CHECKBOX') {
                        if (!answer || Object.keys(answer).length < dependency.argument) {
                            dependencyAttended = false;
                        }
                    } else if (item.type === 'RANGE' || item.type === 'NUMBERBOX') {
                        if (!answer || Number(answer.text) < dependency.argument) {
                            dependencyAttended = false;
                        }
                    } else if (item.type === 'TEXTBOX') {
                        if (!answer || answer.text.length < dependency.argument) {
                            dependencyAttended = false;
                        }
                    }
                    break;
                case 'MAX':
                    if (item.type === 'CHECKBOX') {
                        if (!answer || Object.keys(answer).length > dependency.argument) {
                            dependencyAttended = false;
                        }
                    } else if (item.type === 'RANGE' || item.type === 'NUMBERBOX') {
                        if (!answer || Number(answer.text) > dependency.argument) {
                            dependencyAttended = false;
                        }
                    } else if (item.type === 'TEXTBOX') {
                        if (!answer || answer.text.length > dependency.argument) {
                            dependencyAttended = false;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return dependencyAttended;
    };

    const getNextPage = () => {
        const nextPageIndex = currentPageIndex + 1;
        for (let i = nextPageIndex; i < application.protocol.pages.length; i++) {
            if (application.protocol.pages[i].dependencies.length === 0) {
                return i;
            } else {
                let dependencyAttended = isDependenciesAttended(application.protocol.pages[i].dependencies);
                if (dependencyAttended === true) {
                    return i;
                }
            }
            return undefined;
        }
    };

    const isPreviousPage = () => {
        return currentPageIndex > 0;
    };

    const isNextPage = () => {
        return getNextPage() !== undefined;
    };

    const nextPage = () => {
        if (isNextPage()) {
            const nextPageIndex = getNextPage();
            setCurrentPageIndex(nextPageIndex);
        }
    };

    const previousPage = () => {
        if (isPreviousPage()) {
            const previousPageIndex = currentPageIndex - 1;
            setCurrentPageIndex(previousPageIndex);
        }
    };

    const handleAnswerChange = useCallback((groupToUpdate, itemToUpdate, itemType, updatedAnswer) => {
        setItemAnswerGroups((prevItemAnswerGroups) => {
            const newItemAnswerGroups = { ...prevItemAnswerGroups };

            if (newItemAnswerGroups[groupToUpdate] === undefined) {
                newItemAnswerGroups[groupToUpdate] = { itemAnswers: {}, optionAnswers: {}, tableAnswers: {} };
            }

            switch (itemType) {
                case 'ITEM':
                    newItemAnswerGroups[groupToUpdate]['itemAnswers'][itemToUpdate] = updatedAnswer;
                    break;
                case 'OPTION':
                    newItemAnswerGroups[groupToUpdate]['optionAnswers'][itemToUpdate] = updatedAnswer;
                    break;
                case 'TABLE':
                    newItemAnswerGroups[groupToUpdate]['tableAnswers'][itemToUpdate] = updatedAnswer;
                    break;
                default:
                    break;
            }
            return newItemAnswerGroups;
        });
    }, []);

    const handleProtocolSubmit = () => {
        showAlert({
            title: 'Aguarde o processamento da resposta',
            dismissible: false,
        });

        const applicationAnswer = {
            applicationId: application.id,
            addressId: 1,
            date: new Date(),
            itemAnswerGroups: [],
        };
        for (const group in itemAnswerGroups) {
            if (
                application.protocol.pages
                    .flatMap((page) =>
                        page.itemGroups.flatMap((group) => ({
                            pageId: page.id,
                            groupId: group.id,
                            pageDependencies: page.dependencies,
                            groupDependencies: group.dependencies,
                        }))
                    )
                    .filter(
                        (dependency) =>
                            dependency.groupId === Number(group) &&
                            !isDependenciesAttended(dependency.pageDependencies.concat(dependency.groupDependencies))
                    ).length === 0
            ) {
                const itemAnswerGroup = {
                    itemAnswers: [],
                    optionAnswers: [],
                    tableAnswers: [],
                };

                for (const item in itemAnswerGroups[group].itemAnswers) {
                    itemAnswerGroup.itemAnswers.push({
                        itemId: item,
                        text: itemAnswerGroups[group].itemAnswers[item].text,
                        files: itemAnswerGroups[group].itemAnswers[item].files,
                    });
                }
                for (const item in itemAnswerGroups[group].optionAnswers) {
                    for (const option in itemAnswerGroups[group].optionAnswers[item]) {
                        if (option !== 'group') {
                            itemAnswerGroup.optionAnswers.push({
                                itemId: item,
                                optionId: option,
                                text: itemAnswerGroups[group].optionAnswers[item][option],
                            });
                        }
                    }
                }
                for (const item in itemAnswerGroups[group].tableAnswers) {
                    for (const column in itemAnswerGroups[group].tableAnswers[item]) {
                        if (column !== 'group') {
                            itemAnswerGroup.tableAnswers.push({
                                itemId: item,
                                columnId: column,
                                text: itemAnswerGroups[group].tableAnswers[item][column],
                            });
                        }
                    }
                }
                applicationAnswer.itemAnswerGroups.push(itemAnswerGroup);
            }
        }

        const formData = serialize(applicationAnswer, { indices: true });

        if (connected === true) {
            axios
                .post(baseUrl + `api/applicationAnswer/createApplicationAnswer`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    showAlert({
                        title: 'Muito obrigado por sua participação no projeto!',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                        onHide: () => {
                            navigate(isDashboard ? '/dash/applications' : '/applications');
                        },
                    });
                })
                .catch((error) => {
                    showAlert({
                        title: 'Não foi possível submeter a resposta. Tente novamente mais tarde.',
                        description: error.response?.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                });
        } else {
            storePendingRequest({
                id: applicationId,
                userId: user.id,
                title: 'Resposta da aplicação ' + applicationId + ' referente ao protocolo ' + application.protocol.title,
                url: baseUrl + `api/applicationAnswer/createApplicationAnswer`,
                data: formData,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            });
            showAlert({
                title: 'Você está offline. A resposta será armazenada localmente e submetida quando houver conexão.',
                dismissHsl: [97, 43, 70],
                dismissText: 'Ok',
                dismissible: true,
            });
        }
    };

    useEffect(() => {
        //Search if the application is in localApplications
        if (localApplications !== undefined && application === undefined) {
            const localApplication = localApplications.find((app) => app.id === parseInt(applicationId));
            if (localApplication !== undefined) {
                setApplication(localApplication);
                setIsLoading(false);
            } else if (user.id !== null && user.token !== null) {
                axios
                    .get(baseUrl + `api/application/getApplicationWithProtocol/${applicationId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        setApplication(response.data.data);
                        storeLocalApplication(response.data.data);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar aplicação', description: error.response?.data.message || '' });
                    });
            }
        }
    }, [applicationId, user, logout, navigate, localApplications, storeLocalApplication, application, isDashboard]);

    useEffect(() => {
        if (connected === false && application?.id) {
            showAlert({
                title: 'Você está offline. A aplicação ' + applicationId + ' está armazenada localmente e continuará acessível.',
                dismissHsl: [97, 43, 70],
                dismissText: 'Ok',
                dismissible: true,
            });
        }
    }, [connected, application, applicationId, showAlert]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando aplicação..." />;
    }

    return (
        <div className="d-flex flex-column flex-grow-1 w-100 min-vh-100">
            <div className="row flex-grow-1 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky vh-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-yellow-orange p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />

                    <div className="row d-flex align-items-center justify-content-center h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5">
                            <div className="d-flex flex-column flex-grow-1">
                                {isDashboard && (
                                    <div className="row m-0 justify-content-center">
                                        {(application.applier.id === user.id || user.role === 'ADMIN') && (
                                            <div className="col-4 align-self-center pb-4">
                                                <TextButton
                                                    type="submit"
                                                    hsl={[97, 43, 70]}
                                                    text="Gerenciar"
                                                    onClick={() => navigate('manage')}
                                                />
                                            </div>
                                        )}
                                        <div className="col-4 align-self-center pb-4">
                                            <TextButton
                                                type="submit"
                                                hsl={[97, 43, 70]}
                                                text="Respostas"
                                                onClick={() => navigate('answers')}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="row justify-content-center m-0">
                                    {<ProtocolInfo title={application.protocol.title} description={application.protocol.description} />}
                                </div>
                                {application.protocol.pages[currentPageIndex].itemGroups
                                    .filter((group) => isDependenciesAttended(group.dependencies))
                                    .map((itemGroup, itemGroupIndex) => {
                                        return (
                                            <div>
                                                <p>Grupo de itens {itemGroupIndex + 1}</p>
                                                {itemGroup.items.map((item) => {
                                                    switch (item.type) {
                                                        case 'TEXTBOX':
                                                        case 'NUMBERBOX':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <SimpleTextInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    itemAnswerGroups[itemGroup.id]?.itemAnswers[item.id]
                                                                                        ?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            galleryModalRef={galleryModalRef}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );

                                                        case 'CHECKBOX':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <CheckBoxInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                group: itemGroup.id,
                                                                                ...itemAnswerGroups[itemGroup.id]?.optionAnswers[item.id],
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );

                                                        case 'RADIO':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <RadioButtonInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                group: itemGroup.id,
                                                                                ...itemAnswerGroups[itemGroup.id]?.optionAnswers[item.id],
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );

                                                        case 'SELECT':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <SelectInput
                                                                            item={item}
                                                                            galleryRef={galleryModalRef}
                                                                            answer={{
                                                                                group: itemGroup.id,
                                                                                ...itemAnswerGroups[itemGroup.id]?.optionAnswers[item.id],
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );
                                                        case 'DATEBOX':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <DateInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    itemAnswerGroups[itemGroup.id]?.itemAnswers[item.id]
                                                                                        ?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );
                                                        case 'TIMEBOX':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <TimeInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    itemAnswerGroups[itemGroup.id]?.itemAnswers[item.id]
                                                                                        ?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );
                                                        case 'LOCATIONBOX':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <LocationInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    itemAnswerGroups[itemGroup.id]?.itemAnswers[item.id]
                                                                                        ?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );
                                                        case 'UPLOAD':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {
                                                                        <ImageInput
                                                                            item={item}
                                                                            answer={{
                                                                                text: '',
                                                                                files:
                                                                                    itemAnswerGroups[itemGroup.id]?.itemAnswers[item.id]
                                                                                        ?.files || [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={handleAnswerChange}
                                                                        />
                                                                    }
                                                                </div>
                                                            );
                                                        case 'TEXT':
                                                            return (
                                                                <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                    {<TextImageInput item={item} galleryModalRef={galleryModalRef} />}
                                                                </div>
                                                            );
                                                        default:
                                                            return <p>Input type not found</p>;
                                                    }
                                                })}
                                            </div>
                                        );
                                    })}
                                <div className="row justify-content-center m-0 pt-3">
                                    {
                                        <TextImageInput
                                            item={{
                                                text:
                                                    'Identificador da aplicação: ' +
                                                    application.id +
                                                    '<br>Identificador do protocolo: ' +
                                                    application.protocol.id +
                                                    '<br>Versão do protocolo: ' +
                                                    application.protocol.updatedAt.replace(/\D/g, ''),
                                                files: [],
                                            }}
                                            galleryModalRef={galleryModalRef}
                                        />
                                    }
                                </div>
                                {!isNextPage() && (
                                    <div className="col-4 align-self-center pt-4">
                                        <TextButton
                                            type="submit"
                                            hsl={[97, 43, 70]}
                                            text="Enviar"
                                            onClick={() => {
                                                showAlert({
                                                    title: 'Tem certeza que deseja enviar o protocolo?',
                                                    dismissHsl: [355, 78, 66],
                                                    dismissText: 'Não',
                                                    actionHsl: [97, 43, 70],
                                                    actionText: 'Sim',
                                                    dismissible: true,
                                                    actionOnClick: () => {
                                                        handleProtocolSubmit();
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                                {isPreviousPage() && (
                                    <div className="col-4 align-self-center pt-4">
                                        <TextButton type="button" hsl={[97, 43, 70]} text="Página anterior" onClick={previousPage} />
                                    </div>
                                )}
                                {isNextPage() && (
                                    <div className="col-4 align-self-center pt-4">
                                        <TextButton type="button" hsl={[97, 43, 70]} text="Próxima página" onClick={nextPage} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ApplicationPage;