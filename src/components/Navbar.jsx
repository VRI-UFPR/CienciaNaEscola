import { React } from 'react';
import titleCE from '../assets/images/titleCE.svg';
import ColoredBorder from './ColoredBorder';
import { MaterialSymbol } from 'react-material-symbols';

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

    .icon-toggler:hover{
        color: #e8e8e8 !important;
    }
`;

function NavBar(props) {
    const { showNavTogglerMobile = true, showNavTogglerDesktop = true } = props;

    return (
        <>
            <nav className="navbar ce-navbar navbar-light d-flex flex-column p-0">
                <ColoredBorder />
                <div className="row justify-content-between align-items-center w-100 px-4 py-3 m-0">
                    <div className="col-2 d-flex justify-content-start p-0">
                        <button
                            className={`navbar-toggler btn border-0 h-auto shadow-none ${showNavTogglerMobile ? 'd-flex' : 'd-none'} ${
                                showNavTogglerDesktop ? 'd-lg-flex' : 'd-lg-none'
                            } flex-column`}
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#sidebar"
                            aria-controls="sidebar"
                        >
                            <MaterialSymbol className="icon-toggler" icon="menu" size={40} weight={700} fill color="#FFFFFF" />
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

export default NavBar;
