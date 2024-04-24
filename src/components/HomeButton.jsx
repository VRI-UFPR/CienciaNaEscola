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

    ::-webkit-scrollbar {
        width: 0px;
    }
`;

function HomeButton(props) {
    const { title, check } = props;

    return (
        <div className="custom-btn d-flex align-items-center justify-content-between font-barlow h-100 px-4">
            <div className="d-flex align-items-center h-100 w-100 py-2">
                <h5 style={{ overflowY: 'scroll', maxHeight: '100%' }} className="text-wrap fw-medium w-100 py-1 my-0">
                    {title}
                </h5>

                {check && (
                    <div className="d-flex justify-content-end align-items-center p-0 m-0">
                        <img src={CheckIcon} alt="Ícone de já respondido" className="w-50 h-50" />
                    </div>
                )}
            </div>

            <style>{styles}</style>
        </div>
    );
}

HomeButton.defaultProps = {
    check: false,
};

export default HomeButton;
