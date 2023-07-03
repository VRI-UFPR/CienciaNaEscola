import { React, useRef } from 'react';
import titleCE from '../assets/images/titleCE.svg';
import iconToggler from '../assets/images/navToggler.svg';
import Sidebar from './Sidebar';
import ColoredBorder from './ColoredBorder';
import Alert from './Alert';

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
        max-width: 50%;
    }
`;

function NavBar(props) {
    const { showNavTogglerMobile, showNavTogglerDesktop } = props;
    const modalRef = useRef(null);

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

            <div className="offcanvas offcanvas-start bg-coral-red w-auto" tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} />
            </div>
            <Alert id="NavbarModal" ref={modalRef} />
            <style>{styles}</style>
        </div>
    );
}

NavBar.defaultProps = {
    showNavTogglerDesktop: true,
    showNavTogglerMobile: true,
};

export default NavBar;
