import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import AlertsPage from './pages/AlertsPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import InfosPage from './pages/InfosPage';
import ProfilePage from './pages/ProfilePage';
import ProtocolPage from './pages/ProtocolPage';
import HelpPage from './pages/HelpPage';
import LogoutPage from './pages/LogoutPage';
import { AuthProvider } from './contexts/AuthContext';
import ImageRadioButtonsInput from './components/ImageRadioButtonsInput';
import TextImageInput from './components/TextImageInput';
import CreateProtocolPage from './pages/CreateProtocolPage';
import SignUpPage from './pages/SignUpPage';

const styles = `
.App {
    text-align: center;
  }
  
  .App-logo {
    height: 40vmin;
    pointer-events: none;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .App-logo {
      animation: App-logo-spin infinite 20s linear;
    }
  }
  
  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
  
  .App-link {
    color: #61dafb;
  }
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }  
`;

function App(props) {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SplashPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/alert" element={<AlertsPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/navbar" element={<Navbar />} />
                    <Route path="/terms" element={<InfosPage title="Termos de uso" />} />
                    <Route path="/profile" element={<ProfilePage allowEdit={false} />} />
                    <Route path="/protocol/:id" element={<ProtocolPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/createprotocol" element={<CreateProtocolPage />} />
                    <Route path="/about" element={<InfosPage title="Sobre o aplicativo" showAccept={false} />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                        path="/imageradio"
                        element={
                            <ImageRadioButtonsInput
                                options={['Área de plantação', 'Jardim', 'Praça', 'Escola']}
                                images={[
                                    'https://picsum.photos/108/148',
                                    'https://picsum.photos/108/148',
                                    'https://picsum.photos/108/148',
                                    'https://picsum.photos/108/148',
                                    'https://picsum.photos/108/148',
                                ]}
                            />
                        }
                    />
                    <Route
                        path="/textimage"
                        element={
                            <TextImageInput
                                options={['Área de plantação', 'Jardim', 'Praça', 'Escola']}
                                image={'https://picsum.photos/380/380'}
                            />
                        }
                    />
                </Routes>
                <style> {styles} </style>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
