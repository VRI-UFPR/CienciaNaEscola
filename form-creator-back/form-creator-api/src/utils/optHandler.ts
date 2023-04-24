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

import { Form, FormOptions } from "../core/form";
import { FormAnswerOptions } from "../core/formAnswer";
import { FormUpdate, FormUpdateOptions } from "../core/formUpdate";
import { InputOptions, Sugestion, Validation } from "../core/input";
import { InputAnswer, InputAnswerDict, InputAnswerOptions, InputAnswerOptionsDict } from "../core/inputAnswer";
import { InputUpdate, InputUpdateOptions } from "../core/inputUpdate";
import { SubForm, SubFormOptions } from "../core/subForm";
import { User, UserOptions } from "./../core/user";
import { InputType, UpdateType } from "./enumHandler";
import { ErrorHandler } from "./errorHandler";

/**
 * OptHandler to handle an object and transform into a Classoptions to be used in Class's constructor
 */
export class OptHandler {
    /**
     * Return an FormOptions instance with a parsed object, The main objective is parse any error previously
     * @param obj - object that should be parsed.
     * @returns - An FormOptions instance.
     */
    public static form(obj: any): FormOptions {

        if (obj.title === undefined) {
            throw ErrorHandler.notFound("Form title");
        }
        if (obj.description === undefined) {
            throw ErrorHandler.notFound("Form description");
        }
        if (obj.inputs === undefined || !(obj.inputs instanceof Array)) {
            throw ErrorHandler.notFound("Form inputs");
        }
        const option: FormOptions = {
            title: obj.title,
            description: obj.description,
            id: obj.id,
            inputs: obj.inputs.map((i: any) => OptHandler.input(i)),
            answerTimes: obj.answerTimes,
            status: obj.status,
        };

        return option;

    }

    /**
     * Return an InputOptions instance with a parsed object, The main objective is parse any error previously
     * @param obj - object that should be parsed.
     * @returns - An InputOptions instance.
     */
    public static input(obj: any): InputOptions {
        if (obj.placement === undefined) {
            throw ErrorHandler.notFound("Input placement");
        }
        if (obj.description === undefined) {
            throw ErrorHandler.notFound("Input description");
        }
        if (obj.question === undefined) {
            throw ErrorHandler.notFound("Input question");
        }
        if (obj.type === undefined) {
            throw ErrorHandler.notFound("Input type");
        }
        if (obj.validation === undefined || !(obj.validation instanceof Array)) {
            throw ErrorHandler.notFound("Input validation");
        }
        if ((obj.type === InputType.SUBFORM) && ((obj.subForm === undefined) || (obj.subForm === null))) {
            throw ErrorHandler.notFound("Input subform");
        }

        let subForm: SubForm = null;
        if ((obj.subForm !== null) && (obj.subForm !== undefined)) {
            subForm = new SubForm(OptHandler.subForm(obj.subForm));
        }

        const option: InputOptions = {
            id: obj.id,
            placement: obj.placement,
            description: obj.description,
            question: obj.question,
            enabled: obj.enabled,
            type: obj.type,
            validation: obj.validation.map((v: any) => {
                return { type: v.type, arguments: v.arguments };
            }),
            sugestions: [],
            subForm
        };

        if (obj.sugestions instanceof Array) {
            option.sugestions = obj.sugestions.map((v: any) => {
                return OptHandler.sugestion(v);
            });
        }

        return option;
    }

    /**
     * Return an formAnswerOptions instance with a parsed and validated object, The main objective is parse any error previously
     * @param obj - object that should be parsed.
     * @returns - An FormAnswerOptions instance.
     */
    public static formAnswer(obj: any): FormAnswerOptions {
        if (obj.form === undefined || !(obj.form instanceof Form)) {
            throw ErrorHandler.notFound("Form");
        }
        if (obj.timestamp === undefined || !(obj.timestamp instanceof Date)) {
            throw ErrorHandler.notFound("Answer Date");
        }
        if (obj.inputsAnswerOptions === undefined) {
            throw ErrorHandler.notFound("Input Answers");
        }

        const inputsAnswerOptionsTmp: InputAnswerOptionsDict = {};
        for (const key of Object.keys(obj.inputsAnswerOptions)) {
            inputsAnswerOptionsTmp[parseInt(key, 10)] = obj.inputsAnswerOptions[parseInt(key, 10)].map((i: InputAnswerOptions) => {
                return OptHandler.inputAnswer(i);
            });
        }

        const option: FormAnswerOptions = {
            id: obj.id
            , form: obj.form
            , timestamp: obj.timestamp
            , inputsAnswerOptions: inputsAnswerOptionsTmp
        };

        return option;
    }

