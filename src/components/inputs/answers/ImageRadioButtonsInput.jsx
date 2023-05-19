import React, { useState } from 'react';
import FormInputButtons from '../../FormInputButtons';
import visibilityIcon from '../assets/images/visibilityIcon.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .form-label, .form-check-label{
        font-weight: 500;
        font-size: 90%;
        color: #535353;
    }

    .form-check-input{
        background-color: #D9D9D9
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .squareParent{
        position:relative;
        overflow:hidden;
        padding-bottom:120%;
        background-color: #D9D9D9;
    }
    .squareParent .square{
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }

    .toggle-button{
        min-height: 0px;
        line-height: 0px;
        position: absolute;
        bottom: 20px;
        right: 16px;
    }
`;

function ImageRadioButtonsInput({ options = [], images = [] }) {
    const [ImageVisibility, setImageVisibility] = useState(false);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    const slicedOptions = options.reduce((res, _value, index) => {
        if (index % 2 === 0) {
            res.push(options.slice(index, index + 2));
        }
        return res;
    }, []);

    const slicedImages = images.reduce((res, _value, index) => {
        if (index % 3 === 0) {
            res.push(images.slice(index, index + 3));
        }
        return res;
    }, []);

    return (
        <div className="row justify-content-center shadow rounded m-0 p-3 pb-2">
            <div className="row justify-content-between m-0 mb-3">
                <div className="col-9 p-0">
                    <p className="form-label font-barlow lh-sm m-0">
                        Qual destas informações abaixo descrevem melhor a área ou ambiente de coleta? Destaque apenas um.
                    </p>
                </div>
                <div className="col-3 d-flex justify-content-end ps-3 p-0">
                    <FormInputButtons />
                </div>
            </div>
            <div className="row position-relative m-0 p-0" style={{ maxWidth: '1200px' }}>
                {ImageVisibility ? (
                    slicedImages.map((images, index) => {
                        return (
                            <div className="row justify-content-center m-0 mb-3 px-1" key={'row' + index}>
                                {images.map((image, index) => {
                                    return (
                                        <div className="col-4 p-0" key={image + index}>
                                            <div className={'squareParent rounded shadow mx-2'}>
                                                <img src={image} className="square w-100" alt="Imagem submetida" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <div className="row justify-content-center m-0 mb-3 px-1" style={{ maxWidth: '1200px' }}>
                        {slicedImages[0].map((image, index) => {
                            return (
                                <div className="col-4 p-0" key={image + index}>
                                    <div className={'squareParent rounded shadow mx-2'}>
                                        <img src={image} className="square w-100" alt="Imagem submetida" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <button
                    onClick={toggleImageVisibility}
                    type="button"
                    style={{
                        maxWidth: '26px',
                    }}
                    className="btn toggle-button bg-pastel-blue shadow rounded-circle h-auto w-100 p-1"
                >
                    <img src={visibilityIcon} alt="Ícone de visibilidade" className="w-100"></img>
                </button>
            </div>

            {slicedOptions.map((options, index) => {
                return (
                    <div className="row justify-content-between m-0 px-1" key={'row' + index}>
                        {options.map((option, index) => {
                            const optname = option.toLowerCase().replace(/\s/g, '');

                            return (
                                <div className="col justify-content-start p-0" key={optname + index}>
                                    <div className="form-check ms-2 mb-2">
                                        <input className="form-check-input" type="radio" name="radiooptions" id={optname + 'input'}></input>
                                        <label className="form-check-label font-barlow" htmlFor={optname + 'input'}>
                                            {option}
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
            <style>{styles}</style>
        </div>
    );
}

export default ImageRadioButtonsInput;
