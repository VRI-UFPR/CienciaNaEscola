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
import { Form } from "./form";
import { InputAnswer, InputAnswerDict, InputAnswerOptions, InputAnswerOptionsDict } from "./inputAnswer";

/** Parameters used to create a FormAnswer object. */
export interface FormAnswerOptions {
     /** Unique identifier of a FormAnswer instance */
    id?: number;

    /** Form which answer is related to */
    form: Form;

    /** Time when it is answered */
    timestamp: Date;

    /** A dictionary of inputsAnswers. containing the answers */
    inputsAnswerOptions: InputAnswerOptionsDict;
}

/**
 * Form Class to manage project's forms
 */
export class FormAnswer {
     /** Unique identifier of a FormAnswer instance */
     public readonly id: number;
     /** Form which answer is related to */
     public readonly form: Form;
     /** Time when it is answered */
     public readonly timestamp: Date;
     /** Array of inputsAnswer. containing the answers */
     public readonly inputAnswers: InputAnswerDict;

     /**
      * Creates a new instance of FormAnswer Class
      * @param options - FormAnswerOptions instance to create a FormAnswer.
      */
     constructor(options: FormAnswerOptions) {
         this.id =  options.id ? options.id : null;
         this.form = options.form;
         this.timestamp = options.timestamp;
         this.inputAnswers = {};
         for (const key of  Object.keys(options.inputsAnswerOptions)) {
             this.inputAnswers[parseInt(key, 10)] =  options.inputsAnswerOptions[parseInt(key, 10)].map( (i: InputAnswerOptions) => {
                 return new InputAnswer(i);
             });

         }
     }

 }
