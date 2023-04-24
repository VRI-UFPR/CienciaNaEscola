import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RadioButtonInput from '../components/RadioButtonInput';
import SimpleTextInput from '../components/SimpleTextInput';
import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';

const styles = `
    .bg-munsell {
        background-color: rgba(254, 207, 134, 0.7);
    }

    .bg-red {
        background-color: rgba(245, 148, 137, 1);
    }

    .gray-color {
        color: rgba(120, 120, 120, 1);
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function ProtocolPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [protocol, setProtocol] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        // .get(`http://localhost:3333/form/${id}`)
        axios
            .get(`https://genforms.c3sl.ufpr.br/api/form/${id}`)
            .then((response) => {
                setProtocol(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, [id]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="d-flex flex-column flex-grow-1 bg-munsell px-4 py-4">
                <div className="row m-0 w-100">
                    <div className="col-3 col-sm-2 p-0">
                        <p className="rounded shadow text-center font-barlow gray-color bg-red p-2 m-0">Prot. {id}</p>
                    </div>
                    <div className="col-9 col-sm-10 pe-0">
                        <input
                            className="rounded shadow font-barlow gray-color border-0 p-2 w-100"
                            type="text"
                            placeholder="Insira seu nome"
                        />
                    </div>
                </div>
                {/* <div className="row justify-content-center m-0 pt-4">{<InfoGerais />}</div>
                <div className="row justify-content-center m-0 pt-3">{<DateInput />}</div>
                <div className="row justify-content-center m-0 pt-3">{<TimeInput />}</div> */}
                {protocol.inputs.map((input) => {
                    switch (input.type) {
                        case 0:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<SimpleTextInput input={input} />}
                                </div>
                            );

                        case 2:
                            return (
                                <div key={input.id} className="row justify-content-center m-0 pt-3">
                                    {<RadioButtonInput input={input} />}
                                </div>
                            );

                        default:
                            return <p>ruim</p>;
                    }
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
