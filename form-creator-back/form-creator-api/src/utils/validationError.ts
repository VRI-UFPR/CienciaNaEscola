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

 /**
  * Parameters used to create a dictionary to uses as an object of erro, returning all validations erros just once
  */
 export interface ValidationDict {
      /** A key is a identifier of a Input instance, and the string is all invalid messages */
     [key: number]: string;
 }

 /**
  * ValidationError: Extends Error class
  * Has a dict that allow us to know which answer is invalide
  */
 export class ValidationError extends Error {
     /** A dict that allows user to know which Input Answer is invalid. */
     public readonly validationDict: ValidationDict;

     constructor(validationDict: ValidationDict, ...params: any[]) {
         super(...params);
         this.validationDict = validationDict;
     }
 }
