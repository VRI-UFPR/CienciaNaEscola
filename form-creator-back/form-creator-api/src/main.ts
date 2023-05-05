#! /usr/bin/env node

/*
 * form-creator-api. RESTful API to manage and answer forms.
 * Copyright (C) 2019 Centro de Computacao Cientifica e Software Livre
 * Departamento de Informatica - Universidade Federal do Parana - C3SL/UFPR
 *
 * This file is part of form-creator-api.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// External libraries

import * as bodyParser from "body-parser";
import * as express from "express";
const cors = require('cors');

// Create a new express app
/** @hidden */
const app = module.exports = express();

// Load configuration

/** @hidden */
const port = process.env.PORT;

// Include middlewares
import { DbHandlerMw } from "./api/middlewares/dbHandler";
import { upload } from "./api/middlewares/uploadHandler";

// Include controllers
import { FormCtrl } from "./api/controllers/form";
import { AnswerCtrl } from "./api/controllers/formAnswer";
import { UserCtrl } from "./api/controllers/user"
import { tokenValidation } from "./api/middlewares/userAuth";

// Setup middlewares
app.use("/", bodyParser.json());
app.use("/", DbHandlerMw());
app.use(cors());
app.use(express.json());

// Setup routes

app.get("/form/:id", FormCtrl.read);
app.put("/form/:id", tokenValidation(), FormCtrl.update);
app.post("/form", tokenValidation(), FormCtrl.write);
app.get("/formDate/:id", FormCtrl.getDate);
app.get("/answerNumber/:id", FormCtrl.answerNumber);
app.post("/answer/:id", AnswerCtrl.write);
app.get("/answer/:id", tokenValidation(), AnswerCtrl.read);
app.post("/user/signUp", UserCtrl.signUp);
app.post("/user/signIn", UserCtrl.signIn);
app.put("/user/changePassword", tokenValidation(), UserCtrl.changePassword);
app.get("/user/list/:id", UserCtrl.listForms);
app.put("/user/update", tokenValidation(), UserCtrl.update);
app.delete("/user/deleteData/:id", tokenValidation(), UserCtrl.deleteData);
app.post('/file/upload', upload.single('file'), 
    (req, res) => res.send('<h2>Upload realizado com sucesso</h2>'));
// Listening

app.listen(port);
console.log("Server listening on port " + port);
