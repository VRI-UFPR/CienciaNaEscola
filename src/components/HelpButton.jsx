import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const styles = `
    .help-button{
        min-height: 0px;
        line-height: 0px;
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
        <div>
            <button
                type="button"
                style={{
                    maxWidth: '32px',
                }}
                className="btn btn-crimson help-button rounded-circle h-auto w-100 p-1"
            >
                <img src={helpIcon} alt="Ícone do botão de ajuda" className="w-100"></img>
            </button>
            <style>{styles}</style>
        </div>
    );
}

export default HelpButton;
