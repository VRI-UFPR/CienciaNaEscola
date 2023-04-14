import React from 'react';
import NavBar from '../components/Navbar';
import HelpButton from '../components/HelpButton';

const styles = `

    .bg-grey {
        background-color: #D9D9D9;
    }

    .bg-dark-grey {
        background-color: #787878;
    }

    .bg-red {
        background-color: #EA636F;
    }

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

    .box {
        width: 80%;
        max-width: 350px;
        text-align: center;
        border-radius: 30px;
    }

    .buttons {
        color: #FFF;
        font-weight: 700;
        font-size: 1.2rem;
        border: none;
        border-radius: 30px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
`;

function LogoutPage(props) {
    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <NavBar />
            <div className="d-flex flex-column justify-content-center flex-grow-1">
                <div className="container box d-flex flex-column bg-grey px-4 py-3">
                    <h1 className="font-century-gothic mb-3"> Tem certeza que deseja fazer logout? </h1>
                    <button className="buttons font-century-gothic bg-dark-grey mx-4 py-1"> Fazer Logout </button>
                </div>
                <div className="container box p-3">
                    <button className="buttons font-century-gothic bg-red px-5 py-1"> Cancelar </button>
                </div>
            </div>
            <div className="d-flex justify-content-end pe-4 pb-4">
                <HelpButton />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default LogoutPage;
