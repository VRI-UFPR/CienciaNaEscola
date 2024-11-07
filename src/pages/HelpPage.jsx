/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useRef } from 'react';
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
    const { showSidebar = true, showNavTogglerMobile = true, showNavTogglerDesktop = false } = props;
    const modalRef = useRef(null);

    const questions = [
        { question: '-Lorem ipsum dolor sit amet, consec?', answer: 'Ola mundo' },
        { question: '-Lorem ipsum dolor sit amet, consec?', answer: 'Isso eh' },
        { question: '-Lorem ipsum dolor sit amet, consec?', answer: 'Um teste' },
    ];

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row flex-grow-1 m-0">
                <div className={`col-auto bg-coral-red ${showSidebar ? '' : 'd-lg-none'} p-0`}>
                    <div
                        className={`${showNavTogglerDesktop ? 'offcanvas' : 'offcanvas-lg'} offcanvas-start bg-coral-red w-auto d-flex`}
                        tabIndex="-1"
                        id="sidebar"
                    >
                        <Sidebar modalRef={modalRef} />
                    </div>
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

export default HelpPage;
