import React from 'react';
import HomeButton from '../components/HomeButton';

const styles = `
    .list-home-btn { 
        display: flex;
        justify-content: center;
        margin-bottom: 13px;
    }
`;

function HomeButtonList(props) {
    return (
        <div className="d-flex container-fluid p-0">
            <ul className="container-fluid list-unstyled d-flex flex-column flex-grow-1 p-0 m-0">
                <li className="list-home-btn mt-1">
                    <HomeButton />
                </li>
                <li className="list-home-btn">
                    <HomeButton />
                </li>
                <li className="list-home-btn">
                    <HomeButton />
                </li>
                <li className="list-home-btn mb-0">
                    <HomeButton />
                </li>
            </ul>
            <style>{styles}</style>
        </div>
    );
}

export default HomeButtonList;
