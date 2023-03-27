import React from 'react';
import NavBar from '../components/Navbar';
import ProfileForm from '../components/ProfileForm';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    h1 {
        color: #535353;
        font-weight: bold;
        font-size: x-large;
    }

    h2 {
        color: #535353;
        font-weight: 600;
        font-size: medium;
    }
`;

function ProfilePage(props) {
    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 px-4">
                <div className="row py-4 px-1">
                    <h1 className="font-century-gothic">Seu perfil</h1>
                    <h2>Edite e adicione informações sobre você</h2>
                </div>
                <div className="row d-flex flex-column flex-grow-1 px-2">
                    <ProfileForm />
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProfilePage;
