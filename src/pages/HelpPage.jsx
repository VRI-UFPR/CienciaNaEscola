import { React, useRef } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const styles = `
    .bg-grey {
        background-color: #D9D9D9;
    }

    .crimson-color {
        color: #EC6571;
    }

    .light-gray-color {
        color: #2626268F;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }    

    .tab div {
        display: none;
    }

    .tab div:target {
        display: block; 
    }

    ::placeholder {
        color: #FFFFFF;
    }  
`;

function HelpPage(props) {
    const { showSidebar, showNavTogglerMobile, showNavTogglerDesktop } = props;
    const modalRef = useRef(null);

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row flex-grow-1 m-0">
                <div className={`col-2 bg-coral-red d-none p-0 ${showSidebar ? 'd-lg-flex' : ''}`}>
                    <Sidebar modalRef={modalRef} />
                </div>
                <div className="col p-0">
                    <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                    <div className="d-flex flex-column font-barlow fw-medium px-4">
                        <div>
                            <h2 className="crimson-color font-century-gothic fw-bold py-3 ps-1 m-0">Precisa de ajuda?</h2>
                        </div>
                        <div>
                            <input
                                className="shadow-sm rounded-pill border-0 bg-grey lh-lg w-100 px-3 mb-3"
                                type="search"
                                placeholder="Qual é sua dúvida?"
                            />
                        </div>
                        <div className="fs-6">
                            <h6 className="pb-3 ps-1 m-0">Dúvidas frequentes: </h6>
                            <div className="tab d-flex flex-column ">
                                <a className="light-gray-color pb-3" href="#link1">
                                    -Lorem ipsum dolor sit amet, consec?
                                </a>
                                <div id="link1">
                                    <p>Ola mundo</p>
                                </div>
                                <a className="light-gray-color pb-3" href="#link2">
                                    -Lorem ipsum dolor sit amet, consec?
                                </a>
                                <div id="link2">
                                    <p>Isso eh</p>
                                </div>
                                <a className="light-gray-color pb-3" href="#link3">
                                    -Lorem ipsum dolor sit amet, consec?
                                </a>
                                <div id="link3">
                                    <p>Um teste</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
}

HelpPage.defaultProps = {
    showSidebar: true,
    showNavTogglerMobile: true,
    showNavTogglerDesktop: false,
};

export default HelpPage;
