/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import RoundedButton from '../../RoundedButton';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .text-steel-blue {
        color: #4E9BB9;
    }

    .form-check-input {
        background-color: #D9D9D9;
    }
`;

/**
 * Componente responsável por exibir um formulário secundário.
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.input - Dados do input do formulário.
 * @param {Function} props.onInputChange - Função chamada quando há mudanças no input.
 * @param {Function} props.onInputRemove - Função chamada para remover um input.
*/
function SubForm(props) {
    const { input, onInputChange, onInputRemove } = props;
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [userProtocols, setUserForms] = useState([]);

    /**
     * Faz uma requisição para buscar os formulários do usuário autenticado.
     * A busca é feita apenas se o ID e o token do usuário estiverem disponíveis.
    */
    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            // .get(`http://localhost:3333/user/list/${user.id}`)
            axios
                .get(`https://genforms.c3sl.ufpr.br/api/user/list/${user.id}`)
                .then((response) => {
                    setUserForms(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [user]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div className="pb-4 pb-lg-5">
            <div className="row justify-content-between pb-2 m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 m-0">Subformulário</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton className="text-white" hsl={[190, 46, 70]} icon="upload_file" />
                    <RoundedButton className="text-white ms-2" hsl={[190, 46, 70]} icon="delete" onClick={onInputRemove} />
                </div>
            </div>
            <div className="row form-check form-switch pb-3 m-0 ms-2">
                <input
                    className="form-check-input border-0 fs-5 p-0"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    defaultChecked={input.validation.find((validation) => validation.type === 'required')?.value ?? false}
                    onChange={(event) =>
                        onInputChange({
                            ...input,
                            validation: input.validation.map((item) =>
                                item.type === 'required' ? { ...item, value: event.target.checked } : { item }
                            ),
                        })
                    }
                />
                <label className="form-check-label d-flex font-barlow fw-medium fs-5 p-0" htmlFor="flexSwitchCheckDefault">
                    Obrigatório
                </label>
            </div>
            <div className="font-barlow bg-light-grey rounded-4 lh-1 w-100 p-4">
                <select
                    className="form-select form-select-lg font-barlow bg-light-grey mb-5"
                    defaultValue={-1}
                    onChange={(event) =>
                        onInputChange({
                            ...input,
                            subformId: event.target.value,
                        })
                    }
                >
                    <option value={-1}>Selecione um formulário</option>
                    {userProtocols.map((userProtocol) => (
                        <option key={userProtocol.id} value={userProtocol.id}>
                            {userProtocol.title}
                        </option>
                    ))}
                </select>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default SubForm;