    /**
     * Return an InputAnswerOptions instance with a parsed and validated object, The main objective is parse any error previously
     * @param obj - object that should be parsed.
     * @returns - An InputAnswerOptions instance.
     */
    public static inputAnswer(obj: any): InputAnswerOptions {
        if (obj.idInput === undefined) {
            throw ErrorHandler.notFound("idInput");
        }
        if (obj.placement === undefined) {
            throw ErrorHandler.notFound("Placement");
        }
        if (obj.value === undefined) {
            throw ErrorHandler.notFound("Value");
        }

        let subForm: FormAnswerOptions = null;

        if ((obj.subForm !== null) && (obj.subForm !== undefined)) {
            subForm = this.formAnswer(obj.subForm);
        }

        const option: InputAnswerOptions = {
            id: obj.id
            , idInput: obj.idInput
            , placement: obj.placement
            , value: obj.value
            , subForm
        };

        return option;
    }

    /**
     * Return an FormUpdateOptions instance with a parsed and validated object. The main objective is parse any error previously
     * @param obj - object that should be parsed.
     * @returns - An FormUpdateOptions instance.
     */
    public static formUpdate(obj: any): FormUpdateOptions {
        if (obj.form === undefined) {
            throw ErrorHandler.notFound("form");
        }
        if ((obj.inputUpdates === undefined) || !(obj.inputUpdates instanceof Array)) {
            throw ErrorHandler.notFound("inputUpdates");
        }

        const option: FormUpdateOptions = {
            id: obj.id
            , form: OptHandler.form(obj.form)
            , updateDate: obj.updateDate
            , inputUpdates: obj.inputUpdates.map((i: any) => OptHandler.inputUpdate(i))
        };

        return option;
    }

    /**
     * Return an FormUpdateOptions instance with a parsed and validated object. The main objective is to detect parsing errors previously
     * @param obj - object that should be parsed.
     * @returns - An FormUpdateOptions instance.
     */
    public static inputUpdate(obj: any): InputUpdateOptions {
        if (obj.input === undefined) {
            throw ErrorHandler.notFound("input");
        }
        if (obj.inputOperation === undefined) {
            throw ErrorHandler.notFound("inputOperation");
        }
        if (obj.value === undefined) {
            throw ErrorHandler.notFound("value");
        }

        const option: InputUpdateOptions = {
            id: obj.id
            , input: OptHandler.input(obj.input)
            , inputOperation: obj.inputOperation
            , value: obj.value
        };

        return option;
    }

    /**
     * Return a parsed and validated sugestion.
     * @param obj - object that should be parsed.
     * @returns - Sugestion instance.
     */
    public static sugestion(obj: any): Sugestion {

        if (typeof (obj.value) !== "string") {
            throw ErrorHandler.notFound("Sugestion value");
        }
        if (typeof (obj.placement) !== "number") {
            throw ErrorHandler.notFound("Sugestion placement");
        }

        const option: Sugestion = {
            value: obj.value
            , placement: obj.placement
        };

        return option;
    }

    /**
     * Return an UserOptions instance with a parsed and validated object. The main objective is to detect parsing errors previously
     * @param obj - object to be parsed
     * @returns - an UserOptions instance
     */
    public static User(obj: any, hashedPw?: string): UserOptions {
        if (obj.name === undefined) {
            throw ErrorHandler.notFound("name");
        }
        if (obj.email === undefined) {
            throw ErrorHandler.notFound("email");
        }

        if (!hashedPw) {
            const optionNoHash: UserOptions = {
                name: obj.name
                , email: obj.email
                , id: obj.id
                , forms: obj.forms
            };

            return optionNoHash;
        }

        const option: UserOptions = {
            name: obj.name
            , email: obj.email
            , id: obj.id
            , hash: hashedPw
            , forms: obj.forms
        };

        return option;
    }

    public static subForm(obj: any): SubForm {
        if (obj.contentFormId === undefined) {
            throw ErrorHandler.notFound("SubForm ContentForm");
        }

        const option: SubForm = {
            id: obj.id
            , inputId: obj.inputId
            , contentFormId: obj.contentFormId
        };

        return option;
    }

    /**
     * Return an FormOptions instance with a parsed object, The main objective is parse any error previously
     * @param obj - object that should be parsed.
     * @returns - An FormOptions instance.
     */
    public static formEdit(obj: any): FormOptions {

        if (obj.id === undefined) {
            throw ErrorHandler.notFound("Form id");
        }
        if (obj.title === undefined) {
            throw ErrorHandler.notFound("Form title");
        }
        if (obj.description === undefined) {
            throw ErrorHandler.notFound("Form description");
        }
        if (obj.inputs === undefined || !(obj.inputs instanceof Array)) {
            throw ErrorHandler.notFound("Form inputs");
        }
        const option: FormOptions = {
            title: obj.title,
            description: obj.description,
            id: obj.id,
            inputs: obj.inputs.map((i: any) => OptHandler.input(i)),
            answerTimes: obj.answerTimes,
            status: obj.status
        };

        return option;

    }
}
