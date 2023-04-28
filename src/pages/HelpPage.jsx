import React from 'react';
import NavBar from '../components/Navbar';

const styles = `
    .color-lc-pink {
        color: #EC6571;
    }

    .color-eerie-black {
        color: #262626;
        opacity: 80%;
    }

    .bg-gainsbor {
        background-color: #D9D9D9;
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
        font-family: 'Barlow', sans-serif;
    }
`;

function HelpPage(props) {
    return (
        <div className="d-flex flex-column flex-grow-1">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 px-4">
                <div className="row py-3 m-0">
                    <h2 className="font-century-gothic fw-bold color-lc-pink p-0 m-0">Precisa de ajuda?</h2>
                </div>
                <div className="row pb-3 m-0">
                    <input
                        className="shadow-sm border-0 rounded-pill bg-gainsbor py-1 w-100"
                        type="search"
                        placeholder="Qual é sua dúvida?"
                    />
                </div>
                <div className="row pb-3 m-0">
                    <h5 className="font-barlow fw-medium fs-6 pb-3 px-0 m-0">Dúvidas frequentes: </h5>
                    <div className="tab d-flex flex-column">
                        <a className="font-barlow fw-medium color-eerie-black pb-3" href="#link1">
                            -Lorem ipsum dolor sit amet, consec?
                        </a>
                        <div id="link1">
                            <p>Ola mundo</p>
                        </div>
                        <a className="font-barlow fw-medium color-eerie-black pb-3" href="#link2">
                            -Lorem ipsum dolor sit amet, consec?
                        </a>
                        <div id="link2">
                            <p>Isso eh</p>
                        </div>
                        <a className="font-barlow fw-medium color-eerie-black pb-3" href="#link3">
                            -Lorem ipsum dolor sit amet, consec?
                        </a>
                        <div id="link3">
                            <p>Um teste</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default HelpPage;
