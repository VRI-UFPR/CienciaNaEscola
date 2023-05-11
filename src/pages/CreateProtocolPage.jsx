import { React, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import { ReactComponent as IconPlus } from '../assets/images/iconPlus.svg';
import TextButton from '../components/TextButton';
import RoundedButton from '../components/RoundedButton';
import CreateTextBoxInput from '../components/CreateTextBoxInput';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SplashPage from './SplashPage';
import { useParams } from 'react-router-dom';
import { defaultInputs } from '../utils/constants';

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

    .icon-plus {
        min-width: 15px;
        width: 20px;
    }
`;

function CreateProtocolPage(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputs, setInputs] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { edit } = props;
    const { id } = useParams();

    const handleSubmit = (event) => {
        event.preventDefault();

        const placedInputs = defaultInputs.concat(...inputs);
        placedInputs.forEach((input, index) => {
            input['placement'] = index + 1;
        });

        const protocol = { id: id ? id : '', title, description, inputs: placedInputs };
        if (edit) {
            axios
                .put(`https://genforms.c3sl.ufpr.br/api/form/${id}`, protocol, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        } else {
            axios
                .post('https://genforms.c3sl.ufpr.br/api/form', protocol, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    };

    const handleTextBoxAdd = () => {
        setInputs([
            ...inputs,
            {
                description: '',
                question: '',
                type: 0,
                validation: [],
                sugestions: [],
                subForm: null,
                id: null,
            },
        ]);
    };

    const handleTextBoxRemove = (indexToRemove) => {
        const updatedInputs = inputs.filter((_, index) => index !== indexToRemove);
        setInputs(updatedInputs);
    };

    const handleTextBoxChange = (index, input) => {
        const updateInputs = [...inputs];
        updateInputs[index] = input;
        setInputs(updateInputs);
    };

    useEffect(() => {
        if (edit) {
            axios
                .get(`https://genforms.c3sl.ufpr.br/api/form/${id}`)
                .then((response) => {
                    delete response.data.inputs.id;
                    setInputs(response.data.inputs);
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        } else {
            setIsLoading(false);
        }
    }, [id, edit]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 font-barlow p-4 p-lg-5">
                <div className="row m-0">
                    <h1 className="font-century-gothic color-grey fs-3 fw-bold p-0 pb-4 pb-lg-5 m-0">Gerador de formulários</h1>
                </div>
                <div className="row flex-grow-1 m-0">
                    <div className="col-12 col-lg-auto p-0 pb-4">
                        <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-4 p-4">
                            <h1 className="font-century-gothic fs-3 fw-bold text-white">Adicionar</h1>
                            <button
                                type="button"
                                className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0"
                                onClick={handleTextBoxAdd}
                            >
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Caixa de texto</span>
                            </button>
                            <button type="button" className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0">
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Lista suspensa</span>
                            </button>
                            <button type="button" className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0">
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Seleção única</span>
                            </button>
                            <button type="button" className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0">
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Múltipla escolha</span>
                            </button>
                            <button type="button" className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-3 p-0">
                                <IconPlus className="icon-plus" />
                                <span className="fs-5 fw-medium lh-1 ps-3 text-nowrap">Subformulário</span>
                            </button>
                        </div>
                    </div>
                    <div className="col d-flex flex-column p-0 ps-lg-5">
                        <form className="d-flex flex-column flex-grow-1" onSubmit={handleSubmit}>
                            <div className="flex-grow-1 mb-3">
                                <label htmlFor="title" className="form-label fs-5 fw-medium">
                                    Título do formulário
                                </label>
                                <textarea
                                    className="form-control rounded-4 bg-light-grey fs-5 mb-3"
                                    id="title"
                                    rows="3"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                ></textarea>
                                <label htmlFor="description" className="form-label fs-5 fw-medium">
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
                            {inputs.map((input, index) => (
                                <CreateTextBoxInput
                                    key={index}
                                    index={index}
                                    inputState={input}
                                    onTextBoxChange={handleTextBoxChange}
                                    onTextBoxRemove={() => handleTextBoxRemove(index)}
                                />
                            ))}
                            <div className="row justify-content-between m-0">
                                <div className="col-2"></div>
                                <div className="col-8 col-lg-4">
                                    <TextButton type="submit" hsl={[97, 43, 70]} text="Finalizar protocolo" />
                                </div>
                                <div className="col-2 d-flex align-items-end justify-content-end p-0">
                                    <RoundedButton role="link" onClick={() => navigate('/help')} />
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

CreateProtocolPage.defaultProps = {
    edit: false,
};

export default CreateProtocolPage;
