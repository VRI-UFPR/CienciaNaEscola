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

import { FormAnswer } from "../core/formAnswer";
import { Input } from "../core/input";
import { InputAnswer, InputAnswerDict } from "../core/inputAnswer";
import { ValidationType } from "./enumHandler";
import { ValidationDict, ValidationError } from "./validationError";

/**
 * Validation's handler. Manage parse validation through the project.
 */
export class ValidationHandler {

    /**
     * Validate a string according given a regex.
     * @param answer - Answer to be validated.
     * @param regex - Regex to validate answer.
     * @returns - True if answer match regex, else false.
     */
    private static validateByRegex(answer: string, regex: string): boolean {
        const regexp = new RegExp(regex);
        return regexp.test(answer);
    }

    /**
     * Validate if is null, undefined nor "".
     * @param answer - answer to be validated.
     * @returns - True if not null, "" nor undefined, else false.
     */
    private static validateMandatory(answer: string): boolean {
        return ((!answer) === false);
    }

    /**
     * Validate if answer has minimum number of chars.
     * @param answer - Answer to be validated.
     * @param size - Minimum size that answer should have.
     * @returns - True if has at least Size chars, else false.
     */
    private static validateMinChar(answer: string, size: string): boolean {
        return (answer !== null && answer !== undefined && parseInt(size, 10) <= answer.length);
    }

    /**
     * Validate if answer has minimum number of chars.
     * @param answer - Answer to be validated.
     * @param size - Maximum size that answer should have.
     * @returns - True if has at max Size chars, else false.
     */
    private static validateMaxChar(answer: string, size: string): boolean {
        return (answer !== null && answer !== undefined && parseInt(size, 10) >= answer.length);
    }

    /**
     * Validate if answer is of a determined type.
     * @param answer - Answer to be validated.
     * @param type - Type that answer should be.
     * @returns - True if it is of the determined type, else false.
     */
    private static validateTypeOf(answer: string, type: string): boolean {
        // Using string here to avoid validate validations
        if (type === "int") {
            return (!isNaN(parseInt(answer, 10)));
        } else if (type === "float") {
            return (!isNaN(parseFloat(answer)));
        } else if (type === "date") {
            return ((new Date(answer)).toString() !== "Invalid Date");
        } else {
            return (false);
        }
    }

