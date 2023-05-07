import { React, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import InfoGerais from '../components/InfoGerais';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import Location from '../components/Location';

import SimpleTextInput from '../components/SimpleTextInput';
import RadioButtonInput from '../components/RadioButtonInput';

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

    const initializeAnswers = useCallback(() => {
        const initialAnswers = {};

        if (!isLoading) {
            protocol.inputs.forEach((input) => {
                switch (input.type) {
                    case 0:
                        initialAnswers[input.id] = '';
                        break;
                    case 2:
                        initialAnswers[input.id] = new Array(input.sugestions.length).fill('false');
                        break;
                    default:
                        break;
                }
            });
            setAnswers(initialAnswers);
        }
    }, [isLoading, protocol]);

    const handleAnswerChange = (index, answer) => {
        const updatedAnswers = { ...answers };
        updatedAnswers[index] = answer;
        setAnswers(updatedAnswers);
    };

    const handleProtocolSubmit = () => {
        axios
            .post(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, answers)
            .then((response) => {
                if (response.data.message === 'Answered') {
                    console.log('Funcionou');
                } else {
                    console.log('Não funcionou');
                }
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

    useEffect(() => {
        initializeAnswers();
    }, [isLoading, initializeAnswers]);

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
                <div className="row justify-content-center m-0 pt-4">{<InfoGerais />}</div>
                <div className="row justify-content-center m-0 pt-3">{<DateInput />}</div>
                <div className="row justify-content-center m-0 pt-3">{<TimeInput />}</div>
                <div className="row justify-content-center m-0 pt-3">{<Location />}</div>
                {protocol.inputs.map((input) => {
                    switch (input.type) {
                        case 0:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<SimpleTextInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        case 2:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<RadioButtonInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        default:
                            return <p>ruim</p>;
                    }
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
