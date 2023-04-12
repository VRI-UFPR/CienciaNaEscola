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

import { eachSeries, map, waterfall } from "async";
import { Pool, PoolConfig, QueryResult } from "pg";
import { Form, FormOptions } from "../core/form";
import { FormUpdate, FormUpdateOptions } from "../core/formUpdate";
import { Input, InputOptions, Sugestion, Validation } from "../core/input";
import { InputUpdate, InputUpdateOptions } from "../core/inputUpdate";
import { SubForm } from "../core/subForm";
import { EnumHandler, InputType, UpdateType, ValidationType } from "./enumHandler";
import { ErrorHandler } from "./errorHandler";
import { OptHandler } from "./optHandler";
import { QueryBuilder, QueryOptions } from "./queryBuilder";
import { Sorter } from "./sorter";

/** Paramenters used to create a temporary Validation */
interface ValidationTmp {
    /** Validation identifier */
    id: number;
    /** Input id */
    inputId: number;
    /** Validation of a input */
    validation: Validation;
}

/**
 * Class used to manage all Form operations into the database.
 * This operations include read, write and update data.
 */
export class FormQueryBuilder extends QueryBuilder {

    constructor(pool: Pool) {
        super(pool);
    }

    /**
     * Asynchronously lists all forms from an user.
     * @param userId - User ID who owns the form list.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    public list(userId: number, cb: (err: Error, forms?: Form[]) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },

            (callback: (err: Error, result?: Form[]) => void) => {
                this.executeListForms(userId, (error: Error, results?: Form[]) => {
                    callback(error, results);
                });
            },

            (forms: Form[], callback: (err: Error, result?: Form[]) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, forms);
                });
            }

        ], (err, forms?: Form[]) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                });
            }
            cb(null, forms);
        });
    }

    /**
     * Asynchronously lists all forms from an user in the database.
     * @param userId - User ID who owns the forms.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     */
    private executeListForms(userId: number, cb: (err: Error, forms?: Form[]) => void) {
        const queryString: string = "SELECT t1.id,t1.title,t1.description,t1.times,t1.status FROM form t1 \
                                    INNER JOIN form_owner t2 ON (t1.id=t2.id_form \
                                    AND t2.id_user=$1);";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                userId
            ]
        };

        const forms: Form[] = [];

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }

            for (const row of result.rows) {
                const formOpt: FormOptions = {
                    id: row["id"]
                    , title: row["title"]
                    , description: row["description"]
                    , inputs: []
                    , answerTimes: row["times"]
                    , status: row["status"]
                };

                const formTmp: Form = new Form(formOpt);
                forms.push(formTmp);
            }

            cb(null, forms);
        });
    }

    /**
     * Asynchronously lists all dates from a form from an user.
     * @param formId - From ID that owns the modified dates.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    public readDate(formId: number, cb: (err: Error, dates?: Date[]) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: Date[]) => void) => {
                this.executeReadDate(formId, (error: Error, results?: Date[]) => {
                    callback(error, results);
                });
            },
            (dates: Date[], callback: (err: Error, result?: Date[]) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, dates);
                });
            }
        ], (err, dates?: Date[]) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                });
                return;
            }
            cb(null, dates);
            return;
        });
    }

    /**
     * Asynchronously read a date from a modified form without transactions.
     * @param id - Form identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.form - Date array or null if there's no date not exists.
     */
    private executeReadDate(id: number, cb: (err: Error, dates?: Date[]) => void) {
        const queryString: string = "SELECT update_date FROM form_update WHERE id_form=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, result.rows);
        });

    }

    /**
     * Asynchronously read a form from database.
     * @param id - Form identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.form - Form or null if form not exists.
     */
    public read(id: number, cb: (err: Error, form?: Form) => void) {

        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },

            (callback: (err: Error, result?: Form) => void) => {
                this.readController(id, (error: Error, resultForm?: Form) => {
                    callback(error, resultForm);
                });
            },

            (form: Form, callback: (err: Error, result?: Form) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, form);
                });
            }

        ], (err, form?: Form) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                });
                return;
            }
            cb(null, form);
        });
    }

    /**
     * Asynchronously read a form from database without transactions.
     * @param id - Form identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.form - Form or null if form not exists.
     */
    public readController(id: number, cb: (err: Error, form?: Form) => void) {
        waterfall([
            (callback: (err: Error, result?: Form) => void) => {
                this.executeReadForm(id, (error: Error, result: QueryResult) => {

                    if (result.rowCount !== 1) {
                        callback(ErrorHandler.badIdAmount(result.rowCount));
                        return;
                    }

                    const formTmp: Form = new Form({
                        id: result.rows[0]["id"]
                        , title: result.rows[0]["title"]
                        , description: result.rows[0]["description"]
                        , inputs: []
                        , answerTimes: result.rows[0]["times"]
                        , status: result.rows[0]["status"]
                    });

                    callback(null, formTmp);
                });
            },
            (form: Form, callback: (err: Error, form?: Form, resultValidations?: ValidationTmp[]) => void) => {
                this.executeReadValidation(id, (error: Error, result?: QueryResult) => {

                    if (error) {
                        callback(error);
                        return;
                    }

                    const arrayValidationTmp: ValidationTmp[] = [];
                    let validationTmp: any;
                    for (const i of result.rows) {
                        validationTmp = {
                            id: i["id"]
                            , inputId: i["id_input"]
                            , validation: {
                                type: EnumHandler.parseValidationType(i["validation_type"])
                                , arguments: []
                            }
                        };
                        arrayValidationTmp.push(validationTmp);
                    }

                    callback(null, form, Sorter.sortById(arrayValidationTmp));
                });
            },
            (form: Form, validations: ValidationTmp[], callback: (err: Error, form?: Form, resultValidations?: ValidationTmp[]) => void) => {

                this.executeReadArgument(id, (error: Error, result?: QueryResult) => {

                    if (error) {
                        callback(error);
                        return;
                    }

                    const sortedResults: any = Sorter.sortById(result.rows);
                    let k: number = 0;
                    let i: number = 0;
                    while ((i < validations.length) && (k < sortedResults.length)) {
                        if (validations[i].id === sortedResults[k].id_validation) {
                            validations[i].validation.arguments.push(sortedResults[k].argument);
                            k++;
                        }
                        else {
                            i++;
                        }
                    }
                    callback(null, form, validations);
                });
            },
            (form: Form, validations: ValidationTmp[], callback: (err: Error, form?: Form, resultInputs?: Input[]) => void) => {
                this.executeReadInput(id, (error: Error, result: QueryResult) => {

                    if (error) {
                        callback(error);
                        return;
                    }

                    const validationArray: any = Sorter.sortByInputId(validations);
                    const inputArrayTmp: Input[] = [];
                    let inputTmp: InputOptions;

                    for (const i of result.rows) {
                        inputTmp = {
                            id: i["id"]
                            , placement: i["placement"]
                            , description: i["description"]
                            , question: i["question"]
                            , type: EnumHandler.parseInputType(i["input_type"])
                            , enabled: i["enabled"]
                            , validation: []
                            , sugestions: []
                            , subForm: undefined
                        };
                        inputArrayTmp.push(new Input(inputTmp));
                    }

                    let j: number = 0;
                    let k: number = 0;
                    while ((j < inputArrayTmp.length) && (k < validationArray.length)) {
                        if (inputArrayTmp[j].id === validationArray[k].inputId) {
                            inputArrayTmp[j].validation.push(validationArray[k].validation);
                            k++;
                        } else {
                            j++;
                        }
                    }

                    callback(null, form, Sorter.sortByPlacement(inputArrayTmp));
                });
            },
            (form: Form, inputs: Input[], callback: (err: Error, form?: Form) => void) => {
                this.executeReadSugestion(id, (error: Error, result: QueryResult) => {

                    if (error) {
                        callback(error);
                        return;
                    }

                    let i: number = 0;
                    let k: number = 0;
                    while ((i < inputs.length) && (k < result.rows.length)) {
                        if (inputs[i].id === result.rows[k]["id_input"]) {
                            inputs[i].sugestions.push({ value: result.rows[k]["value"], placement: result.rows[k]["placement"] });
                            k++;
                        } else {
                            i++;
                        }
                    }

                    for (const j of inputs) {
                        form.inputs.push(j);
                    }

                    callback(null, form);
                });
            },
            (form: Form, callback: (err: Error, form?: Form) => void) => {
                const subFormInputs: Input[] = form.inputs.filter((obj) => obj.type === InputType.SUBFORM);
                const inputs: Input[] = form.inputs.filter((obj) => obj.type !== InputType.SUBFORM);

                waterfall([
                    (outerCallback: (er: Error, newSubFormInputs?: Input[]) => void) => {
                        const newSubFormInputs: Input[] = [];
                        eachSeries(subFormInputs, (input, innerCallback) => {
                            this.executeReadSubForm(input.id, (error: Error, result?: QueryResult) => {
                                for (const i of result.rows) {
                                    const inputTmp: Input = {
                                        id: input.id
                                        , placement: input.placement
                                        , description: input.description
                                        , question: input.question
                                        , enabled: input.enabled
                                        , type: input.type
                                        , validation: input.validation
                                        , sugestions: input.sugestions
                                        , subForm: new SubForm({
                                            id: i.id
                                            , inputId: i.id_input
                                            , contentFormId: i.id_content_form
                                        })
                                    };
                                    newSubFormInputs.push(inputTmp);
                                }
                                innerCallback(error);
                            });
                        }, (e) => {
                            if (e) {
                                outerCallback(e);
                                return;
                            }
                            outerCallback(null, newSubFormInputs);
                        });
                    },
                    (newSubFormInputs: Input[], anotherCallback: (er: Error, newForm: Form) => void) => {
                        let inputsTmp = inputs;
                        for (const i of newSubFormInputs) {
                            inputsTmp.push(i);
                        }
                        inputsTmp = Sorter.sortByPlacement(inputsTmp);

                        const formTmp: Form = new Form({
                            id: form.id
                            , title: form.title
                            , description: form.description
                            , inputs: inputsTmp
                            , answerTimes: form.answerTimes
                            , status: form.status
                        });
                        anotherCallback(null, formTmp);
                    }
                ], (er, formTmp?: Form) => {
                    if (er) {
                        callback(er);
                    } else {
                        callback(null, formTmp);
                    }
                });
            }
        ], (err, result?: Form) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, result);
        });
    }

    /**
     * Asynchronously read a SubForm without transactions.
     * @param id - Input identifier that a subForm belongs to.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.subForm - SubForm or null if subForm not exists.
     */
    private executeReadSubForm(id: number, cb: (err: Error, subForm?: QueryResult) => void) {
        const queryString: string = "SELECT id, id_input, id_content_form FROM sub_form WHERE id_input=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously read a form without transactions.
     * @param id - Form identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.form - Form or null if form not exists.
     */
    private executeReadForm(id: number, cb: (err: Error, form?: QueryResult) => void) {
        const queryString: string = "SELECT id, title, description, times, status FROM form WHERE id=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously read inputs from database without transactions.
     * @param id - Form identifier which inputs are linked to.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - inputs or null if inputs not exists.
     */
    private executeReadInput(id: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "SELECT input.id, id_form, placement, input_type, question, \
                                    enabled, input.description FROM form f \
                                    INNER JOIN input ON f.id=id_form \
                                    WHERE f.id=$1 AND enabled=true ORDER BY input.id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously read validations from database without transactions.
     * @param id - Form identifier which validations from inputs are linked to.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Validations or null if validations not exists.
     */
    private executeReadValidation(id: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "SELECT input_validation.id, id_input, validation_type FROM form f \
                                    INNER JOIN input ON f.id=id_form \
                                    INNER JOIN input_validation ON input.id=id_input \
                                    WHERE f.id=$1 AND enabled=true;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously read arguments from database without transactions.
     * @param id - Form identifier which arguments from validatation are linked to.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Arguments or null if arguments not exists.
     */
    private executeReadArgument(id: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "SELECT input_validation_argument.id, id_input_validation AS id_validation, \
                                     input_validation_argument.placement, argument FROM form f\
                                     INNER JOIN input i ON f.id=id_form \
                                     INNER JOIN input_validation iv ON i.id=id_input \
                                     INNER JOIN input_validation_argument ON iv.id=id_input_validation \
                                     WHERE f.id=$1 AND enabled=true;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously read sugestions from database without transactions.
     * @param id - Form identifier wich sugestions from inputs are linked to.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Sugestions or null if sugestions not exists.
     */
    private executeReadSugestion(id: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "SELECT input_sugestion.id, id_input, value, input_sugestion.placement \
                                     FROM form f \
                                     INNER JOIN input ON f.id=id_form \
                                     INNER JOIN input_sugestion ON input.id=id_input \
                                     WHERE f.id=$1 AND enabled=true ORDER BY input.id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously write a form on database.
     * @param form - Form to be inserted.
     * @param cb - Callback function which contains the inserted data.
     * @param cb.err - Error information when the method fails.
     * @param cb.formResult - Form or null if form any error occurs.
     */
    public write(form: Form, cb: (err: Error, form?: Form) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: number) => void) => {
                this.writeController(form, (error: Error, resultId?: number) => {
                    callback(error, resultId);
                });
            },
            (formId: number, callback: (err: Error, result?: number) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, formId);
                });
            },
            (formId: number, callback: (err: Error, result?: Form) => void) => {
                this.read(formId, (error: Error, resultForm?: Form) => {
                    callback(error, resultForm);
                });
            }
        ], (err, formResult?: Form) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                });
                return;
            }
            cb(null, formResult);
        });
    }

    /**
     * Asynchronously write a form on database without transactions.
     * @param form - Form to be inserted.
     * @param cb - Callback function which contains the inserted data.
     * @param cb.err - Error information when the method fails.
     * @param cb.formId - Form identifier or null if form any error occurs.
     */
    private writeController(form: Form, cb: (Err: Error, formId?: number) => void) {
        waterfall([
            (callback: (err: Error, result?: number) => void) => {
                this.executeWriteForm(form, (error: Error, resultId?: number) => {
                    callback(error, resultId);
                });
            },
            (formId: number, callback: (err: Error, result?: number) => void) => {
                eachSeries(form.inputs, (input, innerCallback) => {
                    this.writeInputController(formId, input, (error: Error) => {
                        innerCallback(error);
                    });
                }, (e) => {
                    callback(e, formId);
                });
            }
        ], (err, id?: number) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, id);
        });

    }

    /**
     * Asynchronously write a input on database without transactions.
     * @param formId - Form identifier which inputs are linked to.
     * @param input - A input to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private writeInputController(formId: number, input: Input, cb: (err: Error, inputId?: number) => void) {
        waterfall([
            (callback: (err: Error, result?: number) => void) => {
                this.executeWriteInput(formId, input, callback);
            },
            (inputId: number, callback: (err: Error, resultInputId?: number) => void) => {
                this.writeValidationController(inputId, input.validation, (error: Error) => {
                    callback(error, inputId);
                });
            },
            (inputId: number, callback: (err: Error, resultInputId?: number) => void) => {
                this.writeSugestionController(inputId, input.sugestions, (error: Error) => {
                    callback(error, inputId);
                });
            },
            (inputId: number, callback: (err: Error, resultInputId?: number) => void) => {
                this.writeSubFormController(formId, inputId, input, (error: Error) => {
                    callback(error, inputId);
                });
            }
        ], (err, id?: number) => {
            cb(err, id);
            return;
        });
    }

    /**
     * Asynchronously write a write a SubForm on database and update a input with his identifier.
     * @param formId - Form identifier which SubForms are linked to.
     * @param inputId - Input identifier which SubForms are linked to.
     * @param input - Input that contains the subform to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private writeSubFormController(formId: number, inputId: number, input: Input, cb: (err: Error) => void) {
        if (input.type !== InputType.SUBFORM) {
            cb(null);
            return;
        } else {
            waterfall([
                (callback: (err: Error) => void) => {
                    this.executeVerifyForm(input.subForm.contentFormId, (error: Error) => {
                        callback(error);
                    });
                },
                (callback: (err: Error) => void) => {
                    this.executeWriteSubForm(inputId, input.subForm.contentFormId, callback);
                }
            ], (err) => {
                cb(err);
                return;
            });
        }
    }

    /**
     * Verify if a Form exists in the database.
     * @param id - Form identifier to be verified.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private executeVerifyForm(id: number, cb: (err: Error) => void) {
        const queryString: string = "SELECT id FROM form where id=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (error: Error, result?: QueryResult) => {

            if (result.rowCount !== 1) {
                cb(ErrorHandler.badIdAmount(result.rowCount));
                return;
            }

            cb(error);
            return;
        });
    }
    /**
     * Asynchronously write a validation on database without transactions.
     * @param inputId - Input identifier which validations are linked to.
     * @param validations - A list of validations to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private writeValidationController(inputId: number, validations: Validation[], cb: (err: Error) => void) {
        let i: number;

        eachSeries(validations, (validation, callback) => {
            this.executeWriteValidation(inputId, validation, (err: Error, validationId?: number) => {
                i = 0;
                eachSeries(validation.arguments, (argument, innerCallback) => {
                    this.executeWriteArgument(validationId, argument, i++, innerCallback);
                }, (error) => {
                    callback(error);
                });
            });
        }, (err) => {
            cb(err);
        });
    }

    /**
     * Asynchronously write a sugestion on database without transactions.
     * @param inputId - Input identifier which sugestions are linked to.
     * @param sugestions - A list of sugestions to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private writeSugestionController(inputId: number, sugestions: Sugestion[], cb: (err: Error) => void) {
        eachSeries(sugestions, (sugestion, callback) => {
            this.executeWriteSugestion(inputId, sugestion, callback);
        }, (err) => {
            cb(err);
        });
    }

    /**
     * Asynchronously insert a form on database without transactions.
     * @param form - Form to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Form identifier or null if any error occurs.
     */
    private executeWriteForm(form: Form, cb: (err: Error, result?: number) => void) {
        const queryString: string = "INSERT INTO form (title, description, times, status) \
                                     VALUES ($1, $2, $3, $4) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                form.title
                , form.description
                , form.answerTimes
                , form.status
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, result.rows[0]["id"]);
        });
    }

    /**
     * Asynchronously insert a form on database without transactions.
     * @param inputId - Input identifier to be linked with a subForm.
     * @param contentFormId - A Form identifier to be linked with the SubForm object.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Form identifier or null if any error occurs.
     */
    private executeWriteSubForm(inputId: number, contentFormId: number, cb: (err: Error, result?: number) => void) {
        const queryString: string = "INSERT INTO sub_form (id_input, id_content_form) \
                                     VALUES ($1, $2)";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                inputId
                , contentFormId
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null);
            return;
        });
    }

    /**
     * Asynchronously insert a input on database without transactions.
     * @param formId - Form identifier which input are linked to.
     * @param input - A input to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param cb.resultId - Input identifier or null if any error occurs.
     */
    private executeWriteInput(formId: number, input: Input, cb: (err: Error, resultId?: number) => void) {
        const queryString: string = "INSERT INTO input (id_form, placement, input_type, enabled, question, description) \
                                     VALUES ($1, $2, $3, $4, $5, $6) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                formId
                , input.placement
                , EnumHandler.stringifyInputType(input.type)
                , true
                , input.question
                , input.description
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result.rows[0]["id"]);
        });
    }

    /**
     * Asynchronously insert a validation on database without transactions.
     * @param inputId - Input identifier which validations are linked to.
     * @param validation - Validation to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Validation identifier or null if any error occurs.
     */
    private executeWriteValidation(inputId: number, validation: Validation, cb: (err: Error, result?: number) => void) {
        const queryString: string = "INSERT INTO input_validation (id_input, validation_type) \
                                     VALUES ($1, $2) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                inputId
                , EnumHandler.stringifyValidationType(validation.type)
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result.rows[0]["id"]);
        });
    }

    /**
     * Asynchronously insert a argument on database without transactions.
     * @param validationId - Validation identifier which argument are linked to.
     * @param argument - The argument string to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private executeWriteArgument(validationId: number, argument: string, placement: number, cb: (err: Error) => void) {
        const queryString: string = "INSERT INTO input_validation_argument (id_input_validation, argument, placement) \
                                     VALUES ($1, $2, $3) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                validationId
                , argument
                , placement
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }

    /**
     * Asynchronously insert a sugestion on database without transactions.
     * @param inputId - Input identifier which sugestion are linked to.
     * @param sugestion - Sugestions to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Form identifier or null if any error occurs.
     */
    private executeWriteSugestion(inputId: number, sugestion: Sugestion, cb: (err: Error) => void) {
        const queryString: string = "INSERT INTO input_sugestion (id_input, value, placement) \
                                     VALUES ($1, $2, $3);";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                inputId
                , sugestion.value
                , sugestion.placement
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }

    /**
     * Asynchronously update a form on database.
     * @param formUpdate - FormUpdate object that contains the Form to be updated.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    public update(formUpdate: FormUpdate, cb: (err: Error) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: Form) => void) => {
                this.updateController(formUpdate, (error: Error, resultForm?: Form) => {
                    callback(error, resultForm);
                });
            },
            (form: Form, callback: (err: Error, result?: Form) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, form);
                });
            }
        ], (err) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                });
                return;
            }
            cb(null);
        });
    }

    /**
     * Asynchronously update a form on database without transactions.
     * @param formUpdate - FormUpdate object that contains the data to update.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private updateController(formUpdate: FormUpdate, cb: (err: Error) => void) {
        waterfall([
            // Update form fields on database
            (callback: (err: Error) => void) => {
                if (formUpdate.changed) {
                    this.updateFormController(formUpdate.form, (error: Error) => {
                        callback(error);
                    });
                } else {
                    callback(null);
                }
            },
            // Update inputs on database
            (callback: (err: Error, formUpdateResult?: FormUpdate) => void) => {
                this.updateInputsController(formUpdate.form.id, formUpdate.inputUpdates, (error: Error, inputUpdateResult: InputUpdate[]) => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    const formUpdateTmp: FormUpdate = {
                        id: formUpdate.id
                        , form: formUpdate.form
                        , updateDate: formUpdate.updateDate
                        , changed: formUpdate.changed
                        , inputUpdates: inputUpdateResult
                    };

                    callback(null, formUpdateTmp);
                });
            },
            // Write formUpdate on database
            (formUpdateTmp: FormUpdate, callback: (err: Error, formUpdateTmp?: FormUpdate, resultId?: number) => void) => {
                this.executeWriteFormUpdate(formUpdateTmp, (error: Error, formUpdateResultId?: number) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback(null, formUpdateTmp, formUpdateResultId);
                });
            },
            // Write inputUpdate on database
            (formUpdateTmp: FormUpdate, formUpdateId: number, callback: (err: Error) => void) => {
                eachSeries(formUpdateTmp.inputUpdates, (inputUpdate, innerCallback) => {
                    this.executeWriteInputUpdate(formUpdateId, inputUpdate, innerCallback);
                }, (err) => {
                    callback(err);
                });
            }
        ], (err) => {
            cb(err);
        });
    }

    /**
     * Asynchronously update a form on database.
     * @param form - Form to be updated.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private updateFormController(form: Form, cb: (err: Error) => void) {
        waterfall([
            (callback: (err: Error) => void) => {
                this.executeUpdateForm(form.title, form.id, "title", callback);
            },
            (callback: (err: Error) => void) => {
                this.executeUpdateForm(form.description, form.id, "description", callback);
            },
            (callback: (err: Error) => void) => {
                this.executeUpdateForm(form.answerTimes, form.id, "times", callback);
            },
            (callback: (err: Error) => void) => {
                this.executeUpdateForm(form.status, form.id, "status", callback);
            }
        ], (error) => {
            cb(error);
        });
    }

    /**
     * Check if exists a loop on subForms.
     * @param fathers - Form identifiers ids of subForms that has been already readed.
     * @param input - Input with a subForm to be checked.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    private checkSubFormLoop(fathers: number[], input: Input, cb: (err: Error) => void) {
        waterfall([
            (callback: (error: Error) => void) => {
                let error: Error = null;
                for (const i of fathers) {
                    if (input.subForm.contentFormId === i) {
                        error = new Error("Found a subform loop");
                    }
                }
                callback(error);
            },
            (callback: (error: Error, formResult?: Form) => void) => {
                this.readController(input.subForm.contentFormId, callback);
            },
            (form: Form, callback: (err: Error) => void) => {
                eachSeries(form.inputs, (j, innerCallback) => {
                    if (j.type === InputType.SUBFORM) {
                        fathers.push(input.subForm.contentFormId);
                        this.checkSubFormLoop(fathers, j, innerCallback);
                    } else {
                        innerCallback(null);
                    }
                }, (err) => {
                    callback(err);
                });
            }
        ], (error) => {
            cb(error);
            return;
        });
    }

    /**
     * Asynchronously update a list of inputs on database without transactions.
     * @param formId - Form identifier which update are linked to.
     * @param inputUpdates - InputUpdate array which contains the update information.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param inputUpdateResult - InputUpdate or null if method fails.
     */
    private updateInputsController(formId: number, inputUpdates: InputUpdate[], cb: (err: Error, inputUpdateResult?: InputUpdate[]) => void) {

        const inputUpdatesTmp: InputUpdate[] = [];

        eachSeries(inputUpdates, (inputUpdate, callback) => {
            switch (inputUpdate.inputOperation) {
                case UpdateType.ADD: {
                    waterfall([
                        (innerCallback: (err: Error) => void) => {
                            const vector: number[] = [formId];
                            if (inputUpdate.input.type === InputType.SUBFORM) {
                                this.checkSubFormLoop(vector, inputUpdate.input, innerCallback);
                            } else {
                                innerCallback(null);
                            }
                        },
                        (innerCallback: (err: Error) => void) => {
                            this.writeInputController(formId, inputUpdate.input, (err: Error, id: number) => {

                                if (err) {
                                    innerCallback(err);
                                    return;
                                }

                                const inputOpt: InputOptions = inputUpdate.input;
                                inputOpt.id = id;

                                const inputUpdateOpt: InputUpdateOptions = {
                                    input: inputOpt
                                    , inputOperation: UpdateType.ADD
                                    , value: null
                                };

                                inputUpdatesTmp.push(new InputUpdate(inputUpdateOpt));
                                innerCallback(null);
                            });
                        }
                    ], (err) => {
                        callback(err);
                    });
                    break;
                }
                case UpdateType.REMOVE: {
                    // Set enabled option in database as false
                    this.executeUpdateInput(0, inputUpdate.input.id, "enabled", (err: Error) => {

                        if (err) {
                            callback(err);
                            return;
                        }

                        inputUpdatesTmp.push(inputUpdate);
                        callback(null);
                    });
                    break;
                }
                case UpdateType.SWAP: {
                    // Update placement option in database of a input
                    this.executeUpdateInput(inputUpdate.input.placement, inputUpdate.input.id, "placement", (err: Error) => {

                        if (err) {
                            callback(err);
                            return;
                        }

                        inputUpdatesTmp.push(inputUpdate);
                        callback(null);
                    });
                    break;
                }
                case UpdateType.REENABLED: {
                    // Set enabled option in database as true
                    this.executeUpdateInput(1, inputUpdate.input.id, "enabled", (err: Error) => {

                        if (err) {
                            callback(err);
                            return;
                        }

                        inputUpdatesTmp.push(inputUpdate);
                        callback(null);
                    });
                    break;
                }
                default: {
                    callback(new Error("Operation " + inputUpdate.inputOperation + " not recognized"));
                    break;
                }
            }
        }, (error) => {
            if (error) {
                cb(error);
                return;
            }
            cb(null, inputUpdatesTmp);
        });
    }

    /**
     * Asynchronously update form's fields on database without transactions.
     * @param value - A string to be inserted in the database.
     * @param id - The form id that should be updated.
     * @param field - The field on database that should be updated.
     * @param cb - Callback function.
     * @param cb.err - Error information when method fails.
     */
    private executeUpdateForm(value: any, id: number, field: string, cb: (err: Error) => void) {
        const queryString: string = "UPDATE form SET " + field + " = $1 WHERE id = $2";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                value
                , id
            ]
        };
        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }

    /**
     * Asynchronously update a input field on database without transactions.
     * @param value - A number to be inserted in the database.
     * @param id - The input id that should be updated.
     * @param field - The field on database that should be updated.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     */
    private executeUpdateInput(value: number, id: number, field: string, cb: (err: Error) => void) {
        const queryString: string = "UPDATE input SET " + field + " = $1 WHERE id = $2";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                value
                , id
            ]
        };
        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }

    /**
     * Asynchronously insert a formUpdate on database without transactions.
     * @param formUpdate - Form Update to be inserted.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     * @param cb.formUpdateId - The id of the inserted FormUpdate.
     */
    private executeWriteFormUpdate(formUpdate: FormUpdate, cb: (err: Error, formUpdateId?: number) => void) {

        const queryString: string = "INSERT INTO form_update (id_form, update_date) \
                                     VALUES ( $1, $2 ) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                formUpdate.form.id
                , formUpdate.updateDate
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, result.rows[0].id);
        });
    }

    /**
     * Asynchronously insert a inputUpdate on database without transactions.
     * @param idFormUpdate - FormUpdate identifier to link with the InputUpdate.
     * @param inputUpdate - InputUpdate to be inserted.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     */
    private executeWriteInputUpdate(idFormUpdate: number, inputUpdate: InputUpdate, cb: (err: Error) => void) {

        const queryString: string = "INSERT INTO input_update (id_form_update, id_input, input_operation_id, value) \
                                     VALUES ( $1, $2, $3, $4 );";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                idFormUpdate
                , inputUpdate.input.id
                , inputUpdate.inputOperation
                , inputUpdate.value
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }
}
