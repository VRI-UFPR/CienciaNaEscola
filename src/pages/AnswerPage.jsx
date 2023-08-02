import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import RoundedButton from '../components/RoundedButton';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';

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
    const [protocolAnswer, setProtocolAnswer] = useState();
    const [selectedPerson, setSelectedPerson] = useState(undefined);
    const [selectedQuestion, setSelectedQuestion] = useState(undefined);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const formatAnswer = (input, inputAnswers) => {
        switch (input.type) {
            case 0:
                return inputAnswers[0].value;
            case 1:
            case 2:
                return inputAnswers
                    .filter((option) => option.value === 'true')
                    .map((option) => input.sugestions[option.placement].value)
                    .join(', ');

            default:
                break;
        }
    };

    const setVisualization = (person, question) => {
        setSelectedPerson(person);
        setSelectedQuestion(question);
    };

    useEffect(() => {
        if (user.token) {
            axios
                .get(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setProtocolAnswer(response.data);
                    console.log(response.data);
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
                            {protocolAnswer.length > 0 ? protocolAnswer[0].form.title : 'Inválido'}
                        </Link>{' '}
                        -
                    </h1>
                    <h1 className="color-yellow-orange w-auto fw-bold fs-4 m-0 p-0 ps-1">Respostas</h1>
                </div>

                <div className="bg-light-gray rounded-4 mb-3 p-3">
                    <h2 className="color-dark-gray fw-medium fs-5 m-0">
                        {protocolAnswer.length} respostas{' '}
                        <a href="#answerTab" onClick={() => setVisualization(undefined, undefined)} className="fs-6">
                            (ver todas)
                        </a>
                    </h2>
                </div>
                <div className="bg-light-gray rounded-4 mb-3 p-3 pb-1">
                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Quem respondeu?</h2>
                    {protocolAnswer.map((answer, answerIndex) => {
                        return (
                            <div key={'Person ' + answer.id} className="bg-white rounded-4 mb-3 p-2 px-3">
                                <p className="fw-medium fs-6 m-0">
                                    <a href="#answerTab" onClick={() => setVisualization(answerIndex, undefined)}>
                                        Pessoa {answerIndex}
                                    </a>
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div id="answerTab" className=" mb-lg-4">
                    {protocolAnswer.length > 0 &&
                        protocolAnswer[0].form.inputs
                            .filter((_, inputIndex) => selectedQuestion === undefined || selectedQuestion === inputIndex)
                            .map((input, inputIndex) => {
                                return (
                                    <div key={'Input ' + input.id} className="bg-light-gray rounded-4 mb-3 p-3 pb-1">
                                        <a
                                            href="#answerTab"
                                            onClick={() => setVisualization(undefined, inputIndex)}
                                            className="fw-medium fs-5 m-0"
                                        >
                                            Pergunta {input.placement}
                                        </a>
                                        <h3 className="color-dark-gray fw-bold fs-6 m-0 mt-1 mb-3">{input.question}</h3>
                                        {protocolAnswer
                                            .filter((answer, answerIndex) => selectedPerson === undefined || selectedPerson === answerIndex)
                                            .map((answer, answerIndex) => {
                                                return (
                                                    <div key={'Answer ' + answer.id} className="bg-white rounded-4 mb-3 p-2 px-3">
                                                        <p className="fw-medium fs-6 m-0">
                                                            Pessoa {answerIndex} -{' '}
                                                            <span className="color-dark-gray">
                                                                {formatAnswer(input, answer.inputAnswers[input.id])}
                                                            </span>
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                );
                            })}
                </div>
                <div className="row flex-grow-1 justify-content-end mx-0">
                    <div className="col-2 d-flex align-items-end justify-content-end p-0">
                        <RoundedButton role="link" onClick={() => navigate('/help')} />
                    </div>
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
