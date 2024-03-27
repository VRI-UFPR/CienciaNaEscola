import { React, useEffect, useState } from 'react';
import TextButton from '../../TextButton';
import MarkdownText from '../../MarkdownText';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-dark-grey {
        color: #787878;
    }

    .color-dark-gray {
        color: #535353;
    }

    .simple-text-input {
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }
`;

function SimpleTextInput(props) {
    const [text, setText] = useState(['']);
    const { onAnswerChange, item, group, galleryRef } = props;
    const [ImageVisibility, setImageVisibility] = useState(false);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    useEffect(() => {
        onAnswerChange(group, item.id, 'ITEM', text);
    }, [text, item.id, onAnswerChange, group]);

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0">
                <MarkdownText text={item.text} />
            </div>

            {item.files.length > 0 && galleryRef && (
                <div className="row justify-content-center m-0 mb-3">
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
                <div className="row justify-content-center m-0 mb-3">
                    <TextButton
                        className="fs-6 w-auto p-2 py-0"
                        hsl={[190, 46, 70]}
                        text={`Ver ${ImageVisibility ? 'menos' : 'mais'}`}
                        onClick={toggleImageVisibility}
                    />
                </div>
            )}

            <input
                type={item.type === 'number' ? 'number' : 'text'}
                className="simple-text-input form-control rounded-0 shadow-none bg-dark-grey font-barlow fw-medium fs-6 mb-3 p-0"
                id="simpletextinput"
                placeholder="Digite sua resposta aqui"
                onChange={(e) => setText(e.target.value)}
                //value={answer ? answer[0].value : text}
                //disabled={answer !== undefined}
            ></input>
            <style>{styles}</style>
        </div>
    );
}

export default SimpleTextInput;
