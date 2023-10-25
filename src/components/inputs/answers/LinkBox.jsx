import { React } from 'react';
import { Link } from 'react-router-dom';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    .bg-coral-red{
        background-color: #F59489;
    }
`;

function LinkBox(props) {
    const { input } = props;

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden w-100 p-0">
            <div className="w-100 pb-3 bg-coral-red"></div>
            <div className="p-3 pt-2">
                <Link className="font-barlow fw-medium fs-6 lh-sm m-0 p-0" to={input.description}>
                    {input.question}
                </Link>
            </div>

            <style>{styles}</style>
        </div>
    );
}

LinkBox.defaultProps = {
    input: {
        question: 'PICCE - SITE',
        description: 'https://picce.ufpr.br/',
    },
};

export default LinkBox;
