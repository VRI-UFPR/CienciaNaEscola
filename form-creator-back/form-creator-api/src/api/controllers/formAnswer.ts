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

import { OptHandler } from "../../utils/optHandler";
import { InputAnswerOptions, InputAnswerOptionsDict } from "../../core/inputAnswer";
import { Form, FormOptions } from "../../core/form";
import { FormAnswer, FormAnswerOptions } from "../../core/formAnswer";
import { ValidationHandler } from "../../utils/validationHandler";
import { Response, NextFunction } from "express";
import { Request } from "../apiTypes";
import { waterfall } from "async";
const util = require('util');

export class AnswerCtrl {

    public static write(req: Request, res: Response, next: NextFunction) {

        req.db.form.read(req.params.id, (err: Error, form?: Form) => {
            if (err) {
                res.status(500).json({
                    message: "Form with id: '" + req.params.id + "' not found. Some error has occurred. Check error property for details."
                    , error: err
                });
                return;
            }

            let inputAnswerOptionsDict: InputAnswerOptionsDict = {}

            for (const key of Object.keys(req.body)) {
                inputAnswerOptionsDict[parseInt(key, 10)] = [];
                for (const i in req.body[key]) {
                    const tmpInputAnswerOption: InputAnswerOptions = {
                        idInput: parseInt(key, 10)
                        , placement: parseInt(i, 10)
                        , value: req.body[key][i]
                    }
                    inputAnswerOptionsDict[parseInt(key, 10)].push(tmpInputAnswerOption);
                }
            }

            let formAnswerOpt: FormAnswerOptions = {
                form: form
                , timestamp: new Date(Date.now())
                , inputsAnswerOptions: inputAnswerOptionsDict
            }

            try {
                const formAnswer: FormAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOpt));
                ValidationHandler.validateFormAnswer(formAnswer);
                req.db.answer.write(formAnswer, (err: Error, formAnswerResult: FormAnswer) => {
                    if (err) {
                        throw err;
                        return;
                    }
                    res.json({
                        id: formAnswerResult.id
                        , message: "Answered"
                    });
                    return;
                });
            } catch (e) {
                if (e.validationDict !== undefined) {
                    res.status(500).json({
                        message: "Could not Create form Answer. Some error has occurred. Check error property for details."
                        , error: e.validationDict
                    });
                    return;
                }

                res.status(500).json({
                    message: "Could not Create form Answer. Some error has occurred. Check error property for details."
                    , error: e.message
                });
                return;
            }
        });
    }

    public static read(req: Request, res: Response, next: NextFunction) {

        waterfall([
            (callback: (err: Error) => void) => {
                req.db.form.list(Object(req.userData).id, (err: Error, forms?: Form[]) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    const e: Error = new Error("User dont own this form.");
                    callback((forms.some((obj) => obj.id === Number(req.params.id))) ? null : e);
                });
            },
            (callback: (err: Error, answer?: FormAnswer[]) => void) => {
                req.db.answer.readAll(req.params.id, (err: Error, resultAnswer?: FormAnswer[]) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    res.status(200).json(resultAnswer);
                });
            }
        ], (error: Error) => {
            if (error) {
                res.status(500).json({
                    message: "Some error has ocurred. Check error property for details.",
                    error: error.message
                });
                return;
            }
        });
    }
}
