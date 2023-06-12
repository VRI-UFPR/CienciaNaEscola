import { getByTitle } from '@testing-library/react';
import React from 'react';
import RoundedButton from './RoundedButton';
import iconFile from '../assets/images/iconFile.svg';
import iconTrash from '../assets/images/iconTrash.svg';

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HomeButton from '../components/HomeButton';
import TextImageInput from './TextImageInput';
import { AuthContext } from '../contexts/AuthContext';
import SplashPage from '../pages/SplashPage';

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
    const [isLoading, setIsLoading] = useState(true);
    const [userProtocols, setUserForms] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            // .get(`http://localhost:3333/user/list/${user.id}`)
            axios
                .get(`https://genforms.c3sl.ufpr.br/api/user/list/${user.id}`)
                .then((response) => {
                    setUserForms(response.data);
                    setIsLoading(false);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [user]);

    if (isLoading) {
        return <SplashPage />;
    }

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
                    {userProtocols.map((userProtocol) => (
                        <option key={userProtocol.id}>
                            {userProtocol.title}
                        </option>
                    ))
                    }
                </select>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default SubForm;
