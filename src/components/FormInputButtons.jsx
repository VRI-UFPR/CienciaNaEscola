import React from 'react';
import deleteButton from '../assets/images/deleteButton.svg';
import configButton from '../assets/images/configButton.svg';
import copyButton from '../assets/images/copyButton.svg';

const styles = `
    .bg-yellow-orange {
        background-color: #FECF86;
		border-color
    }

    .bg-gray {
        background-color: #7F7F7F;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .btn{
        padding: 10%;
        min-height: 0px;
        line-height: 0px;
    }

	.btn:hover{
  		background-color: #000000 !important;
	}

	.buttons-row{
		max-width: 100px;
	}
}
`;

function FormInputButtons(props) {
    return (
        <div className="row m-0 buttons-row">
            <div className="col d-flex ps-1 p-0 align-items-start">
                <button type="button" class="btn rounded-circle bg-gray w-100">
                    <img src={configButton} alt="Ícone" className="w-100"></img>
                </button>
            </div>
            <div className="col d-flex ps-1 p-0 align-items-start">
                <button type="button" class="btn rounded-circle bg-yellow-orange w-100">
                    <img src={copyButton} alt="Ícone" className="w-100"></img>
                </button>
            </div>
            <div className="col d-flex ps-1 p-0 align-items-start">
                <button type="button" class="btn rounded-circle bg-crimson w-100">
                    <img src={deleteButton} alt="Ícone" className="w-100"></img>
                </button>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        </div>
    );
}

export default FormInputButtons;
