import { React, useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import GalleryModal from '../components/GalleryModal';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';

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

    const { id: protocolId } = useParams();
    const [protocol, setProtocol] = useState(undefined);

    const modalRef = useRef(null);
    const galleryModalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        //Search if the application is in localApplications
        if (user.id !== null && user.token !== null) {
            axios
                .get(baseUrl + `api/protocol/getProtocol/${protocolId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setProtocol(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                    if (error.response.status === 401) {
                        logout();
                        navigate('dash/signin');
                    }
                });
        }
    }, [protocolId, user, logout, navigate]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="d-flex flex-column flex-grow-1 w-100 min-vh-100">
            <div className="row m-0 flex-grow-1">
                <div className="col-auto bg-coral-red p-0 d-flex position-sticky vh-100 top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-yellow-orange p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />

                    <div className="row d-flex align-items-center justify-content-center h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5">
                            <div className="d-flex flex-column flex-grow-1">
                                <div className="col-4 align-self-center pb-4">
                                    <TextButton type="submit" hsl={[97, 43, 70]} text="Gerenciar" onClick={() => navigate('manage')} />
                                </div>
                                <div className="row justify-content-center m-0">
                                    {<ProtocolInfo title={protocol.title} description={protocol.description} />}
                                </div>
                                {protocol.pages.map((page) => {
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
                                                                    galleryModalRef={galleryModalRef}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
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
                                                                    galleryModalRef={galleryModalRef}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
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
                                                                    galleryModalRef={galleryModalRef}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
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
                                                                    galleryRef={galleryModalRef}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                case 'DATEBOX':
                                                    return (
                                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <DateInput
                                                                    item={item}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                case 'TIMEBOX':
                                                    return (
                                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <TimeInput
                                                                    item={item}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                case 'LOCATIONBOX':
                                                    return (
                                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <LocationInput
                                                                    item={item}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                case 'UPLOAD':
                                                    return (
                                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                            {
                                                                <ImageInput
                                                                    item={item}
                                                                    group={itemGroup.id}
                                                                    onAnswerChange={() => {}}
                                                                    disabled={true}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                case 'TEXT':
                                                    return (
                                                        <div key={item.id} className="row justify-content-center m-0 pt-3">
                                                            {<TextImageInput item={item} galleryModalRef={galleryModalRef} />}
                                                        </div>
                                                    );
                                                default:
                                                    return <p>Input type not found</p>;
                                            }
                                        });
                                    });
                                })}
                                <div className="row justify-content-center m-0 pt-3">
                                    {
                                        <TextImageInput
                                            item={{
                                                text:
                                                    'Identificador do protocolo: ' +
                                                    protocol.id +
                                                    '<br>Versão do protocolo: ' +
                                                    protocol.createdAt.replace(/\D/g, ''),
                                                files: [],
                                            }}
                                            galleryModalRef={galleryModalRef}
                                        />
                                    }
                                </div>
                                <div className="col-4 align-self-center pt-4">
                                    <TextButton
                                        type="button"
                                        hsl={[97, 43, 70]}
                                        text="Aplicar"
                                        onClick={() => {
                                            navigate('apply');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Alert id="ProtocolPageAlert" ref={modalRef} />
            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
