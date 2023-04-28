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
    
    .color-dark-gray{
        color: #535353;
    }

    .profile-label{
        min-width: 6em;
    }
`;

function ProfilePage(props) {
    const [name, setName] = useState('Seu nome');
    const [email, setEmail] = useState('Seu email');
    const [password, setPassword] = useState('Sua senha');

    const { showSidebar, allowEdit } = props;
    return (
        <div className="d-flex flex-column font-barlow min-vh-100">
            <div className="row flex-grow-1 m-0">
                <div className={`col-2 bg-coral-red d-none ${showSidebar ? 'd-lg-flex' : ''} p-0`}>
                    <Sidebar />
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="pb-4">
                            <h1 className="color-dark-gray font-century-gothic fw-bold fs-3 pb-2 m-0">Seu perfil</h1>
                            <h2 className="color-dark-gray fw-medium fs-5 m-0">Edite e adicione informações sobre você</h2>
                        </div>
                        <div className="bg-pastel-blue rounded p-4 p-lg-5">
                            <div className="row align-items-center mb-2 mb-lg-4 m-0">
                                <label htmlFor="name-input" className="form-label profile-label col-12 col-lg-1 pe-lg-5 mb-0 fs-5">
                                    Nome:
                                </label>
                                <input
                                    type="text"
                                    disabled={!allowEdit}
                                    className="col form-control rounded-pill shadow-sm fs-5"
                                    id="name-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                            </div>
                            <div className="row align-items-center mb-2 mb-lg-4 m-0">
                                <label htmlFor="email-input" className="form-label profile-label col-12 col-lg-1 pe-lg-5 mb-0 fs-5">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    disabled={!allowEdit}
                                    className="col form-control rounded-pill shadow-sm fs-5"
                                    id="email-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></input>
                            </div>
                            <div className="row align-items-center mb-2 mb-lg-0 m-0">
                                <label htmlFor="password-input" className="form-label profile-label col-12 col-lg-1 pe-lg-5 mb-0 fs-5">
                                    Senha:
                                </label>
                                <input
                                    type="password"
                                    disabled={!allowEdit}
                                    className="col form-control rounded-pill shadow-sm fs-5"
                                    id="password-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                ></input>
                            </div>
                        </div>
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
        </div>
    );
}

ProfilePage.defaultProps = {
    showSidebar: true,
    allowEdit: true,
    showNavToggler: false,
};

export default ProfilePage;
