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

import { eachSeries, waterfall } from "async";
import { Pool, QueryResult } from "pg";
import { Form } from "../core/form";
import { FormAnswer, FormAnswerOptions } from "../core/formAnswer";
import { InputAnswer, InputAnswerOptions, InputAnswerOptionsDict } from "../core/inputAnswer";
import { ErrorHandler } from "./errorHandler";
import { FormQueryBuilder } from "./formQueryBuilder";
import { OptHandler } from "./optHandler";
import { QueryBuilder, QueryOptions } from "./queryBuilder";
import { Sorter } from "./sorter";
/**
 * Class used to manage all the Answer operations into the database.
 * This operations include read and write data.
 */
export class AnswerQueryBuilder extends QueryBuilder {

    private formQueryBuilder: FormQueryBuilder;

    constructor(builder: FormQueryBuilder, pool: Pool) {
        super(pool);
        this.formQueryBuilder = builder;
    }

    /**
     * Asynchronously write a Answer on database.
     * @param formAnswer - FormAnswer to be inserted.
     * @param cb - Callback function which contains the inserted data.
     * @param cb.err - Error information when the method fails.
     * @param cb.form - FormAnswer or null if any error occurs.
     */
    public write(formAnswer: FormAnswer, cb: (err: Error, result?: FormAnswer) => void) {

        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: number) => void) => {
                this.writeController(formAnswer, (error: Error, resultAnswerId?: number) => {
                    callback(error, resultAnswerId);
                });
            },
            (formAnswerId: number, callback: (err: Error, result?: number) => void) => {
                this.commit((error: Error) => {
                    callback(error, formAnswerId);
                });
            },
            (formAnswerId: number, callback: (err: Error, result?: FormAnswer) => void) => {
                this.read(formAnswerId, (error: Error, formAnswerResult?: FormAnswer) => {
                    callback(error, formAnswerResult);
                });
            }

        ], (err, formAnswerResult?: FormAnswer) => {
            if (err) {
                this.rollback(() => {
                    cb(err);
                });
                return;
            }
            cb(null, formAnswerResult);
        });
    }

    /**
     * Asynchronously write a Answer on database without transactions.
     * @param formAnswer - FormAnswer identifier to be inserted.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.form - FormAnswer identifier or null if any error occurs.
     */
    private writeController(formAnswer: FormAnswer, cb: (err: Error, result?: number) => void) {
        waterfall([
            (callback: (err: Error, result?: any) => void) => {
                this.executeWriteForm(formAnswer, (error: Error, resultId?: number) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback(null, resultId);
                });
            },
            (formAnswerId: number, callback: (err: Error, result?: any) => void) => {
                eachSeries(Object.keys(formAnswer.inputAnswers), (key, outerCallback) => {
                    eachSeries(formAnswer.inputAnswers[parseInt(key, 10)], (inputsAnswer, innerCallback) => {
                        this.writeInputController(formAnswerId, inputsAnswer, innerCallback);
                    }, (error) => {
                        outerCallback(error);
                    });
                }, (err) => {
                    callback(err, formAnswerId);
                });
            }
        ], (err, id?: number) => {
            cb(err, id);
            return;
        });
    }

    /**
     * Asynchronously write a Answer on database without transactions.
     * @param formAnswerId - FormAnswer identifier to link with inputAnswer.
     * @param inputAnswer - InputAnswer to be inserted.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     */
    private writeInputController(formAnswerId: number, inputAnswer: InputAnswer, cb: (err: Error) => void) {
        waterfall([
            (callback: (err: Error, result?: number) => void) => {
                this.executeWriteInput(formAnswerId, inputAnswer, (err: Error, id?: number) => {
                    callback(err, id);
                });
            },
            (inputId: number, callback: (err: Error) => void) => {
                this.writeSubFormController(inputAnswer.subForm, inputId, (err: Error) => {
                    callback(err);
                });
            }
        ], () => {
            cb(null);
            return;
        });
    }

    /**
     * Asynchronously write a Answer on database without transactions.
     * @param subForm - FormAnswer that will be inserted.
     * @param inputId - InputAnswer identifier to be linked with the subFormAnswer (FormAnswer object).
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     */
    private writeSubFormController(subForm: FormAnswer, inputId: number, cb: (err: Error) => void) {
        if (subForm !== null) {
            waterfall([
                (callback: (err: Error, result?: number) => void) => {
                    this.writeController(subForm, (err: Error, subFormId?: number) => {
                        callback(err, subFormId);
                    });
                },
                (subFormId: number, callback: (err: Error) => void) => {
                    this.executeUpdateInput(subFormId, inputId, callback);
                }
            ], (err) => {
                cb(err);
                return;
            });
        } else {
            cb(null);
            return;
        }
    }

    /**
     * Asynchronously insert a FormAnswer on database.
     * @param formAnswer - FormAnswer to be inserted.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - FormAnswer identifier or null if any error occurs.
     */
    private executeWriteForm(formAnswer: FormAnswer, cb: (err: Error, result?: number) => void) {
        const queryString: string = "INSERT INTO form_answer (id_form, answered_at) \
                                     VALUES( $1, $2 ) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                formAnswer.form.id
                , formAnswer.timestamp
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }

            if (result.rowCount !== 1) {
                cb(ErrorHandler.notInserted("FormAnswer"));
                return;
            }
            cb(null, result.rows[0]["id"]);
        });
    }

    /**
     * Asynchronously write a Answer on database without transactions.
     * @param formAnswer - FormAnswer identifier to be linked with the inputAnswer.
     * @param inputAnswer - InputAnswer that should be inserted.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - InputAnswer identifier or null if any error occurs.
     */
    private executeWriteInput(formAnswerId: number, inputAnswer: InputAnswer, cb: (err: Error, result?: number) => void) {
        const queryString: string = "INSERT INTO input_answer (id_form_answer, id_input, id_sub_form, value, placement) \
                                     VALUES ( $1, $2, $3, $4, $5 ) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                formAnswerId
                , inputAnswer.idInput
                , inputAnswer.subForm ? inputAnswer.subForm.id : null
                , inputAnswer.value
                , inputAnswer.placement
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {

            if (err) {
                cb(err);
                return;
            }

            if (result.rowCount !== 1) {
                cb(ErrorHandler.notInserted("InputsAnswer"));
                return;
            }

            cb(null, result.rows[0]["id"]);
        });
    }

    /**
     * Asynchronously insert a inputAnswer on database without transactions.
     * @param formAnswerId - Indentifier to relate with InputAnswer.
     * @param inputAnswerId - InputAnswer Indentifier to be updated.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     */
    private executeUpdateInput(formAnswerId: number, inputAnswerId: number, cb: (err: Error) => void) {
        const queryString: string = "UPDATE input_answer \
                                     SET id_sub_form=$1 \
                                     WHERE id=$2;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                formAnswerId
                , inputAnswerId
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }

            if (result.rowCount !== 1) {
                cb(ErrorHandler.notInserted("InputsAnswer"));
                return;
            }

            cb(null);
        });
    }

    /**
     * Asynchronously read a FormAnswer from database.
     * @param formAnswerId - FormAnswer identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.formAnswers - FormAnswer object or null if form not exists.
     */
    public read(formAnswerId: number, cb: (err: Error, formAnswers?: FormAnswer) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: FormAnswerOptions) => void) => {
                this.readController(formAnswerId, (error: Error, result?: FormAnswerOptions) => {
                    callback(error, result ? result : null);
                });
            },
            (formAnswer: FormAnswerOptions, callback: (err: Error, result?: FormAnswerOptions) => void) => {
                this.commit((error: Error) => {
                    callback(error, formAnswer);
                });
            },
            (formAnswer: FormAnswerOptions, callback: (err: Error, result?: FormAnswer) => void) => {
                this.formQueryBuilder.read(formAnswer.form.id, (error: Error, resultForm?: Form) => {
                    const formAnswerObj: FormAnswerOptions = {
                        id: formAnswer.id
                        , form: resultForm
                        , timestamp: formAnswer.timestamp
                        , inputsAnswerOptions: formAnswer.inputsAnswerOptions
                    };
                    callback(error, new FormAnswer(formAnswerObj));
                });
            }
        ], (err, formAnswer?: FormAnswer) => {
            if (err) {
                this.rollback(() => {
                    cb(err);
                });
                return;
            }
            cb(null, formAnswer);
        });
    }

    /**
     * Asynchronously read all FormAnswer from a form database with transaction.
     * @param formId - Form identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.formAnswers - FormAnswers array object or null if form not exists.
     */
    public readAll(formId: number, cb: (err: Error, formAnswers?: FormAnswer[]) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: number[]) => void) => {
                this.getFormAnswerIDs(formId, (err: Error, result: number[]) => {
                    callback(err, result);
                });
            },
            (formAnswerIDs: number[], callback: (err: Error, result?: FormAnswerOptions[]) => void) => {
                const formAnswers: FormAnswerOptions[] = [];
                eachSeries(formAnswerIDs, (formAnswerId, innerCallback) => {
                    this.readController(formAnswerId, (error: Error, result?: FormAnswerOptions) => {
                        if (result) {
                            formAnswers.push(result);
                        }

                        innerCallback(error);
                    });
                }, (error) => {
                    callback(error, formAnswers);
                });
            },
            (formAnswer: FormAnswerOptions[], callback: (err: Error, result?: FormAnswerOptions[]) => void) => {
                this.commit((error: Error) => {
                    callback(error, formAnswer);
                });
            },
            (formAnswersOpt: FormAnswerOptions[], callback: (err: Error, result?: FormAnswer[]) => void) => {

                const formAnswers: FormAnswer[] = [];

                eachSeries(formAnswersOpt, (formAnswer, innerCallback) => {
                    this.formQueryBuilder.read(formAnswer.form.id, (error: Error, resultForm?: Form) => {

                        const formAnswerObj: FormAnswerOptions = {
                            id: formAnswer.id
                            , form: resultForm
                            , timestamp: formAnswer.timestamp
                            , inputsAnswerOptions: formAnswer.inputsAnswerOptions
                        };

                        formAnswers.push(new FormAnswer(formAnswerObj));
                        innerCallback(error);
                    });
                }, (error) => {
                    callback(error, formAnswers);
                });
            }
        ], (err, formAnswers?: FormAnswer[]) => {
            if (err) {
                this.rollback(() => {
                    cb(err);
                });
                return;
            }
            cb(null, formAnswers);
        });
    }

    /**
     * Asynchronously read a FormAnswer from database without transaction.
     * @param formAnswerId - FormAnswer identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.resultAnswer - FormAnswer object or null if FormAnswer not exists.
     */
    private readController(formAnswerId: number, cb: (err: Error, resultAnswer?: FormAnswerOptions) => void) {
        waterfall([
            (callback: (err: Error, result?: InputAnswerOptions[]) => void) => {
                this.executeReadInput(formAnswerId, (err: Error, result?: QueryResult) => {
                    if (err) {
                        cb(err);
                        return;
                    }

                    const inputAnswersOpts: InputAnswerOptions[] = result.rows.map((inputsAnswerResult) => {
                        let subForm: FormAnswerOptions = null;
                        if (inputsAnswerResult["id_sub_form"]) {
                            subForm = {
                                id: parseInt(inputsAnswerResult["id_sub_form"], 10)
                                , form: new Form({
                                    id: 0
                                    , title: ""
                                    , description: ""
                                    , inputs: []
                                })
                                , timestamp: new Date()
                                , inputsAnswerOptions: []
                            };
                        }
                        const inputAnswersOpt: InputAnswerOptions = {
                            id: inputsAnswerResult["id"]
                            , idInput: inputsAnswerResult["id_input"]
                            , value: inputsAnswerResult["value"]
                            , placement: inputsAnswerResult["placement"]
                            , subForm
                        };
                        return OptHandler.inputAnswer(inputAnswersOpt);
                    });
                    callback(null, inputAnswersOpts);
                });
            },
            (inputAnswersTmp: InputAnswerOptions[], callback: (err: Error, result?: InputAnswerOptionsDict) => void) => {
                const inputAnswersOpts: InputAnswerOptions[] = [];
                eachSeries(inputAnswersTmp, (inputAnswer, innerCallback) => {
                    this.readSubFormController(inputAnswer, inputAnswersOpts, innerCallback);
                }, () => {
                    const inputsAnswerResults: InputAnswerOptionsDict = {};
                    for (const i of inputAnswersOpts) {
                        if (inputsAnswerResults[i["idInput"]]) {
                            inputsAnswerResults[i["idInput"]].push(i);
                            inputsAnswerResults[i["idInput"]] = Sorter.sortByPlacement(inputsAnswerResults[i["idInput"]]);
                        } else {
                            inputsAnswerResults[i["idInput"]] = [i];
                        }
                    }
                    callback(null, inputsAnswerResults);
                });
            },
            (inputsAnswerResults: InputAnswerOptionsDict, callback: (err: Error, result?: FormAnswerOptions) => void) => {
                waterfall([
                    (innerCallback: (err: Error, formAnswer?: FormAnswerOptions) => void) => {
                        this.executeReadForm(formAnswerId, (error: Error, answerResult?: any) => {
                            if (error) {
                                innerCallback(error);
                                return;
                            }
                            const formTmp: Form = {
                                id: answerResult.id_form
                                , title: undefined
                                , description: undefined
                                , inputs: []
                                , answerTimes: answerResult.answerTimes
                                , status: true
                            };
                            const formAnswerTmp: FormAnswerOptions = {
                                id: answerResult.id
                                , form: formTmp
                                , timestamp: answerResult.answered_at
                                , inputsAnswerOptions: inputsAnswerResults
                            };
                            innerCallback(null, formAnswerTmp);
                        });
                    },
                    (formAnswer: FormAnswerOptions, innerCallback: (err: Error, formAnswer?: FormAnswerOptions) => void) => {
                        this.formQueryBuilder.readController(formAnswer.form.id, (err: Error, form?: Form) => {
                            const formAnswerTmp: FormAnswerOptions = {
                                id: formAnswer.id
                                , form
                                , timestamp: formAnswer.timestamp
                                , inputsAnswerOptions: formAnswer.inputsAnswerOptions
                            };
                            innerCallback(null, formAnswerTmp);
                        });
                    }
                ], (err, formAnswer: FormAnswerOptions) => {
                    callback(err, formAnswer);
                });
            }
        ], (err, formAnswer: FormAnswerOptions) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, formAnswer);
        });
    }

    private getFormAnswerIDs(formId: number, cb: (err: Error, formAnswerIds: number[]) => void) {
        const queryString: string = "SELECT form_answer.id FROM form \
                                    INNER JOIN form_answer \
                                    ON form_answer.id_form=form.id \
                                    WHERE form.id=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [formId]
        };

        this.executeQuery(query, (error: Error, result?: QueryResult) => {
            const ids: number[] = [];
            for (const i of result.rows) {
                ids.push(i.id);
            }
            cb(error, ids);
        });
    }

    /**
     * Asynchronously read a SubFormAnswer (FormAnswer object) on database without transactions.
     * @param inputAnswer - InputAnswerOptions object that contains the subForm (if not null) that should be readed.
     * @param inputAnswerArray - InputAnswerOptions array that contains the inputs already validated.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     */
    private readSubFormController(inputAnswer: InputAnswerOptions, inputAnswerArray: InputAnswerOptions[], cb: (err: Error) => void) {
        if (inputAnswer.subForm === null) {
            inputAnswerArray.push(inputAnswer);
            cb(null);
            return;
        }

        this.readController(inputAnswer.subForm.id, (err: Error, formAnswer?: FormAnswerOptions) => {
            if (err) {
                cb(err);
                return;
            }
            const inputAnswerTmp: InputAnswerOptions = {
                id: inputAnswer.id
                , idInput: inputAnswer.idInput
                , placement: inputAnswer.placement
                , value: inputAnswer.value
                , subForm: formAnswer
            };
            inputAnswerArray.push(inputAnswerTmp);
            cb(null);
            return;
        });
    }

    /**
     * Asynchronously read a FormAnswer from database.
     * @param formAnswerId - FormAnswer identifier to be founded.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - The read FormAnswer result query row.
     */
    private executeReadForm(formAnswerId: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "SELECT id, id_form, answered_at \
                                     FROM form_answer \
                                     WHERE id=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [formAnswerId]
        };

        this.executeQuery(query, (error: Error, result?: QueryResult) => {
            if (result.rowCount !== 1) {
                cb(ErrorHandler.badIdAmount(result.rowCount));
                return;
            }

            cb(error, result.rows[0]);
        });
    }

    /**
     * Asynchronously read a InputAnswer from database without transactions.
     * @param formAnswerId - Identifier to read InputAnswers.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - The read InputAnswer result query.
     */
    private executeReadInput(formAnswerId: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "SELECT id, id_form_answer, id_input, id_sub_form, value, placement \
                                     FROM input_answer \
                                     WHERE id_form_answer=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [formAnswerId]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, result);
        });
    }
}
