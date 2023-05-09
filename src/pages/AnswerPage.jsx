import { React, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import InfoGerais from '../components/InfoGerais';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import LocationInput from '../components/LocationInput';

import SimpleTextInput from '../components/SimpleTextInput';
import RadioButtonInput from '../components/RadioButtonInput';
import { AuthContext } from '../contexts/AuthContext';

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
                    console.log(response.data);
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
                {protocolAnswer.map((answer, answerIndex) => {
                    return answer.form.inputs.map((input, inputIndex) => {
                        const inputAnswer = answer.inputAnswers[input.id];
                        switch (input.type) {
                            case 0:
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<SimpleTextInput input={input} answer={inputAnswer} />}
                                    </div>
                                );
                            case 2:
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<RadioButtonInput input={input} answer={inputAnswer} />}
                                    </div>
                                );

                            default:
                                return undefined;
                        }
                    });
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AnswerPage;
