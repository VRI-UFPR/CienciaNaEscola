import React from 'react';
import { Link } from 'react-router-dom';
import HomeButtonList from '../components/HomeButtonList';
import HomeArrows from '../components/HomeArrows';
import NavBar from '../components/Navbar';

import helpButton from '../assets/images/helpButton.svg';

const styles = `
    .protocol-info {
        font-size: 75%;
        width: 90%;
    }

    .general-container {
        position: absolute;
    }

    .help-btn {
        position: fixed;
        bottom: 5%;
        right: 10%;
    }
    .home-button-link {
        text-decoration: none;
        color: #262626;
    }
`;

function HomePage(props) {
    return (
        <div className="general-container container-fluid d-flex flex-column font-barlow h-100 w-100 p-0">
            <NavBar />
            <div className="d-flex flex-column p-0">
                <div className="protocol-info container-fluid d-flex justify-content-between mt-4">
                    <div>Protocolos recentes</div>
                    <div>Ultima modificação</div>
                </div>
                <Link className="home-button-link d-flex" to="/protocol">
                    <HomeButtonList />
                </Link>
                <div className="d-flex">
                    <HomeArrows />
                </div>
            </div>

            <div>
                <button
                    className="help-btn p-0 d-flex"
                    type="button"
                    style={{
                        maxWidth: '40px',
                        width: '50%',
                    }}
                >
                    <img src={helpButton} width="100%" alt=""></img>
                </button>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default HomePage;
