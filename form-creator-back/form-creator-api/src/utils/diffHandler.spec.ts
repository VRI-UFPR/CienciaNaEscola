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
import { diffHandlerScenario } from "../../test/scenario";
import { Form, FormOptions } from "../core/form";
import { FormUpdate, FormUpdateOptions } from "../core/formUpdate";
import { Input, InputOptions, Validation } from "../core/input";
import { InputUpdate, InputUpdateOptions } from "../core/inputUpdate";
import { DiffHandler } from "./diffHandler";
import { InputType, UpdateType, ValidationType } from "./enumHandler";
import { TestHandler } from "./testHandler";

describe("Diff Handler", () => {
    it("should return a valid formUpdate remove type", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjREMOVE, diffHandlerScenario.oldFormObj);
        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateREMOVE);
        done();
    });

    it("should return a valid formUpdate add type", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjADD, diffHandlerScenario.oldFormObj);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateADD);
        done();
    });

    it("should return a valid formUpdate swap type", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjSWAP, diffHandlerScenario.oldFormObj);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateSWAP);
        done();
    });

    it("should return a valid formUpdate remove and add all", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjREMOVEandADD, diffHandlerScenario.oldFormObj);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateREMOVEandADD);
        done();
    });

    it("should return a valid formUpdate all operations", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjALL, diffHandlerScenario.oldFormAll);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateALL);
        done();
    });

    it("should return a valid formUpdate restore inputs", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjRESTORE, diffHandlerScenario.oldFormRestore);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateRESTORE);
        done();
    });

    it("should return a valid formUpdate create a new Form", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjCREATE, diffHandlerScenario.FormObjEmpty);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateCREATE);
        done();
    });

    it("should return a valid formUpdate remove all inputs", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.FormObjEmpty, diffHandlerScenario.oldFormObj);
        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateREMOVEALL);
        done();
    });

    it("should return a valid formUpdate wich changes the title", (done) => {
        const resFormUpdate = DiffHandler.diff(diffHandlerScenario.newFormObjWrongTitle, diffHandlerScenario.odlFormObjCorrectTitle);

        TestHandler.testFormUpdate(resFormUpdate, diffHandlerScenario.expFormUpdateTITLE);
        done();
    });
});
