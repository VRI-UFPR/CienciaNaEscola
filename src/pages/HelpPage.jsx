import React from 'react';
import NavBar from '../components/Navbar';

const styles = `
    .tab div {
        display: none;
    }

    .tab div:target {
        display: block; 
    }

    .search-input {
        width: 100%;
        border: 0px;
        background-color: rgba(217, 217, 217, 1);
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    ::placeholder {
        color: #FFFFFF;
        font-family: 'Barlow', sans-serif;
    }

    h2 {
        color: rgba(236, 101, 113, 1);
        font-weight: 700;
    }

    h5 {
        font-weight: 500;
    }

    a {
        color: rgba(38, 38, 38, 0.56);
        font-family: 'Barlow', sans-serif;
        font-weight: 500;
    }    
`;

function HelpPage(props) {
    return (
        <div>
            <NavBar />
            <div className="d-flex flex-column mx-4">
                <div>
                    <h2 className="font-century-gothic my-3 ms-1">Precisa de ajuda?</h2>
                </div>
                <div>
                    <input className="search-input shadow-sm rounded-pill px-3 mb-3" type="search" placeholder="Qual é sua dúvida?" />
                </div>
                <div>
                    <h5 className="font-barlow mb-3 ms-1">Dúvidas frequentes: </h5>
                    <div className="tab d-flex flex-column">
                        <a className="mb-3" href="#link1">
                            -Lorem ipsum dolor sit amet, consec?
                        </a>
                        <div id="link1">
                            <p>Ola mundo</p>
                        </div>
                        <a className="mb-3" href="#link2">
                            -Lorem ipsum dolor sit amet, consec?
                        </a>
                        <div id="link2">
                            <p>Isso eh</p>
                        </div>
                        <a className="mb-3" href="#link3">
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
