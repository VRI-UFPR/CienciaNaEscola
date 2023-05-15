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

import * as request from "supertest";
import { expect } from "chai";
import { formAnswerScenario, dbHandlerScenario } from "../../../test/scenario";
import * as server from "../../main";
import { EnumHandler, InputType, ValidationType } from "../../utils/enumHandler";
import { TestHandler } from "../../utils/testHandler";
import { OptHandler } from "../../utils/optHandler";
import { Form, FormOptions } from "../../core/form";
import { Input, InputOptions, Validation } from "../../core/input";
import { testToken } from "./form.spec";
import { FormAnswer, FormAnswerOptions } from "../../core/formAnswer";
const util = require('util');


describe("API data controller", () => {

    it("should respond 200 when posting valid form Answer", (done) => {

        request(server)
            .post("/answer/1")
            .send(formAnswerScenario.validAnswer)
            .expect(200)
            .expect((res: any) => {
                expect(res.body.id).to.be.equal(7);
                expect(res.body.message).to.be.equal("Answered");
            })
            .end(done);
    });

    it("should respond 500 when posting invalid form Answer", (done) => {

        request(server)
            .post("/answer/1")
            .send(formAnswerScenario.invalidAnswer)
            .expect(500)
            .expect((res: any) => {
                const message = "Could not Create form Answer. Some error has occurred. Check error property for details.";
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("error");
                expect(res.body.message).to.be.equal(message);
                expect(res.body.error["2"]).to.be.equal("RegEx do not match");
                expect(res.body.error["3"]).to.be.equal("Input answer must be lower than 10");
            })
            .end(done);
    });

    it("should respond 500 when posting valid form Answer for a invalid Form", (done) => {

        request(server)
            .post("/answer/10")
            .send(formAnswerScenario.validAnswer)
            .expect(500)
            .expect((res: any) => {
                const message = "Form with id: '10' not found. Some error has occurred. Check error property for details.";
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("error");
                expect(res.body.message).to.be.equal(message);
            })
            .end(done);
    });

    it("Should respond 200 when reading a form answer", (done) => {

        request(server)
            .get("/answer/1")
            .set("Authorization", "bearer " + testToken)
            .expect(200)

            .expect((res: any) => {
                for (let i = 0; i < 3; ++i) {
                    TestHandler.testFormAnswer(res.body[i], formAnswerScenario.formAnswerRead[i]);
                }
            })
            .end(done);
    });

    it("Should respond 500 when failing to read a form answer", (done) => {

        request(server)
            .get("/answer/500")
            .set("Authorization", "bearer " + testToken)
            .expect(500)

            .expect((res: any) => {
                expect(res.body.error).to.be.equal("User dont own this form.");
            })
            .end(done);
    });

    it("Should respond 200 when reading the number of answers from a form", (done) => {

        request(server)
            .get("/answerNumber/1")
            .expect(200)

            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.answerNumber).to.be.an("number");
                expect(res.body.answerNumber).to.be.equal(3);
            })
            .end(done);
    })
});
