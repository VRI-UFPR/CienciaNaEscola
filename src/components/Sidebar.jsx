import React from "react";
import BuscarImg from "../assets/images/BuscarImg.svg";

const styles = `
    .sidebar-wrapper {
        align-items: center;
    }
    .sidebar-perfil-image {
        width: 100px;
        height: 100px;
        margin: 25px 0px;
        background-color: #FFFFFF;
        border-radius: 50%;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
    }
    .sidebar-novo-button {
        width: 80%;
        height: 45px;
        margin: 0px 0px 5px 0px;
        border-radius: 8px;
        border: none;
        box-shadow: 0px 1px #000000;
        background-color: #AAD390;
        color: #FFFFFF;
        font-size: 24px;
    }
    .sidebar-buscar-button {
        width: 80%;
        height: 45px;
        margin: 5px 0px;
        border-radius: 8px;
        border: none;
        box-shadow: 0px 1px #000000;
        background-color: #FFFFFF;
        color: #000000;
        font-size: 20px;
    }
    .sidebar-menu-wrapper {
        display: flex;
        align-items: start;
    }
    .sidebar-titles {
        color: #FFFFFF;
        opacity: 0.8;
        margin-top: 15px;
        margin-left: 18px;
        align-items: start;
    }
    .sidebar-list-items {
        text-decoration: none;
        color: #FFFFFF;
        margin-left: 30px;
    }
    .left-arrow {
      width: 10px;
      height: 10px;
      align-itens: end;
      background-color: #FFFFFF;
      bottom: 10px;
      position: fixed;
    }
`;

function Sidebar(props) {
  return (
    <div className="d-flex flex-column">
      <div className="sidebar-wrapper d-flex flex-column">
        <div className="sidebar-perfil-image d-flex"></div>
        <button className="sidebar-novo-button btn" type="button">
          Novo
        </button>
        <button className="sidebar-buscar-button d-flex flex-row btn">
          <img
            src={BuscarImg}
            alt="logo"
            style={{ width: "35px", paddingRight: "7px", paddingTop: "3px" }}
          />
          <p>Buscar</p>
        </button>
      </div>
      <div className="sidebar-menu-wrapper d-flex flex-column">
        <h1 className="sidebar-titles">Menu</h1>
        <a className="sidebar-list-items" href="/">
          Protocolos
        </a>
        <a className="sidebar-list-items" href="/">
          Usuários
        </a>
        <a className="sidebar-list-items" href="/">
          Denúncias
        </a>
      </div>
      <div className="sidebar-conta-wrapper d-flex flex-column">
        <h1 className="sidebar-titles">Conta</h1>
        <a className="sidebar-list-items" href="/">
          Perfil
        </a>
        <a className="sidebar-list-items" href="/">
          Logout
        </a>
      </div>
      <div className="left-arrow"></div>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </div>
  );
}

export default Sidebar;
