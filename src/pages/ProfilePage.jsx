import { React, useState } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RoundedButton from '../components/RoundedButton';
import TextButton from '../components/TextButton';

const profilePageStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .text-pastel-blue {
        color: #91CAD6;
    }
    
    .color-dark-gray {
        color: #535353;
    }

    .profile-figure {
        max-width: 170px;
    }

    .profile-label {
        min-width: 5em;
    }

    .underline-light {
        text-decoration-thickness: 0.05rem;
    }
`;

function ProfilePage(props) {
    const [name, setName] = useState('Seu nome');
    const [email, setEmail] = useState('Seu email');

    const { showSidebar, allowEdit } = props;
    return (
        <>
            <div className="row flex-grow-1 font-barlow min-vh-100 m-0">
                <div className={`col-2 d-none ${showSidebar ? 'd-lg-flex' : ''} bg-coral-red p-0`}>
                    <Sidebar />
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={!showSidebar} />
                    <div className="d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="color-dark-gray pb-4">
                            <h1 className="font-century-gothic fw-bold fs-3 pb-2 m-0">Seu perfil</h1>
                            <h2 className="fw-medium fs-5 m-0">Edite e adicione informações sobre você</h2>
                        </div>
                        <div className="row bg-pastel-blue align-items-center rounded p-4 p-lg-5 m-0">
                            <div className="col-12 col-lg-2 d-flex flex-column align-items-center p-0 pb-4 pb-lg-0">
                                <div className="profile-figure ratio ratio-1x1 rounded-circle bg-white shadow-sm w-75"></div>
                                <a className="link-body-emphasis underline-light text-center fs-5 fw-light lh-1 p-3 pb-0" href="/profile">
                                    Editar foto de perfil
                                </a>
                            </div>
                            <div className="col d-flex flex-column justify-content-center">
                                <div className="row align-items-center pb-2 pb-lg-4 m-0">
                                    <label htmlFor="name-input" className="col-12 col-lg-1 form-label profile-label fs-5 pe-lg-5 mb-0">
                                        Nome:
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!allowEdit}
                                        className="col form-control rounded-4 shadow-sm fs-5"
                                        id="name-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    ></input>
                                </div>
                                <div className="row align-items-center m-0">
                                    <label htmlFor="email-input" className="col-12 col-lg-1 form-label profile-label fs-5 pe-lg-5 mb-0">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        disabled={!allowEdit}
                                        className="col form-control rounded-4 shadow-sm fs-5"
                                        id="email-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <a className="underline-light text-center text-pastel-blue fs-5 pt-2" href="/profile">
                            Deseja alterar sua senha?
                        </a>
                        <div className="row flex-grow-1 justify-content-between align-items-end w-100 mx-0">
                            <div className="col-2"></div>
                            <div className="col-auto align-items-center p-0">
                                <TextButton className={`px-5 ${allowEdit ? '' : 'd-none'}`} hsl={[97, 43, 70]} text="Salvar" />
                            </div>
                            <div className="col-2 d-flex align-items-end justify-content-end p-0">
                                <RoundedButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{profilePageStyles}</style>
        </>
    );
}

ProfilePage.defaultProps = {
    showSidebar: true,
    allowEdit: true,
};

export default ProfilePage;
