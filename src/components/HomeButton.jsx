import { React, useContext } from 'react';
import CheckIcon from '../assets/images/CheckIcon.svg';
import RoundedButton from './RoundedButton';
import { AlertContext } from '../contexts/AlertContext';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }    

    .custom-btn {
        background-color: #F8F8F8;
        box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    .home-btn-title {
        overflow-y: scroll;
        max-height: 100%;
    }

    .home-btn-title::-webkit-scrollbar  {
        width: 0px;
    }

    .icon-check{
        width: 35px;
        height: 35px;
    }
`;

function HomeButton(props) {
    const {
        title,
        viewFunction = () => {},
        allowEdit = false,
        editFunction = () => {},
        allowDelete = false,
        deleteFunction = () => {},
        check = false,
    } = props;
    const { showAlert } = useContext(AlertContext);

    return (
        <div className="custom-btn rounded-4 row g-0 align-items-center font-barlow h-100 w-100 py-2 px-4" onClick={viewFunction}>
            <div className="col home-btn-title">
                <h5 className="text-wrap fw-medium m-0">{title}</h5>
            </div>
            {allowEdit && (
                <div className="col-auto ms-2">
                    <RoundedButton
                        hsl={[37, 98, 76]}
                        size={35}
                        onClick={(e) => {
                            e.stopPropagation();
                            editFunction();
                        }}
                        icon="edit"
                    />
                </div>
            )}
            {allowDelete && (
                <div className="col-auto ms-2">
                    <RoundedButton
                        hsl={[355, 78, 66]}
                        size={35}
                        onClick={(e) => {
                            e.stopPropagation();
                            showAlert({
                                title: 'Tem certeza que deseja excluir?',
                                dismissHsl: [355, 78, 66],
                                dismissText: 'Não',
                                actionHsl: [97, 43, 70],
                                actionText: 'Sim',
                                dismissible: true,
                                actionOnClick: () => {
                                    deleteFunction();
                                },
                            });
                        }}
                        icon="delete"
                    />
                </div>
            )}
            {check && (
                <div className="col-auto ms-2">
                    <img src={CheckIcon} alt="Ícone de já respondido" className="icon-check" />
                </div>
            )}
            <style>{styles}</style>
        </div>
    );
}

export default HomeButton;
