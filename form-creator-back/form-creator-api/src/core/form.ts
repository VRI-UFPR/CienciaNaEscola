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
import { Input, InputOptions } from "./input";

/** Parameters used to create a form object. */
export interface FormOptions {
    /** Unique identifier of a Form instance */
    id?: number;

    /** Form's title. An human-understandable identifier. Not unique */
    title: string;

    /** Form Description, as propose */
    description: string;

    /** Array of input. containing question */
    inputs: InputOptions[];

    /** Number of times an user can answer this form */
    answerTimes?: boolean;

    /* Controls if form has been deleted. */
    status?: boolean;
}
/**
 * Form Class to manage project's forms
 */
export class Form {
    /** Unique identifier of a Form instance */
    public readonly id: number;
    /** Form's title. An human-understandable identifier. Not unique */
    public readonly title: string;
    /** Form Description, as propose */
    public readonly description: string;
    /** Array of input. containing question */
    public readonly inputs: Input[];
    /** Number of times an user can answer this form */
    public readonly answerTimes: boolean;
    /* Controls if form has been deleted. */
    public readonly status: boolean;

    /**
     * Creates a new instance of Form Class
     * @param options - FormOptions instance to create a form.
     */
    constructor(options: FormOptions) {
        this.id = options.id ? options.id : null;
        this.title = options.title;
        this.description = options.description;
        this.inputs = options.inputs.map((i: any) => {
            return new Input(OptHandler.input(i));
        });
        this.answerTimes = options.answerTimes ? options.answerTimes : false;
        this.status = options.status;
        if ((options.status === undefined) || (options.status === null) ) {
            this.status = true;
        }
    }

}
