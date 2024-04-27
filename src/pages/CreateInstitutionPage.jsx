import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';

function CreateInstitutionPage(props) {
    const { user } = useContext(AuthContext);
    const [institution, setInstitution] = useState({});
    const navigate = useNavigate();

    const submitInstitution = (e) => {
        e.preventDefault();
        const formData = serialize(institution, { indices: true });
        axios
            .post(`${baseUrl}api/institution/createInstitution`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Instituição criada com sucesso');
                navigate(`dash/institutions/${response.data.data.id}`);
            })
            .catch((error) => {
                alert('Erro ao criar instituição');
            });
    };

    return (
        <div>
            <form name="institution-form" id="institution-form" onSubmit={(e) => submitInstitution(e)}>
                <div>
                    <label label="name">Nome:</label>
                    <input
                        type="text"
                        name="name"
                        form="institution-form"
                        id="name"
                        onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                    />
                </div>
                <div>
                    <label label="type">Selecione o tipo da instituição</label>
                    <select
                        name="type"
                        id="type"
                        form="institution-form"
                        onChange={(e) => setInstitution((prev) => ({ ...prev, type: e.target.value || undefined }))}
                    >
                        <option value="">Selecione uma opção:</option>
                        <option value="PRIMARY">Primary</option>
                        <option value="LOWER_SECONDARY">Lower Secondary</option>
                        <option value="UPPER_SECONDARY">Upper Secondary</option>
                        <option value="TERTIARY">Tertiary</option>
                    </select>
                </div>
                <div>
                    <label label="address-id">ID do endereço:</label>
                    <input
                        type="number"
                        name="address-id"
                        form="institution-form"
                        id="address-id"
                        onChange={(e) => setInstitution({ ...institution, addressId: e.target.value })}
                    />
                </div>
                <div>
                    <button type="submit">Enviar</button>
                </div>
            </form>
            <p>{JSON.stringify(institution)}</p>
        </div>
    );
}

export default CreateInstitutionPage;
