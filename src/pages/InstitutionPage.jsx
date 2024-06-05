import React, { useContext, useEffect, useState } from 'react';
import SplashPage from './SplashPage';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import ErrorPage from './ErrorPage';

function InstitutionPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [institution, setInstitution] = useState(null);
    const { institutionId } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user.status !== 'loading') {
            if (user.role !== 'ADMIN' && (user.role === 'USER' || user.institutionId !== parseInt(institutionId))) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para visualizar esta instituição' });
                return;
            }
            axios
                .get(`${baseUrl}api/institution/getInstitution/${institutionId}`, {
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
                    setError({ text: 'Erro ao carregar a instituição', description: error.response.data.message || '' });
                });
        }
    }, [institutionId, user.token, user.status, user.role, user.institutionId]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando instituição..." />;
    }

    return (
        <div>
            {(user.role === 'USER' || user.role === 'COORDINATOR') && <Link to={'manage'}>Gerenciar</Link>}
            <p>ID: {institution.id}</p>
            <p>Nome: {institution.name}</p>
            <p>Tipo: {institution.type}</p>
            <p>
                Endereço: {institution.address.id}, {institution.address.city}, {institution.address.state}, {institution.address.country}
            </p>
            <Link to={'classrooms/create'}>Criar sala de aula</Link>
            <p>
                Salas de aula:{' '}
                {institution.classrooms.map((c) =>
                    user.role !== 'USER' && user.role !== 'APPLIER' ? (
                        <Link to={`classrooms/${c.id}/manage`}>{c.id} </Link>
                    ) : (
                        <span>{c.id} </span>
                    )
                )}
            </p>
            <Link to={'users/create'}>Criar usuário</Link>
            <p>
                Usuários:{' '}
                {institution.users.map((u) =>
                    user.role === 'ADMIN' ? <Link to={`users/${u.id}/manage`}>{u.username} </Link> : <span>{u.username} </span>
                )}
            </p>
            <p>Criada em: {institution.createdAt}</p>
            <p>Atualizada em: {institution.updateAt}</p>
        </div>
    );
}

export default InstitutionPage;
