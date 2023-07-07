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

/*
  • Types:
  • 0: Caixa de texto;
  • 1: Múltipla escolha;
  • 2: Escolha simples;
  • 3: Lista suspensa;
*/
function jsonToCsv(items) {
    let header = [],
        answers = [],
        mAnswer = [],
        answersNumber = [];
    let headerString, mAnswerString;

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
        answersNumber = [];
        answersNumber = Object.keys(items[i].inputAnswers);
        // Percorre todas as perguntas para verificar se existem respostas
        for (let j = 0; j < items[i].form.inputs.length; j++) {
            // Se existir resposta, trata de acordo com o tipo da pergunta
            if (answersNumber.find((findId) => findId == items[i].form.inputs[j].id) != undefined) {
                // Os tipos estão definidos na descrição dessa função
                switch (items[i].form.inputs[j].type) {
                    case 0:
                        answers[i].push(String(Object(items[i].inputAnswers[items[i].form.inputs[j].id][0].value)));
                        break;

                    case 1:
                        for (let k = 0; k < Object(items[i].inputAnswers[items[i].form.inputs[j].id]).length; k++) {
                            if (Object(items[i].inputAnswers[items[i].form.inputs[j].id][k].value) == 'true') {
                                mAnswer.push(String(items[i].form.inputs[j].sugestions[k].value));
                            }
                        }
                        mAnswerString = mAnswer.join(',');
                        answers[i].push(String(mAnswerString));
                        mAnswer = [];
                        mAnswerString = null;
                        break;

                    case 2:
                        for (let k = 0; k < Object(items[i].inputAnswers[items[i].form.inputs[j].id]).length; k++) {
                            if (Object(items[i].inputAnswers[items[i].form.inputs[j].id][k].value) == 'true') {
                                answers[i].push(String(items[i].form.inputs[j].sugestions[k].value));
                            }
                        }
                        break;

                    case 3:
                        for (let k = 0; k < Object(items[i].inputAnswers[items[i].form.inputs[j].id]).length; k++) {
                            if (Object(items[i].inputAnswers[items[i].form.inputs[j].id][k].value) == 'true') {
                                answers[i].push(String(items[i].form.inputs[j].sugestions[k].value));
                            }
                        }
                        break;

                    default:
                        break;
                }
            } else {
                // Se não encontrou resposta para determinada pergunta, insere a mensagem abaixo no lugar
                answers[i].push(String('Answer not found'));
            }
        }
    }

    // Mais tratamentos para exportar corretamente
    for (let i = 0; i < answers.length; i++) {
        answers[i][0] = '"' + answers[i][0];
        answers[i][items[0].form.inputs.length - 1] = answers[i][items[0].form.inputs.length - 1] + '"';
        answers[i] = answers[i].join('","');
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
