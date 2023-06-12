import React from 'react';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import ProtocolCarousel from '../components/ProtocolCarousel';

const style = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .infos-h1 {
        color: #535353;
        font-weight: bold;
        font-size: x-large;
    }

    .infos-h2 {
        color: #535353;
        font-size: medium;
        text-align: justify;
    }
`;

function RecentProtocolsPage(props) {
    const { title, content, showSidebar, showCreateProtocol, showNavToggler } = props;

    const buttons = ['Button 1', 'Button2', 'Button3', 'Button4', 'Button5', 'Button6', 'Button7', 'Button8', 'Button9']

    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <div className="row m-0 flex-grow-1">
                <div className={`col-2 bg-coral-red d-none ${showSidebar ? 'd-lg-flex' : ''}`}>
                    <Sidebar />
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavToggler={showNavToggler} />
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="d-flex flex-column flex-grow-1">
                            <h1 className="infos-h1 font-century-gothic pb-3 m-0 fw-bold">{title}</h1>
                            <div className="d-flex justify-content-center align-itens-center flex-grow-1 mb-5">
                                <ProtocolCarousel buttons={buttons} />
                            </div>
                        </div>
                        <div className="row justify-content-between mx-0">
                            <div className="col-3"></div>
                            <div className="col-4 align-items-center p-0">
                                <TextButton className={showCreateProtocol ? '' : 'd-none'} hsl={[97, 43, 70]} text="Criar novo protocolo" />
                            </div>
                            <div className="col-3 d-flex align-items-end justify-content-end p-0">
                                <RoundedButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{style}</style>
        </div>
    );
}

RecentProtocolsPage.defaultProps = {
    title: '',
    content: '',
    showSidebar: true,
    showCreateProtocol: true,
    showNavToggler: true,
};

export default RecentProtocolsPage;