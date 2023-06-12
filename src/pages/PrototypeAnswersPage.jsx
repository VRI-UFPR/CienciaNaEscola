import { React, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';

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

function jsonToCsv(items) {
    let header = [],
        answers = [],
        inputNums = [];
    let headerString;

    // Armazena todas as perguntas no vetor 'header'
    for (let i = 0; i < items[0].form.inputs.length; i++) {
        header.push(String(items[0].form.inputs[i].question));
    }
    // Tratamentos para exportar corretamente
    header[0] = '"' + header[0];
    header[items[0].form.inputs.length - 1] = header[items[0].form.inputs.length - 1] + '"';

    // Coloca tudo como uma string única dividindo as perguntas com o divisor de colunas do csv: ','
    headerString = header.join('","');

    // Armazena as respostas
    // Primeiro for percorre todas as respostas
    for (let i = 0; i < items.length; i++) {
        answers[i] = [];
        inputNums = Object.keys(items[i].inputAnswers);
        // Segundo for percorre todas as perguntas dentro de uma resposta
        for (let j = 0; j < Object.keys(items[i].inputAnswers).length; j++) {
            if (Object(items[i].inputAnswers[inputNums[j]]).length > 1) {
                // Terceiro for serve para buscar a resposta verdadeira nos casos em que há mais de uma opção de resposta
                for (let k = 0; k < Object(items[i].inputAnswers[inputNums[j]]).length; k++) {
                    if (Object(items[i].inputAnswers[inputNums[j]][k].value) == 'true') {
                        answers[i].push(String('placement: ' + k));
                    }
                }
            } else {
                answers[i].push(String(Object(items[i].inputAnswers[inputNums[j]][0].value)));
            }
        }

        // Mais tratamentos para exportar corretamente
        answers[i][0] = '"' + answers[i][0];
        if (answers[i][Object.keys(items[i].inputAnswers).length - 1] !== undefined) {
            answers[i][Object.keys(items[i].inputAnswers).length - 1] = answers[i][Object.keys(items[i].inputAnswers).length - 1] + '"';
        } else {
            answers[i][Object.keys(items[i].inputAnswers).length - 1] = '"';
        }
        answers[i] = answers[i].join('","');
        inputNums = [];
    }

    // Armazena tudo em uma única String
    const csv = [headerString, ...answers].join('\r\n');

    // Fim
    return csv;
}

function createFile(user, id) {
    let obj, csv;

    axios
        .get(`https://genforms.c3sl.ufpr.br/api/answer/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
        .then((response) => {
            obj = response.data;
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
        });
}

function PrototypeAnswersPage(props) {
    const { user } = useContext(AuthContext);
    const { id } = useParams();

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
                        <TextButton type="submit" hsl={[37, 98, 76]} text="Respostas" onClick={() => createFile(user, id)} />
                    </div>
                </div>
            </div>
            <style>{PrototypeAnswersStyles}</style>
        </div>
    );
}

export default PrototypeAnswersPage;
