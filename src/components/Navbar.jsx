import { React } from 'react';
import titleCE from '../assets/images/titleCE.svg';
import ColoredBorder from './ColoredBorder';

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

    .icon-toggler:hover .toggler-div{
        box-shadow: inset 0px 1px 4px 0px #00000040;
    }

    .toggler-div{
        height: 4px;
        width: 32px;
    }
`;

function NavBar(props) {
    const { showNavTogglerMobile, showNavTogglerDesktop } = props;

    return (
        <>
            <nav className="navbar ce-navbar navbar-light d-flex flex-column p-0">
                <ColoredBorder />
                <div className="row justify-content-between align-items-center w-100 px-4 py-3 m-0">
                    <div className="col-2 d-flex justify-content-start p-0">
                        <button
                            className={`navbar-toggler icon-toggler btn border-0 h-auto shadow-none p-1 ${
                                showNavTogglerMobile ? 'd-flex' : 'd-none'
                            } ${showNavTogglerDesktop ? 'd-lg-flex' : 'd-lg-none'} flex-column`}
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#sidebar"
                            aria-controls="sidebar"
                        >
                            <div className="toggler-div rounded bg-white"></div>
                            <div className="toggler-div rounded bg-white mt-1"></div>
                            <div className="toggler-div rounded bg-white mt-1"></div>
                        </button>
                    </div>
                    <div className="col-7 d-flex justify-content-center p-0">
                        <img alt="Programa Interinstitucional de Ciência Cidadã na Escola" src={titleCE} className="title-ce w-100"></img>
                    </div>
                    <div className="col-2"></div>
                </div>
            </nav>
            <style>{styles}</style>
        </>
    );
}

NavBar.defaultProps = {
    showNavTogglerDesktop: true,
    showNavTogglerMobile: true,
};

export default NavBar;
