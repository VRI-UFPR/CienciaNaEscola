import React from 'react';
import EyeIcon from '../assets/images/eyeIcon.svg';
import SettingsIcon from '../assets/images/settingsIcon.svg';
import CollaboratorsIcon from '../assets/images/collaboratorsIcon.svg';

const styles = `
    .options-button {
        border: 0px;
        background-color: transparent;
        padding: 4px 4px;
    }

    .options-img {
        height: 20px;
    }
`;

function ProtocolOptions(props) {
    return (
        <div>
            <div className="wrapper d-flex justify-content-center py-1">
                <button className="options-button">
                    <img className="options-img" src={EyeIcon} alt="eye icon" />
                </button>
                <button className="options-button">
                    <img className="options-img" src={SettingsIcon} alt="settings icon" />
                </button>
                <button className="options-button">
                    <img className="options-img" src={CollaboratorsIcon} alt="collaborators icon" />
                </button>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolOptions;
