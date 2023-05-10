import React from 'react'
import HomeButton from './HomeButton';

const style = `

`;

function ProtocolCarousel() {
    return (
        <div className="container-fluid p-0"> 
            <div id="main-slider" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#main-slider" data-slide-to="0" className="active"></li>
                    <li data-target="#main-slider" data-slide-to="1"></li>
                    <li data-target="#main-slider" data-slide-to="2"></li>
                </ol>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <HomeButton title="Protocolo 1" date="20/05/2003" />
                    <div className="carousel-caption d-none d-md-block">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProtocolCarousel;