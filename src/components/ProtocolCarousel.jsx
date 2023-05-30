import React from 'react'
import HomeButton from './HomeButton';
import { Carousel } from 'bootstrap';
import { useEffect, useRef } from 'react';

const style = `
    .custom-carousel {
        background-color: #FECF86;
        border-radius: 15px;
        width: 100%;
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
`;

function ProtocolCarousel(props) {
    const { buttons } = props;

    const calculateItemsPerSlide = () => {
        const carousel = carouselRef.current;
        const carouselWidth = carousel.offsetWidth;
        console.log(carouselWidth);
        const buttonWidth = 60;
        const itemsPerSlide = Math.floor(carouselWidth / buttonWidth);
        return itemsPerSlide;
    };

    const itemsPerSlide = 5;
    const totalSlides = Math.ceil(buttons.length / itemsPerSlide);

    const carouselRef = React.useRef(null);

    React.useEffect(() => {
        const carousel = carouselRef.current;
        new Carousel(carousel);
    }, []);

    const renderCarouselItems = () => {
        const carouselItems = [];

        for (let i = 0; i < totalSlides; i++) {
            const startIndex = i * itemsPerSlide;
            const endIndex = (i + 1) * itemsPerSlide;
            const slideButtons = buttons.slice(startIndex, endIndex);

            carouselItems.push(
            <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                <div className="d-flex flex-column align-items-center">
                {slideButtons.map((button, index) => (
                    <div key={index} className="d-flex flex-column align-items-center mb-3 w-100">
                        <HomeButton key={index} title={button} date="01/01/2021"/>
                    </div>
                ))}
                </div>
            </div>
            );
        }
        return carouselItems;
    };

    return (
        <div id="dynamic-carousel" className="carousel slide custom-carousel" data-bs-interval="false" ref={carouselRef}>
        <div className="carousel-inner">
            {renderCarouselItems()}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#dynamic-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#dynamic-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
        <style>{style}</style>
        </div>
    );
};

export default ProtocolCarousel;