import React from 'react';
import helpIcon from '../assets/images/helpIcon.svg';

const styles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-steel-blue {
        background-color: #4E9BB9;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-lime-green {
        background-color: #AAD390;
    }

    .border-cell {
        height: 10px;
    }

    .navbar {
        background-color: #4E9BB9;
    }

    .btn{
        min-height: 0px;
        line-height: 0px;
    }
`;

function ProfileForm(props) {
    return (
        <form className="d-flex flex-column flex-grow-1">
            <div className="row pb-4">
                <div className="rounded p-4 bg-pastel-blue">
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
            <div className="row pt-0 pb-4 mx-0 px-0 d-flex flex-grow-1 align-items-end">
                <div className="row d-flex px-0 mx-0 justify-content-between">
                    <div className="col-3"></div>
                    <div className="col-4 p-0 align-items-center">
                        <button type="submit" className="btn p-2 shadow w-100 green-button font-century-gothic">
                            Salvar
                        </button>
                    </div>
                    <div className="col-3 d-flex align-items-end justify-content-end px-0">
                        <button
                            type="button"
                            style={{
                                maxWidth: '32px',
                            }}
                            className="btn h-auto p-0 rounded-circle bg-crimson p-1 w-100"
                        >
                            <img src={helpIcon} alt="Ícone" className="w-100"></img>
                        </button>
                    </div>
                </div>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        </form>
    );
}

export default ProfileForm;
