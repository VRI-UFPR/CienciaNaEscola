import { React, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import TextButton from '../../TextButton';

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
    const { item, galleryRef } = props;
    const [ImageVisibility, setImageVisibility] = useState(false);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

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

            {item.files.length > 0 && galleryRef && (
                <div className="row justify-content-center m-0 pt-3">
                    {item.files.slice(0, ImageVisibility ? item.files.length : 3).map((image, index) => {
                        return (
                            <div
                                key={'image-' + image.id}
                                className={`col-${item.files.length > 3 ? 4 : 12 / item.files.length} m-0 px-1 px-lg-2 ${
                                    index > 2 && 'mt-2'
                                }`}
                            >
                                <div
                                    className={`${
                                        item.files.length > 1 && 'ratio ratio-1x1'
                                    } border border-light-subtle rounded-4 overflow-hidden`}
                                    onClick={() => galleryRef.current.showModal({ images: item.files, currentImage: index })}
                                >
                                    <img src={image.path} className="img-fluid object-fit-contain" alt="Responsive" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {item.files.length > 3 && (
                <div className="row justify-content-center m-0 pt-3">
                    <TextButton
                        className="fs-6 w-auto p-2 py-0"
                        hsl={[190, 46, 70]}
                        text={`Ver ${ImageVisibility ? 'menos' : 'mais'}`}
                        onClick={toggleImageVisibility}
                    />
                </div>
            )}

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
