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

import { Form, FormOptions } from "./form";
import { InputUpdate, InputUpdateOptions } from "./inputUpdate";

/** Parameters used to update a form object. */
export interface FormUpdateOptions {
    /** Unique identifier of a FormUpdate instance. */
    id?: number;
    /** Changed Form. */
    form: FormOptions;
    /** Date which form was updated. */
    updateDate: Date;
    /** True when Form title or description has changed. */
    changed?: boolean;
    /** Array of InputUpdate containing changes on inputs. */
    inputUpdates: InputUpdateOptions[];
}

/**
 * FormUpdate Class to manage project's forms
 */
export class FormUpdate {
    /** Unique identifier of a FormUpdate instance. */
    public readonly id?: number;
    /** Changed Form. */
    public readonly form: Form;
    /** Date which form was updated. */
    public readonly updateDate: Date;
    /** True when Form title, description or status has changed. */
    public readonly changed?: boolean;
    /** Array of InputUpdate containing changes on inputs. */
    public readonly inputUpdates: InputUpdate[];
    /**
     * Creates a new instance of FormUpdate Class
     * @param options - FormUpdateOptions instance to update a form.
     */
    constructor(options: FormUpdateOptions) {
        this.id = options.id ? options.id : null;
        this.form = new Form (options.form);
        this.updateDate = options.updateDate;
        this.changed = options.changed ? options.changed : false;
        this.inputUpdates = options.inputUpdates.map((i: any) => {
            return new InputUpdate(i);
        });
    }
}
