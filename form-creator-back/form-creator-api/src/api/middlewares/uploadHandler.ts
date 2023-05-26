import express = require('express');
import multer = require('multer');
import fs = require('fs');

// cria uma instância do middleware configurada
// destination: lida com o destino
// filenane: permite definir o nome do arquivo gravado
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./form-creator-back/form-creator-api/uploads/gallery/`
        if (!fs.existsSync(path))
            fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
      },
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
