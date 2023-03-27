import React from 'react';
import HomeButton from '../components/HomeButton';

const styles = `
    .listHomeBtn { 
        display: flex;
        justify-content: center;
        margin-bottom: 13px;
    }
`;

function HomeButtonList(props) {
    return (
        <div className="d-flex container-fluid p-0">
            <ul className="container-fluid list-unstyled d-flex flex-column flex-grow-1 p-0 m-0">
                <li className="listHomeBtn mt-1">
                    <HomeButton />
                </li>
                <li className="listHomeBtn">
                    <HomeButton />
                </li>
                <li className="listHomeBtn">
                    <HomeButton />
                </li>
                <li className="listHomeBtn mb-0">
                    <HomeButton />
                </li>
            </ul>
            <style>{styles}</style>
        </div>
    );
}

export default HomeButtonList;
