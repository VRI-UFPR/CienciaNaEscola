import React from "react";
import HomeButton from "../components/HomeButton";

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
            <ul className="container-fluid p-0 m-0 list-unstyled d-flex flex-column flex-grow-1">
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
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    )
}

export default HomeButtonList;