import { React, useState } from 'react';
import TextButton from './TextButton';

const galleryStyles = `
    .img-gallery{
        max-height: 200px;
    }
`;

function Gallery(props) {
    const { item, galleryModalRef, className } = props;
    const [ImageVisibility, setImageVisibility] = useState(false);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    return (
        <div className={item.files.length > 0 && galleryModalRef && className}>
            {item.files.length > 0 && galleryModalRef && (
                <div className="row justify-content-center m-0">
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
                                    } img-gallery d-flex justify-content-center border border-light-subtle rounded-4 overflow-hidden`}
                                    onClick={() => galleryModalRef.current.showModal({ images: item.files, currentImage: index })}
                                >
                                    <img src={image.path} className="img-fluid object-fit-contain w-100" alt="Responsive" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {item.files.length > 3 && (
                <div className="row justify-content-center m-0 mt-3">
                    <TextButton
                        className="fs-6 w-auto p-2 py-0"
                        hsl={[190, 46, 70]}
                        text={`Ver ${ImageVisibility ? 'menos' : 'mais'}`}
                        onClick={toggleImageVisibility}
                    />
                </div>
            )}
            <style>{galleryStyles}</style>
        </div>
    );
}

export default Gallery;
