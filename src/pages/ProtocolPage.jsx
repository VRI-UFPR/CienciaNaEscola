import React from 'react';
import cloudy from '../assets/images/cloudy.svg';
import rainy from '../assets/images/rainy.svg';
import sunny from '../assets/images/sunny.svg';
import windy from '../assets/images/windy.svg';
import NavBar from '../components/Navbar';
import ProtocolOptions from '../components/ProtocolOptions';
import InfoGerais from '../components/InfoGerais';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import RadioButtonInput from '../components/RadioButtonInput';
import Weather from '../components/Weather';
import SimpleTextInput from '../components/SimpleTextInput';
import Location from '../components/Location';

const styles = `
    .row {
        width: 100%;
    }

    .protocol-wrapper {
        background-color: rgba(234, 234, 234, 1);
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

var object1 = { id: 1, title: 'Sunny', image: sunny, alt: 'Sunny day image' };
var object2 = { id: 2, title: 'Cloudy', image: windy, alt: 'Cloudy day image' };
var object3 = { id: 3, title: 'Rainy', image: rainy, alt: 'Rainy day image' };
var object4 = { id: 4, title: 'Windy', image: cloudy, alt: 'Windy day image' };

function ProtocolPage(props) {
    return (
        <div className="vh-100">
            <NavBar />
            <div className="protocol-wrapper d-flex flex-column px-4 py-4">
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
                <div className="row justify-content-center m-0 pt-4">
                    <InfoGerais />
                </div>
                <div className="row justify-content-center m-0 pt-3">
                    <DateInput />
                </div>
                <div className="row justify-content-center m-0 pt-3">
                    <TimeInput />
                </div>
                <div className="row justify-content-center m-0 pt-3">
                    <RadioButtonInput options={['Área de plantação', 'Jardim', 'Praça', 'Escola']} />
                </div>
                <div className="row justify-content-center m-0 pt-3">
                    <Weather objects={[object1, object2, object3, object4]} />
                </div>
                <div className="row justify-content-center m-0 pt-3">
                    <SimpleTextInput />
                </div>
                <div className="row justify-content-center m-0 pt-3">
                    <Location />
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
