import { React, useState, useEffect } from 'react';
import iconFile from '../../../assets/images/iconFile.svg';
import iconTrash from '../../../assets/images/iconTrash.svg';
import iconPlus from '../../../assets/images/iconPlus.svg';
import { defaultNewInput } from '../../../utils/constants';

import RoundedButton from '../../RoundedButton';

const styles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }    

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .text-steel-blue {
        color: #4E9BB9;
    }

    .border-steel-blue{
        border-color: #4E9BB9 !important;
    }

    .form-check-input {
        background-color: #D9D9D9;
    }

    `;

function CreateSingleSelectionInput(props) {
    const [title, setTitle] = useState('');
    const { currentItem, type, pageIndex, groupIndex, itemIndex, updateItem, removeItem } = props;
    const [item, setItem] = useState(currentItem || defaultNewInput(type));

    useEffect(() => {
        switch (type) {
            case 'SELECT': {
                setTitle('Lista Suspensa');
                break;
            }
            case 'RADIO': {
                setTitle('Seleção única');
                break;
            }
            case 'CHECKBOX': {
                setTitle('Múltipla escolha');
                break;
            }
            default: {
                break;
            }
        }
    }, [type]);

    useEffect(() => {
        updateItem(item, pageIndex, groupIndex, itemIndex);
    }, [item, pageIndex, groupIndex, itemIndex, updateItem]);

    const addOption = () => {
        setItem((prev) => ({ ...prev, itemOptions: [...prev.itemOptions, { text: '' }] }));
    };

    const removeOption = (index) => {
        setItem((prev) => ({ ...prev, itemOptions: prev.itemOptions.filter((_, i) => i !== index) }));
    };

    const updateOption = (index, value) => {
        setItem((prev) => ({ ...prev, itemOptions: prev.itemOptions.map((item, i) => (i === index ? { text: value } : item)) }));
    };

    return (
        <div className="px-0 pb-4 pb-lg-5">
            <div className="row justify-content-between pb-2 m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 m-0">{title}</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconFile} />
                    <RoundedButton
                        className="ms-2"
                        hsl={[190, 46, 70]}
                        icon={iconTrash}
                        onClick={() => removeItem(pageIndex, groupIndex, itemIndex)}
                    />
                </div>
            </div>
            <div className="row form-check form-switch pb-3 m-0 ms-2">
                <input
                    className="form-check-input border-0 fs-5 p-0"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    // defaultChecked={input.validation.find((validation) => validation.type === 'required')?.value ?? false}
                    // onChange={(event) =>
                    //     onInputChange({
                    //         ...input,
                    //         validation: input.validation.map((item) =>
                    //             item.type === 'required' ? { ...item, value: event.target.checked } : { item }
                    //         ),
                    //     })
                    // }
                />
                <label className="form-check-label font-barlow fw-medium fs-5 p-0" htmlFor="flexSwitchCheckDefault">
                    Obrigatório
                </label>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label htmlFor="question" className="form-label fs-5 fw-medium">
                        Pergunta
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="question"
                        value={item.text || ''}
                        aria-describedby="questionHelp"
                        onChange={(event) => setItem((prev) => ({ ...prev, text: event.target.value }))}
                    />
                    {!item.text && (
                        <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-5 fw-medium">
                        Descrição
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="description"
                        value={item.description || ''}
                        onChange={(event) => setItem((prev) => ({ ...prev, description: event.target.value }))}
                    />
                </div>
                {item.itemOptions.map((data, i) => {
                    return (
                        <div key={i + 1} className="mb-3">
                            <label htmlFor={i} className="form-label fw-medium fs-5">
                                Opção {i}
                            </label>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                    id={i}
                                    value={data.text || ''}
                                    aria-describedby="questionHelp"
                                    onChange={(event) => updateOption(i, event.target.value)}
                                />
                                <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} onClick={() => removeOption(i)} />
                            </div>
                            {!item.itemOptions[i] && (
                                <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                                    *Por favor, preencha esta opção
                                </div>
                            )}
                        </div>
                    );
                })}
                {item.itemOptions.length < 2 && (
                    <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                        O campo precisa ter pelo menos duas opções!
                    </div>
                )}
                <div className="d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} size={22} icon={iconPlus} onClick={() => addOption()} />
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default CreateSingleSelectionInput;
