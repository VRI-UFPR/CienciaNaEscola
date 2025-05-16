/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { Link } from 'react-router-dom';
import { Carousel } from 'bootstrap';
import { useEffect, useState, useRef } from 'react';

import HomeButton from './HomeButton';

const style = `
    .custom-carousel {
        background-color: #FECF86B2;
    }

    .carousel-link {
        height: 7rem;
        max-height: 7rem;
        color: #262626;
    }
        
    .carousel-indicator {
        background-color: #9F9F9F !important;
    }
      
    .carousel-indicator.active {
        background-color: #5C5C5C !important;
    }

    ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
`;

/**
 * Componente de carrossel dinâmico para exibir itens de protocolo.
 * @param {Object} props - Propriedades do componente.
 * @param {Array} props.listItems - Lista de itens para exibição no carrossel.
*/
function ProtocolCarousel(props) {
    const { listItems } = props;

    const carouselRef = useRef(null);

    /** Calcula o número de itens por slide baseado na altura da tela. */
    const itemsPerSlide = Math.round((window.screen.height - 300) / 120);
    const totalSlides = Math.ceil(listItems.length / itemsPerSlide);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const carousel = carouselRef.current;
        new Carousel(carousel);
    }, []);

    /** Renderiza os itens do carrossel, dividindo-os em slides conforme o número de itens por slide. */
    const renderCarouselItems = () => {
        const carouselItems = [];

        for (let i = 0; i < totalSlides; i++) {
            const startIndex = i * itemsPerSlide;
            const endIndex = (i + 1) * itemsPerSlide;
            const slideItems = listItems.slice(startIndex, endIndex);

            carouselItems.push(
                <div key={i} className={`carousel-item ${i === 0 ? ' active' : ''} h-100 px-4`}>
                    <div className="d-flex flex-column align-items-center h-100">
                        {slideItems.map((si) => (
                            <Link
                                to={`${si.id}`}
                                key={'slide-item-' + si.id}
                                className="carousel-link d-flex flex-column align-items-center text-decoration-none w-100 pb-3"
                            >
                                <HomeButton title={si.title} />
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }

        return carouselItems;
    };

    /** Renderiza os indicadores de página do carrossel. */
    const renderPageIndicators = () => {
        const indicators = [];

        for (let i = 0; i < totalSlides; i++) {
            indicators.push(
                <button
                    key={i}
                    type="button"
                    className={`carousel-indicator ${i === currentPage ? ' active' : ''} rounded-circle border-5 mx-1`}
                    data-bs-target="#dynamic-carousel"
                    data-bs-slide-to={i}
                    onClick={() => setCurrentPage(i)}
                    style={{
                        width: '0.7rem',
                        height: '0.7rem',
                    }}
                ></button>
            );
        }

        return indicators;
    };

    return (
        <div
            id="dynamic-carousel"
            className="custom-carousel d-flex flex-column flex-grow-1 carousel slide overflow-scroll rounded-4 w-100 m-0 p-0 px-lg-5 py-4"
            ref={carouselRef}
        >
            <div className="carousel-inner h-100 px-1">{renderCarouselItems()}</div>
            <div className="carousel-indicators position-relative m-0 mt-2">{renderPageIndicators()}</div>
            <style>{style}</style>
        </div>
    );
}

export default ProtocolCarousel;
