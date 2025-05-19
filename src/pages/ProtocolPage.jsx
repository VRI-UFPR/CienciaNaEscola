/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import DateInput from '../components/inputs/answers/DateInput';
import TimeInput from '../components/inputs/answers/TimeInput';
import LocationInput from '../components/inputs/answers/LocationInput';
import ImageInput from '../components/inputs/answers/ImageInput';
import SelectInput from '../components/inputs/answers/SelectInput';
import SimpleTextInput from '../components/inputs/answers/SimpleTextInput';
import RadioButtonInput from '../components/inputs/answers/RadioButtonInput';
import GalleryModal from '../components/GalleryModal';
import CheckBoxInput from '../components/inputs/answers/CheckBoxInput';
import TextButton from '../components/TextButton';
import TextImageInput from '../components/inputs/answers/TextImageInput';
import Sidebar from '../components/Sidebar';
import ProtocolInfo from '../components/ProtocolInfo';
import { AuthContext } from '../contexts/AuthContext';
import ErrorPage from './ErrorPage';
import TableInput from '../components/inputs/answers/TableInput';
import RangeInput from '../components/inputs/answers/RangeInput';
import { serialize } from 'object-to-formdata';
import { AlertContext } from '../contexts/AlertContext';
import { LayoutContext } from '../contexts/LayoutContext';

