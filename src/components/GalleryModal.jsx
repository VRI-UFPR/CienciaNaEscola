/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Modal, Carousel } from 'bootstrap';
import RoundedButton from './RoundedButton';

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

/**
 * Componente de Modal de Galeria.
 * @param {Object} props - As propriedades do componente.
 * @param {React.Ref} ref - Referência do modal para manipulação externa.
*/
const GalleryModal = forwardRef((props, ref) => {
    const [modal, setModal] = useState({ id: 'Gallery', currentImage: 0, images: [] });

    /**
     * Manipula a mudança de slide.
     * @param {Event} event - O evento de mudança de slide.
    */
    const handleSlide = useCallback((event) => {
        const targetId = event.to;
        setModal((prevModal) => {
            return {
                ...prevModal,
                currentImage: targetId,
            };
        });
    }, []);

    /**
     * Exibe o modal com as imagens fornecidas.
     * @param {Object} modalData - Dados do modal contendo as imagens e índice inicial.
     * @param {number} modalData.currentImage - Índice da imagem atual.
     * @param {Array} modalData.images - Lista de URLs das imagens.
    */
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
            carousel.addEventListener('slid.bs.carousel', handleSlide);
            Carousel.getOrCreateInstance(carousel).to(modalData.currentImage);
        }
    };

    /** Oculta o modal e remove o evento de slide. */
    const hideModal = () => {
        document.getElementById(modal.id + '-carousel').removeEventListener('slid.bs.carousel', handleSlide);
        Modal.getInstance(document.getElementById(modal.id)).hide();
    };

    /** Expondo a função showModal para ser acessada externamente via ref. */
    useImperativeHandle(ref, () => ({
        showModal,
    }));

    return (
        <div className="modal fade" id={modal.id} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-4 h-75">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title font-century-gothic color-dark-gray text-center fs-3 fw-bold">
                            Figura {modal.currentImage + 1}
                        </h5>
                        <RoundedButton hsl={[355, 78, 66]} icon="close" onClick={hideModal} className="text-white" />
                    </div>

                    <div className="modal-body">
                        <div id={modal.id + '-carousel'} className="carousel carousel-dark slide d-flex h-100 w-100">
                            <div className="carousel-inner">
                                {modal.images.map((image, index) => {
                                    return (
                                        <div
                                            className={`carousel-item h-100 w-100 ${modal.currentImage === index && 'd-flex active'}`}
                                            key={`gallery-img-${image.id}`}
                                        >
                                            <div className="d-flex justify-content-center align-items-center rounded-4 h-100 w-100 p-0 m-0">
                                                <img
                                                    src={process.env.REACT_APP_API_URL + 'api/' + image.path}
                                                    className="w-auto h-auto mh-100 mw-100 object-fit-contain rounded-4"
                                                    alt={'Figura' + index + 1}
                                                ></img>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {modal.images.length > 1 && (
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target={'#' + modal.id + '-carousel'}
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                            )}

                            {modal.images.length > 1 && (
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target={'#' + modal.id + '-carousel'}
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {modal.images[modal.currentImage]?.description && (
                        <div className="modal-footer d-flex justify-content-center">
                            <p className="text-center color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0">
                                {modal.images[modal.currentImage]?.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <style>{GalleryModalStyles}</style>
        </div>
    );
});

export default GalleryModal;
