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

import { waterfall } from "async";
import { NextFunction, Response } from "express";
import { Form, FormOptions } from "../../core/form";
import { FormAnswer, FormAnswerOptions } from "../../core/formAnswer";
import { FormUpdate, FormUpdateOptions } from "../../core/formUpdate";
import { DiffHandler } from "../../utils/diffHandler";
import { OptHandler } from "../../utils/optHandler";
import { Request } from "../apiTypes";

export class FormCtrl {

    public static read(req: Request, res: Response, next: NextFunction) {

        req.db.form.read(req.params.id, (err: Error, form?: Form) => {
            if (err) {
                res.status(500).json({
                    message: "Form with id: '" + req.params.id + "' not found. Some error has occurred. Check error property for details.",
                    error: err
                });
                return;
            }

            res.json(form);
            return;
        });
    }

    public static write(req: Request, res: Response, next: NextFunction) {

        let form: Form;
        try {
            form = new Form(OptHandler.form(req.body));
        } catch (e) {
            res.status(500).json({
                message: "Invalid Form. Check error property for details.",
                error: e.message
            });
            return;
        }
        waterfall([
            (callback: (err: Error, result?: FormUpdate) => void) => {
                req.db.form.write(form, (err: Error, formResult: Form) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    const formOpts: FormOptions = {
                        id: formResult.id
                        , title: formResult.title
                        , description: formResult.description
                        , inputs: []
                        , answerTimes: formResult.answerTimes
                        , status: true
                    };

                    const formUpdate: FormUpdate = DiffHandler.diff(formResult, new Form(formOpts));

                    callback(null, formUpdate);
                });
            },
            (formUpdate: FormUpdate, callback: (err: Error, formId?: number) => void) => {
                req.db.form.update(formUpdate, (err: Error) => {

                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null, formUpdate.form.id);
                });
            },
            (formId: number, callback: (err: Error) => void) => {
                /** req.userData has to be parsed into an object so we can get its ID */
                req.db.user.assign(Object(req.userData).id, formId, (err: Error) => {

                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null);
                });
            }
        ], (err) => {
            if (err) {
                res.status(500).json({
                    message: "Could not insert form. Some error has occurred. Check error property for details."
                    , error: err.message
                });
                return;
            }

            res.json({
                message: "Form added."
            });
            return;
        });

    }

    public static update(req: Request, res: Response, next: NextFunction) {

        let newForm: Form;
        try {
            newForm = new Form(OptHandler.formEdit(req.body));
        } catch (e) {
            res.status(500).json({
                message: "Invalid Form. Check error property for details."
                , error: e.message
            });
            return;
        }
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
            (callback: (err: Error, result?: FormUpdate) => void) => {
                req.db.form.read(req.params.id, (err: Error, oldForm: Form) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    const formUpdate: FormUpdate = DiffHandler.diff(newForm, oldForm);

                    callback(null, formUpdate);
                });
            },
            (formUpdate: FormUpdate, callback: (err: Error, formResult?: Form) => void) => {
                req.db.form.update(formUpdate, callback);
            }
        ], (err) => {
            if (err) {
                res.status(500).json({
                    message: "Could not update Form. Some error has ocurred. Check error property for details."
                    , error: err.message
                });
                return;
            }
            res.json({ message: "Updated" });
            return;
        });
    }

    public static answerNumber(req: Request, res: Response, next: NextFunction) {

        waterfall([
            (callback: (err: Error, answer?: FormAnswer[]) => void) => {
                req.db.answer.readAll(req.params.id, (err: Error, resultAnswer?: FormAnswer[]) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    res.status(200).json({
                        answerNumber: resultAnswer.length
                    });
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

    public static getDate(req: Request, res: Response, next: NextFunction) {

        req.db.form.readDate(req.params.id, (err: Error, dates?: Date[]) => {
            if (err) {
                res.status(500).json({
                    message: "Some error has occurred. Check error property for details.",
                    error: err
                });
                return;
            }

            res.json(dates);
            return;
        });
    }
}
