import { React, useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import RoundedButton from '../components/RoundedButton';

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
    const [selectedPerson, setSelectedPerson] = useState(0);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

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
                <div className="row m-0 p-0">
                    <h1 className="color-dark-gray w-auto fw-bold fs-4 m-0 mb-3 p-0">
                        <Link className="color-dark-gray" to={`protocol/${id}`}>
                            {protocolAnswer[0].form.title}
                        </Link>{' '}
                        -
                    </h1>
                    <h1 className="color-yellow-orange w-auto fw-bold fs-4 m-0 mb-3 p-0 ps-1">Respostas</h1>
                </div>

                <div className="bg-light-gray rounded-4 p-3 mb-3">
                    <h2 className="color-dark-gray fw-medium fs-5 m-0">4 respostas</h2>
                </div>
                <div className="bg-light-gray rounded-4 p-3 pb-0 mb-3">
                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Quem respondeu?</h2>
                    {protocolAnswer.map((answer, answerIndex) => {
                        return (
                            <div key={answer.id} className="bg-white rounded-4 p-2 px-3 mb-3">
                                <p className="fw-medium fs-6 m-0">
                                    <a href="#answerTab" onClick={() => setSelectedPerson(answerIndex)}>
                                        Pessoa {answerIndex}
                                    </a>
                                </p>
                            </div>
                        );
                    })}
                </div>
                {/* <div className="bg-light-gray rounded-4 p-3 mb-3">
                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Visualizar</h2>
                    <select className="form-select fw-medium fs-6 m-0 bg-white rounded-4 p-2 px-3" aria-label="Default select example">
                        <option className="color-dark-gray fw-medium fs-5 m-0" value="1">
                            Todas as questões
                        </option>
                        <option className="color-dark-gray fw-medium fs-5 m-0" value="2">
                            Questão 1
                        </option>
                        <option className="color-dark-gray fw-medium fs-5 m-0" value="3">
                            Questão 2...
                        </option>
                    </select>
                </div> */}
                {protocolAnswer.map((answer, answerIndex) => {
                    if (answerIndex === selectedPerson) {
                        return (
                            <div id="answerTab" key={answer.id}>
                                <h1 className="color-dark-gray fw-bold fs-4 m-0 mb-3">Respostas da pessoa {answerIndex}</h1>
                                {answer.form.inputs.map((input, inputIndex) => {
                                    switch (input.type) {
                                        case 0:
                                            return (
                                                <div key={input.id} className="bg-light-gray rounded-4 p-3 mb-3">
                                                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Pergunta {input.placement}</h2>
                                                    <h3 className="color-dark-gray fw-bold fs-6 m-0 mb-3">{input.question}</h3>
                                                    <div className="bg-white rounded-4 p-2 px-3">
                                                        <p className="fw-medium fs-6 m-0">{answer.inputAnswers[input.id][0].value}</p>
                                                    </div>
                                                </div>
                                            );
                                        case 1:
                                        case 2:
                                            return (
                                                <div key={input.id} className="bg-light-gray rounded-4 p-3 mb-3">
                                                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Pergunta {input.placement}</h2>
                                                    <h3 className="color-dark-gray fw-bold fs-6 m-0 mb-3">{input.question}</h3>

                                                    {answer.inputAnswers[input.id].map((option, optionIndex) => {
                                                        if (option.value === 'true') {
                                                            return (
                                                                <div key={option.id} className="bg-white rounded-4 p-2 px-3">
                                                                    <p className="fw-medium fs-6 m-0">
                                                                        {input.sugestions[optionIndex].value}
                                                                    </p>
                                                                </div>
                                                            );
                                                        } else {
                                                            return <></>;
                                                        }
                                                    })}
                                                </div>
                                            );

                                        default:
                                            return <></>;
                                    }
                                })}
                            </div>
                        );
                    } else {
                        return <></>;
                    }
                })}
                <div className="row justify-content-end mx-0">
                    <div className="col-2 d-flex align-items-end justify-content-end p-0">
                        <RoundedButton role="link" onClick={() => navigate('/help')} />
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AnswerPage;
