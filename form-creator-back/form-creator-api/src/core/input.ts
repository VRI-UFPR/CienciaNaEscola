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

import { InputType, ValidationType } from "../utils/enumHandler";
import { SubForm, SubFormOptions } from "./subForm";

/** Parameters used to create a input object. */
export interface InputOptions {
    /** Unique identifier of a Input instance. */
    id?: number;
    /** Place where input should be in the form. */
    placement: number;
    /** Input's Description */
    description: string;
    /** Question of input */
    question: string;
    /** Enabled/Disable input */
    enabled?: boolean;
    /** Type of input */
    type: InputType;
    /** Array contain all input's validation */
    validation: Validation[];
    /** Question answer sugestion */
    sugestions?: Sugestion[];
    /** A SubForm object that is a reference to another Form */
    subForm?: SubFormOptions;
}
/** Validation contains the type of it, and n arguments to validate if necessary */
export interface Validation {

    /** Enum Validation Type to identify the type of current validation */
    type: ValidationType;
    /** Array of any, to store informations about validadtion */
    arguments: string[];
}

/** Sugestion for answers */
export interface Sugestion {
    /** Answer's sugestion for a input */
    value: string;
    /** Place where sugestion should be in the input */
    placement: number;
}

/**
 * Input Class to manage project's inputs forms
 */
export class Input {
    /** Unique identifier of a Input instance. */
    public readonly id: number;
    /** Place where input should be in the form. */
    public readonly placement: number;
    /** Input's Description */
    public readonly description: string;
    /** Question of input */
    public readonly question: string;
    /** Enabled/Disable input */
    public readonly enabled: boolean;
    /** Type of input */
    public readonly type: InputType;
    /** Array contain all input's validation */
    public readonly validation: Validation[];
    /** Question answer sugestions */
    public readonly sugestions: Sugestion[];
    /** A SubForm object that is a reference to another Form */
    public readonly subForm: SubForm;
    /**
     * Creates a new instance of Input Class
     * @param options - InputOptions instance to create a input.
     */
    constructor(options: InputOptions) {
        this.id = options.id ? options.id : null;
        this.placement = options.placement;
        this.description = options.description;
        this.question = options.question;
        if ((options.enabled === undefined) || (options.enabled === null) ) {
            this.enabled = true;
        }
        else {
            this.enabled = options.enabled;
        }
        this.type = options.type;
        if (options.sugestions) {
            this.sugestions = options.sugestions.map((i: any) => i);
        } else {
            this.sugestions = [];
        }
        if (options.subForm) {
            this.subForm = new SubForm(options.subForm);
        } else {
            this.subForm = null;
        }
        this.validation = options.validation;
    }
}