    /**
     * Validate if answer has minimum one checkbox checked.
     * @param input - Input that checkbox belongs to.
     * @param inputAnswer - Answers to checkbox.
     * @returns - true if has at minimum one checkbox marked, else false.
     */
    private static validateSomeCheckbox(input: Input, inputAnswers: InputAnswerDict): boolean {
        let result: boolean = false;
        for (const answer of inputAnswers[input.id]) {
            if ((answer.value === "true") && this.inputSugestionExists(input, answer.placement)) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Validate if a sugestion exists.
     * @param input - Input that have sugestions to be verified.
     * @param placement - Value of answer to be verified.
     * @returns - True if sugestion exists, else false.
     */
    private static inputSugestionExists(input: Input, placement: number): boolean {
        let result: boolean = false;
        for (const sugestion of input.sugestions) {
            if (sugestion.placement === placement) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Validate if a input has a minimum number of answers.
     * @param inputAnswers - Dictionary of InputAnswers to be verified.
     * @param id - Input to be searched.
     * @param argument - Max number of answers.
     * @returns - True if has minimum answers, else false.
     */
    private static validateMaxAnswers(inputAnswers: InputAnswerDict, id: number, argument: string): boolean {
        const max: number = parseInt(argument, 10);
        // Verify if argument is an integer
        if (!(isNaN(max))) {
            return (inputAnswers[id].length <= max);
        } else {
            return false;
        }
    }

    /**
     * Validate if exists a answer for a dependent input.
     * @param inputAnswers - Dictionary of InputAnswers to be verified.
     * @param argument - Placement of the dependent input.
     * @returns - True if the input was answered, else false.
     */
    private static validateDependency(inputAnswers: InputAnswer[], argument: string): boolean {
        let result: boolean = false;
        const placement: number = parseInt(argument, 10);
        if (!(isNaN(placement))) {
            for (const inputAnswer of inputAnswers) {
                if (inputAnswer.placement === placement) {
                    result = (inputAnswer.value === "true");
                }
            }
        }
        return result;
    }

    /**
     * Validate if answer has minimum number of chars.
     * @param input - Input to validate answer.
     * @param answer - Answer of input.
     * @returns - A string with all errors.
     */
    private static validateInput(input: Input, inputAnswers: InputAnswerDict): string {
        const errors: string[] = [];

        let inputMandatory: boolean = false;

        for (const val of input.validation) {
            if (val.type === ValidationType.MANDATORY) {
                inputMandatory = true;
                break;
            }
        }

        if ((inputAnswers[input.id] === undefined || inputAnswers[input.id][0].value === "") && !(inputMandatory)) {
            return;
        }

        for (const validation of input.validation) {

            switch (validation.type) {

                case ValidationType.REGEX:
                    for (const answer of inputAnswers[input.id]) {
                        if (!this.validateByRegex(answer.value, validation.arguments[0])) {
                            errors.push("RegEx do not match");
                        }
                    }
                    break;

                case ValidationType.MANDATORY:
                    for (const answer of inputAnswers[input.id]) {
                        if (!(this.validateMandatory(answer.value))) {
                            errors.push("Input answer is mandatory");
                        }
                    }
                    break;

                case ValidationType.MAXCHAR:
                    for (const answer of inputAnswers[input.id]) {
                        if (!(this.validateMaxChar(answer.value, validation.arguments[0]))) {
                            errors.push("Input answer must be lower than " + validation.arguments[0]);
                        }
                    }
                    break;

                case ValidationType.MINCHAR:
                    for (const answer of inputAnswers[input.id]) {
                        if (!(this.validateMinChar(answer.value, validation.arguments[0]))) {
                            errors.push("Input answer must be greater than " + validation.arguments[0]);
                        }
                    }
                    break;

                case ValidationType.TYPEOF:
                    for (const answer of inputAnswers[input.id]) {
                        if (!(this.validateTypeOf(answer.value, validation.arguments[0]))) {
                            errors.push("Input answer must be a " + validation.arguments[0]) + " type";
                        }
                    }
                    break;

                case ValidationType.SOMECHECKBOX:
                    if (!(this.validateSomeCheckbox(input, inputAnswers))) {
                        errors.push("Input answer must have a answer");
                    }
                    break;

                case ValidationType.MAXANSWERS:
                    if (!(this.validateMaxAnswers(inputAnswers, input.id, validation.arguments[0]))) {
                        errors.push("Number of input answers must be lower than " + validation.arguments[0]);
                    }
                    break;

                case ValidationType.DEPENDENCY:
                    const id: number = parseInt(validation.arguments[0], 10);
                    if (!(isNaN(id)) && !(this.validateDependency(inputAnswers[id], validation.arguments[1]))) {
                        errors.push("Must answer question with id " + validation.arguments[0] + " and placement " + validation.arguments[1]);
                    }
                    break;
            }
        }

        return errors.join(";");
    }

    /**
     * Validate if form answer is valid.
     * @param formAnswer - FormAnswer to be validated.
     */
    public static validateFormAnswer(formAnswer: FormAnswer): void {
        const errorsDict: ValidationDict = {};
        for (const input of formAnswer.form.inputs) {
            const error: string = this.validateInput(input, formAnswer.inputAnswers);
            if (error !== "" && error !== undefined) {
                errorsDict[input.id] = error;
            }
        }

        if (Object.keys(errorsDict).length > 0) {
            throw new ValidationError(errorsDict, "Validation Error");
        }
    }
}
