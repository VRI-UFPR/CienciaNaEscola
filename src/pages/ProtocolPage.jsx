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
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import LinkBox from '../components/inputs/answers/LinkBox';

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
            if (answers[prop][0] instanceof File) {
                uploadPromises.push(
                    uploadFile(answers[prop][0]).then((response) => {
                        uploadedFiles[prop][0] = response.data.url;
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
        //.get(`https://genforms.c3sl.ufpr.br/api/form/${id}`)
        const url = () => {
            switch (id) {
                case '96':
                    return '091a3cde-f7e5-464e-aaef-1ba653a1312f';
                case '103':
                    return '6caeb977-ac46-4151-9be8-b3953d80e918';
                case '104':
                    return '743e7fff-0461-4412-93d4-06200ece5a6f';
                case '105':
                    return '284bc033-0f04-4a2a-a751-19d706c6968e';
                case '106':
                    return '782abe19-78c3-43d7-8472-c599b465f17f';
                case '109':
                    return '1b2aed60-f977-4304-816b-c5efbdc4e108';
                case '110':
                    return '74316371-84a4-4150-b39e-f15430731029';
                case '112':
                    return '578d11a6-8092-41d3-b6e1-702758dc3f02';
                case '113':
                    return '047ff336-f99d-47bb-a205-188f2cea9685';
                case '114':
                    return 'e5667a47-1e7b-4666-b5e2-8e0aa7c7c624';
                case '115':
                    return 'e7ae00f5-d57c-445c-ab36-8d1aa026de5c';
                case '117':
                    return 'de19eda9-f683-4bc5-b3f5-d1212565c572';
                case '118':
                    return '16b4188e-3b79-4f15-aaa4-655d55ab8f7a';
                case '119':
                    return '960558c3-fad6-47d9-840f-1fbb29d8d531';
                case '122':
                    return 'fd05c415-35df-4cbc-9a27-30c2b7f6a838';
                case '123':
                    return '2ac0e5d6-6b07-4907-b674-bbfab9107e8d';
                default:
                    return '4441b136-5756-477d-9ec9-dd4f4f2d554f';
            }
        };

        axios
            .get(`https://run.mocky.io/v3/${url()}`)
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
                    title: 'Você não tem permissão para acessar este protocolo.',
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
                </div>
                <div className="row justify-content-center m-0 pt-3">{<ProtocolInfo info={protocol.description} />}</div>
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

                        case 3:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<SelectInput input={input} onAnswerChange={handleAnswerChange} />}
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
                        case 102:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<ImageInput input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 103:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<LinkBox input={input} onAnswerChange={handleAnswerChange} />}
                                </div>
                            );
                        case 104:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
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
