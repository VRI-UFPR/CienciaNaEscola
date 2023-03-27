import React from 'react';

import pinkArrow from '../assets/images/pinkArrow.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .general {
        width: 85%;
    }

    .leftArrow {
        transform: scaleX(-1);
        margin-right: 7px;
    }

    .rightArrow {
        margin-left: 7px;
    }

    .leftArrow, .rightArrow {
        width: 35px;
    }

    .arrowText {
        color: #F59489;
        font-weight: 700;
        font-size: 15px;
    }
`;

function HomeArrows(props) {
    return (
        <div className="general d-flex container-fluid align-itens-center justify-content-between mt-3 p-0">
            <div className="d-flex align-items-center justify-content-center">
                <img src={pinkArrow} alt="Seta" className="leftArrow"></img>
                <span className="arrowText d-flex">Voltar</span>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <span className="arrowText">Ver mais</span>
                <img src={pinkArrow} alt="Seta" className="rightArrow"></img>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default HomeArrows;
