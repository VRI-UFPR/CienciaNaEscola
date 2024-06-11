import React, { useContext } from 'react';
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import logoPicceTextual from '../assets/images/logoPicceTextual.svg';
import ColoredBorder from '../components/ColoredBorder';
import { useNavigate } from 'react-router-dom';
import TextButton from '../components/TextButton';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutContext } from '../contexts/LayoutContext';

const styles = `
    .logo-picce-circular{
        max-width: 400px;
        max-height: 75%;
    }

    .logo-picce-textual{
        max-width: 200px;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .color-grey {
        color: #535353;
    }
`;

function ErrorPage(props) {
    const { text, description } = props;
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { isDashboard } = useContext(LayoutContext);

    return (
        <div className="d-flex flex-column align-items-center vh-100">
            <ColoredBorder />
            <div className="d-flex flex-grow-1 align-items-end justify-content-center w-75 m-0">
                <div className="ratio ratio-1x1 logo-picce-circular h-75">
                    <img src={logoPicceCircular} className="w-100" alt="Logo gráfico Picce"></img>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center h-25 px-4 m-0">
                <span className="font-barlow color-grey text-center fw-medium fs-3 mb-2">{text || ''}</span>
                <span className="font-barlow color-grey text-center fw-medium fs-5 mb-4">{description || ''}</span>
                <TextButton
                    text="Voltar ao início"
                    onClick={() => {
                        logout();
                        navigate(isDashboard ? '/dash/' : '/');
                    }}
                    hsl={[355, 78, 66]}
                ></TextButton>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center h-25 w-75 px-2 m-0">
                <img src={logoPicceTextual} className="logo-picce-textual w-50 p-0" alt="Logo textual Picce"></img>
            </div>
            <ColoredBorder />
            <style>{styles}</style>
        </div>
    );
}

export default ErrorPage;
