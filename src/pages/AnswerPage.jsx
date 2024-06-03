import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import baseUrl from '../contexts/RouteContext';
import { Chart } from 'react-google-charts';
import Gallery from '../components/Gallery';
import GalleryModal from '../components/GalleryModal';

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
        color: #787878;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-dark-gray {
        color: #535353;
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

function AnswerPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [answer, setAnswer] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState(undefined);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const galleryModalRef = useRef(null);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const modalRef = useRef(null);

    const setVisualization = (person, question) => {
        setSelectedAnswer(person);
        setSelectedItem(question);
    };

    useEffect(() => {
        if (user.token) {
            axios
                .get(`${baseUrl}api/application/getApplicationWithAnswers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setAnswer(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [id, user]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="container-fluid d-flex flex-column flex-grow-1 p-0 m-0">
            <div className="row flex-grow-1 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky vh-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row d-flex align-items-center justify-content-center font-barlow h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5 pb-lg-4">
                            <h1 className="color-dark-gray font-century-gothic fw-bold fs-2 pb-4 m-0">
                                <Link className="color-dark-gray" to={`/applications/${id}`}>
                                    {answer.protocol.title}
                                </Link>{' '}
                                - Respostas
                            </h1>

                            <div className="bg-light-gray rounded-4 mb-3 p-3">
                                <h2 className="color-dark-gray fw-medium fs-5 m-0">
                                    {Object.keys(answer.answers).length + ' respostas '}
                                    <a
                                        href="#answerTab"
                                        onClick={() => setVisualization(undefined, undefined)}
                                        className="color-dark-gray fw-bold fs-6"
                                    >
                                        (ver todas)
                                    </a>
                                </h2>
                            </div>
                            {Object.entries(answer.answers).length > 0 && (
                                <div className="bg-light-gray rounded-4 mb-3 p-3 pb-1">
                                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Quem respondeu?</h2>
                                    {Object.entries(answer.answers).map(([key, value]) => {
                                        return (
                                            <div key={'answer-' + key} className="bg-white rounded-4 mb-3 p-2 px-3">
                                                <p className="fw-medium fs-6 m-0">
                                                    <a
                                                        className="color-dark-gray fw-bold"
                                                        href="#answerTab"
                                                        onClick={() => setVisualization(key, undefined)}
                                                    >
                                                        {value.user.username + ' - ' + new Date(value.date).toLocaleDateString() + ''}
                                                    </a>
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div id="answerTab" className=" mb-lg-4">
                                {answer.protocol.pages.map((page, pageIndex) => {
                                    return page.itemGroups.map((itemGroup, itemGroupIndex) => {
                                        return itemGroup.items.map((item, itemIndex) => {
                                            return (
                                                (selectedItem === undefined || selectedItem === item.id) &&
                                                item.type !== 'TEXT' && (
                                                    <div key={'input-' + item.id} className="bg-light-gray rounded-4 mb-3 p-3 pb-1">
                                                        <a
                                                            href="#answerTab"
                                                            onClick={() => setVisualization(undefined, item.id)}
                                                            className="d-block color-dark-gray fw-bold fw-medium fs-5 mb-3"
                                                        >
                                                            {item.text}
                                                        </a>
                                                        {Object.entries(item.itemAnswers).map(([applicationAnswerId, answerGroupId]) => {
                                                            return Object.entries(answerGroupId).map(([answerGroupId, groupAnswers]) => {
                                                                return groupAnswers.map((groupAnswer) => {
                                                                    return (
                                                                        (selectedAnswer === undefined ||
                                                                            selectedAnswer === applicationAnswerId) && (
                                                                            <div
                                                                                key={'answer-' + applicationAnswerId}
                                                                                className="bg-white rounded-4 mb-3 p-2 px-3"
                                                                            >
                                                                                <p className="fw-medium fs-6 m-0 mb-1">
                                                                                    {answer.answers[applicationAnswerId].user.username +
                                                                                        ' - ' +
                                                                                        new Date(
                                                                                            answer.answers[applicationAnswerId].date
                                                                                        ).toLocaleDateString()}
                                                                                </p>
                                                                                {item.type === 'UPLOAD' ? (
                                                                                    <Gallery
                                                                                        className="mb-3"
                                                                                        item={{
                                                                                            files: groupAnswer.files.map((file) => ({
                                                                                                path: baseUrl + file.path,
                                                                                            })),
                                                                                        }}
                                                                                        galleryModalRef={galleryModalRef}
                                                                                    />
                                                                                ) : (
                                                                                    <p className="fw-medium fs-6 color-dark-gray m-0">
                                                                                        {groupAnswer.text}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    );
                                                                });
                                                            });
                                                        })}
                                                        {Object.entries(item.itemAnswers).length === 0 && item.itemOptions.length === 0 && (
                                                            <div className="bg-white rounded-4 mb-3 p-2 px-3">
                                                                <p className="fw-medium fs-6 color-dark-gray m-0">0 respostas</p>
                                                            </div>
                                                        )}
                                                        {item.itemOptions.map((option, index) => {
                                                            return (
                                                                <div
                                                                    key={'answer-' + option.id}
                                                                    className="bg-white rounded-4 mb-3 p-2 px-3"
                                                                >
                                                                    <p className="fw-medium fs-6 m-0 mb-1">
                                                                        {option.text +
                                                                            ' - ' +
                                                                            (selectedAnswer === undefined
                                                                                ? Object.keys(option.optionAnswers).length
                                                                                : option.optionAnswers[selectedAnswer] === undefined
                                                                                ? '0'
                                                                                : '1') +
                                                                            ' respostas'}
                                                                    </p>
                                                                    {Object.entries(option.optionAnswers).map(
                                                                        ([applicationAnswerId, answerGroupId]) => {
                                                                            return Object.entries(answerGroupId).map(
                                                                                ([answerGroupId, groupAnswers]) => {
                                                                                    return (
                                                                                        (selectedAnswer === undefined ||
                                                                                            selectedAnswer === applicationAnswerId) && (
                                                                                            <p
                                                                                                className="fw-medium fs-6 color-dark-gray m-0"
                                                                                                key={
                                                                                                    'answer-' +
                                                                                                    applicationAnswerId +
                                                                                                    '-' +
                                                                                                    answerGroupId
                                                                                                }
                                                                                            >
                                                                                                {answer.answers[applicationAnswerId].user
                                                                                                    .username +
                                                                                                    ' (' +
                                                                                                    new Date(
                                                                                                        answer.answers[
                                                                                                            applicationAnswerId
                                                                                                        ].date
                                                                                                    ).toLocaleDateString() +
                                                                                                    '); '}
                                                                                            </p>
                                                                                        )
                                                                                    );
                                                                                }
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        {item.itemOptions.length > 0 && selectedAnswer === undefined && (
                                                            <div className="rounded-4 overflow-hidden mb-3">
                                                                <Chart
                                                                    chartType="PieChart"
                                                                    data={[['Resposta', 'Quantidade']].concat(
                                                                        item.itemOptions.map((io) => {
                                                                            return [io.text, Object.keys(io.optionAnswers).length];
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
                                                )
                                            );
                                        });
                                    });
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="AnswerPageAlert" ref={modalRef} />
            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AnswerPage;
