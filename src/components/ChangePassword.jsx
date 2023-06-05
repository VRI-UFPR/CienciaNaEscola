import React from 'react';
import TextButton from './TextButton';

const changePasswordStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }
    
    .bg-white {
        background-color: #FFFFFF;
    }

    .row input {
        background-color: #D9D9D9;
    }
`;

function ChangePassword(props) {
    return (
        <div className="d-flex flex-column shadow bg-white rounded-4 w-100 mx-0 px-5 py-4">
            <div className="row input p-4 py-2 mx-0">
                <label className="form-label font-century-gothic text-center fs-6" labelFor="oldPassword">
                    Digite sua senha antiga
                </label>
                <input className="border-0 rounded-4 shadow-sm py-1" type="text" id="oldPassword" />
            </div>
            <div className="row input p-4 py-2 mx-0">
                <label className="form-label font-century-gothic text-center fs-6" labelFor="newPassword">
                    Crie uma nova senha
                </label>
                <input className="border-0 rounded-4 shadow-sm py-1" type="text" id="newPassword" />
            </div>{' '}
            <div className="row input p-4 py-2 mx-0">
                <label className="form-label font-century-gothic text-center fs-6" labelFor="confirmPassword">
                    Confirme sua nova senha
                </label>
                <input className="border-0 rounded-4 shadow-sm py-1" type="text" id="confirmPassword" />
            </div>
            <div className="row d-flex justify-content-center p-4 py-2 mx-0">
                <div className="col-auto d-flex px-1">
                    <TextButton hsl={[97, 43, 70]} text="Finalizar" className="p-2 px-5" />
                </div>
            </div>
            <style>{changePasswordStyles}</style>
        </div>
    );
}

export default ChangePassword;
