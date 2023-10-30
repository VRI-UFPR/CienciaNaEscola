export const defaultInputs = [
    {
        description: 'date',
        question: 'date',
        type: 0,
        validation: [],
        sugestions: [],
        subForm: null,
        id: null,
    },
    {
        description: 'time',
        question: 'time',
        type: 0,
        validation: [],
        sugestions: [],
        subForm: null,
        id: null,
    },
    {
        description: 'location',
        question: 'location',
        type: 0,
        validation: [],
        sugestions: [],
        subForm: null,
        id: null,
    },
];

export const defaultNewInput = (type) => {
    return {
        description: '',
        question: '',
        type: type,
        validation: [
            {
                type: 'required',
                value: false,
            },
        ],
        sugestions: [],
        inputId: null,
        id: null,
    };
};

export const aboutPICCE = (
    <>
        Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute
        iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
        tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit
        laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem
        ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrum exercitationem ullam corporis.
    </>
);

export const terms = (
    <>
        Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute
        iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
        tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit
        laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem
        ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrum exercitationem ullam corporis.    
    </>
);

const styles = `
    .mb-2-5 {
        margin-bottom: 12px !important;
    }
`;

export const teamMembers = (
    <>
        <p className="mb-2-5">Ana de Vasconcelos Oporto</p>
        <p className="mb-2-5">Clara Drimel</p>
        <p className="mb-2-5">Daniel Lins</p>
        <p className="mb-2-5">Eduarda de Aguiar Freitas</p>
        <p className="mb-2-5">Eduardo Mathias de Souza</p>
        <p className="mb-2-5">Eloisa Nielsen</p>
        <p className="mb-2-5">Guilherme Stonoga Tedardi</p>
        <p className="mb-2-5">Izalorran Bonaldi</p>
        <p className="mb-2-5">João Armênio</p>
        <p className="mb-2-5">José Guilherme de Oliveira Pedroso</p>
        <p className="mb-2-5">Juliana Zambon</p>
        <p className="mb-2-5">Matheus Moraes Piovesan</p>
        <p className="mb-2-5">Tiago Mendes Bottamedi</p>
        <p className="mb-2-5">Yuri Junqueira Tobias</p>
        <style>{styles}</style>
    </>
);
