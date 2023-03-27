import React from 'react';
import { Routes, Route } from 'react-router-dom';
import cloudy from './assets/images/cloudy.svg';
import rainy from './assets/images/rainy.svg';
import sunny from './assets/images/sunny.svg';
import windy from './assets/images/windy.svg';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';
import ProtocolPage from './pages/ProtocolPage';
import EndProtocolPage from './pages/EndProtocolPage';
import HelpPage from './pages/HelpPage';
import InfoGerais from './components/InfoGerais';
import DateInput from './components/DateInput';
import TimeInput from './components/TimeInput';
import Weather from './components/Weather';
import Location from './components/Location';
import SimpleTextInput from './components/SimpleTextInput';
import RadioButtonInput from './components/RadioButtonInput';
import AboutPage from './pages/AboutPage';

var object1 = { id: 1, title: 'Sunny', image: sunny, alt: 'Sunny day image' };
var object2 = { id: 2, title: 'Cloudy', image: windy, alt: 'Cloudy day image' };
var object3 = { id: 3, title: 'Rainy', image: rainy, alt: 'Rainy day image' };
var object4 = { id: 4, title: 'Windy', image: cloudy, alt: 'Windy day image' };

function App(props) {
    return (
        <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/protocol" element={<ProtocolPage />} />
            <Route path="/endprotocol" element={<EndProtocolPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/info" element={<InfoGerais />} />
            <Route path="/date" element={<DateInput />} />
            <Route path="/time" element={<TimeInput />} />
            <Route path="/weather" element={<Weather objects={[object1, object2, object3, object4]} />} />
            <Route path="/location" element={<Location />} />
            <Route path="/simpletext" element={<SimpleTextInput />} />
            <Route path="/radiooptions" element={<RadioButtonInput options={['Área de plantação', 'Jardim', 'Praça', 'Escola']} />} />
            <Route path="/about" element={<AboutPage />} />
        </Routes>
    );
}

export default App;
