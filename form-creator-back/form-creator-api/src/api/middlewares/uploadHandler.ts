import express = require('express');
import multer = require('multer');

// cria uma instância do middleware configurada
// destination: lida com o destino
// filenane: permite definir o nome do arquivo gravado
const storage = multer.diskStorage({
    destination: "../uploads/",
    // destino do arquivo no servidor
    // req: informações sobre a requisição feita pelo usuário
    // file: arquivo enviado
    // cb: função de callback que será chamada após o processamento
    // da requisição
    filename: function (req, file, cb) {
        // error first callback
        cb(null, file.fieldname + '-' + Date.now())
    },
});

// cria uma instância do middleware configurada
const upload = multer({ storage });

export { upload };
