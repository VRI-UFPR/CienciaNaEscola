import { React, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';

import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import LocationInput from '../components/inputs/answers/LocationInput';
import ImageInput from '../components/inputs/answers/ImageInput';
import Weather from '../components/inputs/answers/Weather';
import SelectInput from '../components/inputs/answers/SelectInput';

import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import Alert from '../components/Alert';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import ImageRadioButtonsInput from '../components/inputs/answers/ImageRadioButtonsInput';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import LinkBox from '../components/inputs/answers/LinkBox';
import { AuthContext } from '../contexts/AuthContext';
import {
    protocol104,
    protocol105,
    protocol106,
    protocol113,
    protocol114,
    protocol115,
    protocol118,
    protocol119,
    protocol122,
    protocol123,
    protocol125,
    protocol127,
    protocol128,
    protocol129,
    protocol131,
} from '../mockResponses/protocols';

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
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const modalRef = useRef(null);
    const modalRef1 = useRef(null);
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

        for (let prop in answers) {
            uploadedFiles[prop] = [];
            if (answers[prop] instanceof File) {
                uploadPromises.push(
                    uploadFile(answers[prop]).then((response) => {
                        uploadedFiles[prop] = [response.data.url];
                    })
                );
            } else {
                uploadedFiles[prop] = answers[prop];
            }
        }

        Promise.all(uploadPromises).then(() => {
            axios
                .post(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, uploadedFiles)
                .then((response) => {
                    modalRef.current.showModal({
                        title: 'Muito obrigado por sua participação no projeto!',
                        onHide: () => {
                            navigate('/home');
                        },
                    });
                })
                .catch((error) => {
                    modalRef.current.showModal({
                        title: 'Não foi possível enviar a resposta. Tente novamente mais tarde.',
                    });
                    console.error(error.message);
                });
        });
    };

    useEffect(() => {
        const syncProtocol = async () => {
            switch (id) {
                case '104':
                    return setProtocol(protocol104);
                case '105':
                    return setProtocol(protocol105);
                case '106':
                    return setProtocol(protocol106);
                case '113':
                    return setProtocol(protocol113);
                case '114':
                    return setProtocol(protocol114);
                case '115':
                    return setProtocol(protocol115);
                case '118':
                    return setProtocol(protocol118);
                case '119':
                    return setProtocol(protocol119);
                case '122':
                    return setProtocol(protocol122);
                case '123':
                    return setProtocol(protocol123);
                case '125':
                    return setProtocol(protocol125);
                case '127':
                    return setProtocol(protocol127);
                case '128':
                    return setProtocol(protocol128);
                case '129':
                    return setProtocol(protocol129);
                case '131':
                    return setProtocol(protocol131);
                default:
            }
        };

        syncProtocol().then(() => setIsLoading(false));
    }, [id]);

    // useEffect(() => {
    //     if (!isLoading) {
    //         if (protocol.owner !== undefined && protocol.owner !== user.id) {
    //             modalRef.current.showModal({
    //                 title: 'Você não tem permissão para acessar este protocolo.',
    //                 onHide: () => {
    //                     navigate('/home');
    //                 },
    //             });
    //         }
    //     }
    // }, [isLoading, navigate, protocol, user]);

    if (isLoading) {
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
                </div>
                <div className="row justify-content-center m-0 pt-3">{<ProtocolInfo info={protocol.description} />}</div>
                {protocol.inputs.map((input) => {
                    switch (input.type) {
                        case 0:
                            if (input.question === 'date' && input.description === 'date' && input.placement === 1) {
                                return (
                                    <div key={id + '-' + id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                        {<DateInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'time' && input.description === 'time' && input.placement === 2) {
                                return (
                                    <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                        {<TimeInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'location' && input.description === 'location' && input.placement === 3) {
                                return (
                                    <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                        {<LocationInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            } else if (input.question === 'username' && input.description === 'username') {
                                return (
                                    <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3 d-none">
                                        {
                                            <SimpleTextInput
                                                input={input}
                                                onAnswerChange={handleAnswerChange}
                                                answer={[{ value: user.username }]}
                                            />
                                        }
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                        {<SimpleTextInput input={input} onAnswerChange={handleAnswerChange} />}
                                    </div>
                                );
                            }

                        case 1:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<CheckBoxInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        case 2:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<RadioButtonInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        case 3:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<SelectInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        case 100:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<ImageRadioButtonsInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 101:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<TextImageInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 102:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<ImageInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 103:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<LinkBox input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 104:
                            return (
                                <div key={id + '-' + input.id} className="row justify-content-center m-0 pt-3">
                                    {<Weather input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );

                        default:
                            return <></>;
                    }
                })}
                <div className="col-4 align-self-center pt-4">
                    <TextButton
                        type="submit"
                        hsl={[97, 43, 70]}
                        text="Enviar"
                        onClick={() => {
                            modalRef.current.showModal({
                                title: 'Tem certeza que deseja enviar o protocolo?',
                                dismissHsl: [355, 78, 66],
                                dismissText: 'Não',
                                actionHsl: [97, 43, 70],
                                actionText: 'Sim',
                                actionOnClick: () => {
                                    handleProtocolSubmit();
                                },
                            });
                        }}
                    />
                </div>
            </div>
            <Alert id="ProtocolPageAlert" ref={modalRef} />
            <Alert id="ProtocolPageConfirmation" ref={modalRef1} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
