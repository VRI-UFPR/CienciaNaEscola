import React from 'react';
import iconCE from '../assets/images/logo.svg';
import titleCE from '../assets/images/logo.svg';
import navToggler from '../assets/images/logo.svg';
import Sidebar from '../components/Sidebar';

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

    .navbar {
        background-color: #4E9BB9;
    }

    .offcanvas {
        background-color: #F59489;
  }
`;

function NavBar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-light pt-0 d-flex flex-column">
                <div className="container-fluid d-flex py-2 pt-3 px-0 mx-0">
                    <div className="row justify-content-between align-items-center px-1 mx-4 w-100">
                        <div className="col-2 d-flex p-0">
                            <img
                                alt=""
                                src={iconCE}
                                width="95%"
                                style={{
                                    maxWidth: '100px',
                                }}
                            ></img>
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
                        <div className="col-2 p-0 d-flex justify-content-end">
                            <button
                                className="btn p-0 pt-1"
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
                    </div>
                </div>
            </nav>

            <div className="offcanvas offcanvas-start w-50" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <Sidebar />
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        </div>
    );
}

export default NavBar;
