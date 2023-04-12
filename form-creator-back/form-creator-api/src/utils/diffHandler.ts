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
import { FormUpdate, FormUpdateOptions } from "../core/formUpdate";
import { Input, InputOptions } from "../core/input";
import { InputUpdate, InputUpdateOptions } from "../core/inputUpdate";
import { InputType, UpdateType, ValidationType } from "./enumHandler";
import { Sorter } from "./sorter";

/**
 * DiffHandler to find out the difference between two Forms then create and return a FormUpdate
 */
export class DiffHandler {

    /**
     * Return an FormUpdate object with the result of the difference between two Forms.
     * @param newForm - The new Form that should be compared.
     * @param oldForm - The old Form that was in the database.
     * @returns - An FormUpdate object.
     */
    public static diff(newForm: Form, oldForm: Form): FormUpdate {

        const sortedNewInputs: Input[] = Sorter.sortById(newForm.inputs).filter(DiffHandler.isIdValid);
        const sortedOldInputs: Input[] = Sorter.sortById(oldForm.inputs);
        const inputsToAdd: Input[] = Sorter.sortById(newForm.inputs).filter(DiffHandler.isNotIdValid);

        const formUpdate: FormUpdate = {
            form: newForm
            , updateDate: new Date()
            , changed: ((newForm.title !== oldForm.title) ||
                (newForm.description !== oldForm.description) ||
                (newForm.answerTimes !== oldForm.answerTimes) ||
                (newForm.status !== oldForm.status))
            , inputUpdates: []
        };

        let i: number = 0;
        let j: number = 0;

        while ((i < sortedOldInputs.length) && (j < sortedNewInputs.length)) {
            if (sortedNewInputs[j]["id"] === sortedOldInputs[i]["id"]) {
                if (sortedNewInputs[j].placement !== sortedOldInputs[i].placement) {
                    formUpdate.inputUpdates.push(DiffHandler.swapInput(sortedNewInputs[j], sortedOldInputs[i]));
                }
                j++;
                i++;
            }
            else if (sortedNewInputs[j]["id"] < sortedOldInputs[i]["id"]) {
                formUpdate.inputUpdates.push(DiffHandler.reenabledInput(sortedNewInputs[j]));
                j++;
            }
            else {
                formUpdate.inputUpdates.push(DiffHandler.removeInput(sortedOldInputs[i]));
                i++;
            }
        }

        while ((i < sortedOldInputs.length)) {
            formUpdate.inputUpdates.push(DiffHandler.removeInput(sortedOldInputs[i]));
            i++;
        }

        while ((j < sortedNewInputs.length)) {
            if (sortedNewInputs[j].id !== null) {
                formUpdate.inputUpdates.push(DiffHandler.reenabledInput(sortedNewInputs[j]));
            }
            j++;
        }

        j = 0;
        while ((j < inputsToAdd.length)) {
            formUpdate.inputUpdates.push(DiffHandler.addInput(inputsToAdd[j]));
            j++;

        }
        return formUpdate;
    }

    /**
     * Create an InputUpdate object which removes the given Input.
     * @param input - An input to be removed
     * @returns - An InputUpdate object.
     */
    private static removeInput(input: Input): InputUpdate {
        const inputUpdate: InputUpdate = {
            input
            , inputOperation: UpdateType.REMOVE
            , value: null
        };
        return inputUpdate;
    }

    /**
     * Create an InputUpdate object which add the given Input.
     * @param input - An input to be added
     * @returns - An InputUpdate object.
     */
    private static addInput(input: Input): InputUpdate {
        const inputUpdate: InputUpdate = {
            input
            , inputOperation: UpdateType.ADD
            , value: null
        };
        return inputUpdate;
    }

    /**
     * Create an InputUpdate object which change the placement of the given Input.
     * @param input - An input to be changed
     * @returns - An InputUpdate object.
     */
    private static swapInput(newInput: Input, oldInput: Input): InputUpdate {
        const inputUpdate: InputUpdate = {
            input: newInput
            , inputOperation: UpdateType.SWAP
            , value: "" + oldInput.placement
        };
        return inputUpdate;
    }

    /**
     * Create an InputUpdate object which reenabled given Input.
     * @param input - An input to be reenabled
     * @returns - An InputUpdate object.
     */
    private static reenabledInput(input: Input): InputUpdate {
        const inputUpdate: InputUpdate = {
            input
            , inputOperation: UpdateType.REENABLED
            , value: null
        };
        return inputUpdate;
    }

    private static isIdValid(obj: any): boolean {
        return ((obj.id !== null) && (obj.id !== undefined) && (obj.id > 0) && (typeof obj.id === "number"));
    }

    private static isNotIdValid(obj: any): boolean {
        return !DiffHandler.isIdValid(obj);
    }

}
