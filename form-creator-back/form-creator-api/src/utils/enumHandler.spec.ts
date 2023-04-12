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
import { enumHandlerScenario } from "../../test/scenario";
import { EnumHandler, InputType, UpdateType, ValidationType } from "./enumHandler";
describe("Enum Handler", () => {

    it("should stringify UpdateType ", () => {
        expect(enumHandlerScenario.sUpdateNone).to.be.equal("");
        expect(enumHandlerScenario.sUpdateAdd).to.be.equal("add");
        expect(enumHandlerScenario.sUpdateRemove).to.be.equal("remove");
        expect(enumHandlerScenario.sUpdateSwap).to.be.equal("swap");
        expect(enumHandlerScenario.sUpdateReenabled).to.be.equal("reenabled");
    });

    it("should parse string to UpdateType", () => {
        expect(enumHandlerScenario.pUpdateAdd).to.be.equal(UpdateType.ADD);
        expect(enumHandlerScenario.pUpdateAddCapitalLetters).to.be.equal(UpdateType.ADD);
        expect(enumHandlerScenario.pUpdateRemove).to.be.equal(UpdateType.REMOVE);
        expect(enumHandlerScenario.pUpdateRemoveCapitalLetters).to.be.equal(UpdateType.REMOVE);
        expect(enumHandlerScenario.pUpdateSwap).to.be.equal(UpdateType.SWAP);
        expect(enumHandlerScenario.pUpdateSwapCapitalLetters).to.be.equal(UpdateType.SWAP);
        expect(enumHandlerScenario.pUpdateNone).to.be.equal(UpdateType.NONE);
        expect(enumHandlerScenario.pUpdateFOOL).to.be.equal(UpdateType.NONE);
    });

    it("should stringify InputType ", () => {
        expect(enumHandlerScenario.sInputNone).to.be.equal("");
        expect(enumHandlerScenario.sInputText).to.be.equal("text");
        expect(enumHandlerScenario.sInputCheckbox).to.be.equal("checkbox");
        expect(enumHandlerScenario.sInputRadio).to.be.equal("radio");
    });

    it("should parse string to InputType", () => {
        expect(enumHandlerScenario.pInputText).to.be.equal(InputType.TEXT);
        expect(enumHandlerScenario.pInputTextCapitalLetters).to.be.equal(InputType.TEXT);
        expect(enumHandlerScenario.pInputNone).to.be.equal(InputType.NONE);
        expect(enumHandlerScenario.pInputFOOL).to.be.equal(InputType.NONE);
        expect(enumHandlerScenario.pInputCheckbox).to.be.equal(InputType.CHECKBOX);
        expect(enumHandlerScenario.pInputCheckboxCapitalLetters).to.be.equal(InputType.CHECKBOX);
        expect(enumHandlerScenario.pInputRadio).to.be.equal(InputType.RADIO);
        expect(enumHandlerScenario.pInputRadioCapitalLetters).to.be.equal(InputType.RADIO);
        expect(enumHandlerScenario.pInputSelect).to.be.equal(InputType.SELECT);
        expect(enumHandlerScenario.pInputSelectCapitalLetters).to.be.equal(InputType.SELECT);
    });

    it("should stringify ValidationType ", () => {
        expect(enumHandlerScenario.sValidationNone).to.be.equal("");
        expect(enumHandlerScenario.sValidationRegex).to.be.equal("regex");
        expect(enumHandlerScenario.sValidationMandatory).to.be.equal("mandatory");
        expect(enumHandlerScenario.sValidationMaxChar).to.be.equal("maxchar");
        expect(enumHandlerScenario.sValidationMinChar).to.be.equal("minchar");
        expect(enumHandlerScenario.sValidationTypeOf).to.be.equal("typeof");
        expect(enumHandlerScenario.sValidationSomeCheckbox).to.be.equal("somecheckbox");
        expect(enumHandlerScenario.sValidationMaxAnswers).to.be.equal("maxanswers");
    });

    it("should parse string to ValidationType", () => {
        expect(enumHandlerScenario.pValidationRegex).to.be.equal(ValidationType.REGEX);
        expect(enumHandlerScenario.pValidationRegexCapitalized).to.be.equal(ValidationType.REGEX);
        expect(enumHandlerScenario.pValidationMandatory).to.be.equal(ValidationType.MANDATORY);
        expect(enumHandlerScenario.pValidationMandatoryCapitalized).to.be.equal(ValidationType.MANDATORY);
        expect(enumHandlerScenario.pValidationMaxChar).to.be.equal(ValidationType.MAXCHAR);
        expect(enumHandlerScenario.pValidationMaxCharyCapitalized).to.be.equal(ValidationType.MAXCHAR);
        expect(enumHandlerScenario.pValidationMinChar).to.be.equal(ValidationType.MINCHAR);
        expect(enumHandlerScenario.pValidationMinCharyCapitalized).to.be.equal(ValidationType.MINCHAR);
        expect(enumHandlerScenario.pValidationTypeOf).to.be.equal(ValidationType.TYPEOF);
        expect(enumHandlerScenario.pValidationTypeOfCapitalized).to.be.equal(ValidationType.TYPEOF);
        expect(enumHandlerScenario.pValidationSomeCheckbox).to.be.equal(ValidationType.SOMECHECKBOX);
        expect(enumHandlerScenario.pValidationSomeCheckboxCapitalized).to.be.equal(ValidationType.SOMECHECKBOX);
        expect(enumHandlerScenario.pValidationMaxAnswers).to.be.equal(ValidationType.MAXANSWERS);
        expect(enumHandlerScenario.pValidationMaxAnswersCapitalized).to.be.equal(ValidationType.MAXANSWERS);
        expect(enumHandlerScenario.pValidationDependency).to.be.equal(ValidationType.DEPENDENCY);
        expect(enumHandlerScenario.pValidationDependencyCapitalized).to.be.equal(ValidationType.DEPENDENCY);
        expect(enumHandlerScenario.pValidationNone).to.be.equal(ValidationType.NONE);
        expect(enumHandlerScenario.pValidatioFOOL).to.be.equal(ValidationType.NONE);
    });
});
