import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const styles = `
    .help-button{
        max-height: 32px;
        max-width: 32px;
    }

    .btn-crimson {
        color: #fff;
        background-color: #EC6571;
        border-color: #EC6571;
    }

    .btn-crimson:hover {
        color: #fff;
        background-color: #780f18;
        border-color: #780f18;
    }

    .btn-crimson:focus {
        color: #fff;
        background-color: #780f18;
        border-color: #780f18;
        box-shadow: 0 0 0 0.25rem rgba(225, 83, 97, 0.5);
    }
`;

function HelpButton(props) {
    return (
        <div className="ratio ratio-1x1 help-button">
            <button type="button" className="btn d-flex btn-crimson rounded-circle w-100 h-100 p-1 ">
                <img src={helpIcon} alt="Ícone do botão de ajuda" className="w-100"></img>
            </button>
            <style>{styles}</style>
        </div>
    );
}

export default HelpButton;
