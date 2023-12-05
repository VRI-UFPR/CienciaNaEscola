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

    .name-col input:focus{
        outline: none;
    }
`;

function ProtocolPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const [application, setApplication] = useState();
    const [answers, setAnswers] = useState({});
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
        axios
            .post(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, answers)
            .then((response) => {
                modalRef1.current.showModal({
                    title: 'Muito obrigado por sua participação no projeto!',
                    onHide: () => {
                        navigate('/home');
                    },
                });
            })
            .catch((error) => {
                modalRef1.current.showModal({
                    title: 'Não foi possível submeter a resposta. Tente novamente mais tarde.',
                });
                console.error(error.message);
            });
    };

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            axios
                .get(`http://localhost:3000/api/application/getApplicationWithProtocol/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    setApplication(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                    if (error.response.status === 401) {
                        logout();
                        navigate('/login');
                    }
                });
        }
    }, [id, user, logout, navigate]);

    if (isLoading) {
        return <SplashPage />;
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
                <div className="row justify-content-center m-0 pt-3">{<ProtocolInfo info={application.protocol.description} />}</div>
                {application.protocol.pages.map((page) => {
                    return page.itemGroups.map((itemGroup) => {
                        return itemGroup.items.map((item) => {
                            switch (item.type) {
                                case 'TEXTBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<SimpleTextInput item={item} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );

                                case 'CHECKBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<CheckBoxInput item={item} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );

                                case 'RADIO':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<RadioButtonInput item={item} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );

                                case 'SELECT':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<SelectInput item={item} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );

                                default:
                                    return <p>Input type not found</p>;
                            }
                        });
                    });
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
