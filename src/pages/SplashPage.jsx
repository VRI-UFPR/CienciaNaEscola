import { React } from 'react';
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';

const styles = `
    .logo-picce-circular{
        max-width: 400px;
        max-height: 75%;
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
        <div className="d-flex flex-column align-items-center vh-100">
            <ColoredBorder />
            <div className="row flex-grow-1 align-items-end justify-content-center w-75 m-0">
                <div className="ratio ratio-1x1 logo-picce-circular h-75">
                    <img src={logoPicceCircular} className="w-100" alt="Logo gráfico Picce"></img>
                </div>
            </div>
            <div className="row align-items-center justify-content-center h-25 m-0">
                <div className="spinner-border text-secondary spinner-splash" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
            <div className="row align-items-center justify-content-center h-25 w-75 px-2 m-0">
                <img src={logoPicceTextual} className="logo-picce-textual w-50 p-0" alt="Logo textual Picce"></img>
            </div>
            <ColoredBorder />
            <style>{styles}</style>
        </div>
    );
}

export default SplashPage;
