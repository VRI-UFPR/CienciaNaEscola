import React from "react";
import NavBar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";

const styles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-steel-blue {
        background-color: #4E9BB9;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-lime-green {
        background-color: #AAD390;
    }

    .border-cell {
        height: 10px;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .navbar {
        background-color: #4E9BB9;
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

    .green-button {
        border-radius: 10px;
        background-color: #AAD390;
        color: #FFF;
        font-weight: 700;
        font-size: 130%;
    }

    label {
        color: #000;
        font-weight: 600;
        font-size: medium;
    }
`;

function ProfilePage(props) {
    return (
        <div className="d-flex flex-column vh-100 font-barlow">
            <NavBar />
            <div className="container-fluid px-4 d-flex flex-column flex-grow-1">
                <div className="row py-4 px-1">
                    <h1 className="font-century-gothic">Seu perfil</h1>
                    <h2>Edite e adicione informações sobre você</h2>
                </div>
                <div className="row px-2 d-flex flex-column flex-grow-1">
                    <ProfileForm />
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default ProfilePage;
