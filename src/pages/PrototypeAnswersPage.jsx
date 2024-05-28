import { React, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import baseUrl from '../contexts/RouteContext';
import Alert from '../components/Alert';

const PrototypeAnswersStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey{
        color: #535353;
    }
`;

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
                                userAnswers[j + 1] = userAnswers[j + 1] + ' | ' + String(items[j].itemOptions[k].text).replace(/\n/g, ' ');
                            else userAnswers[j + 1] = String(items[j].itemOptions[k].text).replace(/\n/g, ' ');
                    }
                    break;

                case 'UPLOAD':
                    userAnswers[j + 1] = baseUrl.concat(String(items[j].itemAnswers[ansIds[i]][ansIds[i]][0].files[0].path));
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

const createFile = (user, id, modalRef) => {
    let obj, csv;

    axios
        .get(baseUrl + `api/applicationAnswer/getApplicationWithAnswers/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
        .then((response) => {
            obj = response.data;
            if (Object.keys(obj.data.answers).length > 0) {
                csv = jsonToCsv(obj.data);

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
                modalRef.current.showModal({ title: 'O seguinte protocolo não possui respostas: ' + obj.data.protocol.title });
            }
        });
};

function PrototypeAnswersPage(props) {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const modalRef = useRef(null);

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar showNavTogglerDesktop={false} />
            <div className="container-fluid d-flex flex-column flex-grow-1 font-barlow p-4 p-lg-5">
                <div className="row m-0">
                    <div className="col-12 col-lg-4 p-0 mb-3 mb-lg-0">
                        <h1 className="font-century-gothic color-grey fs-3 fw-bold p-0 m-0">Resposta dos formulários</h1>
                    </div>
                    <div className="col-0 col-lg-4 p-0"></div>
                    <div className="col-12 col-lg-4 p-0 mb-3 mb-lg-0 ps-lg-2">
                        <TextButton type="submit" hsl={[37, 98, 76]} text="Respostas" onClick={() => createFile(user, id, modalRef)} />
                    </div>
                </div>
            </div>
            <Alert id="PrototypeAnswerPage" ref={modalRef} />
            <style>{PrototypeAnswersStyles}</style>
        </div>
    );
}

export default PrototypeAnswersPage;
