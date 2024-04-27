import { React } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'bootstrap';
import { useEffect, useState, useRef } from 'react';

import HomeButton from './HomeButton';

const style = `
    .custom-carousel {
        background-color: #FECF86B2;
        padding-top: 2rem;
        padding-bottom: 2rem;
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
`;

function ProtocolCarousel(props) {
    const { listItems } = props;

    const carouselRef = useRef(null);
    const itemsPerSlide = Math.round((window.screen.height - 300) / 120);
    const totalSlides = Math.ceil(listItems.length / itemsPerSlide);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const carousel = carouselRef.current;
        new Carousel(carousel);
    }, []);

    const renderCarouselItems = () => {
        const carouselItems = [];

        for (let i = 0; i < totalSlides; i++) {
            const startIndex = i * itemsPerSlide;
            const endIndex = (i + 1) * itemsPerSlide;
            const slideItems = listItems.slice(startIndex, endIndex);

            carouselItems.push(
                <div key={i} className={`carousel-item ${i === 0 ? ' active' : ''} h-100`}>
                    <div className="d-flex flex-column align-items-center h-100 pb-3">
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

    const renderPageIndicators = () => {
        const indicators = [];

        for (let i = 0; i < totalSlides; i++) {
            indicators.push(
                <button
                    key={i}
                    type="button"
                    className={`carousel-indicator ${i === currentPage ? ' active' : ''} rounded-circle border-0 mx-1`}
                    data-bs-target="#dynamic-carousel"
                    data-bs-slide-to={i}
                    onClick={() => setCurrentPage(i)}
                    style={{
                        width: '1rem',
                        height: '1rem',
                    }}
                ></button>
            );
        }

        return indicators;
    };

    return (
        <div id="dynamic-carousel" className="custom-carousel carousel slide w-100 rounded-4" ref={carouselRef}>
            <div className="carousel-inner h-100">{renderCarouselItems()}</div>
            <div className="carousel-indicators">{renderPageIndicators()}</div>
            <style>{style}</style>
        </div>
    );
}

export default ProtocolCarousel;
