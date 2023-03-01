import logo from "./assets/images/logo.svg";
import React from "react";
import SplashPage from "./pages/SplashPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="App">
                            <header className="App-header">
                                <img src={logo} className="App-logo" alt="logo" />
                                <p>
                                    Edit <code>src/App.js</code> and save to reload.
                                </p>
                                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                                    Learn React
                                </a>
                            </header>
                            <style dangerouslySetInnerHTML={{ __html: styles }} />
                        </div>
                    }
                />
                <Route path="/splash" element={<SplashPage />} />
            </Routes>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </BrowserRouter>
    );
}

export default App;