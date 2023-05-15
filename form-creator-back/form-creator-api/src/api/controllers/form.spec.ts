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

import { series, waterfall } from "async";
import * as request from "supertest";
import { expect } from "chai";
import * as server from "../../main";
import { TestHandler } from "../../utils/testHandler";
import { OptHandler } from "../../utils/optHandler";
import { Form, FormOptions } from "../../core/form";
import { Fixture } from "../../../test/fixture";
import { formScenario } from "../../../test/scenario";

before(function (done): void {
    const fix: Fixture = new Fixture();

    waterfall([
        (callback: (err: Error) => void) => {
            fix.drop(callback);
        },
        (callback: (err: Error) => void) => {
            fix.create(callback);
        },
        (callback: (err: Error) => void) => {
            fix.fixture(callback);
        }
    ], (err) => {
        done(err);
    });
});

export let testToken: string;

describe("Initial test User", () => {
    it("Should respond 200 when signing up a valid user", (done) => {
        request(server)
            .post("/user/signUp")
            .send({
                name: "Test_name"
                , email: "test_email@test.com"
                , hash: "Test_pw"
            })
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("User registered with sucess.");
            })
            .end(done);
    });

    it("Should respond 200 when validating an user signIn", (done) => {
        request(server)
            .post("/user/signIn")
            .send({
                email: "test_email@test.com"
                , hash: "Test_pw"
            })
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Authentication successful.");
                testToken = res.body.token;
            })
            .end(done);
    });
})


describe("API data controller - form", () => {

    it("should respond 200 when getting valid form", (done) => {
        request(server)
            .get("/form/1")
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");

                const form: Form = new Form(OptHandler.form(res.body));
                expect(form.answerTimes).to.be.equal(false);
                TestHandler.testForm(form, new Form(OptHandler.form(formScenario.validForm)));

            })
            .end(done);
    });

    it("should respond 500 when getting inexistent form", (done) => {
        request(server)
            .get("/form/10")
            .expect(500)
            .expect((res: any) => {
                const message = "Form with id: '10' not found. Some error has occurred. Check error property for details.";
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("error");
                expect(res.body.message).to.be.equal(message);
            })
            .end(done);
    });

    it("should respond 200 when posting valid form", (done) => {

        request(server)
            .post("/form")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formToPost)
            .expect(200)
            .end(done);
    });

    it("should respond 401 when failing to validate token", (done) => {

        request(server)
            .post("/form")
            .set("Authorization", "bearer " + "coronga")
            .send(formScenario.formToPost)
            .expect(401)
            .end(done);
    });

    it("should respond 500 when posting malformed form", (done) => {

        request(server)
            .post("/form")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formMissingTitle)
            .expect(500)
            .expect((res: any) => {
                const message = "Invalid Form. Check error property for details.";
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("error");
                expect(res.body.message).to.be.equal(message);
            })
            .end(done);
    });

    it("should respond 200 when putting valid form update swap inputs", (done) => {
        request(server)
            .put("/form/1")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formToSwapInputs)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })
            .end(done);
    });

    it("should respond 200 when putting valid form update add inputs", (done) => {
        request(server)
            .put("/form/3")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formToAddInputs)
            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })
            .end(done);
    });

    it("should respond 200 when putting valid form update remove inputs", (done) => {
        request(server)
            .put("/form/3")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formToRemoveInputs)

            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })
            .end(done);
    });

    it("should respond 200 when putting valid form update reenabled inputs", (done) => {
        request(server)
            .put("/form/3")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formToReenableInputs)

            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })

            .end(done);
    });

    it("should respond 200 when putting valid form update changing the title", (done) => {
        request(server)
            .put("/form/4")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.changeTitle)

            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })

            .end(done);
    });

    it("should respond 200 when putting valid form update deleting form", (done) => {
        request(server)
            .put("/form/4")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.deleteForm)

            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })

            .end(done);
    });

    it("should respond 200 when putting valid form update undo changes", (done) => {
        request(server)
            .put("/form/4")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.undo)

            .expect(200)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg);
            })

            .end(done);
    });

    it("should respond 500 when putting a valid form update for an inexistent form", (done) => {
        request(server)
            .put("/form/100")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.validUpdate)
            .expect(500)
            .expect((res: any) => {
                const message = "Could not update Form. Some error has ocurred. Check error property for details.";
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("error");
                expect(res.body.message).to.be.equal(message);
            })
            .end(done);
    });

    it("should respond 500 when putting an malformed form update", (done) => {
        request(server)
            .put("/form/1")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.malformedUpdate)
            .expect(500)
            .expect((res: any) => {
                const message = "Invalid Form. Check error property for details.";
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("error");
                expect(res.body.message).to.be.equal(message);
            })
            .end(done);
    });

    it("should respond 500 when putting valid form update swap inputs when user dont own the form", (done) => {
        request(server)
            .put("/form/5")
            .set("Authorization", "bearer " + testToken)
            .send(formScenario.formToSwapInputs)
            .expect(500)
            .expect((res: any) => {
                expect(res.body.message).to.be.equal(formScenario.msg2);
            })
            .end(done);
    });

    it("Should get all modified dates from a form", (done) => {
        request(server)
            .get("/formDate/1")
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.equal(1);
                expect(res.body[0]).to.be.an("object");
            })
            .end(done);
    });

    it("Should get an empty array of modified dates from a form", (done) => {
        request(server)
            .get("/formDate/500")
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.equal(0);
            })
            .end(done);
    });

});
