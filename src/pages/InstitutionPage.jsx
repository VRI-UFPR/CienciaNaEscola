import React, { useContext, useEffect, useState } from 'react';
import SplashPage from './SplashPage';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';

function InstitutionPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [institution, setInstitution] = useState(null);
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user.token) {
            axios
                .get(`${baseUrl}api/institution/getInstitution/${id}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setInstitution(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    alert('Falha ao carregar a instituição');
                });
        }
    }, [id, user.token]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div>
            <p>ID: {institution.id}</p>
            <p>Nome: {institution.name}</p>
            <p>Tipo: {institution.type}</p>
            <p>
                Endereço: {institution.address.id}, {institution.address.city}, {institution.address.state}, {institution.address.country}
            </p>
            <Link to={'classrooms/create'}>Criar sala de aula</Link>
            <p>Salas de aula: {JSON.stringify(institution.classrooms.map((classroom) => classroom.users.map((user) => user.username)))}</p>
            <Link to={'users/create'}>Criar usuário</Link>
            <p>Usuários: {JSON.stringify(institution.users.map((user) => user.username))}</p>
            <p>Criada em: {institution.createdAt}</p>
            <p>Atualizada em: {institution.updateAt}</p>
        </div>
    );
}

export default InstitutionPage;
