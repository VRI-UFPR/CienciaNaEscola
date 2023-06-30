import { React, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';

import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import LocationInput from '../components/inputs/answers/LocationInput';

import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import Alert from '../components/Alert';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import ImageInput from '../components/inputs/answers/ImageInput';
import ImageRadioButtonsInput from '../components/inputs/answers/ImageRadioButtonsInput';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('api_key', process.env.REACT_APP_API_KEY);
        formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
        formData.append('file', file);

        const response = await axios.post(`https://api.cloudinary.com/v1_1/dbxjlnwlo/image/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

function ProtocolPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [protocol, setProtocol] = useState();
    const [answers, setAnswers] = useState({});
    const { id } = useParams();
    const modalRef = useRef(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAnswerChange = useCallback((indexToUpdate, updatedAnswer) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            newAnswers[indexToUpdate] = updatedAnswer;
            return newAnswers;
        });
    }, []);

    const handleProtocolSubmit = () => {
        const uploadedFiles = {};
        const uploadPromises = [];

        modalRef.current.showModal({ title: 'Resposta submetida com sucesso.' });

        for (let prop in answers) {
            uploadedFiles[prop] = [];
            if (answers[prop][0] instanceof File) {
                uploadPromises.push(
                    uploadFile(answers[prop][0]).then((response) => {
                        uploadedFiles[prop][0] = response.data.url;
                    })
                );
            } else {
                uploadedFiles[prop][0] = answers[prop][0];
            }
        }

        Promise.all(uploadPromises).then(() => {
            axios
                .post(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, uploadedFiles)
                .then((response) => {
                    modalRef.current.showModal({ title: 'Resposta submetida com sucesso.' });
                    navigate('/home');
                })
                .catch((error) => {
                    console.error(error.message);
                });
        });
    };

    useEffect(() => {
        //.get(`https://genforms.c3sl.ufpr.br/api/form/${id}`)
        axios
            .get(`https://run.mocky.io/v3/${id === '90' ? '9f88aaf3-440c-4fc6-a0a2-af24668f6c8e' : 'bfb41b55-54e3-4096-a925-8002b55dbdea'}`)
            .then((response) => {
                setProtocol(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, [id]);

    useEffect(() => {
        if (!isLoading) {
            if (protocol.owner !== undefined && protocol.owner !== user.id) {
                modalRef.current.showModal({
                    title: 'Você não tem permissão para acessar este formulário.',
                    onHide: () => {
                        navigate('/home');
                    },
                });
            }
        }
    }, [isLoading, navigate, protocol, user]);

    if (isLoading || user === undefined || (protocol.owner !== undefined && protocol.owner !== user.id)) {
        return (
            <>
                <SplashPage />
                <Alert id="ProtocolPageAlert" ref={modalRef} />
            </>
        );
    }

    return (
        <div className="d-flex flex-column flex-grow-1 w-100 min-vh-100">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 bg-yellow-orange px-4 py-4">
                <div className="row m-0 w-100">
                    <div className="col-3 col-sm-2 p-0">
                        <p className="rounded shadow text-center font-barlow gray-color bg-coral-red p-2 m-0">Prot. {id}</p>
                    </div>
                    <div className="name-col col-9 col-sm-10 pe-0">
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
                            if (input.question === 'date' && input.description === 'date' && input.placement === 1) {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<DateInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'time' && input.description === 'time' && input.placement === 2) {
                                return (
                                    <div key={input.id} className="row justify-content-center m-0 pt-3">
                                        {<TimeInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'location' && input.description === 'location' && input.placement === 3) {
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
                        case 102:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<ImageInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 100:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<ImageRadioButtonsInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 101:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<TextImageInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        default:
                            return <></>;
                    }
                })}
                <div className="col-4 align-self-center pt-4">
                    <TextButton type="submit" hsl={[97, 43, 70]} text="Enviar" onClick={handleProtocolSubmit} />
                </div>
            </div>
            <Alert id="ProtocolPageAlert" ref={modalRef} />
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
