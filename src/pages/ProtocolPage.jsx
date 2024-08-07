/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

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
import Alert from '../components/Alert';
import GalleryModal from '../components/GalleryModal';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { serialize } from 'object-to-formdata';

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
`;

function ProtocolPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const [application, setApplication] = useState(undefined);
    const [itemAnswerGroups, setItemAnswerGroups] = useState({});
    const { id } = useParams();
    const { connected, storeLocalApplication, storePendingRequest, localApplications } = useContext(StorageContext);
    const modalRef = useRef(null);
    const galleryModalRef = useRef(null);
    const navigate = useNavigate();

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
        modalRef.current.showModal({
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
                    itemAnswerGroup.optionAnswers.push({
                        itemId: item,
                        optionId: option,
                        text: itemAnswerGroups[group].optionAnswers[item][option],
                    });
                }
            }
            for (const item in itemAnswerGroups[group].tableAnswers) {
                for (const column in itemAnswerGroups[group].tableAnswers[item]) {
                    itemAnswerGroup.tableAnswers.push({
                        itemId: item,
                        columnId: column,
                        text: itemAnswerGroups[group].tableAnswers[item][column],
                    });
                }
            }
            applicationAnswer.itemAnswerGroups.push(itemAnswerGroup);
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
                    modalRef.current.showModal({
                        title: 'Muito obrigado por sua participação no projeto!',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                        onHide: () => {
                            navigate('/home');
                        },
                    });
                })
                .catch((error) => {
                    modalRef.current.showModal({
                        title: 'Não foi possível submeter a resposta. Tente novamente mais tarde.',
                        description: error.response.data.message,
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                    console.error(error.message);
                });
        } else {
            storePendingRequest({
                id: id,
                userId: user.id,
                title: 'Resposta da aplicação ' + id + ' referente ao protocolo ' + application.protocol.title,
                url: baseUrl + `api/applicationAnswer/createApplicationAnswer`,
                data: formData,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            });
            modalRef.current.showModal({
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
            const localApplication = localApplications.find((app) => app.id === parseInt(id));
            if (localApplication !== undefined) {
                setApplication(localApplication);
                setIsLoading(false);
            } else if (user.id !== null && user.token !== null) {
                axios
                    .get(baseUrl + `api/application/getApplicationWithProtocol/${id}`, {
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
                        console.error(error.message);
                        if ((error.response?.status ?? 401) === 401) {
                            logout();
                            navigate('/login');
                        }
                    });
            }
        }
    }, [id, user, logout, navigate, localApplications, storeLocalApplication, application]);

    useEffect(() => {
        if (connected === false && application?.id) {
            modalRef.current.showModal({
                title: 'Você está offline. O protocolo ' + id + ' está armazenado localmente e continuará acessível.',
                dismissHsl: [97, 43, 70],
                dismissText: 'Ok',
                dismissible: true,
            });
        }
    }, [connected, application, id]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="d-flex flex-column flex-grow-1 w-100 min-vh-100">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 bg-yellow-orange p-4">
                <div className="row justify-content-center m-0">
                    <div className="align-self-center p-0 pb-4">
                        <TextButton
                            type="submit"
                            hsl={[97, 43, 70]}
                            text="Respostas"
                            onClick={() => {
                                navigate('/answer/' + id);
                            }}
                        />
                    </div>
                </div>
                <div className="row justify-content-center m-0">
                    {<ProtocolInfo title={application.protocol.title} description={application.protocol.description} />}
                </div>
                {application.protocol.pages.map((page) => {
                    return page.itemGroups.map((itemGroup) => {
                        return itemGroup.items.map((item) => {
                            switch (item.type) {
                                case 'TEXTBOX':
                                case 'NUMBERBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {
                                                <SimpleTextInput
                                                    item={item}
                                                    galleryModalRef={galleryModalRef}
                                                    group={itemGroup.id}
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
                                                    group={itemGroup.id}
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
                                                    group={itemGroup.id}
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
                                                    group={itemGroup.id}
                                                    onAnswerChange={handleAnswerChange}
                                                />
                                            }
                                        </div>
                                    );
                                case 'DATEBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<DateInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'TIMEBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<TimeInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'LOCATIONBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<LocationInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'UPLOAD':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<ImageInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
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
                        });
                    });
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
                                    application.protocol.createdAt.replace(/\D/g, ''),
                                files: [],
                            }}
                            galleryModalRef={galleryModalRef}
                        />
                    }
                </div>
                <div className="col-4 align-self-center pt-4">
                    <TextButton
                        type="submit"
                        hsl={[97, 43, 70]}
                        text="Enviar"
                        onClick={() => {
                            modalRef.current.showModal({
                                title: 'Tem certeza que deseja enviar o protocolo?',
                                dismissHsl: [355, 78, 66],
                                dismissText: 'Não',
                                actionHsl: [97, 43, 70],
                                actionText: 'Sim',
                                actionOnClick: () => {
                                    handleProtocolSubmit();
                                },
                            });
                        }}
                    />
                </div>
            </div>
            <Alert id="ProtocolPageAlert" ref={modalRef} />
            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
