import { React, useState, useEffect } from 'react';
import picceTitle from '../assets/images/picceTitle.svg';
import Background from '../assets/images/loginPageBackground.png';
import { useNavigate } from 'react-router-dom';
import TextButton from '../components/TextButton';
import logoFA from '../assets/images/logoFA.svg';
import logoUFPR from '../assets/images/logoUFPR.svg';

const styles = `

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    ::placeholder {
        color: #FFFFFF;
        font-weight: 400;
        font-size: 90%;
        opacity: 1;
    }

    .button-position {
        z-index: 1;
    }

    .background-style {
        background-size: cover;
        background-image: url(${Background});
    }

    .spinner-splash{
        width: 50px;
        height: 50px;
    }

    .mw-200{
        max-width: 200px;
    }

    .mw-150{
        max-width: 150px;
    }

    .mw-270{
        max-width: 270px;
    }
`;

function InstallPage(props) {
    const navigate = useNavigate();
    const [installPrompt, setInstallPrompt] = useState(null);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            navigate('/signin');
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPrompt(e);
        });

        // Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                setInstallPrompt(e);
            });
        };
    }, [navigate]);

    const installApp = () => {
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
            console.log(choiceResult);
            setInstallPrompt(null);
        });
    };

    return (
        <div className="background-style d-flex flex-column align-items-center font-century-gothic vh-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center h-75 w-100">
                <div className="d-flex flex-column align-items-center justify-content-end">
                    <img src={picceTitle} alt="PICCE" className="mw-270 pb-4" />
                    <span className="install-title text-center fw-medium lh-sm fs-5 w-75 w-sm-50">
                        Bem-vindo(a) ao Ciência Cidadã na Escola!
                    </span>
                    <span className="install-title text-center fw-medium lh-sm pt-4 fs-6 w-75 w-sm-50">
                        As funcionalidades do app só estão disponíveis após a instalação. Clique no botão abaixo para instalar.
                    </span>
                </div>

                <div className={`row justify-content-center g-0 w-75 pt-5 ${installPrompt ? '' : 'd-none'}`}>
                    <div className="button-position row flex-column justify-content-end align-items-center g-0">
                        <div className="col-12 col-lg-6">
                            <TextButton
                                hsl={[97, 43, 70]}
                                text="Instalar app"
                                className="rounded-pill"
                                type="button"
                                onClick={installApp}
                            />
                        </div>
                    </div>
                </div>
                <div className={`row justify-content-center g-0 w-75 pt-5 ${installPrompt ? 'd-none' : ''}`}>
                    <div className="spinner-border text-secondary spinner-splash" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            </div>
            <div className="row align-items-end justify-content-between g-0 h-25 w-100 pb-4 ps-2">
                <div className="col-4 justify-content-start d-flex align-items-center">
                    <img className="d-h-auto mw-150 w-100" src={logoUFPR} alt="Logomarca da Universidade Federal do Paraná" />
                </div>
                <div className="col-6 justify-content-end d-flex align-items-center">
                    <img className="h-auto mw-200 w-100" src={logoFA} alt="Logomarca da Fundação Araucária" />
                </div>
            </div>
            <style> {styles}</style>
        </div>
    );
}

export default InstallPage;
