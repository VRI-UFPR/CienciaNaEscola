import React from 'react';
import titleCE from '../assets/images/titleCE.svg';
import iconToggler from '../assets/images/navToggler.svg';
import Sidebar from './Sidebar';
import ColoredBorder from './ColoredBorder';
import Alert from './Alert';
import { useNavigate } from 'react-router-dom';

const styles = `
    .ce-navbar {
        background-color: #78acc4;
    }

    .bg-coral-red {
        background-color: #F59489;
    }

    .title-ce{
        max-width: 300px;
    }

    .icon-toggler{
        max-width: 50px;
    }

    .offcanvas-ce{
        max-width: 400px;
    }
`;

function NavBar(props) {
    const { showNavTogglerMobile, showNavTogglerDesktop } = props;
    const navigate = useNavigate();
    return (
        <div>
            <nav className="navbar ce-navbar navbar-light d-flex flex-column p-0">
                <ColoredBorder />
                <div className="row justify-content-between align-items-center w-100 px-4 py-3 m-0">
                    <div className="col-2 d-flex justify-content-start p-0">
                        <button
                            className={`navbar-toggler icon-toggler btn border-0 h-auto shadow-none p-1 ${
                                showNavTogglerMobile ? 'd-flex' : 'd-none'
                            } ${showNavTogglerDesktop ? 'd-lg-flex' : 'd-lg-none'}`}
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#sidebar"
                            aria-controls="sidebar"
                        >
                            <img src={iconToggler} width="100%" alt="Ícone"></img>
                        </button>
                    </div>
                    <div className="col-7 d-flex justify-content-center p-0">
                        <img alt="Programa Interinstitucional de Ciência Cidadã na Escola" src={titleCE} className="title-ce w-100"></img>
                    </div>
                    <div className="col-2"></div>
                </div>
            </nav>

            <div className="offcanvas offcanvas-start offcanvas-ce bg-coral-red w-50" tabIndex="-1" id="sidebar">
                <Sidebar />
            </div>
            <Alert
                id="NavbarModal"
                title="Tem certeza que deseja fazer logout?"
                dismissHsl={[355, 78, 66]}
                dismissText="Não"
                actionHsl={[97, 43, 70]}
                actionText="Sim"
                actionOnClick={() => navigate('/login')}
            />
            <style>{styles}</style>
        </div>
    );
}

NavBar.defaultProps = {
    showNavTogglerDesktop: true,
    showNavTogglerMobile: true,
};

export default NavBar;
