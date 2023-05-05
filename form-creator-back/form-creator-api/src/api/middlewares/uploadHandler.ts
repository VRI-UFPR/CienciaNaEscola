const express = require('express')
	, app = express()
	, multer = require('multer');

// cria uma instância do middleware configurada
// destination: lida com o destino
// filenane: permite definir o nome do arquivo gravado
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // error first callback
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // error first callback
        cb(null, file.fieldname + '-' + Date.now())
    }
});

// cria uma instância do middleware configurada
const upload = multer({ storage });

export { upload };
