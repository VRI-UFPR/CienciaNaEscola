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

    @media (min-width: 992px) and (max-width: 1160px) {
        .sidebar-col {
            width: 25% !important;
        }
    }
`;

function HelpPage(props) {
    const { showSidebar, showNavTogglerMobile, showNavTogglerDesktop } = props;
    const modalRef = useRef(null);

    const questions = [
        { question: '-Lorem ipsum dolor sit amet, consec?', answer: 'Ola mundo' },
        { question: '-Lorem ipsum dolor sit amet, consec?', answer: 'Isso eh' },
        { question: '-Lorem ipsum dolor sit amet, consec?', answer: 'Um teste' },
    ];

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row flex-grow-1 m-0">
                <div className={`sidebar-col col-md-3 col-lg-2 bg-coral-red d-none p-0 ${showSidebar ? 'd-lg-flex' : ''}`}>
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
                                {questions.map((question) => (
                                    <>
                                        <a className="light-gray-color pb-3" href={'#' + question.answer}>
                                            {question.question}
                                        </a>
                                        <div id={question.answer}>
                                            <p>{question.answer}</p>
                                        </div>
                                    </>
                                ))}
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
