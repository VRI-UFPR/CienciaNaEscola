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

import { User } from "../../core/user";
import { Response, NextFunction } from "express";
import { Request } from "../apiTypes";
import { OptHandler } from "../../utils/optHandler";
import { eachSeries, map, waterfall } from "async";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Form } from "../../core/form";
import { FormAnswer, FormAnswerOptions } from "../../core/formAnswer";

export class UserCtrl {

    public static signUp(req: Request, res: Response, next: NextFunction) {

        let newUser: User;

        waterfall([
            (callback: (err: Error, user?: User) => void) => {
                bcrypt.hash(req.body.hash, 10, (err: Error, hashedPw: string) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    try {
                        newUser = new User(OptHandler.User(req.body, hashedPw));
                    } catch (err) {
                        callback(err);
                        return;
                    }
                    callback(null, newUser);
                });
            },
            (user: User, callback: (err: Error) => void) => {
                req.db.user.write(user, (err: Error) => {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        res.json({
                            message: "User registered with sucess."
                        });
                        callback(null);
                        return;
                    }
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

    public static signIn(req: Request, res: Response, next: NextFunction) {

        waterfall([
            (callback: (err: Error, userId?: number) => void) => {
                req.db.user.executeVerifyEmail(req.body.email, (err: Error, id?: number) => {
                    if (id !== undefined) {
                        callback(null, id);
                        return;
                    }

                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(new Error("Auth Failed"));
                });
            },
            (id: number, callback: (err: Error, user?: User) => void) => {
                req.db.user.read(id, (err: Error, user?: User) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, user);
                });
            },
            (user: User, callback: (err: Error, user?: User) => void) => {
                bcrypt.compare(req.body.hash, user.hash, (err: Error, result?: boolean) => {
                    if (err !== undefined) {
                        callback(err);
                        return;
                    }
                    if (!result) {
                        callback(new Error("Auth failed"));
                        return;
                    }
                    callback(null, user);
                });
            },
            (user: User, callback: (err: Error) => void) => {
                jwt.sign(
                    {
                        email: user.email
                        , id: user.id
                    },
                    process.env.JWT_KEY
                    , {
                        expiresIn: "1h"
                    },
                    (err: Error, encoded: string) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.json({
                            message: "Authentication successful.",
                            token: encoded,
                            id: user.id
                        });
                        callback(null);
                    })
            }
        ], (err: Error) => {
            if (err) {
                res.status(500).json({
                    message: "Authentication fail."
                });
                return;
            }
            return;
        });
    }

    public static deleteData(req: Request, res: Response, next: NextFunction) {

        if (Object(req.userData).id !== Number(req.params.id)) {
            res.status(500).json({
                message: "Unauthorized action."
            })
            return;
        }

        req.db.user.delete(Object(req.userData).id, (err: Error) => {

            if (err) {
                res.status(500).json({
                    message: "Failed to delete user. Check error properties for details."
                    , error: err.message
                });
                return;
            }

            res.status(200).json({
                message: "User data deleted."
            });
        });
    }

    public static changePassword(req: Request, res: Response, next: NextFunction) {

        let newUser: User;

        waterfall([
            (callback: (err: Error, password?: string) => void) => {
                bcrypt.hash(req.body.hash, 10, (err: Error, hashedPw: string) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null, hashedPw);
                });
            },
            (password: string, callback: (err: Error, user?: User) => void) => {
                req.db.user.read(Object(req.userData).id, (err: Error, user?: User) => {

                    if (err) {
                        callback(err);
                        return;
                    }

                    newUser = new User(OptHandler.User(user, password));

                    callback(null, newUser);
                });
            },
            (user: User, callback: (err: Error) => void) => {
                req.db.user.update(user, Object(req.userData).id, (err: Error) => {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        res.json({
                            message: "Password changed with sucess."
                        });
                        callback(null);
                        return;
                    }
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

    public static listForms(req: Request, res: Response, next: NextFunction) {

        waterfall([
            (callback: (err: Error, forms?: any[]) => void) => {
                req.db.form.list(req.params.id, (err: Error, forms?: Form[]) => {
                    if (err) {
                        res.status(500).json({
                            message: "Could not list forms. Some error has occurred. Check error property for details.",
                            error: err
                        });
                        return;
                    }

                    const mappedForms = forms.map(form => ({
                        id: form.id
                        , title: form.title
                        , description: form.description
                        , answersNumber: 0
                        , answerTimes: form.answerTimes
                        , date: ""
                        , status: form.status
                    }));

                    callback(null, mappedForms);
                });
            },
            (forms: any[], callback: (err: Error, result?: Object[]) => void) => {
                eachSeries(forms, (form: any, innerCallback) => {
                    req.db.answer.readAll(form.id, (err: Error, resultAnswer?: FormAnswer[]) => {
                        if (err) {
                            innerCallback(err);
                            return;
                        }

                        form.answersNumber = resultAnswer.length;

                        innerCallback(null);
                    });
                }, (e) => {
                    callback(e, forms);
                });
            },
            (forms: any[], callback: (err: Error, result?: Object[]) => void) => {
                eachSeries(forms, (form: any, innerCallback) => {
                    req.db.form.readDate(form.id, (err: Error, dates?: any[]) => {
                        if (err) {
                            innerCallback(err);
                            return;
                        }

                        if (dates.length) {
                            form.date = dates.sort().slice(-1)[0].update_date;
                        }

                        innerCallback(null);
                    });
                }, (e) => {
                    callback(e, forms);
                });
            },
        ], (error: Error, forms) => {
            if (error) {
                res.status(500).json({
                    message: "Some error has ocurred. Check error property for details.",
                    error: error.message
                });
                return;
            }
            res.json(forms);
        });

    }

    public static update(req: Request, res: Response, next: NextFunction) {

        let newUser: User;
        try {
            newUser = new User(OptHandler.User(req.body));
        } catch (e) {
            res.status(500).json({
                message: "Invalid User. Check error property for details."
                , error: e.message
            });
            return;
        }
        waterfall([
            (callback: (err: Error, userResult?: User) => void) => {
                req.db.user.update(newUser, Object(req.userData).id, callback);
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
}