import { React } from 'react';
import Markdown from 'markdown-to-jsx';
import Gallery from '../../Gallery';

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

    .img-markdown {
        max-width: 100%;
        height: auto;
    }
`;

function TextImageInput(props) {
    const { item, galleryModalRef } = props;

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0">
                <Markdown
                    options={{
                        overrides: {
                            img: {
                                props: {
                                    className: 'img-markdown',
                                },
                            },
                        },
                    }}
                    className="form-label color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0"
                >
                    {item.text}
                </Markdown>
            </div>

            <Gallery item={item} galleryModalRef={galleryModalRef} />

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
