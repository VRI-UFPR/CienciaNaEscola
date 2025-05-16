/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useEffect, useCallback, useRef, useContext } from 'react';
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
import TableInput from '../components/inputs/answers/TableInput';
import TextButton from '../components/TextButton';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import { LayoutContext } from '../contexts/LayoutContext';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';
import RangeInput from '../components/inputs/answers/RangeInput';

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

/**
 * ApplicationPage - Componente responsável por exibir e manipular uma aplicação baseada em um protocolo.
 * @param {Object} props - Propriedades do componente.
 */
function ApplicationPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const { user, logout } = useContext(AuthContext);
    const [application, setApplication] = useState(undefined);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [itemAnswerGroups, setItemAnswerGroups] = useState({});
    const [answerDate, setAnswerDate] = useState(undefined);
    const [answerTime, setAnswerTime] = useState(undefined);
    const [answerLocation, setAnswerLocation] = useState(undefined);
    const { applicationId } = useParams();
    const { connected, storeLocalApplication, storePendingRequest, localApplications } = useContext(StorageContext);
    const { showAlert } = useContext(AlertContext);
    const galleryModalRef = useRef(null);
    const navigate = useNavigate();
    const { isDashboard } = useContext(LayoutContext);

    /**
     * Encontra a resposta associada a um item pelo ID.
     * @param {number} id - ID do item.
     */
    const findAnswer = (id) => {
        for (const group in itemAnswerGroups) {
            let res = undefined;
            if (itemAnswerGroups[group].itemAnswers[id] !== undefined) res = itemAnswerGroups[group].itemAnswers[id];
            if (itemAnswerGroups[group].optionAnswers[id] !== undefined) res = itemAnswerGroups[group].optionAnswers[id];
            if (itemAnswerGroups[group].tableAnswers[id] !== undefined) res = itemAnswerGroups[group].tableAnswers[id];
            if (res !== undefined) {
                // Drop group and files from res
                let { group, files, ...answer } = res;
                return answer;
            }
        }
        return undefined;
    };

    /**
     * Busca um item no protocolo pelo ID.
     * @param {number} id - ID do item.
     */
    const findItem = (id) => {
        for (const page of application.protocol.pages)
            for (const group of page.itemGroups) for (const item of group.items) if (item.id === id) return item;

        return undefined;
    };

    /**
     * Verifica se as dependências de um item foram atendidas.
     * @param {Array} dependencies - Lista de dependências.
     */
    const isDependenciesAttended = (dependencies) => {
        let dependencyAttended = true;
        for (const dependency of dependencies) {
            const item = findItem(dependency.itemId);
            const answer = findAnswer(dependency.itemId);
            switch (dependency.type) {
                case 'EXACT_ANSWER':
                    if (item.type === 'TEXTBOX' || item.type === 'NUMBERBOX' || item.type === 'RANGE') {
                        if (!answer || answer.text !== dependency.argument) dependencyAttended = false;
                    } else if (item.type === 'CHECKBOX' || item.type === 'RADIO' || item.type === 'SELECT') {
                        if (
                            !answer ||
                            item.itemOptions
                                .filter((o) => Object.keys(answer).includes(o.id.toString()))
                                .map((o) => o.text)
                                .includes(dependency.argument) === false
                        )
                            dependencyAttended = false;
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
                        )
                            dependencyAttended = false;
                    }
                    break;
                case 'MIN':
                    if (item.type === 'CHECKBOX') {
                        if (!answer || Object.keys(answer).length < dependency.argument) dependencyAttended = false;
                    } else if (item.type === 'RANGE' || item.type === 'NUMBERBOX') {
                        if (!answer || Number(answer.text) < dependency.argument) dependencyAttended = false;
                    } else if (item.type === 'TEXTBOX') {
                        if (!answer || answer.text.length < dependency.argument) dependencyAttended = false;
                    }
                    break;
                case 'MAX':
                    if (item.type === 'CHECKBOX') {
                        if (!answer || Object.keys(answer).length > dependency.argument) dependencyAttended = false;
                    } else if (item.type === 'RANGE' || item.type === 'NUMBERBOX') {
                        if (!answer || Number(answer.text) > dependency.argument) dependencyAttended = false;
                    } else if (item.type === 'TEXTBOX') {
                        if (!answer || answer.text.length > dependency.argument) dependencyAttended = false;
                    }
                    break;
                default:
                    break;
            }
        }
        return dependencyAttended;
    };

    /** Obtém o índice da próxima página. */
    const getNextPage = () => {
        const nextPageIndex = currentPageIndex + 1;
        for (let i = nextPageIndex; i < application.protocol.pages.length; i++) {
            if (application.protocol.pages[i].dependencies.length === 0) return i;
            else {
                let dependencyAttended = isDependenciesAttended(application.protocol.pages[i].dependencies);
                if (dependencyAttended === true) return i;
            }
            return undefined;
        }
    };

    /** Verifica se há uma página anterior. */
    const hasPreviousPage = () => currentPageIndex > 0;

    /** Verifica se há uma próxima página. */
    const hasNextPage = () => getNextPage() !== undefined;

    /** Navega para a próxima página. */
    const goToNextPage = () => {
        if (hasNextPage()) setCurrentPageIndex(getNextPage());
    };

    /** Navega para a página anterior. */
    const goToPreviousPage = () => {
        if (hasPreviousPage()) setCurrentPageIndex(currentPageIndex - 1);
    };

    /**
     * Manipula mudanças nas respostas.
     * @param {string} groupToUpdate - Grupo de itens atualizado.
     * @param {string} itemToUpdate - Item atualizado.
     * @param {string} itemType - Tipo de item (ITEM, OPTION, TABLE).
     * @param {Object} updatedAnswer - Resposta atualizada.
     */
    const handleAnswerChange = useCallback((groupToUpdate, itemToUpdate, itemType, updatedAnswer) => {
        setItemAnswerGroups((prevItemAnswerGroups) => {
            const newItemAnswerGroups = { ...prevItemAnswerGroups };

            if (newItemAnswerGroups[groupToUpdate] === undefined)
                newItemAnswerGroups[groupToUpdate] = { itemAnswers: {}, optionAnswers: {}, tableAnswers: {} };

            const targetAnswers =
                newItemAnswerGroups[groupToUpdate][
                    itemType === 'ITEM'
                        ? 'itemAnswers'
                        : itemType === 'OPTION'
                        ? 'optionAnswers'
                        : itemType === 'TABLE'
                        ? 'tableAnswers'
                        : null
                ];

            if (targetAnswers) {
                Object.keys(updatedAnswer).length === 0
                    ? delete targetAnswers[itemToUpdate]
                    : (targetAnswers[itemToUpdate] = updatedAnswer);
            }

            return newItemAnswerGroups;
        });
    }, []);

    /** Manipula submissão do protocolo. */
    const handleProtocolSubmit = () => {
        showAlert({ headerText: 'Aguarde o processamento da resposta.', isClosable: false });

        const applicationAnswer = {
            applicationId: application.id,
            date: new Date(answerDate + 'T' + answerTime + ':00Z'),
            coordinate: answerLocation,
            itemAnswerGroups: [],
        };

        for (const group in itemAnswerGroups)
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
                    .filter((d) => d.groupId === Number(group) && !isDependenciesAttended(d.pageDependencies.concat(d.groupDependencies)))
                    .length === 0
            ) {
                const itemAnswerGroup = { itemAnswers: [], optionAnswers: [], tableAnswers: [] };

                for (const item in itemAnswerGroups[group].itemAnswers)
                    itemAnswerGroup.itemAnswers.push({
                        itemId: item,
                        text: itemAnswerGroups[group].itemAnswers[item].text,
                        files: itemAnswerGroups[group].itemAnswers[item].files,
                    });

                for (const item in itemAnswerGroups[group].optionAnswers)
                    for (const option in itemAnswerGroups[group].optionAnswers[item])
                        if (option !== 'group')
                            itemAnswerGroup.optionAnswers.push({
                                itemId: item,
                                optionId: option,
                                text: itemAnswerGroups[group].optionAnswers[item][option],
                            });

                for (const item in itemAnswerGroups[group].tableAnswers)
                    for (const column in itemAnswerGroups[group].tableAnswers[item])
                        if (column !== 'group')
                            itemAnswerGroup.tableAnswers.push({
                                itemId: item,
                                columnId: column,
                                text: itemAnswerGroups[group].tableAnswers[item][column],
                            });

                applicationAnswer.itemAnswerGroups.push(itemAnswerGroup);
            }

        const formData = serialize(applicationAnswer, { indices: true });

        if (connected === true)
            axios
                .post(process.env.REACT_APP_API_URL + `api/applicationAnswer/createApplicationAnswer`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) =>
                    showAlert({
                        headerText: 'Muito obrigado por sua participação no projeto.',
                        onPrimaryBtnClick: () => navigate(isDashboard ? '/dash/applications' : '/applications'),
                    })
                )
                .catch((error) =>
                    showAlert({
                        headerText: 'Não foi possível submeter a resposta. Tente novamente mais tarde.',
                        bodyText:
                            error.response?.data.message === 'ItemAnswerGroups is a required field'
                                ? 'É necessário responder ao menos 1 item.'
                                : error.response?.data.message,
                    })
                );
        else {
            storePendingRequest({
                id: applicationId,
                userId: user.id,
                title: 'Resposta da aplicação ' + applicationId + ' referente ao protocolo ' + application.protocol.title,
                url: process.env.REACT_APP_API_URL + `api/applicationAnswer/createApplicationAnswer`,
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } },
            });
            showAlert({ headerText: 'Você está offline. A resposta será armazenada localmente e submetida quando houver conexão.' });
        }
    };

    useEffect(() => {
        //Search if the application is in localApplications
        if (localApplications !== undefined && application === undefined) {
            const localApplication = localApplications.find((app) => app.id === parseInt(applicationId));
            if (localApplication !== undefined && connected === false) {
                setApplication(localApplication);
                setIsLoading(false);
            } else if (user.id !== null && user.token !== null) {
                axios
                    .get(process.env.REACT_APP_API_URL + `api/application/getApplicationWithProtocol/${applicationId}`, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    })
                    .then((response) => {
                        setApplication(response.data.data);
                        storeLocalApplication(response.data.data);
                        setIsLoading(false);
                    })
                    .catch((error) =>
                        setError({ text: 'Erro ao obter informações da aplicação', description: error.response?.data.message || '' })
                    );
            }
        }
    }, [applicationId, user, logout, navigate, localApplications, storeLocalApplication, application, isDashboard, connected]);

    useEffect(() => {
        if (connected === false && application?.id)
            showAlert({
                headerText: 'Você está offline. A aplicação ' + applicationId + ' está armazenada localmente e continuará acessível.',
            });
    }, [connected, application, applicationId, showAlert]);

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text="Carregando aplicação..." />;

    return (
        <div className="d-flex flex-column flex-grow-1 w-100 min-vh-100">
            <div className="d-flex flex-grow-1 w-100">
                <div className="d-flex flex-column position-lg-sticky bg-coral-red vh-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="d-flex flex-column flex-grow-1 overflow-hidden bg-yellow-orange p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />

                    <div className="row d-flex align-items-center justify-content-center h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5">
                            <div className="d-flex flex-column flex-grow-1">
                                {isDashboard && (
                                    <div className="row g-2 justify-content-center mb-4">
                                        {application.actions.toUpdate && (
                                            <div className="col">
                                                <TextButton
                                                    type="submit"
                                                    hsl={[197, 43, 61]}
                                                    text="Gerenciar"
                                                    onClick={() => navigate('manage')}
                                                />
                                            </div>
                                        )}
                                        {application.actions.toGetAnswers && (
                                            <div className="col">
                                                <TextButton
                                                    type="submit"
                                                    hsl={[197, 43, 61]}
                                                    text="Respostas"
                                                    onClick={() => navigate('answers')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="row justify-content-center m-0">
                                    <ProtocolInfo title={application.protocol.title} description={application.protocol.description} />
                                </div>
                                {currentPageIndex === 0 && (
                                    <div>
                                        <div className="row justify-content-center m-0 pt-3">
                                            <DateInput answer={answerDate || ''} onAnswerChange={(newDate) => setAnswerDate(newDate)} />
                                        </div>
                                        <div className="row justify-content-center m-0 pt-3">
                                            <TimeInput answer={answerTime || ''} onAnswerChange={(newTime) => setAnswerTime(newTime)} />
                                        </div>
                                        {application.keepLocation && (
                                            <div className="row justify-content-center m-0 pt-3">
                                                <LocationInput
                                                    answer={answerLocation || { latitude: 0.0, longitude: 0.0 }}
                                                    onAnswerChange={(newLocation) => setAnswerLocation(newLocation)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {application.protocol.pages[currentPageIndex].itemGroups
                                    .filter((group) => isDependenciesAttended(group.dependencies))
                                    .map((itemGroup, itemGroupIndex) => {
                                        if (itemGroup.type === 'ONE_DIMENSIONAL')
                                            return (
                                                <div key={'group' + itemGroupIndex}>
                                                    {itemGroup.items.map((item) => {
                                                        switch (item.type) {
                                                            case 'RANGE':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                                        {
                                                                            <RangeInput
                                                                                item={item}
                                                                                galleryModalRef={galleryModalRef}
                                                                                answer={{
                                                                                    text:
                                                                                        itemAnswerGroups[itemGroup.id]?.itemAnswers[item.id]
                                                                                            ?.text || '',
                                                                                    files: [],
                                                                                    group: itemGroup.id,
                                                                                }}
                                                                                group={itemGroup.id}
                                                                                onAnswerChange={handleAnswerChange}
                                                                            />
                                                                        }
                                                                    </div>
                                                                );
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
                                                                                    ...itemAnswerGroups[itemGroup.id]?.optionAnswers[
                                                                                        item.id
                                                                                    ],
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
                                                                                    ...itemAnswerGroups[itemGroup.id]?.optionAnswers[
                                                                                        item.id
                                                                                    ],
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
                                                                                galleryModalRef={galleryModalRef}
                                                                                answer={{
                                                                                    group: itemGroup.id,
                                                                                    ...itemAnswerGroups[itemGroup.id]?.optionAnswers[
                                                                                        item.id
                                                                                    ],
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
                                                                                galleryModalRef={galleryModalRef}
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
                                        else
                                            return (
                                                <div key={'group' + itemGroupIndex} className="row justify-content-center m-0 pt-3">
                                                    <TableInput
                                                        group={itemGroup}
                                                        answers={itemGroup.items.map((i) => ({
                                                            item: i.id,
                                                            answer: { ...itemAnswerGroups[itemGroup.id]?.tableAnswers[i.id] },
                                                        }))}
                                                        onAnswerChange={handleAnswerChange}
                                                    />
                                                </div>
                                            );
                                    })}
                                <div className="row justify-content-center m-0 pt-3">
                                    <TextImageInput
                                        item={{
                                            text:
                                                'Identificador da aplicação:  ' +
                                                application.id +
                                                '  \nIdentificador do protocolo: ' +
                                                application.protocol.id +
                                                '  \nVersão do protocolo: ' +
                                                application.protocol.updatedAt.replace(/\D/g, ''),
                                            files: [],
                                        }}
                                        galleryModalRef={galleryModalRef}
                                    />
                                </div>
                                {!hasNextPage() && (
                                    <div className="col-4 align-self-center pt-4">
                                        <TextButton
                                            type="submit"
                                            hsl={[97, 43, 70]}
                                            text="Enviar"
                                            onClick={() => {
                                                showAlert({
                                                    headerText: 'Tem certeza que deseja enviar o protocolo?',
                                                    primaryBtnHsl: [355, 78, 66],
                                                    primaryBtnLabel: 'Não',
                                                    secondaryBtnHsl: [97, 43, 70],
                                                    secondaryBtnLabel: 'Sim',
                                                    onSecondaryBtnClick: () => handleProtocolSubmit(),
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                                {hasPreviousPage() && (
                                    <div className="col-4 align-self-center pt-4">
                                        <TextButton type="button" hsl={[97, 43, 70]} text="Página anterior" onClick={goToPreviousPage} />
                                    </div>
                                )}
                                {hasNextPage() && (
                                    <div className="col-4 align-self-center pt-4">
                                        <TextButton type="button" hsl={[97, 43, 70]} text="Próxima página" onClick={goToNextPage} />
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
