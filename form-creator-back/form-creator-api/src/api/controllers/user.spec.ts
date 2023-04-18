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
import * as server from "../../main";
import { testToken } from "./form.spec";

describe("API data controller", () => {

    it("Should respond 500 when failing to sign up a hash-null user", (done) => {

        request(server)
            .post("/user/signUp")
            .send({
                name: "Test_name"
                , email: "test_email@test.com"
                , hash: null
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Some error has ocurred. Check error property for details.");
                expect(res.body.error).to.be.equal("data and salt arguments required");
            })
            .end(done);
    });

    it("Should respond 500 when failing sign up a name-null user", (done) => {

        request(server)
            .post("/user/signUp")
            .send({
                email: "test_email@test.com"
                , hash: "Test_pw"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Some error has ocurred. Check error property for details.");
                expect(res.body.error).to.be.equal("The dataType named 'name' was not found")
            })
            .end(done);
    });

    it("Should respond 500 when failing sign up an email-null user", (done) => {

        request(server)
            .post("/user/signUp")
            .send({
                name: "Test_name"
                , hash: "Test_pw"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Some error has ocurred. Check error property for details.");
                expect(res.body.error).to.be.equal("The dataType named 'email' was not found");
            })
            .end(done);
    });

    it("Should respond 500 when failing sign up an user with an existing email in the DB", (done) => {

        request(server)
            .post("/user/signUp")
            .send({
                name: "Test_name2"
                , email: "test_email@test.com"
                , hash: "Test_pw"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Some error has ocurred. Check error property for details.");
                expect(res.body.error).to.be.equal("Email exists on the database.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to validate an user by wrong password", (done) => {

        request(server)
            .post("/user/signIn")
            .send({
                email: "test_email@test.com"
                , hash: "Test_p"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Authentication fail.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to validate an user by email not in the DB", (done) => {

        request(server)
            .post("/user/signIn")
            .send({
                email: "test_Unexisting_email@test.com"
                , hash: "Test_pw"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Authentication fail.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to validate an email-null user", (done) => {

        request(server)
            .post("/user/signIn")
            .send({
                hash: "Test_pw"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Authentication fail.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to validate an hash-null user", (done) => {

        request(server)
            .post("/user/signIn")
            .send({
                email: "test_email@test.com"
            })
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Authentication fail.");
            })
            .end(done);
    });

    it("Should respond 200 when changing an user's password", (done) => {

        request(server)
            .put("/user/changePassword")
            .set("Authorization", "bearer " + testToken)
            .send({
                hash: "changed_pw_hashing"
            })
            .expect(200)

            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.eql("Password changed with sucess.");
            })
            .end(done);
    });

    it("Should respond 200 when listing forms from an user", (done) => {

        request(server)
            .get("/user/list/1")
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("array");
                res.body.sort(function (a: any, b: any) {
                    return a.id - b.id
                })
                let j: number = 1;
                for (const i of res.body) {
                    expect(i.id).to.be.eql(j++);
                }
            })
            .end(done);
    });

    it("Should respond 200 when updating an user info", (done) => {

        request(server)
            .put("/user/update")
            .send({
                name: "test_name_update"
                , email: "test_email@test.com"
            })
            .set("Authorization", "bearer " + testToken)
            .expect(200)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Updated");
            })
            .end(done);
    });

    it("Should respond 500 when failing on updating an user info by email missing", (done) => {

        request(server)
            .put("/user/update")
            .send({
                name: "test_name_update"
            })
            .set("Authorization", "bearer " + testToken)
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Invalid User. Check error property for details.");
                expect(res.body.error).to.be.equal("The dataType named 'email' was not found");
            })
            .end(done);
    });

    it("Should respond 500 when failing on updating an user info by email missing", (done) => {

        request(server)
            .put("/user/update")
            .send({
                email: "test_email@test.com"
            })
            .set("Authorization", "bearer " + testToken)
            .expect(500)
            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Invalid User. Check error property for details.");
                expect(res.body.error).to.be.equal("The dataType named 'name' was not found");
            })
            .end(done);
    });

    it("Should respond 200 when deleting an user from the database", (done) => {

        request(server)
            .delete("/user/deleteData/1")
            .set("Authorization", "bearer " + testToken)
            .expect(200)

            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("User data deleted.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to delete an user from the database", (done) => {

        request(server)
            .delete("/user/deleteData/1")
            .set("Authorization", "bearer " + testToken)
            .expect(500)

            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Failed to delete user. Check error properties for details.");
                expect(res.body.error).to.be.eql("Invalid ID, user doesn't exist.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to delete an user by incompatible ID", (done) => {

        request(server)
            .delete("/user/deleteData/2")
            .set("Authorization", "bearer " + testToken)
            .expect(500)

            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.equal("Unauthorized action.");
            })
            .end(done);
    });

    it("Should respond 500 when failing to change a password", (done) => {

        request(server)
            .put("/user/changePassword")
            .set("Authorization", "bearer " + testToken)
            .send({
                hash: "changed_pw_hashing"
            })
            .expect(500)

            .expect((res: any) => {
                expect(res.body).to.be.an("object");
                expect(res.body.message).to.be.an("string");
                expect(res.body.message).to.be.eql("Some error has ocurred. Check error property for details.")
                expect(res.body.error).to.be.eql("Bad amount of ids returned: found '0' should be 1");
            })
            .end(done);
    });
});
