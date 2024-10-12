/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

const styles = `
    .options-button {
        border: 0px;
        background-color: transparent;
        padding: 4px 4px;
    }

    .options-img {
        height: 20px;
    }
`;

function ProtocolOptions(props) {
    return (
        <div>
            <div className="wrapper d-flex justify-content-center py-1">
                <button className="options-button">{/* <img className="options-img" src={EyeIcon} alt="eye icon" /> */}</button>
                <button className="options-button">{/* <img className="options-img" src={SettingsIcon} alt="settings icon" /> */}</button>
                <button className="options-button">
                    {/* <img className="options-img" src={CollaboratorsIcon} alt="collaborators icon" /> */}
                </button>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolOptions;
