import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const styles = `
    
    h2 {
        color: #91CAD6;
    }

    .quest {
        background-color: #D3D3D3;
        border-radius: 10px;
    }

    p {
        color: red;
    }

    .form {
        display: flex;
        flex-direction: column;
        padding: 1px;
    }

    .error {
        color: red;
    }

    `;

function InputOptions (props){


  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [questionInputText, setQuestionInputText] = useState('')
  const [descriptionInputText, setDescriptionInputText] = useState('')

  const onSubmit = data => console.log(data)


    return (
        <div className="row buttons-row m-0">
            <div className="col d-flex align-items-start ps-1 p-0">
                <h2>Seleção Única</h2>
            </div>
            <div className="quest p-5">
            <form  onSubmit={handleSubmit(onSubmit)}>
                <div className='form'>
                    <label>Pergunta</label>
 <input {...register("question", { required: true})} />
      {errors.question && <span className='error'>*Este campo é obrigatório</span>}
      

      <label>Descrição</label>
      <input  {...register("description")} />    
      <input type="submit" /></div>
    </form>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default InputOptions;
