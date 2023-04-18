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

import { expect } from "chai";
import { Form } from "../core/form";
import { FormAnswer } from "../core/formAnswer";
import { FormUpdate } from "../core/formUpdate";
import { Input, Validation } from "../core/input";
import { InputAnswer } from "../core/inputAnswer";
import { InputUpdate } from "../core/inputUpdate";
import { SubForm } from "../core/subForm";
import { User } from "../core/user";
import { EnumHandler, InputType, UpdateType, ValidationType } from "./enumHandler";
import { Sorter } from "./sorter";

/**
 * Test's handler. Manage tests through the project.
 */
export class TestHandler {

    /**
     * Verify if two forms are semantically equal;
     * @param form - Form that should be tested
     * @param stub - A model form that first param itend to be.
     * @returns - True if forms are equal else false
     */
    public static testForm(form: Form, stub: Form){
        expect(form.id).to.be.equal(stub.id);
        expect(form.title).to.be.equal(stub.title);
        expect(form.description).to.be.equal(stub.description);
        expect(form.inputs.length).to.be.equal(stub.inputs.length);
        for (let i = 0; i < form.inputs.length ; i++){
            TestHandler.testInput(form.inputs[i], stub.inputs[i]);
        }

    }

    /**
     * Verify if two inputs are semantically equal;
     * @param input - Input that should be tested
     * @param stub - A model input that first param itend to be.
     * @returns - True if inputs are equal else false
     */
    public static testInput(input: Input, stub: Input){
        expect(input.id).to.be.equal(stub.id);
        expect(input.placement).to.be.equal(stub.placement);
        expect(input.description).to.be.equal(stub.description);
        expect(input.question).to.be.equal(stub.question);
        expect(input.type).to.be.equal(stub.type);
        expect(input.validation.length).to.be.equal(stub.validation.length);
        for (let i = 0; i < input.validation.length ; i++){
            expect(input.validation[i].type).to.be.equal(stub.validation[i].type);
            expect(input.validation[i].arguments.length).to.be.equal(stub.validation[i].arguments.length);
            for (let j = 0; j < input.validation[i].arguments.length  ; j++){
                expect(input.validation[i].arguments[j]).to.be.equal(stub.validation[i].arguments[j]);
            }
        }

        if (input.type === InputType.SUBFORM) {
            TestHandler.testSubForm(input.subForm, stub.subForm);
        } else {
            expect(input.subForm).to.be.equal(null);
        }
    }

    /**
     * Verify if two formAnswers are semantically equal;
     * @param formAnswer - Form Answer that should be tested
     * @param stub - A model formAnswer that first param itend to be.
     * @returns - True if formAnswers are equal else false
     */
    public static testFormAnswer(formAnswer: FormAnswer, stub: FormAnswer){
        expect(formAnswer.id).to.be.equal(stub.id);
        TestHandler.testForm(formAnswer.form, stub.form);
        for (const key of Object.keys(formAnswer.inputAnswers)){
            formAnswer.inputAnswers[parseInt(key, 10)].forEach((inputAnswer, i) => {
                TestHandler.testInputAnswer(inputAnswer, stub.inputAnswers[parseInt(key, 10)][i]);

            });
        }

    }

    /**
     * Verify if two inputAnswer are semantically equal;
     * @param inputAnswer - inputAnswer that should be tested
     * @param stub - A model inputAnswer that first param itend to be.
     * @returns - True if inputAnswer are equal else false
     */
    public static testInputAnswer(inputAnswer: InputAnswer, stub: InputAnswer){
        expect(inputAnswer.id).to.be.equal(stub.id);
        expect(inputAnswer.idInput).to.be.equal(stub.idInput);
        expect(inputAnswer.placement).to.be.equal(stub.placement);
        expect(inputAnswer.value).to.be.equal(stub.value);
        if (stub.subForm !== null) {
            TestHandler.testFormAnswer(inputAnswer.subForm, stub.subForm);
        }
    }

    /**
     * Verify if two FormUpdate are semantically equal;
     * @param formUpdate - FormUpdate that should be tested
     * @param stub - A model FormUpdate that first param itend to be.
     * @returns - True if FormUpdate are equal else false
     */
    public static testFormUpdate(formUpdate: FormUpdate, stub: FormUpdate) {
        const sortedFormInputs: InputUpdate[] = Sorter.sortById(formUpdate.inputUpdates);
        const sortedStubInputs: InputUpdate[] = Sorter.sortById(stub.inputUpdates);

        expect(formUpdate.id).to.be.equal(stub.id);
        TestHandler.testForm(formUpdate.form, stub.form);
        for (let i = 0; i < formUpdate.inputUpdates.length; i++) {
            TestHandler.testInputUpdate(sortedFormInputs[i], sortedStubInputs[i]);
        }
    }

    /**
     * Verify if two InputUpdate are semantically equal;
     * @param inputUpdate - InputUpdate that should be tested
     * @param stub - A model InputUpdate that first param itend to be.
     * @returns - True if InputUpdate are equal else false
     */
    public static testInputUpdate(inputUpdate: InputUpdate, stub: InputUpdate) {
        expect(inputUpdate.id).to.be.equal(stub.id);
        TestHandler.testInput(inputUpdate.input, stub.input);
        expect(inputUpdate.inputOperation).to.be.equal(stub.inputOperation);
        expect(inputUpdate.value).to.be.equal(stub.value);
    }

    public static testUser(user: User, stub: User) {
        /** If there's no ID input the DB itself should ID it */
        if (user.id === null) {
            expect(stub.id).to.be.a("number");
        } else {
            expect(user.id).to.be.equal(stub.id);
        }
        expect(user.name).to.be.equal(stub.name);
        expect(user.email).to.be.equal(stub.email);
        expect(user.hash).to.be.equal(stub.hash);
        expect(user.enabled).to.be.equal(stub.enabled);
    }
    /**
     * Verify if two sub forms are semantically equal;
     * @param subForm - subForm that should be tested
     * @param stub - A model subForm that first param itend to be.
     * @returns - True if subForm are equal else false
     */
    public static testSubForm(subForm: SubForm, stub: SubForm) {
        expect(subForm.id).to.be.equal(stub.id);
        expect(subForm.inputId).to.be.equal(stub.inputId);
        expect(subForm.contentFormId).to.be.equal(stub.contentFormId);
    }
}
