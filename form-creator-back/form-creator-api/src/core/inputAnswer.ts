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

import { OptHandler } from "../utils/optHandler";
import { FormAnswer, FormAnswerOptions } from "./formAnswer";

/** Parameters used to create a input object. */
export interface InputAnswerOptions {
    /** Unique identifier of a InputAnswer instance. */
    id?: number;
    /** Input id which this answer came from. */
    idInput: number;
    /** Place where answers should be (multivalored answers). */
    placement: number;
    /** Input's answer */
    value: string;
    /** SubForm's answer */
    subForm?: FormAnswerOptions;
}

/** Parameters used to create a dictionary to uses as an collection of InputAnswerOptions Object. */
export interface InputAnswerOptionsDict {
    /** A key is a identifier of a Input instance */
    [key: number]: InputAnswerOptions[];
}

/** Parameters used to create a dictionary to uses as an collection of InputAnswer Object.. */
export interface InputAnswerDict {
    /** A key is a identifier of a Input instance */
    [key: number]: InputAnswer[];
}

/**
 * Input Class to manage project's inputs forms
 */
export class InputAnswer {
    /** Unique identifier of a Input Answer instance. */
    public readonly id: number;
    /** A identifier of a Input instance. */
    public readonly idInput: number;
    /** Place where input should be in the form. */
    public readonly placement: number;
    /** Input's Description. */
    public readonly value: string;
    /** SubForm Answer. */
    public readonly subForm: FormAnswer;

    /**
     * Creates a new instance of InputAnswer Class
     * @param options - InputOptionsAnswer instance to create a inputAnswer.
     */
    constructor(options: InputAnswerOptions) {
        this.id = options.id ? options.id : null;
        this.idInput = options.idInput;
        this.placement = options.placement;
        this.value = options.value;
        this.subForm = options.subForm ? new FormAnswer(OptHandler.formAnswer(options.subForm)) : null;
    }

}
