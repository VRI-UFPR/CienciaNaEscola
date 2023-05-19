import { React, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import InfoGerais from '../components/inputs/answers/InfoGerais';
import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import LocationInput from '../components/inputs/answers/LocationInput';

import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import TextButton from '../components/TextButton';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';

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

function ProtocolPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [protocol, setProtocol] = useState();
    const [answers, setAnswers] = useState({});
    const { id } = useParams();

    const handleAnswerChange = useCallback((indexToUpdate, updatedAnswer) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            newAnswers[indexToUpdate] = updatedAnswer;
            return newAnswers;
        });
    }, []);

    const handleProtocolSubmit = () => {
        axios
            .post(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, answers)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    useEffect(() => {
        axios
            .get(`https://genforms.c3sl.ufpr.br/api/form/${id}`)
            .then((response) => {
                setProtocol(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, [id]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 bg-yellow-orange px-4 py-4">
                <div className="row m-0 w-100">
                    <div className="col-3 col-sm-2 p-0">
                        <p className="rounded shadow text-center font-barlow gray-color bg-coral-red p-2 m-0">Prot. {id}</p>
                    </div>
                    <div className="col-9 col-sm-10 pe-0">
                        <input
                            className="rounded shadow font-barlow gray-color border-0 p-2 w-100"
                            type="text"
                            placeholder="Insira seu nome"
                        />
                    </div>
                </div>
                {protocol.inputs.map((input) => {
                    switch (input.type) {
                        case 0:
                            if (input.question === 'infos' && input.description === 'infos' && input.placement === 1) {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<InfoGerais input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'date' && input.description === 'date' && input.placement === 2) {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<DateInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'time' && input.description === 'time' && input.placement === 3) {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<TimeInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'location' && input.description === 'location' && input.placement === 4) {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<LocationInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<SimpleTextInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            }
                        case 1:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<CheckBoxInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 2:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<RadioButtonInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        default:
                            return <></>;
                    }
                })}
                <div className="d-flex justify-content-center">
                    <TextButton
                        text="Enviar"
                        hsl={[97, 43, 70]}
                        onClick={handleProtocolSubmit}
                        className="my-4 shadow w-auto px-5"
                    ></TextButton>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
