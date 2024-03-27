import { React } from 'react';
import Gallery from '../../Gallery';
import MarkdownText from '../../MarkdownText';

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
    const { item, galleryModalRef } = props;

    return (
        <div className="rounded-4 shadow bg-white p-3 pb-0">
            <div className="row m-0">
                <MarkdownText text={item.text} />
            </div>

            <Gallery className="mb-3" item={item} galleryModalRef={galleryModalRef} />

            <style>{styles}</style>
        </div>
    );
}

export default TextImageInput;
