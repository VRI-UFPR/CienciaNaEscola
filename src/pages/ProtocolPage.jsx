import { React, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StorageContext } from '../contexts/StorageContext';
import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import LocationInput from '../components/inputs/answers/LocationInput';
import ImageInput from '../components/inputs/answers/ImageInput';
import SelectInput from '../components/inputs/answers/SelectInput';
import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import Alert from '../components/Alert';
import Gallery from '../components/Gallery';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';

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
    const [itemAnswerGroups, setItemAnswerGroups] = useState({});
    const { id } = useParams();
    const { connected, storeApplicationWithProtocol, storePendingRequest } = useContext(StorageContext);
    const modalRef = useRef(null);
    const galleryRef = useRef(null);
    const navigate = useNavigate();

    const handleAnswerChange = useCallback((groupToUpdate, itemToUpdate, itemType, updatedAnswer) => {
        setItemAnswerGroups((prevItemAnswerGroups) => {
            const newItemAnswerGroups = { ...prevItemAnswerGroups };

            if (newItemAnswerGroups[groupToUpdate] === undefined) {
                newItemAnswerGroups[groupToUpdate] = { itemAnswers: {}, optionAnswers: {}, tableAnswers: {} };
            }

            switch (itemType) {
                case 'ITEM':
                    newItemAnswerGroups[groupToUpdate]['itemAnswers'][itemToUpdate] = updatedAnswer;
                    break;
                case 'OPTION':
                    newItemAnswerGroups[groupToUpdate]['optionAnswers'][itemToUpdate] = updatedAnswer;
                    break;
                case 'TABLE':
                    newItemAnswerGroups[groupToUpdate]['tableAnswers'][itemToUpdate] = updatedAnswer;
                    break;
                default:
                    break;
            }
            return newItemAnswerGroups;
        });
    }, []);

    const handleProtocolSubmit = () => {
        modalRef.current.showModal({
            title: 'Aguarde o processamento da resposta',
            dismissible: false,
        });

        const applicationAnswer = {
            applicationId: application.id,
            addressId: 1,
            date: new Date(),
            itemAnswerGroups: [],
        };
        for (const group in itemAnswerGroups) {
            const itemAnswerGroup = {
                itemAnswers: [],
                optionAnswers: [],
                tableAnswers: [],
            };
            for (const item in itemAnswerGroups[group].itemAnswers) {
                itemAnswerGroup.itemAnswers.push({
                    itemId: item,
                    text: itemAnswerGroups[group].itemAnswers[item],
                });
            }
            for (const item in itemAnswerGroups[group].optionAnswers) {
                for (const option in itemAnswerGroups[group].optionAnswers[item]) {
                    itemAnswerGroup.optionAnswers.push({
                        itemId: item,
                        optionId: option,
                        text: itemAnswerGroups[group].optionAnswers[item][option],
                    });
                }
            }
            for (const item in itemAnswerGroups[group].tableAnswers) {
                for (const column in itemAnswerGroups[group].tableAnswers[item]) {
                    itemAnswerGroup.tableAnswers.push({
                        itemId: item,
                        columnId: column,
                        text: itemAnswerGroups[group].tableAnswers[item][column],
                    });
                }
            }
            applicationAnswer.itemAnswerGroups.push(itemAnswerGroup);
        }

        const formData = serialize(applicationAnswer, { indices: true });

        if (connected === true) {
            axios
                .post(`http://localhost:3000/api/applicationAnswer/createApplicationAnswer`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    modalRef.current.showModal({
                        title: 'Muito obrigado por sua participação no projeto!',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                        onHide: () => {
                            navigate('/home');
                        },
                    });
                })
                .catch((error) => {
                    modalRef.current.showModal({
                        title: 'Não foi possível submeter a resposta. Tente novamente mais tarde.',
                        dismissHsl: [97, 43, 70],
                        dismissText: 'Ok',
                        dismissible: true,
                    });
                    console.error(error.message);
                });
        } else {
            storePendingRequest({
                url: `http://localhost:3000/api/applicationAnswer/createApplicationAnswer`,
                data: formData,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            });
            modalRef.current.showModal({
                title: 'Você está offline. A resposta será armazenada localmente e submetida quando houver conexão.',
                dismissHsl: [97, 43, 70],
                dismissText: 'Ok',
                dismissible: true,
            });
        }
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

    useEffect(() => {
        if (connected === false && application.id) {
            modalRef.current.showModal({
                title: 'Você está offline. O protocolo ' + id + ' será armazenado localmente e continuará acessível.',
                dismissHsl: [97, 43, 70],
                dismissText: 'Ok',
                dismissible: true,
            });
            storeApplicationWithProtocol(application);
        }
    }, [connected, application, storeApplicationWithProtocol, id]);

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
                <div className="row justify-content-center m-0 pt-3">
                    {<ProtocolInfo title={application.protocol.title} description={application.protocol.description} />}
                </div>
                {application.protocol.pages.map((page) => {
                    return page.itemGroups.map((itemGroup) => {
                        return itemGroup.items.map((item) => {
                            switch (item.type) {
                                case 'TEXTBOX':
                                case 'NUMBERBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {
                                                <SimpleTextInput
                                                    item={item}
                                                    galleryRef={galleryRef}
                                                    group={itemGroup.id}
                                                    onAnswerChange={handleAnswerChange}
                                                />
                                            }
                                        </div>
                                    );

                                case 'CHECKBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {
                                                <CheckBoxInput
                                                    item={item}
                                                    galleryRef={galleryRef}
                                                    group={itemGroup.id}
                                                    onAnswerChange={handleAnswerChange}
                                                />
                                            }
                                        </div>
                                    );

                                case 'RADIO':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {
                                                <RadioButtonInput
                                                    item={item}
                                                    galleryRef={galleryRef}
                                                    group={itemGroup.id}
                                                    onAnswerChange={handleAnswerChange}
                                                />
                                            }
                                        </div>
                                    );

                                case 'SELECT':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {
                                                <SelectInput
                                                    item={item}
                                                    galleryRef={galleryRef}
                                                    group={itemGroup.id}
                                                    onAnswerChange={handleAnswerChange}
                                                />
                                            }
                                        </div>
                                    );
                                case 'DATEBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<DateInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'TIMEBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<TimeInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'LOCATIONBOX':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<LocationInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'UPLOAD':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {<ImageInput item={item} group={itemGroup.id} onAnswerChange={handleAnswerChange} />}
                                        </div>
                                    );
                                case 'TEXT':
                                    return (
                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                            {
                                                <TextImageInput
                                                    item={item}
                                                    galleryRef={galleryRef}
                                                    group={itemGroup.id}
                                                    onAnswerChange={handleAnswerChange}
                                                />
                                            }
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
            <Gallery id="ProtocolPageGallery" ref={galleryRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
