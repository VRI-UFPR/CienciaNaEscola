import React from 'react';
import iconFile from '../assets/images/iconFile.svg';
import iconTrash from '../assets/images/iconTrash.svg';

import RoundedButton from './RoundedButton';

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

    `;

function InputOptions(props) {
    const { index, inputState, onTextBoxChange, onTextBoxRemove } = props;

    const handleTextBoxChange = (event, field) => {
        const updatedTextBox = { ...inputState };
        updatedTextBox[field] = event.target.value;
        onTextBoxChange(index, updatedTextBox);
    };

    // const {
    //     register,
    //     handleSubmit,
    //     watch,
    //     formState: { errors },
    // } = useForm();

    // const [questionInputText, setQuestionInputText] = useState('');
    // const [descriptionInputText, setDescriptionInputText] = useState('');

    // const onSubmit = (data) => console.log(data);

    return (
        <div className="pb-4 pb-lg-5">
            <div className="row justify-content-between m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 pb-4 m-0">Seleção Única</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconFile} />
                    <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} onClick={onTextBoxRemove} />
                </div>
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
                        aria-describedby="questionHelp"
                        onChange={(event) => handleTextBoxChange(event, 'question')}
                    />
                    <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                        *Este campo é obrigatório.
                    </div>
                </div>
                <div className="pb-1">
                    <label htmlFor="description" className="form-label fs-5 fw-medium">
                        Descrição
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="description"
                        onChange={(event) => handleTextBoxChange(event, 'description')}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="option0" className="form-label fs-5 fw-medium">
                        Opção 0
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="option0"
                        aria-describedby="questionHelp"
                        onChange={(event) => handleTextBoxChange(event, 'question')}
                    />
                    <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                        *Por favor, preencha esta opção
                    </div>
                </div>
                <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                    O campo precisa ter pelo menos duas opções!
                </div>
            </div>
            <div class="form-check form-switch d-flex justify-content-end p-1">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label class="form-check-label font-barlow fw-medium ps-1" for="flexSwitchCheckDefault">
                    Obrigatório
                </label>
            </div>
            {/* <div className="quest p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form">
                        <label>Pergunta</label>
                        <input {...register('question', { required: true })} />
                        {errors.question && <span className="error">*Este campo é obrigatório</span>}

                        <label>Descrição</label>
                        <input {...register('description')} />
                        <input type="submit" />
                    </div>
                </form>
            </div> */}
            <style>{styles}</style>
        </div>
    );
}

export default InputOptions;
