/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import logoVRI from '../assets/images/logoVRI.png';

export const defaultNewInput = (type, tempId, placement) => {
    return {
        tempId: tempId,
        placement: placement,
        text: '',
        description: '',
        type: type,
        enabled: true,
        itemOptions: [],
        files: [],
        itemValidations:
            type === 'RANGE'
                ? [
                      { type: 'MIN', argument: '' },
                      { type: 'MAX', argument: '' },
                      { type: 'STEP', argument: '' },
                  ]
                : [],
    };
};

export const defaultNewValidation = () => ({
    type: '',
    argument: '',
    customMessage: '',
    tempId: Math.floor(Date.now() + Math.random() * 1000),
});

export const defaultNewDependency = () => ({
    type: '',
    argument: '',
    itemTempId: '',
    customMessage: '',
    tempId: Math.floor(Date.now() + Math.random() * 1000),
});

export const defaultNewItemGroup = (type, newPlacement) => ({
    type: type,
    isRepeatable: false,
    items: [],
    dependencies: [],
    tableColumns: [],
    placement: newPlacement,
    tempId: Math.floor(Date.now() + Math.random() * 1000),
});

export const defaultNewPage = (newPlacement) => ({
    type: 'ITEMS',
    itemGroups: [],
    dependencies: [],
    placement: newPlacement,
    tempId: Math.floor(Date.now() + Math.random() * 1000),
});

export const defaultNewProtocol = () => ({
    title: '',
    description: '',
    enabled: true,
    visibility: 'PUBLIC',
    applicability: 'PUBLIC',
    answersVisibility: 'PUBLIC',
    replicable: true,
    viewersUser: [],
    viewersClassroom: [],
    answersViewersUser: [],
    answersViewersClassroom: [],
    appliers: [],
    pages: [],
});

export const version = '2.0.159 (2bc6ade)';

export const aboutPICCE = `
## Sobre o PICCE
### Missão

A missão do PICCE é promover a construção da Ciência Cidadã nas escolas da rede de ensino do estado do Paraná por meio de um processo formativo, pautado em metodologias de ensino e aprendizagem sempre aliadas à inovação e ao pensamento crítico. Para isso, conta com o desenvolvimento de uma estratégia educacional cujo alicerce é a aliança entre a Base Nacional Comum Curricular (BNCC), os pressupostos da Ciência Cidadã e a integração entre instituições de ensino de nível federal e estadual com a Secretaria Estadual de Ensino.

### Visão

A partir de suas ações, o PICCE busca transformar o ensino de Ciências nas escolas paranaenses, ao ressignificar conceitos e práticas, bem como ao exercitar novas formas de apropriação da comunidade a partir do conhecimento científico. A longo prazo, o objetivo é que o Programa expanda suas atividades para todo o país, criando uma rede nacional de Ciência Cidadã.

### Valores

O PICCE considera estudantes e professores como co-produtores de conhecimentos científicos, e para contribuir com a inovação cidadã, estimula o aprendizado conjunto, por meio de infraestrutura compartilhada. Para tanto, está baseado em três pilares:

### Ciência Aberta

É a prática de fazer ciência de modo colaborativo. Ou seja, os dados das pesquisas e outros processos estão disponíveis livremente, podem ser reutilizados, distribuídos e reproduzidos por outros pesquisadores e pela sociedade em geral. A Ciência Aberta permite aumentar o conhecimento público da ciência e também contribui para que os pesquisadores ampliem sua produção e possam buscar mais investimentos em ciência e tecnologia. Pensando no livre acesso à informação, também busca ampliar a divulgação científica, possibilitando a visibilidade e o reconhecimento dos investigadores e das instituições, a promoção da responsabilidade social científica, a apropriação social do conhecimento, a transparência do processo científico e a democratização do acesso ao conhecimento científico.

### Ciência Cidadã

A Ciência Cidadã integra o movimento de Ciência Aberta. Seu aspecto central é a pluralidade de atores sociais, que vivenciam diferentes dinâmicas de experimentação da ciência e contribuem para um aprendizado coletivo, contextualizado para cada realidade e com foco na inovação. Sua proposta fundamental é que os estudantes sejam cidadãos cientistas, participando em várias etapas do processo científico, desde o desenvolvimento de uma questão científica, passando pela escolha da abordagem utilizada, a coleta e análise dos dados, até chegar na comunicação dos resultados.

### Ciência Cidadã na Escola

Os princípios da Ciência Cidadã podem e devem ser aplicados diretamente à educação básica. Os professores da rede de ensino municipal e estadual são responsáveis por mostrar aos estudantes que a ciência está além do que é aprendido em sala de aula e anda ao lado da cidadania. Desta forma, as crianças e os adolescentes entendem desde cedo que a experimentação científica pode ser usada para entender o contexto onde estão inseridas e, a partir das suas descobertas, propor formas de mudar a sua realidade.

## Equipe de Desenvolvimento do Aplicativo

Este projeto conta com a colaboração de pesquisadores e estudantes do [Laboratório de Visão, Robótica e Imagem (VRI)](https://web.inf.ufpr.br/vri/) do Departamento de Informática (DInf) da UFPR, incluindo:

- Prof. Dr. Eduardo Todt (orientador)
- Ana de Vasconcelos Oporto  
- Clara Drimel  
- Daniel Lins  
- Eduarda de Aguiar Freitas  
- Eduardo Mathias de Souza  
- Eloisa Nielsen  
- Guilherme Stonoga Tedardi  
- Izalorran Bonaldi  
- João Armênio  
- José Guilherme de Oliveira Pedroso  
- Juliana Zambon  
- Matheus Moraes Piovesan  
- Tiago Mendes Bottamedi  
- Yuri Junqueira Tobias  

<div className="row w-25"><img src="${logoVRI}" alt="Logo do VRI" /></div>

Versão do aplicativo: ${version}
`;

export const terms =
    '### Disposições Gerais:\nIdentificação das partes envolvidas: Universidade Federal do Paraná e o usuário do aplicativo. Estes termos de uso regem o uso do aplicativo em tela. O usuário concorda em cumprir os termos ao utilizar o aplicativo.\n\n### Responsabilidade Limitada:\nOs autores do aplicativo não são responsáveis por danos diretos, indiretos, incidentais, consequenciais, especiais ou punitivos decorrentes do uso ou impossibilidade de uso do aplicativo. Os autores não são responsáveis por qualquer conteúdo gerado pelo usuário ou por terceiros. Os autores não garantem a precisão, integridade, atualidade ou utilidade de qualquer conteúdo fornecido pelo aplicativo.\n\n### Isenção de Garantias:\nO aplicativo é fornecido "no estado em que se encontra", sem garantias de qualquer tipo, expressas ou implícitas. Os autores não garantem que o aplicativo seja livre de erros ou que funcionará sem interrupções.\n\n### Disposições Adicionais:\nDisputas eventuais serão resolvidas exclusivamente no forum de Curitiba - PR.\n\n### Atualizações e Revisões:\nOs termos de uso podem ser atualizados periodicamente. O usuário concorda em ficar vinculado às versões mais recentes.';

export const brazilianStates = [
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins',
];
