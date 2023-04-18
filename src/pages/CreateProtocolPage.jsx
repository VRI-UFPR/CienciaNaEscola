import React from 'react';
import NavBar from '../components/Navbar';
import { ReactComponent as IconPlus } from '../assets/images/iconPlus.svg';
import TextButton from '../components/TextButton';
import RoundedButton from '../components/RoundedButton';

const CreateProtocolStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey{
        color: #535353;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .bg-light-grey:focus{
        background-color: #D9D9D9 !important;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }
`;

function CreateProtocolPage(props) {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 font-barlow p-4 p-lg-5">
                <div className="row m-0">
                    <h1 className="fs-3 px-0 fw-bold font-century-gothic color-grey pb-lg-5 pb-4 m-0">Gerador de formulários</h1>
                </div>
                <div className="row flex-grow-1 m-0">
                    <div className="col-lg-2 col-12 pb-4 p-0">
                        <div className="d-flex flex-column align-items-center bg-pastel-blue rounded-4 p-4 h-auto">
                            <h1 className="fs-3 fw-bold font-century-gothic text-white">Adicionar</h1>
                            <div className="d-flex w-100 align-items-center">
                                <IconPlus width={30} />
                                <span className="fs-4 ps-4 fw-normal">Caixa de texto</span>
                            </div>
                            <div className="d-flex w-100 align-items-center">
                                <IconPlus width={30} />
                                <span className="fs-4 ps-4 fw-normal">Lista suspensa</span>
                            </div>
                            <div className="d-flex ps- w-100 align-items-center">
                                <IconPlus width={30} />
                                <span className="fs-4 ps-4 fw-normal">Seleção única</span>
                            </div>
                            <div className="d-flex w-100 align-items-center">
                                <IconPlus width={30} />
                                <span className="fs-4 ps-4 fw-normal">Múltipla escolha</span>
                            </div>
                            <div className="d-flex w-100 align-items-center">
                                <IconPlus width={30} />
                                <span className="fs-4 ps-4 fw-normal">Subformulário</span>
                            </div>
                        </div>
                    </div>
                    <div className="col ps-lg-5 p-0 d-flex flex-column">
                        <form action="" method="post" className="d-flex flex-column flex-grow-1">
                            <div className="flex-grow-1 mb-3">
                                <label for="exampleFormControlInput1" class="form-label fs-5">
                                    Título do formulário
                                </label>
                                <textarea
                                    class="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="exampleFormControlTextarea1"
                                    rows="3"
                                ></textarea>
                                <label for="exampleFormControlTextarea1" class="form-label fs-5">
                                    Descrição do formulário
                                </label>
                                <textarea
                                    class="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="exampleFormControlTextarea1"
                                    rows="6"
                                ></textarea>
                            </div>
                            <div className="row justify-content-between m-0">
                                <div className="col-2"></div>
                                <div className="col-lg-4 col-8">
                                    <TextButton hsl={[97, 43, 70]} text="Finalizar protocolo" />
                                </div>
                                <div className="col-2 d-flex align-items-end justify-content-end p-0">
                                    <RoundedButton />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style>{CreateProtocolStyles}</style>
        </div>
    );
}

export default CreateProtocolPage;
