import React from "react";
import helpButton from "../assets/images/helpButton.svg";

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
`;

function ProfileForm(props) {
    return (
        <form className="d-flex flex-column flex-grow-1">
            <div className="row pb-4">
                <div className="rounded p-4 bg-pastel-blue">
                    <div className="mb-1">
                        <label TermsPagefor="exampleInputEmail1" className="form-label mb-0">
                            Nome:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                    <div className="mb-1">
                        <label TermsPagefor="exampleInputEmail1" className="form-label mb-0">
                            E-mail:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                    <div className="mb-1">
                        <label TermsPagefor="exampleInputEmail1" className="form-label mb-0">
                            Cidade/país:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                    <div className="mb-1">
                        <label TermsPagefor="exampleInputEmail1" className="form-label mb-0">
                            Instituição:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                    <div className="mb-1">
                        <label TermsPagefor="exampleInputEmail1" className="form-label mb-0">
                            Código INEP:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                    <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label mb-0">
                            Papel:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                    <div className="mb-4">
                        <label TermsPagefor="exampleInputEmail1" className="form-label mb-0">
                            Login:
                        </label>
                        <input
                            type="email"
                            className="form-control shadow-sm rounded-pill"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        ></input>
                    </div>
                </div>
            </div>
            <div className="row pt-0 pb-4 mx-0 px-0 d-flex flex-grow-1 align-items-end">
                <div className="row px-0 mx-0 justify-content-between">
                    <div className="col-3"></div>
                    <div className="col-4 p-0 align-items-center">
                        <button type="submit" className="btn p-2 shadow w-100 green-button font-century-gothic">
                            Salvar
                        </button>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end px-0">
                        <button
                            className="btn p-0 pt-1"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExample"
                            aria-controls="offcanvasExample"
                            style={{
                                maxWidth: "40px",
                                width: "50%",
                            }}
                        >
                            <img src={helpButton} width="100%" alt=""></img>
                        </button>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </form>
    );
}

export default ProfileForm;
