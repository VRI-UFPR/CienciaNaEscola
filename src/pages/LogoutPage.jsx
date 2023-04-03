import React from 'react';
//import logoutTitle from '../assets/images/helpIcon.svg';
import NavBar from '../components/Navbar';

const styles = `

    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-grey {
        background-color: #D9D9D9;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    h1 {
        color: #535353;
        font-weight: bold;
        font-size: x-large;
    }

    .container{
        border-radius: 30px;
        padding: 20px;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 80%;
        height: 18%;
    }

    .center {
        position: absolute;
        top: 40%;
        left: 10%;
    }

    .centerb {
        position: absolute;
        top: 57%;
        left: 11%;     
    }

    .red-button {
        border-radius: 30px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #EA636F;
        color: #FFF;
        font-weight: 700;
        font-size: 130%;
        font-family: 'Century Gothic', sans-serif;
        border: none;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);;
    }
    .grey-button {
        border-radius: 30px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #787878;
        color: #FFF;
        font-weight: 700;
        font-size: 130%;
        margin-top: 10px;
        font-family: 'Century Gothic', sans-serif;
        border: none;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
`;


function LogoutPage(props){
    return (
        <div className="d-flex flex-column vh-100 w-100 font-barlow">
            <NavBar />
            <div className=" bg-grey container center ">
                <h1 className="font-century-gothic"> Tem certeza que deseja fazer logout? </h1>
                <button className="grey-button"> Fazer Logout </button>
            </div>
            <div className="cancelar container centerb">
                <button className="red-button"> Cancelar </button>
            </div>
            <style>{styles}</style>
        </div>
    )
}

export default LogoutPage;