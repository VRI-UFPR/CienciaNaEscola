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
import { inputScenario } from "../../test/scenario";
import { InputType, ValidationType } from "../utils/enumHandler";
import { Input, InputOptions } from "./input";

describe("Input with enabled atribute", () => {

    it("should create a Input with option key 'enabled' as undefined", (done) => {
        expect(inputScenario.inputUndefEnable).to.be.a("object");
        expect(inputScenario.inputUndefEnable.enabled).to.be.equal(true);
        done();
    });

    it("should create a Input with option key 'enabled' as null", (done) => {
        expect(inputScenario.inputNullEnable).to.be.a("object");
        expect(inputScenario.inputNullEnable.enabled).to.be.equal(true);

        done();
    });

    it("should create a Input with option key 'enabled' as true", (done) => {
        expect(inputScenario.inputTrueEnable).to.be.a("object");
        expect(inputScenario.inputTrueEnable.enabled).to.be.equal(true);

        done();
    });

    it("should create a Input with option key 'enabled' as false", (done) => {

        expect(inputScenario.inputFalseEnable).to.be.a("object");
        expect(inputScenario.inputFalseEnable.enabled).to.be.equal(false);

        done();
    });

});
