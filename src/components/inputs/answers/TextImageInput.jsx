import { React } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9
    }

    .color-dark-gray {
        color: #535353;
    }
`;

function TextImageInput(props) {
    const { input } = props;

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0 pb-3">
                <p className="form-label color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0">{input.question}</p>
            </div>

            <div className="ratio ratio-1x1 bg-grey rounded-4 overflow-hidden">
                <img className="img-fluid object-fit-contain" src={input.description} alt="Imagem" />
            </div>

            <style>{styles}</style>
        </div>
    );
}

TextImageInput.defaultProps = {
    input: {
        question: 'Pergunta',
        description: 'https://picsum.photos/1300/1300?random=1',
    },
};

export default TextImageInput;
