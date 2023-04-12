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
import { validationHScenario } from "../../test/scenario";
import { Form } from "../core/form";
import { FormAnswer, FormAnswerOptions } from "../core/formAnswer";
import { InputAnswerOptions, InputAnswerOptionsDict } from "../core/inputAnswer";
import { configs } from "./config";
import { DbHandler } from "./dbHandler";
import { EnumHandler, InputType, ValidationType } from "./enumHandler";
import { OptHandler } from "./optHandler";
import { ValidationHandler } from "./validationHandler";

describe("Validation Handler", () => {
    const dbhandler = new DbHandler(configs.poolconfig);

    it("should test when Input has a minimum char number", (done) => {

        const inputAnswerOptionsDict = validationHScenario.dictMinCharNumber;

        const date: Date = validationHScenario.date;
        dbhandler.form.read(2, (error: Error, form: Form) => {
            expect(error).to.be.a("null");

            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: date
                , inputsAnswerOptions: inputAnswerOptionsDict
            };
            const formAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOptions));
            try {
                ValidationHandler.validateFormAnswer(formAnswer);
            } catch (e) {
                expect(e.validationDict["4"]).to.be.equal("Input answer must be greater than 8");
                expect(e.validationDict["5"]).to.be.a("undefined");
            }
            done();
        });
    });

    it("should test when Input is mandatory", (done) => {

        const inputAnswerOptionsDict = validationHScenario.dictMandatoryInput;

        const data: Date = validationHScenario.date;
        dbhandler.form.read(2, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: data
                , inputsAnswerOptions: inputAnswerOptionsDict
            };
            const formAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOptions));
            try {
                ValidationHandler.validateFormAnswer(formAnswer);
            } catch (e) {
                expect(e.validationDict["4"]).to.be.a("undefined");
                expect(e.validationDict["5"]).to.be.equal("Input answer is mandatory;Input answer is mandatory");
            }
            done();
        });
    });

    it("should test when Input has a maximum char number", (done) => {

        const inputAnswerOptionsDict = validationHScenario.dictMaxCharNumber;
        const data: Date = validationHScenario.date;
        dbhandler.form.read(1, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: data
                , inputsAnswerOptions: inputAnswerOptionsDict
            };
            const formAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOptions));
            try {
                ValidationHandler.validateFormAnswer(formAnswer);
            } catch (e) {
                expect(e.validationDict["1"]).to.be.a("undefined");
                expect(e.validationDict["2"]).to.be.a("undefined");
                expect(e.validationDict["3"]).to.be.equal("Input answer must be lower than 10");
            }
            done();
        });

    });

    it("should test when Input has a RegEx", (done) => {

        const inputAnswerOptionsDict = validationHScenario.dictHasARegEx;
        const data: Date = validationHScenario.date;
        dbhandler.form.read(1, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: data
                , inputsAnswerOptions: inputAnswerOptionsDict
            };
            const formAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOptions));
            try {
                ValidationHandler.validateFormAnswer(formAnswer);
            } catch (e) {
                expect(e.validationDict["1"]).to.be.a("undefined");
                expect(e.validationDict["3"]).to.be.a("undefined");
                expect(e.validationDict["2"]).to.be.equal("RegEx do not match");
            }
            done();
        });
    });

    it("should test when input is number", (done) => {

        const inputAnswerOptionsDict = validationHScenario.dictCNFD;

        dbhandler.form.read(7, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: new Date()
                , inputsAnswerOptions: inputAnswerOptionsDict
            };
            const formAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOptions));
            try {
                ValidationHandler.validateFormAnswer(formAnswer);
            } catch (e) {
                expect(e.validationDict["23"]).to.be.equal("Input answer must be a int;Number of input answers must be lower than 2");
                expect(e.validationDict["24"]).to.be.undefined;
                expect(e.validationDict["25"]).to.be.equal("Input answer must be a float");
                expect(e.validationDict["26"]).to.be.undefined;
                expect(e.validationDict["27"]).to.be.equal("Input answer must be a date");
                expect(e.validationDict["28"]).to.be.undefined;
                expect(e.validationDict["29"]).to.be.equal("Input answer must be a invalid;Number of input answers must be lower than invalid;Must answer question with id 28 and placement invalid");
            }
            done();
        });
    });

    it("should test when input has sugestion", (done) => {

        const inputAnswerOptionsDict: InputAnswerOptionsDict = validationHScenario.dictHasSugestion;

        dbhandler.form.read(6, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: new Date()
                , inputsAnswerOptions: inputAnswerOptionsDict
            };
            const formAnswer = new FormAnswer(OptHandler.formAnswer(formAnswerOptions));
            try {
                ValidationHandler.validateFormAnswer(formAnswer);
            } catch (e) {
                expect(e.validationDict["18"]).to.be.equal("Input answer must have a answer");
                expect(e.validationDict["19"]).to.be.undefined;
                expect(e.validationDict["20"]).to.be.undefined;
                expect(e.validationDict["21"]).to.be.undefined;
                expect(e.validationDict["22"]).to.be.equal("Must answer question with id 18 and placement 2");
            }
            done();
        });
    });
});
