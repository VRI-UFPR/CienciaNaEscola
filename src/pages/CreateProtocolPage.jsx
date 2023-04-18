import { React, useState } from 'react';
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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const protocol = { title, description };
        console.log(JSON.stringify(protocol));
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 font-barlow p-4 p-lg-5">
                <div className="row m-0">
                    <h1 className="font-century-gothic color-grey fs-3 fw-bold p-0 pb-4 pb-lg-5 m-0">Gerador de formulários</h1>
                </div>
                <div className="row flex-grow-1 m-0">
                    <div className="col-12 col-lg-3 col-xl-2 p-0 pb-4">
                        <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-4 p-4">
                            <h1 className="font-century-gothic fs-3 fw-bold text-white">Adicionar</h1>
                            <div className="d-flex align-items-center w-100">
                                <IconPlus width={30} style={{ minWidth: '30px' }} />
                                <span className="fs-4 fw-normal ps-4">Caixa de texto</span>
                            </div>
                            <div className="d-flex align-items-center w-100">
                                <IconPlus width={30} style={{ minWidth: '30px' }} />
                                <span className="fs-4 fw-normal ps-4">Lista suspensa</span>
                            </div>
                            <div className="d-flex ps- w-100 align-items-center">
                                <IconPlus width={30} style={{ minWidth: '30px' }} />
                                <span className="fs-4 fw-normal ps-4">Seleção única</span>
                            </div>
                            <div className="d-flex align-items-center w-100">
                                <IconPlus width={30} style={{ minWidth: '30px' }} />
                                <span className="fs-4 fw-normal ps-4">Múltipla escolha</span>
                            </div>
                            <div className="d-flex align-items-center w-100">
                                <IconPlus width={30} style={{ minWidth: '30px' }} />
                                <span className="fs-4 fw-normal ps-4 text-truncate">Subformulário</span>
                            </div>
                        </div>
                    </div>
                    <div className="col d-flex flex-column p-0 ps-lg-5">
                        <form className="d-flex flex-column flex-grow-1" onSubmit={handleSubmit}>
                            <div className="flex-grow-1 mb-3">
                                <label htmlFor="title" className="form-label fs-5">
                                    Título do formulário
                                </label>
                                <textarea
                                    className="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="title"
                                    rows="3"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                ></textarea>
                                <label htmlFor="description" className="form-label fs-5">
                                    Descrição do formulário
                                </label>
                                <textarea
                                    className="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="description"
                                    rows="6"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                ></textarea>
                            </div>
                            <div className="row justify-content-between m-0">
                                <div className="col-2"></div>
                                <div className="col-8 col-lg-4">
                                    <TextButton type="submit" hsl={[97, 43, 70]} text="Finalizar protocolo" />
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
