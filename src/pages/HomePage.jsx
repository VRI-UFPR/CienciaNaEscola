import React from 'react';
import HomeButtonList from '../components/HomeButtonList';
import HomeArrows from '../components/HomeArrows';
import NavBar from '../components/Navbar';
import HelpButton from '../components/HelpButton';

const styles = `
    .protocolInfo {
        font-size: 75%;
        width: 90%;
    }

    .generalContainer {
        position: absolute;
    }

    .button-container{
        padding: 24px 36px;
    }
`;

function HomePage(props) {
    return (
        <div className="generalContainer container-fluid d-flex flex-column font-barlow h-100 w-100 p-0">
            <NavBar />
            <div className="d-flex flex-column p-0">
                <div className="protocolInfo container-fluid d-flex justify-content-between mt-4">
                    <div>Protocolos recentes</div>
                    <div>Ultima modificação</div>
                </div>
                <div className="d-flex">
                    <HomeButtonList />
                </div>
                <div className="d-flex">
                    <HomeArrows />
                </div>
            </div>

            <div className="d-flex button-container flex-grow-1 align-items-end justify-content-end">
                <HelpButton />
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default HomePage;
