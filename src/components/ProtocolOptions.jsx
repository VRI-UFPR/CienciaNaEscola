import React from "react";
import EyeIcon from "../assets/images/eyeIcon.svg";
import SettingsIcon from "../assets/images/settingsIcon.svg";
import CollaboratorsIcon from "../assets/images/collaboratorsIcon.svg";

const styles = `
    button {
        border: 0px;
        background-color: transparent;
        padding: 4px 4px;
    }

    img {
        height: 20px;
    }
`;

function ProtocolOptions(props) {
    return ( 
        <div>
            <div className="wrapper d-flex justify-content-center py-1">
                <button>
                    <img src={EyeIcon} alt="eye icon" />
                </button>
                <button>
                    <img src={SettingsIcon} alt="settings icon" />
                </button>
                <button>
                    <img src={CollaboratorsIcon} alt="collaborators icon" />
                </button>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default ProtocolOptions;