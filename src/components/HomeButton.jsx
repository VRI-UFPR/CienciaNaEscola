import { React } from 'react';
import CheckIcon from '../assets/images/CheckIcon.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }    

    .custom-btn {
        background-color: #F8F8F8;
        border-radius: 10px;
        width: 85%;
        box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.5);
    }

    .custom-icon {
        max-width: 100px !important;
        max-height: 60px !important;
    }
`;

function HomeButton(props) {
    const { title, check } = props;

    return (
        <div className="custom-btn d-flex align-items-center font-barlow h-100 px-4">
            <div className="d-flex align-items-center w-75 h-100 p-0">
                <h4 className=" text-truncate fw-medium m-0">{title}</h4>
            </div>
            <div className="d-flex justify-content-end align-items-center w-25 h-100 p-0">
                {check && <img src={CheckIcon} alt="Ícone de já respondido" className="custom-icon w-50 h-50" />}
            </div>
            <style>{styles}</style>
        </div>
    );
}

HomeButton.defaultProps = {
    check: false,
};

export default HomeButton;
