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
import { expect } from "chai";
import { QueryResult } from "pg";
import { dbHandlerScenario } from "../../test/scenario";
import { Form, FormOptions } from "../core/form";
import { FormAnswer, FormAnswerOptions } from "../core/formAnswer";
import { FormUpdate, FormUpdateOptions } from "../core/formUpdate";
import { Input, InputOptions, Validation } from "../core/input";
import { InputAnswer, InputAnswerDict, InputAnswerOptions, InputAnswerOptionsDict } from "../core/inputAnswer";
import { InputUpdate, InputUpdateOptions } from "../core/inputUpdate";
import { SubForm, SubFormOptions } from "../core/subForm";
import { User, UserOptions } from "../core/user";
import { configs } from "./config";
import { DbHandler } from "./dbHandler";
import { InputType, UpdateType, ValidationType } from "./enumHandler";
import { ErrorHandler } from "./errorHandler";
import { OptHandler } from "./optHandler";
import { QueryBuilder, QueryOptions } from "./queryBuilder";
import { TestHandler } from "./testHandler";

describe("Database Handler", () => {
    const dbhandler = new DbHandler(configs.poolconfig);
    it("should insert a form, id = 5", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.insertForm5, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("INSERT");
            expect(result.rowCount).to.be.equal(1);
            done();

        });
    });

    it("should insert a form, id = 6, and then rollback", (done) => {
    series([
        (cb: (err: Error, result?: QueryResult) =>  void) => {
            dbhandler.form.begin(cb);
        },
        (callback: (err: Error, result?: QueryResult) =>  void) => {
            dbhandler.form.executeQuery(dbHandlerScenario.insertForm6, callback);
        },
        (cb: (err: Error, result?: QueryResult) =>  void) => {
            dbhandler.form.rollback(cb);
        }
    ], (err, results) => {
        expect(err).to.be.a("null");
        expect(results[0].command).to.be.equal("BEGIN");
        expect(results[1].command).to.be.equal("INSERT");
        expect(results[1].rowCount).to.be.equal(1);
        expect(results[2].command).to.be.equal("ROLLBACK");
        done();

        });
    });

    it("should select all forms", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.selectAllForm, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("SELECT");
            expect(result.rowCount).to.be.equal(5);
            done();

        });
    });

    it("should remove non existent form with id = 6", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteForm6, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(0);
            done();

        });
    });

    it("should remove existent form with id = 5", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteForm5, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(1);
            done();

        });
    });

    it("should insert a input", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.insertInputs,  (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("INSERT");
            expect(result.rowCount).to.be.equal(2);
            done();
        });
    });

    it("should select all inputs", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.selectAllInputs, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("SELECT");
            expect(result.rowCount).to.be.equal(15);
            done();

        });
    });

    it("should remove non existent input", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteNonExistentInput, (err: Error, result?: QueryResult) =>  {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(0);
            done();
        });
    });

    it("should remove existent input", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteBothInputs, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(3);
            done();

        });
    });

    it("should insert a input validations", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.insertInputValidations, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("INSERT");
            expect(result.rowCount).to.be.equal(2);
            done();
        });
    });

    it("should select all input validations", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.selectInputValidations, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("SELECT");
            expect(result.rowCount).to.be.equal(18);
            done();
        });
    });

    it("should remove non existent input validations", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteNonExistetnValidations, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(0);
            done();
        });
    });

    it("should remove existent input validations", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteInputValidations, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(5);
            done();
        });
    });

    it("should insert a input validations arguments", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.insertInputValArguments, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("INSERT");
            expect(result.rowCount).to.be.equal(2);
            done();
        });

    });

    it("should select all input validations arguments", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.selectInputValidationArgumetns, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("SELECT");
            expect(result.rowCount).to.be.equal(13);
            done();
        });
    });

    it("should remove non existent input validations arguments", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteNEInputValArgs, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(0);
            done();
        });
    });

    it("should remove existent input validations arguments", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteInputValArgs, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(1);
            done();
        });
    });

    it("should insert a form answers", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.insertFormAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("INSERT");
            expect(result.rowCount).to.be.equal(2);
            done();
        });
    });

    it("should select all form answers", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.selectFormAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("SELECT");
            expect(result.rowCount).to.be.equal(9);
            done();
        });
    });

    it("should remove non existent form answer", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.deleteNEFormAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(0);
            done();
        });
    });

    it("should remove existent form answers", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.deleteFormAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(2);
            done();
        });

    });

    it("should insert a input answers", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.insertInputAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("INSERT");
            expect(result.rowCount).to.be.equal(2);
            done();
        });
    });

    it("should select all form answers", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.selectInputAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("SELECT");
            expect(result.rowCount).to.be.equal(19);
            done();
        });
    });

    it("should remove non existent input answer", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.removeNEInputAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(0);
            done();
        });
    });

    it("should remove existent input answers", (done) => {
        dbhandler.answer.executeQuery(dbHandlerScenario.removeInputAnswers, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("DELETE");
            expect(result.rowCount).to.be.equal(2);
            done();
        });
    });

    it("should delete existent form with id = 3", (done) => {
        dbhandler.form.executeQuery(dbHandlerScenario.deleteForm3, (err: Error, result?: QueryResult) => {
            expect(err).to.be.a("null");
            expect(result.command).to.be.equal("UPDATE");
            done();

        });
    });
});

