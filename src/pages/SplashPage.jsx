import React from 'react';
import { Link } from 'react-router-dom';
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';

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
`;

function SplashPage(props) {
    return (
        <div className="SplashPage d-flex flex-column vh-100 font-barlow">
            <div className="container-fluid px-0 d-flex flex-column w-100 flex-grow-1">
                <ColoredBorder />
                <div className="row mx-0 px-0 d-flex flex-grow-1 align-items-center">
                    <div className="row mx-0 px-0 d-flex align-items-center justify-content-center h-50">
                        <div className="row w-100 justify-content-center">
                            <img
                                src={logoPicceCircular}
                                className="w-75"
                                style={{
                                    maxWidth: '250px',
                                }}
                                alt="Logo Picce"
                            ></img>
                        </div>
                        <div className="row justify-content-center pt-4">
                            <div
                                className="spinner-border text-secondary"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                }}
                                role="status"
                            >
                                <span className="sr-only"></span>
                            </div>
                        </div>
                        <div className="row justify-content-center pt-4">
                            <Link to={'/profile'}>ProfilePage</Link>
                            <Link to={'/terms'}>TermsPage</Link>
                            <Link to={'/endprotocol'}>EndProtocolPage</Link>
                        </div>
                    </div>
                </div>
                <div className="row w-100 p-0 m-0 justify-content-center pb-4">
                    <img
                        src={logoPicceTextual}
                        style={{
                            width: '35%',
                            maxWidth: '200px',
                        }}
                        alt="Logo Picce"
                    ></img>
                </div>
                <ColoredBorder />
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        </div>
    );
}

export default SplashPage;
