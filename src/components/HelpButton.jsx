import React from 'react';

import helpIcon from '../assets/images/helpIcon.svg';

const styles = `
    .bg-crimson {
        background-color: #EC6571;
    }

    .help-button{
        min-height: 0px;
        line-height: 0px;
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
                className="btn help-button bg-crimson rounded-circle h-auto w-100 p-1"
            >
                <img src={helpIcon} alt="Ícone do botão de ajuda" className="w-100"></img>
            </button>
            <style>{styles}</style>
        </div>
    );
}

export default HelpButton;
