import { React } from 'react';
import MarkdownText from './MarkdownText';

const protocolInfoStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-gray {
        color: #787878;
    }   

    .bg-coral-red{
        background-color: #F59489;
    }

    .img-markdown {
        max-width: 100%;
        height: auto;
    }
`;

function ProtocolInfo(props) {
    const { title, description } = props;

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden w-100 p-0">
            <div className="w-100 pb-3 bg-coral-red"></div>
            <div className="p-3 pb-0">
                <h1 className="color-dark-gray font-barlow text-break fw-bold fs-5 m-0 p-0 mb-3">{title}</h1>
                <MarkdownText text={description} />
            </div>

            <style>{protocolInfoStyles}</style>
        </div>
    );
}

export default ProtocolInfo;
