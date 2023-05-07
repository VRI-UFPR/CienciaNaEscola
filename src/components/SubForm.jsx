import { getByTitle } from '@testing-library/react';
import React from 'react';
import RoundedButton from './RoundedButton';
import iconFile from '../assets/images/iconFile.svg';
import iconTrash from '../assets/images/iconTrash.svg';

const styles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
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
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function SubForm(props) {
    return (
        <div className="pb-4 pb-lg-5">
            <div className="row justify-content-between m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 pb-4 m-0">Subformulário</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconFile} />
                    <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} />
                </div>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4 font-barlow">
                <select class="form-select form-select-lg mb-5 bg-light-grey font-barlow">
                    <option selected>Selecione um formulário</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default SubForm;
