import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { serialize } from 'object-to-formdata';
import axios from 'axios';
import baseUrl from '../contexts/RouteContext';
import { useNavigate, useParams } from 'react-router-dom';
import SplashPage from './SplashPage';
import ErrorPage from './ErrorPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey {
        color: #535353;
    }

    .color-grey:checked {
        color: #535353;
    }

    .color-grey:focus {
        color: #535353;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }

    .bg-light-pastel-blue{
        background-color: #b8d7e3;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-light-pastel-blue:focus{
        background-color: #b8d7e3;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .bg-light-grey:focus{
        background-color: #D9D9D9;
    }

    .color-steel-blue {
        color: #4E9BB9;
    }

    .form-check-input {
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }

    .form-check-input:focus {
        border: 0;
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }

    .form-check input:checked {
        border: 0;
        background-color: #91CAD6;
    }
`;

function CreateInstitutionPage(props) {
    const { institutionId } = useParams();
    const { isEditing } = props;
    const { user } = useContext(AuthContext);
    const formRef = useRef(null);

    const [institution, setInstitution] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (!isEditing && user.role !== 'ADMIN') {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para criar instituições' });
                return;
            } else if (
                isEditing &&
                user.role !== 'ADMIN' &&
                (user.role !== 'COORDINATOR' || user.institutionId !== parseInt(institutionId))
            ) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para editar esta instituição' });
                return;
            }
            if (isEditing) {
                axios
                    .get(`${baseUrl}api/institution/getInstitution/${institutionId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setInstitution({ name: d.name, type: d.type, addressId: d.address.id });
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        alert('Erro ao buscar instituição. ' + error.response?.data.message || '');
                    });
            } else {
                setIsLoading(false);
            }
        }
    }, [institutionId, isEditing, isLoading, user.token, user.status, user.role, user.institutionId]);

    const submitInstitution = (e) => {
        e.preventDefault();
        const formData = serialize(institution, { indices: true });
        if (isEditing) {
            axios
                .put(`${baseUrl}api/institution/updateInstitution/${institutionId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Instituição atualizada com sucesso');
                    navigate(`/dash/institutions/${response.data.data.id}`);
                })
                .catch((error) => {
                    alert('Erro ao atualizar instituição. ' + error.response?.data.message || '');
                });
        } else {
            axios
                .post(`${baseUrl}api/institution/createInstitution`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    alert('Instituição criada com sucesso');
                    navigate(`/dash/institutions/${response.data.data.id}`);
                })
                .catch((error) => {
                    alert('Erro ao criar instituição. ' + error.response?.data.message || '');
                });
        }
    };

    const deleteInstitution = () => {
        axios
            .delete(`${baseUrl}api/institution/deleteInstitution/${institutionId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Instituição excluída com sucesso');
                navigate(`/dash/institutions/`);
            })
            .catch((error) => {
                alert('Erro ao excluir instituição. ' + error.response?.data.message || '');
            });
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando criação de instituição..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100 p-0 overflow-x-hidden">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow m-0">
                        <div className="col-12 col-md-10 p-4 pb-0">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">
                                {isEditing ? 'Editar' : 'Criar'} instituição
                            </h1>
                        </div>
                    </div>
                    <div className="row justify-content-center font-barlow flex-grow-1 gx-0 overflow-hidden">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4">
                            <form
                                name="institution-form"
                                ref={formRef}
                                action="/submit"
                                id="institution-form"
                                onSubmit={(e) => submitInstitution(e)}
                            >
                                <div>
                                    <label label="name" className="form-label fs-5 fw-medium color-steel-blue" s>
                                        Nome da instituição:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={institution.name || ''}
                                        form="institution-form"
                                        id="name"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium  fs-5 mb-3 border-0"
                                        onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label label="type" className="form-label fs-5 fw-medium color-steel-blue">
                                        Selecione o tipo da instituição
                                    </label>
                                    <select
                                        name="type"
                                        value={institution.type || ''}
                                        id="type"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium fs-5 mb-3 border-0"
                                        form="institution-form"
                                        onChange={(e) => setInstitution((prev) => ({ ...prev, type: e.target.value || undefined }))}
                                    >
                                        <option value="" className="color-grey fw-medium fs-5">
                                            Selecione uma opção:
                                        </option>
                                        <option value="PRIMARY" className="color-grey fw-medium fs-5">
                                            Pré-escola ou Ensino Fundamental I
                                        </option>
                                        <option value="LOWER_SECONDARY" className="color-grey fw-medium fs-5">
                                            Ensino Fundamental II
                                        </option>
                                        <option value="UPPER_SECONDARY" className="color-grey fw-medium fs-5">
                                            Ensino Médio
                                        </option>
                                        <option value="TERTIARY" className="color-grey fw-medium fs-5">
                                            Ensino superior
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label label="address-id" className="form-label fs-5 fw-medium color-steel-blue">
                                        ID do endereço:
                                    </label>
                                    <input
                                        type="number"
                                        name="address-id"
                                        value={institution.addressId || ''}
                                        form="institution-form"
                                        id="address-id"
                                        className="form-control rounded-4 bg-light-pastel-blue color-grey fw-medium  fs-5 mb-3 border-0"
                                        onChange={(e) => setInstitution({ ...institution, addressId: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row justify-content-center font-barlow gx-0">
                        <div className="col col-md-10 d-flex flex-column h-100 px-4">
                            <div className="row justify-content-center justify-content-md-start gx-2 gy-4 mb-4">
                                <div className="col-3 col-md-2">
                                    <TextButton
                                        text={isEditing ? 'Editar' : 'Criar'}
                                        hsl={[97, 43, 70]}
                                        onClick={() => {
                                            formRef.current.requestSubmit();
                                        }}
                                    />
                                </div>
                                {isEditing && (
                                    <div className="col-3 col-md-2">
                                        <TextButton text={'Excluir'} hsl={[355, 78, 66]} onClick={deleteInstitution} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default CreateInstitutionPage;
