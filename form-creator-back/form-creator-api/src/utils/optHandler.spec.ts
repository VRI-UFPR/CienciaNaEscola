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
import { optHandlerScenario } from "../../test/scenario";
import { Form, FormOptions } from "../core/form";
import { FormAnswer, FormAnswerOptions } from "../core/formAnswer";
import { FormUpdate, FormUpdateOptions } from "../core/formUpdate";
import { Input, InputOptions, Validation } from "../core/input";
import { InputAnswer, InputAnswerDict, InputAnswerOptions, InputAnswerOptionsDict } from "../core/inputAnswer";
import { InputUpdate, InputUpdateOptions } from "../core/inputUpdate";
import { SubForm, SubFormOptions } from "../core/subForm";
import { InputType, UpdateType, ValidationType } from "./enumHandler";
import { ErrorHandler } from "./errorHandler";
import { OptHandler } from "./optHandler";

describe("Options Handler", () => {

    it("should get error when missing Form title", () => {
        let formTmp: Form;
        try {
            formTmp = new Form ( OptHandler.form(optHandlerScenario.formMissingTitle));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Form title").message);
            expect(formTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Form description", () => {
        let formTmp: Form;
        try {
            formTmp = new Form ( OptHandler.form(optHandlerScenario.formMissingDescription));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Form description").message);
            expect(formTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Form inputs", () => {
        let formTmp: Form;
        try {
            formTmp = new Form ( OptHandler.form(optHandlerScenario.formMissingInputs));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Form inputs").message);
            expect(formTmp).to.be.a("undefined");
        }
    });

    it("should get error when Form inputs is not an array", () => {
        let formTmp: Form;
        try {
            formTmp = new Form ( OptHandler.form(optHandlerScenario.formInputNotAnArray));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Form inputs").message);
            expect(formTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Input placement", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputMissingPlacement));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input placement").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Input description", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputMissingDescription));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input description").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Input question ", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputMissingQuestion));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input question").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Input type", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputMissingType));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input type").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error when missing Input validation", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputMissingValidation));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input validation").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error when Input validation is not an array", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputValidationNotAnArray));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input validation").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error when FormAnswer has no form associated", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.noFormAssociated));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Form").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should get error when FormAnswer has a form associated but not type form", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.noFormType));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Form").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should get error when FormAnswer has no date associated", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.formHasNoDate));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Answer Date").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should get error when FormAnswer has a date associated but not type Date", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.formNoDateType));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Answer Date").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should get error when FormAnswer has no inputAnswerOptionsDict associated", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.formHasNoDict));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input Answers").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should test InputAnswerOptions when missing idInput", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.missingIdInputOpt));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("idInput").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should test InputAnswerOptions when missing placement", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.missingPlacementInputOpt));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Placement").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should test InputAnswerOptions when missing Value", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.missingValueInputOpt));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Value").message);
            expect(formAnswerTmp).to.be.a("undefined");
        }
    });

    it("should test FormAnswer no error", () => {
        let formAnswerTmp: FormAnswer;
        try {
            formAnswerTmp =  new FormAnswer(OptHandler.formAnswer(optHandlerScenario.validForm));
        }finally{
            expect(formAnswerTmp).to.not.be.a("undefined");
        }
    });

    it("should test FormUpdate no error", () => {
        let formUpdateTmp: FormUpdate;
        try {
            formUpdateTmp = new FormUpdate(OptHandler.formUpdate(optHandlerScenario.validFormUpdate));
        } finally {
            expect(formUpdateTmp).to.be.a("object");
        }
    });

    it("should get error FormUpdate inputUpdates is not an array", () => {
        let formUpdateTmp: FormUpdate;
        try {
            formUpdateTmp = new FormUpdate(OptHandler.formUpdate(optHandlerScenario.nonArrayInputUpdate));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("inputUpdates").message);
            expect(formUpdateTmp).to.be.a("undefined");
        }
    });

    it("should get error FormUpdate missing option key 'form'", () => {
        let formUpdateTmp: FormUpdate;
        try {
            formUpdateTmp = new FormUpdate(OptHandler.formUpdate(optHandlerScenario.missingFormProperty));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("form").message);
            expect(formUpdateTmp).to.be.a("undefined");
        }
    });

    it("should get error FormUpdate missing option key 'inputUpdates'", () => {
        let formUpdateTmp: FormUpdate;
        try {
            formUpdateTmp = new FormUpdate(OptHandler.formUpdate(optHandlerScenario.missingInputUpdate));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("inputUpdates").message);
            expect(formUpdateTmp).to.be.a("undefined");
        }
    });

    it("should get error InputUpdate missing option key 'input'", () => {
        let updateTmp: InputUpdate;
        try {
            updateTmp = new InputUpdate(OptHandler.inputUpdate(optHandlerScenario.inputUpdateMissingInput));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("input").message);
            expect(updateTmp).to.be.a("undefined");
        }
    });

    it("should get error InputUpdate missing option key 'inputOperation'", () => {
        let updateTmp: InputUpdate;
        try {
            updateTmp = new InputUpdate(OptHandler.inputUpdate(optHandlerScenario.missinginputOperation));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("inputOperation").message);
            expect(updateTmp).to.be.a("undefined");
        }
    });

    it("should get error InputUpdate missing option key 'value'", () => {
        let updateTmp: InputUpdate;
        try {
            updateTmp = new InputUpdate(OptHandler.inputUpdate(optHandlerScenario.missingValueProperty));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("value").message);
            expect(updateTmp).to.be.a("undefined");
        }
    });

    it("should get error Input with malformed sugestion missing key 'placement'", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.malformedSugestionMissingPlacement));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Sugestion placement").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should get error Input with malformed sugestion missing key 'value'", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.malformedSugestionMissingValue));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Sugestion value").message);
            expect(inputTmp).to.be.a("undefined");
        }
    });

    it("should test subForm no error", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.validInputWithSubForm));
        } finally {
            expect(inputTmp).to.be.a("object");
            expect(inputTmp.subForm).to.be.not.a("null");
        }
    });

    it("should get error missing subForm", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.missingSubFormProperty));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("Input subform").message);
        }
    });

    it("should get error missing subForm", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputWithSubFormWithoutContentFormId));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("SubForm ContentForm").message);
        }
    });

    it("should get error missing subForm", () => {
        let inputTmp: Input;
        try {
            inputTmp = new Input(OptHandler.input(optHandlerScenario.inputWithSubFormWithoutInputId));
        } catch (e) {
            expect(e).to.be.not.a("null");
            expect(e.message).to.be.equal(ErrorHandler.notFound("SubForm InputId").message);
        }
    });
});
