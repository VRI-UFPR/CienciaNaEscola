import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App(props) {
    return (
        <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/protocol" element={<ProtocolPage />} />
            <Route path="/endprotocol" element={<EndProtocolPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
        </Routes>
    );
}

export default App;
