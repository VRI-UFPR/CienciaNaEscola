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

export const teamMembers = (
    <>
        <p className="mb-4">Clara Drimel</p>
        <p className="mb-4">Daniel Lins</p>
        <p className="mb-4">Eduarda de Aguiar Freitas</p>
        <p className="mb-4">Eduardo Mathias de Souza</p>
        <p className="mb-4">Eloisa Nielsen</p>
        <p className="mb-4">Guilherme Stonoga Tedardi</p>
        <p className="mb-4">Izalorran Bonaldi</p>
        <p className="mb-4">João Armênio</p>
        <p className="mb-4">Juliana Zambon</p>
        <p className="mb-4">Matheus Piovesan</p>
        <p className="mb-4">Tiago Mendes Bottamedi</p>
        <p className="mb-4">Yuri Tobias</p>
    </>
);
