import React from 'react';

const styles = `
    .homeBtn {
        background-color: #D9D9D9;
        width: 85%;
        padding: 0px 10px;
        border-radius: 9px;
        font-size: 90%;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5);
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function HomeButton(props) {
    return (
        <div className="homeBtn font-barlow d-flex align-items-center h-100">
            <div className="d-flex justify-content-between flex-fill px-0 py-0">
                <div>{props.title}</div>
                <div>{props.date}</div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default HomeButton;
