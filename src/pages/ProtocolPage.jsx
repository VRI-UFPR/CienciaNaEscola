import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RadioButtonInput from '../components/RadioButtonInput';
import SimpleTextInput from '../components/SimpleTextInput';
import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import ProtocolOptions from '../components/ProtocolOptions';
// import cloudy from '../assets/images/cloudy.svg';
// import rainy from '../assets/images/rainy.svg';
// import sunny from '../assets/images/sunny.svg';
// import windy from '../assets/images/windy.svg';
// import InfoGerais from '../components/InfoGerais';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
// import Weather from '../components/Weather';
import Location from '../components/Location';

const styles = `
    .row {
        width: 100%;
    }

    .protocol-wrapper {
        background-color: rgba(234, 234, 234, 1);
        height: 100vh;
    }

    .protocol-number {
        background-color: rgba(245, 148, 137, 1);
        max-width: 85px;
    }

    .input-name {
        border: 0px;
        width: 100%;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

// var object1 = { id: 1, title: 'Sunny', image: sunny, alt: 'Sunny day image' };
// var object2 = { id: 2, title: 'Cloudy', image: windy, alt: 'Cloudy day image' };
// var object3 = { id: 3, title: 'Rainy', image: rainy, alt: 'Rainy day image' };
// var object4 = { id: 4, title: 'Windy', image: cloudy, alt: 'Windy day image' };

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
        <div className="min-vh-100 d-flex flex-column">
            <NavBar />
            <div className="protocol-wrapper d-flex flex-column h-100 flex-grow-1 px-4 py-4">
                <div className="row align-items-start m-0">
                    <div className="col-3 p-0">
                        <p className="protocol-number rounded shadow font-barlow m-0 p-2">N° prot.</p>
                    </div>
                    <div className="col-6 d-flex justify-content-center px-2">
                        <input className="input-name shadow rounded font-barlow p-2" type="text" placeholder="Insira seu nome" />
                    </div>
                    <div className="col-3 d-flex justify-content-end p-0">
                        <ProtocolOptions />
                    </div>
                </div>
                {/* <div className="row justify-content-center m-0 pt-4">{<InfoGerais />}</div>*/}
                <div className="row justify-content-center m-0 pt-3">{<DateInput />}</div>
                <div className="row justify-content-center m-0 pt-3">{<TimeInput />}</div>
                <div className="row justify-content-center m-0 pt-3">{<Location />}</div>
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
