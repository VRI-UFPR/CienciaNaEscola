import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Modal, Carousel } from 'bootstrap';
import RoundedButton from './RoundedButton';
import iconExit from '../assets/images/ExitSidebarIcon.svg';

const GalleryModalStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9;
    }

    .color-dark-gray{
        color: #535353;
    }
`;

const GalleryModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState(props);

    const handleSlide = useCallback((event) => {
        const targetId = event.to;
        setModal((prevModal) => {
            return {
                ...prevModal,
                currentImage: targetId,
            };
        });
    }, []);

    const showModal = (modalData) => {
        if (modalData) {
            const alert = document.getElementById(modal.id);

            setModal({
                id: modal.id,
                currentImage: modalData.currentImage || modal.currentImage,
                images: modalData.images || modal.images,
            });

            Modal.getOrCreateInstance(alert).show();

            const carousel = document.getElementById(modal.id + '-carousel');
            carousel.addEventListener('slide.bs.carousel', handleSlide);
            Carousel.getOrCreateInstance(carousel).to(modalData.currentImage);
        }
    };

    const hideModal = () => {
        document.getElementById(modal.id + '-carousel').removeEventListener('slide.bs.carousel', handleSlide);
        Modal.getInstance(document.getElementById(modal.id)).hide();
    };

    useImperativeHandle(ref, () => ({
        showModal,
    }));

    return (
        <div className="modal fade" id={modal.id} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4">
                    <div className="modal-header">
                        <h5 className="modal-title font-century-gothic color-dark-gray text-center text-nowrap fs-3 fw-bold">
                            Figura {modal.currentImage + 1}
                        </h5>
                        <div className="container d-flex flex-column align-items-end ">
                            <RoundedButton hsl={[355, 78, 66]} icon={iconExit} onClick={hideModal}/>
                        </div>
                    </div>

                    <div className="modal-body">
                        <div id={modal.id + '-carousel'} className="carousel slide">
                            <div className="carousel-inner">
                                {modal.images.map((image, index) => {
                                    return (
                                        <div
                                            className={`carousel-item ${modal.currentImage === index && 'active'}`}
                                            key={`gallery-img-${image.id}`}
                                        >
                                            <img src={image.path} className="d-block rounded-4 w-100" alt={'Figura' + index + 1}></img>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target={'#' + modal.id + '-carousel'}
                                data-bs-slide="prev"
                            >
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target={'#' + modal.id + '-carousel'}
                                data-bs-slide="next"
                            >
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{GalleryModalStyles}</style>
        </div>
    );
});

GalleryModal.defaultProps = {
    id: 'Gallery',
    currentImage: 0,
    images: [],
};

export default GalleryModal;
