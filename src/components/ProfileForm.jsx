import React from 'react';
import helpIcon from '../assets/images/helpIcon.svg';

const styles = `
    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .btn{
        min-height: 0px;
        line-height: 0px;
    }

    .green-button {
        border-radius: 10px;
        background-color: #AAD390;
        color: #FFF;
        font-weight: 700;
        font-size: 130%;
    }
`;

function ProfileForm(props) {
    return (
        <form className="d-flex flex-column flex-grow-1">
            <div className="row pb-4">
                <div className="bg-pastel-blue rounded p-4">
                    <div className="mb-1">
                        <label labelfor="nameinput" className="form-label mb-0">
                            Nome:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="nameinput"></input>
                    </div>
                    <div className="mb-1">
                        <label labelfor="emailinput" className="form-label mb-0">
                            E-mail:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="emailinput"></input>
                    </div>
                    <div className="mb-1">
                        <label labelfor="locationinput" className="form-label mb-0">
                            Cidade/país:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="locationinput"></input>
                    </div>
                    <div className="mb-1">
                        <label labelfor="institutioninput" className="form-label mb-0">
                            Instituição:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="institutioninput"></input>
                    </div>
                    <div className="mb-1">
                        <label labelfor="codeinput" className="form-label mb-0">
                            Código INEP:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="codeinput"></input>
                    </div>
                    <div className="mb-1">
                        <label for="roleinput" className="form-label mb-0">
                            Papel:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="roleinput"></input>
                    </div>
                    <div className="mb-4">
                        <label labelfor="logininput" className="form-label mb-0">
                            Login:
                        </label>
                        <input type="text" className="form-control shadow-sm rounded-pill" id="logininput"></input>
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-grow-1 align-items-end pb-4 mx-0 p-0">
                <div className="row d-flex justify-content-between px-0 mx-0">
                    <div className="col-3"></div>
                    <div className="col-4 align-items-center p-0">
                        <button type="submit" className="btn green-button shadow font-century-gothic w-100 p-2">
                            Salvar
                        </button>
                    </div>
                    <div className="col-3 d-flex align-items-end justify-content-end px-0">
                        <button
                            type="button"
                            style={{
                                maxWidth: '32px',
                            }}
                            className="btn bg-crimson rounded-circle w-100 h-auto p-1"
                        >
                            <img src={helpIcon} alt="Ícone" className="w-100"></img>
                        </button>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </form>
    );
}

export default ProfileForm;
