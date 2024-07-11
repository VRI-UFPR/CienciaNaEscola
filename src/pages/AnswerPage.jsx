/*
Copyright (C) 2024 Laboratório Visão Robótica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import SplashPage from './SplashPage';
import NavBar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import baseUrl from '../contexts/RouteContext';
import { Chart } from 'react-google-charts';
import Gallery from '../components/Gallery';
import GalleryModal from '../components/GalleryModal';
import TextButton from '../components/TextButton';

const styles = `
    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .color-yellow-orange {
        color: #FECF86;
    }

    .bg-light-gray {
        background-color: #D9D9D9;
    }

    .bg-coral-red {
        background-color: #F59489;
    }

    .color-gray {
        color: #787878;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-dark-gray {
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

function AnswerPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [answer, setAnswer] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState(undefined);
    const [selectedItem, setSelectedItem] = useState(undefined);
    const galleryModalRef = useRef(null);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const modalRef = useRef(null);

    const setVisualization = (person, question) => {
        setSelectedAnswer(person);
        setSelectedItem(question);
    };

    const sumOptionAnswers = (itemOptions) => {
        let sum = 0;
        for (const option of itemOptions) {
            sum += Object.keys(option.optionAnswers).length;
        }
        return sum;
    };

    useEffect(() => {
        if (user.token) {
            axios
                .get(`${baseUrl}api/applicationAnswer/getApplicationWithAnswers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setAnswer(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [id, user]);

    if (isLoading) {
        return <SplashPage />;
    }

    // Função de exportar csv

    const createFile = (modalRef) => {
        let obj, csv;

        obj = answer;

        if (Object.keys(obj.answers).length > 0) {
            csv = jsonToCsv(obj);

            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, 'data.csv');
            } else {
                var link = document.createElement('a');
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'data.csv');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        } else {
            modalRef.current.showModal({ title: 'O seguinte protocolo não possui respostas: ' + obj.protocol.title });
        }
    };

    function jsonToCsv(ans) {
        let header = [],
            answers = [],
            userAnswers = [];
        let headerString;
        let items = ans.protocol.pages[0].itemGroups[0].items;
        let ansIds = Object.keys(ans.answers);

        // Armazena todas as perguntas no vetor 'header'
        header.push('username');
        for (let i = 0; i < items.length; i++) {
            // Substitui '\n' por um espaço para evitar quebra de linha no CSV
            let cleanText = String(items[i].text).replace(/\n/g, ' ');
            header.push(cleanText);
        }
        // Tratamentos para exportar corretamente
        // items.length já contém o +1 do "username"
        header[0] = '"' + header[0];
        header[items.length] = header[items.length] + '"';

        // Coloca tudo como uma string única dividindo as perguntas com o divisor de colunas do csv: ','
        headerString = header.join('","');

        // Armazena as respostas
        for (let i = 0; i < ansIds.length; i++) {
            userAnswers[0] = String(ans.answers[ansIds[i]].user.username);

            // Respostas em si
            for (let j = 0; j < items.length; j++) {
                switch (items[j].type) {
                    case 'TIMEBOX':
                    case 'DATEBOX':
                    case 'LOCATIONBOX':
                    case 'TEXTBOX':
                        userAnswers[j + 1] = String(items[j].itemAnswers[ansIds[i]][ansIds[i]][0].text).replace(/\n/g, ' ');
                        break;

                    case 'TEXT':
                        userAnswers[j + 1] = 'Enunciado*';
                        break;

                    case 'RADIO':
                        // Percorre todas as opções buscando pela opção selecionada pelo usuário
                        for (let k = 0; k < items[j].itemOptions.length; k++) {
                            if (items[j].itemOptions[k].optionAnswers[ansIds[i]] !== undefined)
                                userAnswers[j + 1] = String(items[j].itemOptions[k].text).replace(/\n/g, ' ');
                        }
                        break;

                    case 'CHECKBOX':
                        // Percorre todas as opções buscando pela opção selecionada pelo usuário
                        for (let k = 0; k < items[j].itemOptions.length; k++) {
                            if (items[j].itemOptions[k].optionAnswers[ansIds[i]] !== undefined)
                                if (userAnswers[j + 1] !== undefined)
                                    userAnswers[j + 1] =
                                        userAnswers[j + 1] + ' | ' + String(items[j].itemOptions[k].text).replace(/\n/g, ' ');
                                else userAnswers[j + 1] = String(items[j].itemOptions[k].text).replace(/\n/g, ' ');
                        }
                        break;

                    case 'UPLOAD':
                        for (let k = 0; k < items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files.length; k++) {
                            if (
                                items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files[k].path.includes('.png') ||
                                items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files[k].path.includes('.jpg') ||
                                items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files[k].path.includes('.jpeg')
                            ) {
                                if (userAnswers[j + 1] !== undefined)
                                    userAnswers[j + 1] =
                                        userAnswers[j + 1] +
                                        ' | ' +
                                        baseUrl.concat('api/', String(items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files[k].path));
                                else
                                    userAnswers[j + 1] = baseUrl.concat(
                                        'api/',
                                        String(items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files[k].path)
                                    );
                            }
                        }
                        break;

                    case 'NUMBERBOX':
                        break;

                    case 'SELECT':
                        break;

                    case 'SCALE':
                        break;

                    default:
                        break;
                }
            }
            userAnswers[0] = '"' + userAnswers[0];
            userAnswers[items.length] = userAnswers[items.length] + '"';

            answers[i] = userAnswers.join('","');
        }

        const csv = [headerString, ...answers].join('\r\n');

        return csv;
    }

    return (
        <div className="container-fluid d-flex flex-column flex-grow-1 p-0 m-0">
            <div className="row m-0 flex-grow-1">
                <div className="col-auto bg-coral-red p-0 d-flex position-lg-sticky vh-100 top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row d-flex align-items-center justify-content-center font-barlow h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5 pb-lg-4">
                            <div className="row p-0 m-0">
                                <h1 className="col col-12 col-md-9 order-2 order-md-1 color-dark-gray font-century-gothic fw-bold fs-2 py-4 pt-md-0 m-0">
                                    <Link className="color-dark-gray" to={`/protocol/${id}`}>
                                        {answer.protocol.title}
                                    </Link>{' '}
                                    - Respostas
                                </h1>
                                <div className="col col-12 col-md-3 order-1 order-md-2 d-flex align-items-center">
                                    <TextButton text={'Exportar'} hsl={[197, 43, 61]} onClick={() => createFile(modalRef)} />
                                </div>
                            </div>

                            <div className="bg-light-gray rounded-4 mb-3 p-3">
                                <h2 className="color-dark-gray fw-medium fs-5 m-0">
                                    {Object.keys(answer.answers).length + ' respostas '}
                                    <a
                                        href="#answerTab"
                                        onClick={() => setVisualization(undefined, undefined)}
                                        className="color-dark-gray fw-bold fs-6"
                                    >
                                        (ver todas)
                                    </a>
                                </h2>
                            </div>
                            {Object.entries(answer.answers).length > 0 && (
                                <div className="bg-light-gray rounded-4 mb-3 p-3 pb-1">
                                    <h2 className="color-dark-gray fw-medium fs-5 m-0 mb-3">Quem respondeu?</h2>
                                    {Object.entries(answer.answers).map(([key, value]) => {
                                        return (
                                            <div key={'answer-' + key} className="bg-white rounded-4 mb-3 p-2 px-3">
                                                <p className="fw-medium fs-6 m-0">
                                                    <a
                                                        className="color-dark-gray fw-bold"
                                                        href="#answerTab"
                                                        onClick={() => setVisualization(key, undefined)}
                                                    >
                                                        {value.user.username + ' - ' + new Date(value.date).toLocaleDateString() + ''}
                                                    </a>
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div id="answerTab" className=" mb-lg-4">
                                {answer.protocol.pages.map((page, pageIndex) => {
                                    return page.itemGroups.map((itemGroup, itemGroupIndex) => {
                                        return itemGroup.items.map((item, itemIndex) => {
                                            return (
                                                (selectedItem === undefined || selectedItem === item.id) &&
                                                item.type !== 'TEXT' && (
                                                    <div key={'input-' + item.id} className="bg-light-gray rounded-4 mb-3 p-3 pb-1">
                                                        <a
                                                            href="#answerTab"
                                                            onClick={() => setVisualization(undefined, item.id)}
                                                            className="d-block color-dark-gray fw-bold fw-medium fs-5 mb-3"
                                                        >
                                                            {item.text}
                                                        </a>
                                                        {Object.entries(item.itemAnswers).map(([applicationAnswerId, answerGroupId]) => {
                                                            return Object.entries(answerGroupId).map(([answerGroupId, groupAnswers]) => {
                                                                return groupAnswers.map((groupAnswer) => {
                                                                    return (
                                                                        (selectedAnswer === undefined ||
                                                                            selectedAnswer === applicationAnswerId) && (
                                                                            <div
                                                                                key={'answer-' + applicationAnswerId}
                                                                                className="bg-white rounded-4 mb-3 p-2 px-3"
                                                                            >
                                                                                <p className="fw-medium fs-6 m-0 mb-1">
                                                                                    {answer.answers[applicationAnswerId].user.username +
                                                                                        ' - ' +
                                                                                        new Date(
                                                                                            answer.answers[applicationAnswerId].date
                                                                                        ).toLocaleDateString()}
                                                                                </p>
                                                                                {item.type === 'UPLOAD' ? (
                                                                                    <Gallery
                                                                                        className="mb-3"
                                                                                        item={{
                                                                                            files: groupAnswer.files.map((file) => ({
                                                                                                path: baseUrl + 'api/' + file.path,
                                                                                            })),
                                                                                        }}
                                                                                        galleryModalRef={galleryModalRef}
                                                                                    />
                                                                                ) : (
                                                                                    <p className="fw-medium fs-6 color-dark-gray m-0">
                                                                                        {groupAnswer.text}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    );
                                                                });
                                                            });
                                                        })}
                                                        {Object.entries(item.itemAnswers).length === 0 && item.itemOptions.length === 0 && (
                                                            <div className="bg-white rounded-4 mb-3 p-2 px-3">
                                                                <p className="fw-medium fs-6 color-dark-gray m-0">0 respostas</p>
                                                            </div>
                                                        )}
                                                        {item.itemOptions.map((option, index) => {
                                                            return (
                                                                <div
                                                                    key={'answer-' + option.id}
                                                                    className="bg-white rounded-4 mb-3 p-2 px-3"
                                                                >
                                                                    <p className="fw-medium fs-6 m-0 mb-1">
                                                                        {option.text +
                                                                            ' - ' +
                                                                            (selectedAnswer === undefined
                                                                                ? Object.keys(option.optionAnswers).length
                                                                                : option.optionAnswers[selectedAnswer] === undefined
                                                                                ? '0'
                                                                                : '1') +
                                                                            ' respostas'}
                                                                    </p>
                                                                    {Object.entries(option.optionAnswers).map(
                                                                        ([applicationAnswerId, answerGroupId]) => {
                                                                            return Object.entries(answerGroupId).map(
                                                                                ([answerGroupId, groupAnswers]) => {
                                                                                    return (
                                                                                        (selectedAnswer === undefined ||
                                                                                            selectedAnswer === applicationAnswerId) && (
                                                                                            <p
                                                                                                className="fw-medium fs-6 color-dark-gray m-0"
                                                                                                key={
                                                                                                    'answer-' +
                                                                                                    applicationAnswerId +
                                                                                                    '-' +
                                                                                                    answerGroupId
                                                                                                }
                                                                                            >
                                                                                                {answer.answers[applicationAnswerId].user
                                                                                                    .username +
                                                                                                    ' (' +
                                                                                                    new Date(
                                                                                                        answer.answers[
                                                                                                            applicationAnswerId
                                                                                                        ].date
                                                                                                    ).toLocaleDateString() +
                                                                                                    '); '}
                                                                                            </p>
                                                                                        )
                                                                                    );
                                                                                }
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        {item.itemOptions.length > 0 &&
                                                            selectedAnswer === undefined &&
                                                            sumOptionAnswers(item.itemOptions) > 0 && (
                                                                <div className="rounded-4 overflow-hidden mb-3">
                                                                    <Chart
                                                                        chartType="PieChart"
                                                                        data={[['Resposta', 'Quantidade']].concat(
                                                                            item.itemOptions.map((io) => {
                                                                                return [io.text, Object.keys(io.optionAnswers).length];
                                                                            })
                                                                        )}
                                                                        options={{
                                                                            chartArea: { top: 8, height: '90%', width: '90%' },
                                                                            legend: { position: 'bottom' },
                                                                            colors: [
                                                                                '#F59489',
                                                                                '#91CAD6',
                                                                                '#FECF86',
                                                                                '#4E9BB9',
                                                                                '#EC6571',
                                                                                '#AAD390',
                                                                                '#8C6A80',
                                                                                '#70A6A6',
                                                                                '#FACD63',
                                                                                '#578AA2',
                                                                                '#E64E5E',
                                                                                '#91BD7E',
                                                                                '#F9A98F',
                                                                                '#76C4D1',
                                                                                '#FEDB8A',
                                                                                '#5C97B2',
                                                                                '#D85A6A',
                                                                                '#89A86B',
                                                                                '#F7BC92',
                                                                                '#6FACB5',
                                                                                '#E14953',
                                                                                '#A1C588',
                                                                                '#F5D39A',
                                                                                '#568BA5',
                                                                                '#C44D59',
                                                                                '#7FA569',
                                                                                '#E6A17C',
                                                                                '#619BB0',
                                                                                '#F39C9F',
                                                                                '#ADC192',
                                                                                '#FFD07D',
                                                                                '#5499AE',
                                                                                '#E6606F',
                                                                                '#97BD83',
                                                                                '#F6C2A3',
                                                                                '#6BA3B8',
                                                                                '#E15661',
                                                                                '#90B67A',
                                                                                '#F7AE9C',
                                                                                '#75BFCB',
                                                                                '#E6737D',
                                                                                '#A2CA93',
                                                                                '#FAD4AC',
                                                                                '#639FB7',
                                                                                '#D45B66',
                                                                                '#83AB77',
                                                                                '#F9B69B',
                                                                                '#71B4C6',
                                                                                '#E75762',
                                                                                '#A8C599',
                                                                            ],
                                                                            is3D: true,
                                                                        }}
                                                                        height={'400px'}
                                                                    />
                                                                </div>
                                                            )}
                                                    </div>
                                                )
                                            );
                                        });
                                    });
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="AnswerPageAlert" ref={modalRef} />
            <GalleryModal id="ProtocolPageGallery" ref={galleryModalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AnswerPage;
