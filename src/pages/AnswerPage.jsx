import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import baseUrl from '../contexts/RouteContext';

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
`;

function AnswerPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [answer, setAnswer] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState(undefined);
    const [selectedItem, setSelectedItem] = useState(undefined);
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
                .get(`${baseUrl}api/applicationAnswer/getApplicationWithAnswers/${id}`, {
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
        <div className="font-barlow d-flex flex-column min-vh-100">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 bg-white p-4 p-lg-5">
                <div className="row m-0 mb-4 p-0">
                    <h1 className="color-dark-gray w-auto fw-bold fs-4 m-0 p-0">
                        <Link className="color-dark-gray" to={`/protocol/${id}`}>
                            {answer.protocol.title}
                        </Link>{' '}
                        -
                    </h1>
                    <h1 className="color-dark-gray w-auto fw-bold fs-4 m-0 p-0 ps-1">Respostas</h1>
                </div>

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
                {Object.entries(answer.answers).lenght > 0 && (
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
                                                            (selectedAnswer === undefined || selectedAnswer === applicationAnswerId) && (
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
                                                                    <p className="fw-medium fs-6 color-dark-gray m-0">{groupAnswer.text}</p>
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
                                                    <div key={'answer-' + option.id} className="bg-white rounded-4 mb-3 p-2 px-3">
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
                                                                                    {answer.answers[applicationAnswerId].user.username +
                                                                                        ' (' +
                                                                                        new Date(
                                                                                            answer.answers[applicationAnswerId].date
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
                                        </div>
                                    )
                                );
                            });
                        });
                    })}
                </div>
            </div>
            <Alert id="AnswerPageAlert" ref={modalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AnswerPage;
