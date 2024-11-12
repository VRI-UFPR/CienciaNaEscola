/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState } from 'react';
import TextButton from './TextButton';
import baseUrl from '../contexts/RouteContext.js';

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
        <div className={(item.files.length > 0 && galleryModalRef && className) || undefined}>
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
                                    <img
                                        src={baseUrl + 'api/' + image.path}
                                        className="img-fluid object-fit-contain w-100"
                                        alt="Responsive"
                                    />
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
