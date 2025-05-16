/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState } from 'react';
import axios from 'axios';

/** Componente de upload de arquivos. */
function FileUpload() {
    const [file, setFile] = useState(null);

    /**
     * Manipula a seleção de arquivo pelo usuário.
     * @param {Element} event O evento de mudança do input de arquivo.
    */
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    /** Envia o arquivo selecionado para o servidor usando uma requisição HTTP POST. */
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);

        axios
            .post(`http://localhost:3333/file/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default FileUpload;
