import React from 'react'
import { Link } from 'react-router-dom';
import HomeButton from './HomeButton';
import { Carousel } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';

const style = `
    .custom-carousel {
        background-color: rgba(254, 207, 134, 0.7);
        
        border-radius: 15px;
        width: 100%;
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    .carousel-indicators {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }
        
    .carousel-indicator {
        border-radius: 50%;
        background-color: #9F9F9F;
        margin: 0 5px;
        cursor: pointer;
        border: none;
    }
      
    .carousel-indicator.active {
        background-color: #5C5C5C;
    }
`;

function ProtocolCarousel(props) {
    const { users } = props;

    const carouselRef = useRef(null);
    const carouselParentRef = useRef(null);
    const itemsPerSlide = 5;
    const totalSlides = Math.ceil(users.length / itemsPerSlide);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const carousel = carouselRef.current;
        const carouselParent = carouselParentRef.current;
        

        new Carousel(carousel);
    }, []);

    const renderCarouselItems = () => {
        const carouselItems = [];

        for (let i = 0; i < totalSlides; i++) {
            const startIndex = i * itemsPerSlide;
            const endIndex = (i + 1) * itemsPerSlide;
            const slideButtons = users.slice(startIndex, endIndex);

            carouselItems.push(
            <div key={i} className={`carousel-item${i === 0 ? ' active' : ''} h-100`}>
                <div className="d-flex flex-column align-items-center h-100 pb-3">
                {slideButtons.map((button, index) => (
                    <div
                        key={index}
                        className="d-flex flex-column align-items-center pb-3 w-100" style={{height: '20%', maxHeight: '20%'}}>
                        <HomeButton
                            title={users.userProtocol.title}
                            date="01/01/2021"
                        />
                    </div>
                ))}
                </div>
            </div>
            );
        }

        return carouselItems;
    };

    const renderPageIndicators = () => {
        const indicators = [];

        for (let i = 0; i < totalSlides; i++) {
            indicators.push(
                <button
                    key={i} 
                    type="button" 
                    className={`carousel-indicator ${i === currentPage ? ' active' : ''}`}
                    data-bs-target="#dynamic-carousel"
                    data-bs-slide-to={i}
                    onClick={() => setCurrentPage(i)}
                    style={{ 
                        width: '1rem',
                        height: '1rem'
                    }}
                ></button>
            )
        }

        return indicators;
    }

    return (
        <div id="dynamic-carousel" className="carousel slide custom-carousel" data-bs-interval="false" ref={carouselRef}>
        <div className="carousel-inner h-100">
            {renderCarouselItems()}
        </div>
        <div className="carousel-indicators">
            {renderPageIndicators()}
        </div>
            <button className="carousel-control-prev d-none">
                {}
            </button>
            <button className="carousel-control-next d-none">
                {}
            </button>
        <button className="carousel-control-prev d-none" type="button" data-bs-target="#dynamic-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next d-none" type="button" data-bs-target="#dynamic-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
        <style>{style}</style>
        </div>
    );
};

export default ProtocolCarousel;