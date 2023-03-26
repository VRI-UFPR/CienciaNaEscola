import React from "react";
import ColoredBorder from "../components/ColoredBorder";
import HomeButtonList from "../components/HomeButtonList";
import HomeArrows from "../components/HomeArrows";
import NavBar from "../components/Navbar";

import helpButton from "../assets/images/helpButton.svg";

const styles = `
    .protocolInfo {
        font-size: 75%;
        width: 90%;
    }

    .generalContainer {
        position: absolute;
    }

    .helpBtn {
        position: fixed;
        bottom: 5%;
        right: 10%;
    }
`;


function HomePage(props) {
    return (
        <div className="generalContainer font-barlow d-flex flex-column p-0 container-fluid h-100 w-100">
            <div className="d-flex flex-column p-0">
                <div className="protocolInfo d-flex container-fluid justify-content-between mt-4">
                    <div>
                        Protocolos recentes
                    </div>
                    <div>
                        Ultima modificação
                    </div>
                </div>
                <div className="d-flex">
                    <HomeButtonList />
                </div>
                <div className="d-flex">
                    <HomeArrows />
                </div>
            </div>

            <div>
                <button
                    className="helpBtn p-0 d-flex"
                    type="button"
                    style={{
                        maxWidth: "40px",
                        width: "50%",
                    }}
                >
                    <img src={helpButton} width="100%" alt=""></img>
                </button>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    )
}

export default HomePage;