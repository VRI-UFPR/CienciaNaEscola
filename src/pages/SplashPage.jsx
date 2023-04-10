import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function SplashPage(props) {
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNavigate(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (navigate) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <div className="container-fluid d-flex flex-column flex-grow-1 w-100 px-0">
                <ColoredBorder />
                <div className="row d-flex flex-grow-1 align-items-center mx-0 px-0 ">
                    <div className="row d-flex align-items-center justify-content-center h-50 mx-0 px-0">
                        <div className="row justify-content-center w-100">
                            <img
                                src={logoPicceCircular}
                                className="w-75"
                                style={{
                                    maxWidth: '250px',
                                }}
                                alt="Logo gráfico Picce"
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
                    </div>
                </div>
                <div className="row justify-content-center w-100 pb-4 p-0 m-0">
                    <img
                        src={logoPicceTextual}
                        style={{
                            width: '35%',
                            maxWidth: '200px',
                        }}
                        alt="Logo textual Picce"
                    ></img>
                </div>
                <ColoredBorder />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default SplashPage;
