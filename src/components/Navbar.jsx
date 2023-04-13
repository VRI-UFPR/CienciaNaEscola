import React from 'react';
import titleCE from '../assets/images/titleCE.svg';
import navToggler from '../assets/images/navToggler.svg';
import Sidebar from './Sidebar';
import ColoredBorder from './ColoredBorder';

const styles = `
    .navbar {
        background-color: rgba(78, 155, 185, 0.81);
    }

    .offcanvas {
        background-color: #F59489;
  }
`;

function NavBar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-light d-flex flex-column pt-0">
                <ColoredBorder />
                <div className="container-fluid d-flex pb-2 pt-3 p-0 mx-0">
                    <div className="row justify-content-between align-items-center w-100 px-1 mx-4">
                        <div className="col-2 d-flex justify-content-start p-0">
                            <button
                                className="btn d-flex align-items-center shadow-none p-1 pt-1"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExample"
                                aria-controls="offcanvasExample"
                                style={{
                                    maxWidth: '50px',
                                    width: '80%',
                                }}
                            >
                                <img src={navToggler} width="100%" alt=""></img>
                            </button>
                        </div>
                        <div className="col-7 d-flex justify-content-center p-0">
                            <img
                                alt=""
                                src={titleCE}
                                width="100%"
                                style={{
                                    maxWidth: '300px',
                                }}
                            ></img>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
            </nav>

            <div className="offcanvas offcanvas-start w-50" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <Sidebar />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default NavBar;