const styles = `
    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-coral-red {
        background-color: #F59489;
    }

    .gray-color {
        color: #787878;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .name-col input:focus{
        outline: none;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

/**
 * Página de exibição de um protocolo.
 * @param {Object} props - Propriedades do componente.
 */
function ProtocolPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    const { isDashboard } = useContext(LayoutContext);

    const { protocolId } = useParams();
    const [protocol, setProtocol] = useState(undefined);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const galleryModalRef = useRef(null);
    const navigate = useNavigate();

    /** Verifica se existe uma próxima página no protocolo. */
    const hasNextPage = () => currentPageIndex < protocol.pages.length - 1;

    /** Verifica se existe uma página anterior no protocolo. */
    const hasPreviousPage = () => {
        return currentPageIndex > 0;
    };

    /** Avança para a próxima página do protocolo, se existir. */
    const nextPage = () => {
        if (hasNextPage()) {
            setCurrentPageIndex(currentPageIndex + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /** Volta para a página anterior do protocolo, se existir. */
    const previousPage = () => {
        if (hasPreviousPage()) setCurrentPageIndex(currentPageIndex - 1);
    };

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (user.role === 'USER')
                return setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para visualizar este protocolo',
                });
            axios
                .get(process.env.REACT_APP_API_URL + `api/protocol/getProtocol/${protocolId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setProtocol(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) =>
                    setError({ text: 'Erro ao obter informações do protocolo', description: error.response?.data.message || '' })
                );
        }
    }, [protocolId, user.status, logout, navigate, user.token, isLoading, user.role, user.id]);

    const replicateProtocol = () => {
        const formData = serialize({ id: protocolId });
        axios
            .post(`${process.env.REACT_APP_API_URL}api/protocol/replicateProtocol`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) =>
                showAlert({
                    headerText: 'O protocolo foi replicado com sucesso. Deseja ir para o novo protocolo?',
                    primaryBtnLabel: 'Ficar',
                    primaryBtnHsl: [355, 78, 66],
                    secondaryBtnLabel: 'Ir',
                    secondaryBtnHsl: [97, 43, 70],
                    onPrimaryBtnClick: () => {},
                    onSecondaryBtnClick: () =>
                        navigate(isDashboard ? `/dash/protocols/${response.data.data.id}` : `/protocols/${response.data.data.id}`),
                })
            )
            .catch((error) => showAlert({ headerText: 'Erro ao buscar grupos', bodyText: error.response?.data.message }));
    };

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text="Carregando protocolo..." />;

    return (
        <div className="d-flex flex-column flex-grow-1 w-100 min-vh-100">
            <div className="d-flex flex-grow-1 w-100">
                <div className="d-flex flex-column position-lg-sticky bg-coral-red vh-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="d-flex flex-column flex-grow-1 overflow-hidden bg-yellow-orange p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />

                    <div className="row d-flex align-items-center justify-content-center h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5">
                            <div className="d-flex flex-column flex-grow-1">
                                <div className="row justify-content-center g-2 m-0 pb-4">
                                    {protocol.actions.toUpdate && (
                                        <div className="col">
                                            <TextButton
                                                type="submit"
                                                hsl={[197, 43, 61]}
                                                text="Gerenciar"
                                                onClick={() => navigate('manage')}
                                            />
                                        </div>
                                    )}
                                    {protocol.actions.toApply && (
                                        <div className="col">
                                            <TextButton
                                                type="submit"
                                                hsl={[197, 43, 61]}
                                                text="Aplicar"
                                                onClick={() => navigate('apply')}
                                            />
                                        </div>
                                    )}
                                    {protocol.replicable && (
                                        <div className="col">
                                            <TextButton
                                                type="submit"
                                                hsl={[197, 43, 61]}
                                                text="Replicar"
                                                onClick={() => replicateProtocol()}
                                            />
                                        </div>
                                    )}
                                    {protocol.actions.toGetWAnswers && (
                                        <div className="col">
                                            <TextButton
                                                type="submit"
                                                hsl={[197, 43, 61]}
                                                text="Respostas"
                                                onClick={() => navigate('answers')}
                                            />
                                        </div>
                                    )}
                                </div>
                                {currentPageIndex === 0 && (
                                    <div className="row justify-content-center m-0 pb-3">
                                        <ProtocolInfo title={protocol.title} description={protocol.description} />
                                    </div>
                                )}
                                {protocol.pages[currentPageIndex].itemGroups.map((itemGroup, itemGroupIndex) => {
                                    if (
                                        itemGroup.type !== 'TEXTBOX_TABLE' &&
                                        itemGroup.type !== 'RADIO_TABLE' &&
                                        itemGroup.type !== 'CHECKBOX_TABLE'
                                    ) {
                                        return (
                                            <div key={'group' + itemGroupIndex}>
                                                {(() =>
                                                    itemGroup.items.map((item) => {
                                                        switch (item.type) {
                                                            case 'RANGE':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <RangeInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            group={itemGroup.id}
                                                                            answer={{
                                                                                text:
                                                                                    protocol.pages[currentPageIndex].itemGroups[
                                                                                        itemGroup.id
                                                                                    ]?.itemAnswers[item.id]?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'TEXTBOX':
                                                            case 'NUMBERBOX':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <SimpleTextInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                text:
                                                                                    protocol.pages[currentPageIndex].itemGroups[
                                                                                        itemGroup.id
                                                                                    ]?.itemAnswers[item.id]?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'CHECKBOX':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <CheckBoxInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                group: itemGroup.id,
                                                                                ...protocol.pages[currentPageIndex].itemGroups[itemGroup.id]
                                                                                    ?.optionAnswers[item.id],
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );

                                                            case 'RADIO':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <RadioButtonInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                group: itemGroup.id,
                                                                                ...protocol.pages[currentPageIndex].itemGroups[itemGroup.id]
                                                                                    ?.optionAnswers[item.id],
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );

                                                            case 'SELECT':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <SelectInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                group: itemGroup.id,
                                                                                ...protocol.pages[currentPageIndex].itemGroups[itemGroup.id]
                                                                                    ?.optionAnswers[item.id],
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'DATEBOX':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <DateInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    protocol.pages[currentPageIndex].itemGroups[
                                                                                        itemGroup.id
                                                                                    ]?.itemAnswers[item.id]?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'TIMEBOX':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <TimeInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    protocol.pages[currentPageIndex].itemGroups[
                                                                                        itemGroup.id
                                                                                    ]?.itemAnswers[item.id]?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'LOCATIONBOX':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <LocationInput
                                                                            item={item}
                                                                            answer={{
                                                                                text:
                                                                                    protocol.pages[currentPageIndex].itemGroups[
                                                                                        itemGroup.id
                                                                                    ]?.itemAnswers[item.id]?.text || '',
                                                                                files: [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'UPLOAD':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <ImageInput
                                                                            item={item}
                                                                            galleryModalRef={galleryModalRef}
                                                                            answer={{
                                                                                text: '',
                                                                                files:
                                                                                    protocol.pages[currentPageIndex].itemGroups[
                                                                                        itemGroup.id
                                                                                    ]?.itemAnswers[item.id]?.files || [],
                                                                                group: itemGroup.id,
                                                                            }}
                                                                            onAnswerChange={() => {}}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                );
                                                            case 'TEXT':
                                                                return (
                                                                    <div key={item.id} className="row justify-content-center m-0 pb-3">
                                                                        <TextImageInput item={item} galleryModalRef={galleryModalRef} />
                                                                    </div>
                                                                );
                                                            default:
                                                                return <p>Input type not found</p>;
                                                        }
                                                    }))()}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={'group' + itemGroupIndex} className="row justify-content-center m-0 pb-3">
                                                <TableInput
                                                    group={itemGroup}
                                                    answer={{
                                                        group: itemGroup.id,
                                                        ...protocol.pages[currentPageIndex].itemGroups[itemGroup.id]?.tableAnswers,
                                                    }}
                                                    disabled={true}
                                                />
                                            </div>
                                        );
                                    }
                                })}
                                <div className="row justify-content-center m-0 pb-4">
                                    <TextImageInput
                                        item={{
                                            text:
                                                'Identificador do protocolo: ' +
                                                protocol.id +
                                                '  \nVersão do protocolo: ' +
                                                protocol.createdAt.replace(/\D/g, ''),
                                            files: [],
                                        }}
                                        galleryModalRef={galleryModalRef}
                                    />
                                </div>
                                {hasPreviousPage() && (
                                    <div className="col-4 align-self-center pb-3">
                                        <TextButton type="button" hsl={[97, 43, 70]} text="Página anterior" onClick={previousPage} />
                                    </div>
                                )}
                                {hasNextPage() && (
                                    <div className="col-4 align-self-center pb-3">
                                        <TextButton type="button" hsl={[97, 43, 70]} text="Próxima página" onClick={nextPage} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
