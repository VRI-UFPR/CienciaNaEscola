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
import { Form, FormOptions } from "./form";

/** Parameters used to create a subform object. */
export interface SubFormOptions {
    /** Unique identifier of a SubForm instance */
    id?: number;

    /** Input wich subForm is linked. */
    inputId?: number;

    /** SubForm of a form. */
    contentFormId: number;
}
/**
 * Form Class to manage project's forms
 */
export class SubForm {
    /** Unique identifier of a SubForm instance */
    public readonly id: number;

    /** Input wich subForm is linked. */
    public readonly inputId: number;

    /** SubForm of a form. */
    public readonly contentFormId: number;

    /*
     * Creates a new instance of Form Class
     * @param options - FormOptions instance to create a form.
     */
    constructor(options: SubFormOptions) {
        this.id = options.id ? options.id : null;
        this.inputId = options.inputId ? options.inputId : null;
        this.contentFormId = options.contentFormId;
    }
}
