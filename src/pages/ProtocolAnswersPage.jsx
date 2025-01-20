/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CustomContainer from '../components/CustomContainer';
import NavBar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import SplashPage from './SplashPage';
import ErrorPage from './ErrorPage';
import TextButton from '../components/TextButton';
import RoundedButton from '../components/RoundedButton';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Gallery from '../components/Gallery';
import GalleryModal from '../components/GalleryModal';
import Chart from 'react-google-charts';
import TableInput from '../components/inputs/answers/TableInput';
import { AlertContext } from '../contexts/AlertContext';

const styles = `
    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .color-yellow-orange {
        color: #FECF86;
    }

    .bg-light-gray {
        background-color: #D9D9D9;
    }

    .bg-coral-red {
        background-color: #F59489;
    }

    .color-gray {
        color: #787878 !important;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-dark-gray {
        color: #535353 !important;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

function ProtocolAnswersPage(props) {
    const { protocolId } = useParams();
    const { user } = useContext(AuthContext);
    const [protocolWAnswers, setProtocolWAnswers] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const mapRef = useRef();
    const galleryModalRef = useRef();
    const [selectedAnswer, setSelectedAnswer] = useState(undefined);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const [selectedApplication, setSelectedApplication] = useState(undefined);
    const { showAlert } = useContext(AlertContext);

    const setVisualization = (person, question, application) => {
        setSelectedAnswer(person);
        setSelectedItem(question);
        setSelectedApplication(application);
    };

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            axios
                .get(`${process.env.REACT_APP_API_URL}api/protocol/getProtocolWithAnswers/${protocolId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setProtocolWAnswers(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError({ text: 'Erro ao carregar protocolo', description: error.response?.data.message || '' });
                });
        }
    }, [protocolId, user.token, user.status, isLoading]);

    const approveAnswer = (applicationAnswerId) => {
        axios
            .put(
                `${process.env.REACT_APP_API_URL}api/applicationAnswer/approveApplicationAnswer/${applicationAnswerId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                showAlert({ headerText: 'Resposta aprovada com sucesso', message: response.data.message });
                setProtocolWAnswers((prev) => {
                    const newProtocol = { ...prev };
                    newProtocol.applications = newProtocol.applications.map((application) => {
                        const newApplication = { ...application };
                        newApplication.answers = newApplication.answers.map((answer) => {
                            const newAnswer = { ...answer };
                            if (newAnswer.id === applicationAnswerId) {
                                newAnswer.approved = true;
                            }
                            return newAnswer;
                        });
                        return newApplication;
                    });
                    return newProtocol;
                });
            })
            .catch((error) => showAlert({ headerText: 'Erro ao aprovar resposta', message: error.response?.data.message || '' }));
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando protocolo..." />;
    }

    return (
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row align-items-stretch h-100 g-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <CustomContainer className="font-barlow flex-grow-1 overflow-y-scroll p-4" df="12" md="10">
                        <div className="row align-items-center gx-2 gy-3 mb-4">
                            <div className="col-12 col-md-9 order-2 order-md-1 ">
                                <h1 className="color-dark-gray font-century-gothic fw-bold fs-2 m-0">
                                    <Link className="color-dark-gray" to={`/dash/protocols/${protocolId}`}>
                                        {protocolWAnswers.title}
                                    </Link>
                                </h1>
                            </div>
                            <div className="col order-1 order-md-2">
                                <TextButton text={'Exportar'} hsl={[197, 43, 61]} onClick={() => {}} disabled={true} />
                            </div>
                        </div>
                        <div className="bg-light-gray rounded-4 mb-3 p-3">
                            <div className="row gx-2 justify-content-between align-items-center">
                                <div className="col">
                                    <h2 className="color-dark-gray fw-medium fs-5 m-0">
                                        Aplicações ({protocolWAnswers.applications.length}) e respostas (
                                        {protocolWAnswers.applications.flatMap((application) => application.answers).length})
                                    </h2>
                                    <p className="color-dark-gray fw-medium fs-6 m-0">
                                        Clique em uma aplicação ou resposta para filtrar{' '}
                                        <a
                                            href="#answerTab"
                                            onClick={() => setVisualization(undefined, undefined, undefined)}
                                            className="color-dark-gray fw-bold fs-6"
                                        >
                                            (limpar filtros)
                                        </a>
                                    </p>
                                </div>
                                <div className="col-auto">
                                    <RoundedButton
                                        hsl={[0, 0, 85]}
                                        size={32}
                                        icon="expand_content"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#applicationCollapse"
                                        aria-controls="applicationCollapse"
                                        className="color-dark-gray"
                                    />
                                </div>
                            </div>
                            <div className="collapse" id="applicationCollapse">
                                {protocolWAnswers.applications.map((application) => {
                                    return (
                                        <div key={'answer-' + application.id} className="bg-white rounded-4 mt-3 p-3">
                                            <div className="row gx-2 justify-content-between align-items-center">
                                                <div className="col-11">
                                                    <a
                                                        className="color-dark-gray fw-bold fs-6"
                                                        href="#answerTab"
                                                        onClick={() => setVisualization(undefined, undefined, application.id)}
                                                    >
                                                        Aplicação #{application.id} -{' '}
                                                        {application.applier.username +
                                                            ' - ' +
                                                            new Date(application.createdAt).toLocaleDateString()}
                                                    </a>
                                                </div>
                                                <div className="col-auto">
                                                    <RoundedButton
                                                        hsl={[0, 0, 100]}
                                                        size={20}
                                                        icon="expand_content"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={'#answerCollapse' + application.id}
                                                        aria-controls={'answerCollapse' + application.id}
                                                        className="color-dark-gray"
                                                    />
                                                </div>
                                            </div>
                                            <div className="collapse" id={'answerCollapse' + application.id}>
                                                {application.answers.map((answer) => {
                                                    return (
                                                        <div key={'answer-' + answer.id} className="mt-1">
                                                            <div className="row gx-2 justify-content-between align-items-center">
                                                                <div className="col-11">
                                                                    <a
                                                                        className="color-dark-gray fs-6"
                                                                        href="#answerTab"
                                                                        onClick={() => setVisualization(answer.id, undefined, undefined)}
                                                                    >
                                                                        Resposta #{answer.id} -{' '}
                                                                        {answer.user.username +
                                                                            ' - ' +
                                                                            new Date(answer.date).toLocaleDateString()}
                                                                    </a>
                                                                </div>
                                                                {answer.approved !== true && (
                                                                    <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[97, 43, 70]}
                                                                            size={20}
                                                                            onClick={() => approveAnswer(answer.id)}
                                                                            icon="check"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="bg-light-gray rounded-4 mb-3 p-3">
                            <div className="row gx-2 justify-content-between align-items-center">
                                <div className="col">
                                    <div className="col">
                                        <h2 className="color-dark-gray fw-medium fs-5 m-0">Localizações</h2>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <RoundedButton
                                        hsl={[0, 0, 85]}
                                        size={32}
                                        icon="expand_content"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#locationCollapse"
                                        aria-controls="locationCollapse"
                                        className="color-dark-gray"
                                    />
                                </div>
                            </div>
                            <div className="collapse show" id="locationCollapse">
                                <div className="rounded-4 overflow-hidden bg-white mt-3">
                                    <MapContainer center={[-14.235, -51.9253]} zoom={3} style={{ height: '400px' }} ref={mapRef}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {protocolWAnswers.applications
                                            .filter(
                                                (application) => selectedApplication === undefined || application.id === selectedApplication
                                            )
                                            .flatMap((application) => application.answers)
                                            .filter((answer) => selectedAnswer === undefined || answer.id === selectedAnswer)
                                            .map((answer) => {
                                                return (
                                                    <Marker
                                                        position={[answer.coordinate.latitude, answer.coordinate.longitude]}
                                                        key={'marker-' + answer.id}
                                                        eventHandlers={{
                                                            add: () =>
                                                                mapRef.current.setView([
                                                                    answer.coordinate.latitude,
                                                                    answer.coordinate.longitude,
                                                                ]),
                                                        }}
                                                    >
                                                        <Popup>
                                                            <a
                                                                className="color-dark-gray fw-bold"
                                                                href="#answerTab"
                                                                onClick={() => setVisualization(answer.id, undefined, undefined)}
                                                            >
                                                                {answer.user.username + ' - ' + new Date(answer.date).toLocaleDateString()}
                                                            </a>
                                                        </Popup>
                                                    </Marker>
                                                );
                                            })}
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center gx-2 gy-3 mb-4" id="answerTab">
                            <div className="col">
                                <h1 className="color-dark-gray font-century-gothic fw-bold fs-2 m-0">Respostas</h1>
                            </div>
                        </div>
                        <div className=" mb-lg-4">
                            {protocolWAnswers.pages.map((page) => {
                                return page.itemGroups.map((itemGroup) => {
                                    return (() => {
                                        switch (itemGroup.type) {
                                            case 'ONE_DIMENSIONAL':
                                                return itemGroup.items.map((item) => {
                                                    return (
                                                        (selectedItem === undefined || selectedItem === item.id) && (
                                                            <div key={'input-' + item.id} className="bg-light-gray rounded-4 mb-3 p-3">
                                                                <div className="row gx-2 justify-content-between align-items-center">
                                                                    <div className="col-10">
                                                                        <a
                                                                            href="#answerTab"
                                                                            onClick={() => setVisualization(undefined, item.id, undefined)}
                                                                            className="d-block color-dark-gray fw-bold fw-medium fs-5"
                                                                        >
                                                                            {item.text}
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[0, 0, 85]}
                                                                            size={32}
                                                                            icon="expand_content"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={'#itemCollapse' + item.id}
                                                                            aria-controls={'itemCollapse' + item.id}
                                                                            className="color-dark-gray"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="collapse show" id={'itemCollapse' + item.id}>
                                                                    {item.itemAnswers.map((itemAnswer) => {
                                                                        return (
                                                                            (selectedAnswer === undefined ||
                                                                                itemAnswer.group.applicationAnswer.id === selectedAnswer) &&
                                                                            (selectedApplication === undefined ||
                                                                                protocolWAnswers.applications
                                                                                    .find(
                                                                                        (application) =>
                                                                                            application.id === selectedApplication
                                                                                    )
                                                                                    .answers.find(
                                                                                        (answer) =>
                                                                                            answer.id ===
                                                                                            itemAnswer.group.applicationAnswer.id
                                                                                    ) !== undefined) && (
                                                                                <div
                                                                                    key={'answer-' + itemAnswer.id}
                                                                                    className="bg-white rounded-4 mt-3 p-2 px-3"
                                                                                >
                                                                                    <p className="fw-medium fs-6 m-0 mb-1">
                                                                                        {protocolWAnswers.applications.flatMap(
                                                                                            (application) =>
                                                                                                application.answers.map((answer) => {
                                                                                                    return answer.id ===
                                                                                                        itemAnswer.group.applicationAnswer
                                                                                                            .id
                                                                                                        ? answer.user.username +
                                                                                                              ' - ' +
                                                                                                              new Date(
                                                                                                                  answer.date
                                                                                                              ).toLocaleDateString()
                                                                                                        : '';
                                                                                                })
                                                                                        )}
                                                                                    </p>
                                                                                    {item.type === 'UPLOAD' ? (
                                                                                        <Gallery
                                                                                            className="mt-3"
                                                                                            item={{
                                                                                                files: itemAnswer.files.map((file) => ({
                                                                                                    path: file.path,
                                                                                                })),
                                                                                            }}
                                                                                            galleryModalRef={galleryModalRef}
                                                                                        />
                                                                                    ) : (
                                                                                        <p className="fw-medium fs-6 color-dark-gray m-0">
                                                                                            {itemAnswer.text}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        );
                                                                    })}
                                                                    {item.itemAnswers.length === 0 && item.itemOptions.length === 0 && (
                                                                        <div className="bg-white rounded-4 mt-3 p-2 px-3">
                                                                            <p className="fw-medium fs-6 color-dark-gray m-0">
                                                                                0 respostas
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {item.itemOptions.map((itemOption) => {
                                                                        return (
                                                                            <div
                                                                                key={'answer-' + itemOption.id}
                                                                                className="bg-white rounded-4 mt-3 p-2 px-3"
                                                                            >
                                                                                <p className="fw-medium fs-6 m-0 mb-1">
                                                                                    {itemOption.text +
                                                                                        ' - ' +
                                                                                        itemOption.optionAnswers.filter(
                                                                                            (optionAnswer) =>
                                                                                                (selectedAnswer === undefined ||
                                                                                                    optionAnswer.group.applicationAnswer
                                                                                                        .id === selectedAnswer) &&
                                                                                                (selectedApplication === undefined ||
                                                                                                    protocolWAnswers.applications
                                                                                                        .find(
                                                                                                            (application) =>
                                                                                                                application.id ===
                                                                                                                selectedApplication
                                                                                                        )
                                                                                                        .answers.find(
                                                                                                            (answer) =>
                                                                                                                answer.id ===
                                                                                                                optionAnswer.group
                                                                                                                    .applicationAnswer.id
                                                                                                        ) !== undefined)
                                                                                        ).length +
                                                                                        ' respostas'}
                                                                                </p>
                                                                                {itemOption.optionAnswers.map((optionAnswer) => {
                                                                                    return (
                                                                                        (selectedAnswer === undefined ||
                                                                                            optionAnswer.group.applicationAnswer.id ===
                                                                                                selectedAnswer) &&
                                                                                        (selectedApplication === undefined ||
                                                                                            protocolWAnswers.applications
                                                                                                .find(
                                                                                                    (application) =>
                                                                                                        application.id ===
                                                                                                        selectedApplication
                                                                                                )
                                                                                                .answers.find(
                                                                                                    (answer) =>
                                                                                                        answer.id ===
                                                                                                        optionAnswer.group.applicationAnswer
                                                                                                            .id
                                                                                                ) !== undefined) && (
                                                                                            <p
                                                                                                className="fw-medium fs-6 color-dark-gray m-0"
                                                                                                key={'option-answer-' + optionAnswer.id}
                                                                                            >
                                                                                                {protocolWAnswers.applications.flatMap(
                                                                                                    (application) =>
                                                                                                        application.answers.map(
                                                                                                            (answer) => {
                                                                                                                return answer.id ===
                                                                                                                    optionAnswer.group
                                                                                                                        .applicationAnswer
                                                                                                                        .id
                                                                                                                    ? answer.user.username +
                                                                                                                          ' - ' +
                                                                                                                          new Date(
                                                                                                                              answer.date
                                                                                                                          ).toLocaleDateString()
                                                                                                                    : '';
                                                                                                            }
                                                                                                        )
                                                                                                )}
                                                                                            </p>
                                                                                        )
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {item.itemOptions
                                                                        .flatMap((itemOption) => itemOption.optionAnswers)
                                                                        .filter(
                                                                            (optionAnswer) =>
                                                                                (selectedAnswer === undefined ||
                                                                                    optionAnswer.group.applicationAnswer.id ===
                                                                                        selectedAnswer) &&
                                                                                (selectedApplication === undefined ||
                                                                                    protocolWAnswers.applications
                                                                                        .find(
                                                                                            (application) =>
                                                                                                application.id === selectedApplication
                                                                                        )
                                                                                        .answers.find(
                                                                                            (answer) =>
                                                                                                answer.id ===
                                                                                                optionAnswer.group.applicationAnswer.id
                                                                                        ) !== undefined)
                                                                        ).length > 0 && (
                                                                        <div className="rounded-4 overflow-hidden mt-3">
                                                                            <Chart
                                                                                chartType="PieChart"
                                                                                data={[['Resposta', 'Quantidade']].concat(
                                                                                    item.itemOptions.map((itemOption) => {
                                                                                        return [
                                                                                            itemOption.text,
                                                                                            itemOption.optionAnswers.filter(
                                                                                                (optionAnswer) =>
                                                                                                    (selectedAnswer === undefined ||
                                                                                                        optionAnswer.group.applicationAnswer
                                                                                                            .id === selectedAnswer) &&
                                                                                                    (selectedApplication === undefined ||
                                                                                                        protocolWAnswers.applications
                                                                                                            .find(
                                                                                                                (application) =>
                                                                                                                    application.id ===
                                                                                                                    selectedApplication
                                                                                                            )
                                                                                                            .answers.find(
                                                                                                                (answer) =>
                                                                                                                    answer.id ===
                                                                                                                    optionAnswer.group
                                                                                                                        .applicationAnswer
                                                                                                                        .id
                                                                                                            ) !== undefined)
                                                                                            ).length,
                                                                                        ];
                                                                                    })
                                                                                )}
                                                                                options={{
                                                                                    chartArea: { top: 8, height: '90%', width: '90%' },
                                                                                    legend: { position: 'bottom' },
                                                                                    colors: [
                                                                                        '#F59489',
                                                                                        '#91CAD6',
                                                                                        '#FECF86',
                                                                                        '#4E9BB9',
                                                                                        '#EC6571',
                                                                                        '#AAD390',
                                                                                        '#8C6A80',
                                                                                        '#70A6A6',
                                                                                        '#FACD63',
                                                                                        '#578AA2',
                                                                                        '#E64E5E',
                                                                                        '#91BD7E',
                                                                                        '#F9A98F',
                                                                                        '#76C4D1',
                                                                                        '#FEDB8A',
                                                                                        '#5C97B2',
                                                                                        '#D85A6A',
                                                                                        '#89A86B',
                                                                                        '#F7BC92',
                                                                                        '#6FACB5',
                                                                                        '#E14953',
                                                                                        '#A1C588',
                                                                                        '#F5D39A',
                                                                                        '#568BA5',
                                                                                        '#C44D59',
                                                                                        '#7FA569',
                                                                                        '#E6A17C',
                                                                                        '#619BB0',
                                                                                        '#F39C9F',
                                                                                        '#ADC192',
                                                                                        '#FFD07D',
                                                                                        '#5499AE',
                                                                                        '#E6606F',
                                                                                        '#97BD83',
                                                                                        '#F6C2A3',
                                                                                        '#6BA3B8',
                                                                                        '#E15661',
                                                                                        '#90B67A',
                                                                                        '#F7AE9C',
                                                                                        '#75BFCB',
                                                                                        '#E6737D',
                                                                                        '#A2CA93',
                                                                                        '#FAD4AC',
                                                                                        '#639FB7',
                                                                                        '#D45B66',
                                                                                        '#83AB77',
                                                                                        '#F9B69B',
                                                                                        '#71B4C6',
                                                                                        '#E75762',
                                                                                        '#A8C599',
                                                                                    ],
                                                                                    is3D: true,
                                                                                }}
                                                                                height={'400px'}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    );
                                                });
                                            case 'TEXTBOX_TABLE':
                                            case 'RADIO_TABLE':
                                            case 'CHECKBOX_TABLE':
                                                return protocolWAnswers.applications.flatMap((application) => {
                                                    return application.answers.map((answer) => {
                                                        return (
                                                            <div
                                                                key={`group-${itemGroup.id}-${answer.id}`}
                                                                className="row justify-content-center m-0 pt-3"
                                                            >
                                                                <TableInput
                                                                    isProtocol={true}
                                                                    applicationAnswerId={answer.id}
                                                                    group={itemGroup}
                                                                    answersPage={true}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        );
                                                    });
                                                });
                                            default:
                                                return null;
                                        }
                                    })();
                                });
                            })}
                        </div>
                    </CustomContainer>
                </div>
            </div>
            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolAnswersPage;
