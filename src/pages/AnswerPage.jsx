import { React, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';

import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import { AuthContext } from '../contexts/AuthContext';
import InfoGerais from '../components/inputs/answers/InfoGerais';
import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import Location from '../components/inputs/answers/LocationInput';

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
`;

function AnswerPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [protocolAnswer, setProtocolAnswer] = useState();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

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
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 bg-yellow-orange px-4 py-4">
                <div className="row m-0 w-100">
                    <div className="col-3 col-sm-2 p-0">
                        <div className="btn-group w-100" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" data-bs-target="#answersCarousel" data-bs-slide="prev">
                                Anterior
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-target="#answersCarousel" data-bs-slide="next">
                                Próxima
                            </button>
                        </div>
                    </div>
                    <div className="col-9 col-sm-10 pe-0">
                        <input
                            className="rounded shadow font-barlow gray-color border-0 p-2 w-100"
                            type="text"
                            placeholder="Insira seu nome"
                        />
                    </div>
                </div>
                <div id="answersCarousel" className="carousel slide carousel-fade" data-bs-touch="false">
                    <div className="carousel-inner">
                        {protocolAnswer.map((answer, answerIndex) => {
                            return (
                                <div key={answer.id} className={`carousel-item ${answerIndex === 0 ? 'active' : ''}`}>
                                    {answer.form.inputs.map((input, inputIndex) => {
                                        const inputAnswer = answer.inputAnswers[input.id];
                                        switch (input.type) {
                                            case 0:
                                                if (input.question === 'infos' && input.description === 'infos' && input.placement === 1) {
                                                    return (
                                                        <div key={input.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <InfoGerais
                                                                    input={input}
                                                                    onAnswerChange={() => undefined}
                                                                    answer={inputAnswer}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                } else if (
                                                    input.question === 'date' &&
                                                    input.description === 'date' &&
                                                    input.placement === 2
                                                ) {
                                                    return (
                                                        <div key={input.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <DateInput
                                                                    input={input}
                                                                    onAnswerChange={() => undefined}
                                                                    answer={inputAnswer}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                } else if (
                                                    input.question === 'time' &&
                                                    input.description === 'time' &&
                                                    input.placement === 3
                                                ) {
                                                    return (
                                                        <div key={input.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <TimeInput
                                                                    input={input}
                                                                    onAnswerChange={() => undefined}
                                                                    answer={inputAnswer}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                } else if (
                                                    input.question === 'location' &&
                                                    input.description === 'location' &&
                                                    input.placement === 4
                                                ) {
                                                    return (
                                                        <div key={input.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <Location
                                                                    input={input}
                                                                    onAnswerChange={() => undefined}
                                                                    answer={inputAnswer}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div key={input.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <SimpleTextInput
                                                                    input={input}
                                                                    onAnswerChange={() => undefined}
                                                                    answer={inputAnswer}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                }
                                            case 2:
                                                return (
                                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                                        {
                                                            <RadioButtonInput
                                                                input={input}
                                                                answer={inputAnswer}
                                                                onAnswerChange={() => undefined}
                                                            />
                                                        }
                                                    </div>
                                                );

                                            default:
                                                return undefined;
                                        }
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AnswerPage;
