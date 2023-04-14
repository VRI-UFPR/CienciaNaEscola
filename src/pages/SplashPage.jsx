import React from 'react';
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .logo-picce-circular{
        max-width: 350px;
    }

    .logo-picce-textual{
        max-width: 200px;
    }

    .spinner-splash{
        width: 50px;
        height: 50px;
    }
`;

function SplashPage(props) {
    return (
        <div className="container-fluid d-flex flex-column font-barlow vh-100 px-0">
            <ColoredBorder />
            <div className="row flex-grow-1 align-items-end w-75 mx-auto ">
                <img src={logoPicceCircular} className="mx-auto logo-picce-circular" alt="Logo gráfico Picce"></img>
            </div>
            <div className="row h-25 w-50 mx-auto align-items-center">
                <div className="spinner-border text-secondary mx-auto spinner-splash" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
            <div className="row h-25 w-50 mx-auto align-items-center">
                <img src={logoPicceTextual} className="mx-auto logo-picce-textual" alt="Logo textual Picce"></img>
            </div>
            <ColoredBorder />
            <style>{styles}</style>
        </div>
    );
}

export default SplashPage;