describe("Read and Write on Database", () => {

    const dbhandler = new DbHandler(configs.poolconfig);

    it("should read an existent form", (done) => {
        dbhandler.form.read(1, (err: Error, form: Form) => {
            expect(err).to.be.a("null");
            TestHandler.testForm(form, new Form(dbHandlerScenario.formToRead));
            done();
        });
    });

    it("should read a non existent form", (done) => {
        dbhandler.form.read(20, (err: Error, form?: Form) => {
            expect(err).to.be.not.equal(null);
            expect(form).to.be.undefined;
            done();
        });
    });

    it("should write form", (done) => {
        const form = new Form(OptHandler.form(dbHandlerScenario.formToWrite));
        dbhandler.form.write(form, (err: Error, formResult: Form) => {
            expect(err).to.be.a("null");
            expect(formResult.id).to.be.equal(5);
            let inputId: number = 16;
            for (const input of formResult.inputs){
                expect(input.id).to.be.equal(inputId);
                inputId++;
            }
            done();
        });
    });

    it("should read an existent form Answer", (done) => {
        dbhandler.form.read(1, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
               id: 3
               , form
               , timestamp: dbHandlerScenario.date
               , inputsAnswerOptions: dbHandlerScenario.inputAnswerToRead
            };
            dbhandler.answer.read(3, (err: Error, formAnswer: FormAnswer) => {
                TestHandler.testFormAnswer(formAnswer, new FormAnswer(formAnswerOptions));
                done();
           });
        });
    });

    it("should read a non existent form Answer", (done) => {
        dbhandler.answer.read(25, (err: Error, formAnswer: FormAnswer) => {
            expect(err).to.not.equal(null);
            expect(formAnswer).to.be.undefined;

            done();
        });

    });

    it("should write form Answer", (done) => {
        dbhandler.form.read(1, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: new Date()
                , inputsAnswerOptions: dbHandlerScenario.inputAnswerToWrite
            };
            const formAnswerObj = new FormAnswer(formAnswerOptions);

            dbhandler.answer.write(formAnswerObj, (err: Error, formAnswerResult: FormAnswer) => {
                expect(err).to.be.a("null");
                expect(formAnswerResult.id).to.be.equal(8);
                let inputAnswerId: number = 18;
                for (const key of Object.keys(formAnswerResult.inputAnswers)){
                    for (const inputAnswer of formAnswerResult.inputAnswers[parseInt(key, 10)]){
                        expect(inputAnswer.id).to.be.equal(inputAnswerId);
                        inputAnswerId++;
                    }
                }
                done();
            });
        });
    });

    it("should update a form and insert FormUpdate", (done) => {
        dbhandler.form.update(new FormUpdate (dbHandlerScenario.updateForm), (err: Error) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should update a form to delete it", (done) => {
        dbhandler.form.update(new FormUpdate (dbHandlerScenario.updateDelete), (err: Error) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should update inputs and insert FormUpdate", (done) => {
        dbhandler.form.update(new FormUpdate (dbHandlerScenario.updateInput), (err: Error) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should reenabled inputs and insert FormUpdate", (done) => {
        dbhandler.form.update(new FormUpdate (dbHandlerScenario.reenabledInputs), (err: Error) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should not update database operation not recognized", (done) => {
        dbhandler.form.update(dbHandlerScenario.failedUpdate, (err: Error) => {
            expect(err).to.be.not.a("null");
            done();
        });
    });

    it("should insert a input with answer sugestions", (done) => {
        dbhandler.form.write(dbHandlerScenario.formWithInputAnswerSugestions, (err: Error, formResult: Form) => {
            expect(err).to.be.a("null");
            TestHandler.testForm(dbHandlerScenario.formWithInputAnswerSugestions, formResult);
            done();
        });
    });

    it("should insert a form with typeof validation", (done) => {
        dbhandler.form.write(dbHandlerScenario.formWithTypeOfValidation, (err: Error, formResult: Form) => {
            expect(err).to.be.a("null");
            TestHandler.testForm(dbHandlerScenario.formWithTypeOfValidation, formResult);
            done();
        });
    });

    it("should insert form answer validation somecheckbox", (done) => {
        dbhandler.form.read(6, (error: Error, form: Form) => {
            const formAnswerOptions: FormAnswerOptions = {
                form
                , timestamp: new Date()
                , inputsAnswerOptions: dbHandlerScenario.inputAnswerValidationCheckbox
            };
            const formAnswerObj = new FormAnswer(formAnswerOptions);

            dbhandler.answer.write(formAnswerObj, (err: Error, formAnswerResult: FormAnswer) => {
                expect(err).to.be.a("null");
                expect(formAnswerResult.id).to.be.equal(9);
                let inputAnswerId: number = 21;
                for (const key of Object.keys(formAnswerResult.inputAnswers)){
                    for (const inputAnswer of formAnswerResult.inputAnswers[parseInt(key, 10)]){
                        expect(inputAnswer.id).to.be.equal(inputAnswerId);
                        inputAnswerId++;
                    }
                }
                done();
            });
        });
    });

    it("Should insert a default user in the database", (done) => {
        dbhandler.user.write(dbHandlerScenario.toBeInserted, (error: Error, userResult: User) => {
            expect(error).to.be.a("null");
            TestHandler.testUser(dbHandlerScenario.toBeInserted, userResult);
            done();
        });

    });

    it("Should insert an enbale-false user in the database", (done) => {
        dbhandler.user.write(dbHandlerScenario.falseEnabled, (error: Error, userResult: User) => {
            expect(error).to.be.a("null");
            TestHandler.testUser(dbHandlerScenario.falseEnabled, userResult);
            expect(userResult.enabled).to.be.eql(false);
            done();
        });

    });

    it("Should insert an enabled-null user in the database", (done) => {
        dbhandler.user.write(dbHandlerScenario.nullEnabled, (error: Error, userResult: User) => {
            expect(error).to.be.a("null");
            TestHandler.testUser(dbHandlerScenario.nullEnabled, userResult);
            expect(userResult.enabled).to.be.eql(true);
            done();
        });
    });

    it("Should insert an id-null user in the database", (done) => {
        dbhandler.user.write(dbHandlerScenario.nullId, (error: Error, userResult: User) => {
            expect(error).to.be.a("null");
            TestHandler.testUser(dbHandlerScenario.nullId, userResult);
            expect(userResult.id).to.be.equal(5);
            done();
        });
    });

    it("Should update an user from the database", (done) => {
        dbhandler.user.update(dbHandlerScenario.toupdate, dbHandlerScenario.toupdate.id, (err: Error) => {
            expect(err).to.be.a("null");
            /** Read the user from DB and tests it with the updated user */
            dbhandler.user.read(2, (error: Error, userResult: User) => {
                expect(error).to.be.a("null");
                TestHandler.testUser(dbHandlerScenario.toupdate, userResult);
            });
            done();
        });
    });

    it("Should update an user's enabled from the database", (done) => {
        dbhandler.user.update(dbHandlerScenario.updateEnable, dbHandlerScenario.updateEnable.id, (err: Error) => {
            expect(err).to.be.a("null");
            /** Read the user from DB and tests it with the updated user */
            dbhandler.user.read(3, (error: Error, userResult: User) => {
                expect(error).to.be.a("null");
                TestHandler.testUser(dbHandlerScenario.updateEnable, userResult);
            });
            done();
        });
    });

    it("Should write a form with SubForms", (done) => {
        dbhandler.form.write(new Form (dbHandlerScenario.formWithSubForm1), (err: Error, form?: Form) => {
            expect(err).to.be.a("null");
            TestHandler.testForm(new Form (dbHandlerScenario.formWithSubForm1), form);
            done();
        });
    });

    it("should update subforms and insert FormUpdate", (done) => {
        dbhandler.form.update(new FormUpdate (dbHandlerScenario.formUpdateDeleteAddWithSubForm), (err: Error, form?: Form) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should update change placement with subforms", (done) => {
        dbhandler.form.update(new FormUpdate (dbHandlerScenario.formUpdateSwapWithSubForm), (err: Error, form?: Form) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should read an existent form with subform", (done) => {
        dbhandler.form.read(8, (err: Error, form: Form) => {
            expect(err).to.be.a("null");
            TestHandler.testForm(form, new Form(dbHandlerScenario.updatedFormWithValidSubForm2));
            done();
        });
    });

    it("should not insert a form with a invalid subForm", (done) => {
        dbhandler.form.write(new Form(dbHandlerScenario.formWithInvalidSubForm1), (err: Error, formResult: Form) => {
            expect(err).to.be.not.a("null");
            expect(err.message).to.be.equal(ErrorHandler.badIdAmount(0).message);
            expect(formResult).to.be.not.a("object");
            done();
        });
    });

    it("should update form - remove and add a new subform", (done) => {
        dbhandler.form.update(new FormUpdate(dbHandlerScenario.formUpdateAddRemoveSubForm), (err: Error) => {
            expect(err).to.be.a("null");
            done();
        });
    });

    it("should read an existent form with subforms", (done) => {
        dbhandler.form.read(8, (err: Error, form: Form) => {
            TestHandler.testForm(form, new Form(dbHandlerScenario.updatedFormWithValidSubForm2));
            done();
        });
    });

    it("should not insert a form with himself as subform", (done) => {
        dbhandler.form.write(new Form(dbHandlerScenario.formWithInvalidSubForm2), (err: Error, formResult?: Form) => {
            expect(err).to.be.not.a("null");
            expect(err.message).to.be.equal(ErrorHandler.badIdAmount(0).message);
            expect(formResult).to.be.not.a("object");
            done();
        });
    });

    it("should not update a form with himself as subform", (done) => {
        dbhandler.form.update(new FormUpdate(dbHandlerScenario.formUpdateHimselfAsSubForm), (err: Error) => {
            expect(err).to.be.not.a("null");
            expect(err.message).to.be.equal("Found a subform loop");
            done();
        });
    });

    it("should insert a form with a valid subForm", (done) => {
        dbhandler.form.write(new Form(dbHandlerScenario.formWithSubForm2), (err: Error, formResult?: Form) => {
            expect(err).to.be.a("null");
            TestHandler.testForm(new Form(dbHandlerScenario.formWithSubForm2), formResult);
            done();
        });
    });

    it("should not update a form with subform loop", (done) => {
        dbhandler.form.update(new FormUpdate(dbHandlerScenario.formUpdateWithSubFormLoop), (err: Error) => {
            expect(err).to.be.not.a("null");
            expect(err.message).to.be.equal("Found a subform loop");
            done();
        });
    });

    it("should insert a answer to a form with subform", (done) => {
        dbhandler.answer.write(new FormAnswer(dbHandlerScenario.formAnswerWithSubForms), (err: Error, formAnswerResult?: FormAnswer) => {
            expect(err).to.be.a("null");
            expect(formAnswerResult.id).to.be.equal(10);
            const ids: number[] = [ 26, 34, 33, 35, 36, 18, 19, 20, 21 ];
            let inputAnswerId: number = 0;
            for (const key of Object.keys(formAnswerResult.inputAnswers)){
                for (const inputAnswer of formAnswerResult.inputAnswers[parseInt(key, 10)]){
                    expect(inputAnswer.id).to.be.equal(ids[inputAnswerId]);
                    inputAnswerId++;
                }
            }
            done();
        });
    });

    it("should read an existent form Answer with subForms", (done) => {
        dbhandler.answer.read(10, (err: Error, formAnswerResult?: FormAnswer) => {
            expect(err).to.be.a("null");
            TestHandler.testFormAnswer(formAnswerResult, new FormAnswer(dbHandlerScenario.formAnswerWithSubForms));
            done();
        });
    });

    it("Should delete an user from the database", (done) => {
        dbhandler.user.delete(2, (err: Error) => {
            expect(err).to.be.a("null");
        });
        done();
    });

    it("Should read a deleted user from the database", (done) => {
        dbhandler.user.read(100, (error: Error) => {
            expect(error.message).to.be.eql("Bad amount of ids returned: found '0' should be 1");
        });
        done();
    });

});
