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

import { Form, FormOptions } from "../src/core/form";
import { FormAnswer, FormAnswerOptions } from "../src/core/formAnswer";
import { FormUpdate, FormUpdateOptions } from "../src/core/formUpdate";
import { Input, InputOptions, Validation } from "../src/core/input";
import { InputAnswerOptions, InputAnswerOptionsDict } from "../src/core/inputAnswer";
import { InputUpdate, InputUpdateOptions } from "../src/core/inputUpdate";
import { SubForm, SubFormOptions } from "../src/core/subForm";
import { User } from "../src/core/user";
import { EnumHandler, InputType, UpdateType, ValidationType } from "../src/utils/enumHandler";
import { OptHandler } from "../src/utils/optHandler";
import { QueryBuilder, QueryOptions } from "../src/utils/queryBuilder";
/**
 * testing sort.spec.ts
 */
/** Array with random placement values */
const randomPlacement: any[] = [
    { placement: 5 }
    , { placement: 3 }
    , { placement: 1 }
    , { placement: 2 }
    , { placement: 1 }
    , { placement: 0 }
    , { placement: 4 }
    , { placement: 4 }
    , { placement: 3 }
    , { placement: 0 }
];
/** Array with sorted placement values */
const orderedPlacement: any[] = [
    { placement: 0 }
    , { placement: 0 }
    , { placement: 1 }
    , { placement: 1 }
    , { placement: 2 }
    , { placement: 3 }
    , { placement: 3 }
    , { placement: 4 }
    , { placement: 4 }
    , { placement: 5 }
];

/** ====================================================== */

/** The same 'Date' value was used in some objects */
const date: Date = new Date(2019, 6, 4);

/** input with value under the minimum char number */
const inputMinCharNumber: InputAnswerOptions = {
    idInput: 4
    , placement: 0
    , value: "MIN 8"
};
/** comparing with min input char */
const inputQuest2Form2: InputAnswerOptions = {
    idInput: 5
    , placement: 0
    , value: "Answer to Question 2 Form 2"
};
/** dict for testing min char number */
const AnswerDictMinCharNumber: InputAnswerOptionsDict = {
    4: [inputMinCharNumber]
    , 5: [inputQuest2Form2]
};
/** comparing with mandatory input */
const inputQuest1Fomr2: InputAnswerOptions = {
    idInput: 4
    , placement: 0
    , value: "Answer to Question 1 Form 2"
};
/** test mandatory input */
const lackingInputValueAnswer: InputAnswerOptions = {
    idInput: 5
    , placement: 0
    , value: ""
};
/** dict for testing mandatory input */
const AnswerDictMandatoryInput: InputAnswerOptionsDict = {
    4: [inputQuest1Fomr2]
    , 5: [lackingInputValueAnswer]
};
/** being compared with max char, 'has regex' */
const AnswerQuest1Form1: InputAnswerOptions = {
    idInput: 1
    , placement: 0
    , value: "Answer to Question 1 Form 1"
};
/** being compared with max char */
const AnswerNumValue: InputAnswerOptions = {
    idInput: 2
    , placement: 0
    , value: "12345-000"
};
/** test maximun char */
const AnswerMoreThan10Char: InputAnswerOptions = {
    idInput: 3
    , placement: 0
    , value: "MORE THEN 10 CHAR"
};
/** dict for testing maximun char number */
const AnswerDictMaxChar: InputAnswerOptionsDict = {
    1: [AnswerQuest1Form1]
    , 2: [AnswerNumValue]
    , 3: [AnswerMoreThan10Char]
};
/** test having a RegEx */
const AnswerRegEx: InputAnswerOptions = {
    idInput: 2
    , placement: 0
    , value: "12aa345-000"
};
/** being compared with having a RegEx */
const AnswerMaxChar10: InputAnswerOptions = {
    idInput: 3
    , placement: 0
    , value: "MAXCHAR 10"
};
/** dict for testing when the input has an Regular expression that does not match */
const DictWithRegExInput: InputAnswerOptionsDict = {
    1: [AnswerNumValue]
    , 2: [AnswerRegEx]
    , 3: [AnswerMaxChar10]
};
/** test condition for input being int and to not have more than 2 answers */
const AnswerNaN: InputAnswerOptions = {
    idInput: 23
    , placement: 0
    , value: "Not a number"
};
/** test having more than 2 answer */
const Answer23: InputAnswerOptions = {
    idInput: 23
    , placement: 0
    , value: "23"
};
/** test having more than 2 answer */
const Answer23conflict: InputAnswerOptions = {
    idInput: 23
    , placement: 0
    , value: "24"
};
/**
 * expected answer
 */
const AnswerOK: InputAnswerOptions = {
    idInput: 24
    , placement: 0
    , value: "25"
};
/**
 * test an answer not being a float when
 */
const AnsweNotaFloat: InputAnswerOptions = {
    idInput: 25
    , placement: 0
    , value: "Not a Float"
};
/**
 * espected float answer
 */
const AnswerFloat: InputAnswerOptions = {
    idInput: 26
    , placement: 0
    , value: "1.83"
};
/**
 * answer not having an date when required
 */
const AnswerNotaDate: InputAnswerOptions = {
    idInput: 27
    , placement: 0
    , value: "Not a date"
};
/**
 * expected date answer
 */
const AnswerDate: InputAnswerOptions = {
    idInput: 28
    , placement: 0
    , value: "02/02/2002"
};
/**
 * invalid answer
 */
const AnswerInvalid: InputAnswerOptions = {
    idInput: 29
    , placement: 0
    , value: "Invalid argument causes invalid answer"
};
/** Dictionary to test wrong inputAnswerOptions */
const AnswerOptionsDict: InputAnswerOptionsDict = {
    23: [
        AnswerNaN
        , Answer23
        , Answer23conflict
    ]
    , 24: [AnswerOK]
    , 25: [AnsweNotaFloat]
    , 26: [AnswerFloat]
    , 27: [AnswerNotaDate]
    , 28: [AnswerDate]
    , 29: [AnswerInvalid]
};
/** AnswerOpt with invalid placement */
const notAnswer: InputAnswerOptions = {
    idInput: 18
    , placement: 5
    , value: "Invalid Placement"
};
/** Answer with 'true' value */
const AnswerTrue: InputAnswerOptions = {
    idInput: 19
    , placement: 1
    , value: "true"
};
/** Answer with 'true' value */
const AnswerTrue2nd: InputAnswerOptions = {
    idInput: 20
    , placement: 1
    , value: "true"
};
/** Answer with 'true' value */
const AnswerTrue3rd: InputAnswerOptions = {
    idInput: 21
    , placement: 0
    , value: "true"
};
/** Answer with a wrong ID */
const AnswerWrongId: InputAnswerOptions = {
    idInput: 22
    , placement: 0
    , value: "Answer question 5 form 6"
};
/** Dictionary to test some properties */
const AnswerDictHasSugestionInput: InputAnswerOptionsDict = {
    18: [notAnswer]
    , 19: [AnswerTrue]
    , 20: [AnswerTrue2nd]
    , 21: [AnswerTrue3rd]
    , 22: [AnswerWrongId]
};
/** ====================================================== */

/**
 * testing diffHandler.spec.ts -- compare new inputs with the old ones
 * Input(ordered by description) -> forms -> expectedInput -> expectedForm
 */

/**
 * input to be compared;
 * without validation value
 */
const Input1: Input = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: 1
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input1Otherplacement: Input = {
    placement: 1
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: 1
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input1UndefinedID: Input = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: undefined
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input1Empty: Input = {
    placement: 1
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: null
    , sugestions: []
    , subForm: null
};

/** input to be compared */
const Input2: Input = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 3
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input2Placement0: Input = {
    placement: 0
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 3
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input2UndefinedID: Input = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: undefined
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input2Placement0id2: Input = {
    placement: 0
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 2
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input2id2: Input = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 2
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input2Placement2id2: Input = {
    placement: 2
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 2
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input2Placement0idNULL: Input = {
    placement: 0
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: null
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input3: Input = {
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: 2
    , sugestions: []
    , subForm: null
};

/** input to be compared */
const Input3UndefinedID: Input = {
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: undefined
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input3OtherID: Input = {
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: 3
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input3Placement1id3: Input = {
    placement: 1
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: 3
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input3idNULL: Input = {
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: null
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input4: Input = {
    placement: 3
    , description: "Description Question 4 Form 1"
    , question: "Question 4 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: undefined
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const Input4Placement2id4: Input = {
    placement: 2
    , description: "Description Question 4 Form 1"
    , question: "Question 4 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 4
    , sugestions: []
    , subForm: null
};
/** input to be compared */
const mixedInput1: Input = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 3
    , sugestions: []
    , subForm: null
};
/** New form with one less input */
const form1: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , Input2
    ],
    answerTimes: true
    , status: true
};

/** New form with one more Input */
const form2: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , Input2
        , Input3
        , Input4
    ],
    answerTimes: true
    , status: true

};
/** New form with swapped inputs */
const form3: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1Otherplacement
        , Input2Placement0
        , Input3
    ],
    answerTimes: true
    , status: true
};
/** New form with inputs that were removed and added */
const form4: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1UndefinedID
        , Input2UndefinedID
        , Input3UndefinedID
    ],
    answerTimes: true
    , status: true
};
/** New form resulting from the aplication of all operations */
const form5: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1Otherplacement
        , Input2Placement0id2
        , Input3OtherID
        , Input4
    ],
    answerTimes: true
    , status: true
};
/** New form resulting from the restoration of an Input */
const form6: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , Input2Placement2id2
        , Input3Placement1id3
    ],
    answerTimes: true
    , status: true
};
/** New form */
const form7: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1Empty
        , Input2Placement0idNULL
        , Input3idNULL
    ],
    answerTimes: true
    , status: true
};
/** New form created with a wrong title */
const form8: Form = {
    id: 1
    , title: "Title 1"
    , description: "Description 1"
    , inputs: [
        Input1
        , Input2
    ],
    answerTimes: true
    , status: true
};
/** New form created */
const formToRead: Form = {
    id: 1
    , title: "Title 1"
    , description: "Description 1"
    , inputs: [
        Input1
        , Input2
    ],
    answerTimes: true
    , status: true
};
/** Old form that serves as a base for comparison */
const formBase: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , Input2
        , Input3
    ],
    answerTimes: true
    , status: true
};
/** Another old form that serves as a base for comparison */
const formBase2: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , Input2id2
        , Input4Placement2id4
    ],
    answerTimes: true
    , status: true
};
/** Another old form that serves as a base for comparison */
const formBase3: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , mixedInput1
    ],
    answerTimes: true
    , status: true
};
/** Empty form used as a base for comparison */
const emptyForm: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: []
    , answerTimes: true
    , status: true
};
/** Expected input update to check an form update with a 'remove' type */
const expInput1: InputUpdate = {
    input: Input3
    , inputOperation: UpdateType.REMOVE
    , value: null
};

/** Expected input update to check an form update with a 'add' type */
const expInput2: InputUpdate = {
    input: Input4
    , inputOperation: UpdateType.ADD
    , value: null
};

/** Expected input update to check an form update with a 'swap' type */
const expInput3: InputUpdate = {
    input: Input1Otherplacement
    , inputOperation: UpdateType.SWAP
    , value: "" + 0
};

/** Expected input update to check an form update with a 'swap' type */
const expInput4: InputUpdate = {
    input: Input2Placement0
    , inputOperation: UpdateType.SWAP
    , value: "" + 1
};
/** Expected input update to check an form update with 'swap' type */
const expInput5: InputUpdate = {
    input: Input1UndefinedID
    , inputOperation: UpdateType.ADD
    , value: null
};
/** Expected input update to check an form update with 'add' type */
const expInput6: InputUpdate = {
    input: Input2UndefinedID
    , inputOperation: UpdateType.ADD
    , value: null
};
/** Expected input update to check an form update with 'add' type */
const expInput7: InputUpdate = {
    input: Input3UndefinedID
    , inputOperation: UpdateType.ADD
    , value: null
};
/** Expected input update to check an form update with 'swap' type */
const expInput8: InputUpdate = {
    input: Input2Placement0id2
    , inputOperation: UpdateType.SWAP
    , value: "" + 1
};
/** Expected input update to check an form update with 'reenabled' type */
const expInput9: InputUpdate = {
    input: Input3OtherID
    , inputOperation: UpdateType.REENABLED
    , value: null
};
/** Expected input update to check an form update with 'remove' type */
const expInput10: InputUpdate = {
    input: Input4Placement2id4
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** Expected input update to check an form update with 'remove' type */
const expInput11: InputUpdate = {
    input: Input2Placement2id2
    , inputOperation: UpdateType.REENABLED
    , value: null
};
/** Expected input update to check an form update when create a new form */
const expInput12: InputUpdate = {
    input: Input1Empty
    , inputOperation: UpdateType.ADD
    , value: null
};
/** Expected input update to check an form update when create a new form */
const expInput13: InputUpdate = {
    input: Input2Placement0idNULL
    , inputOperation: UpdateType.ADD
    , value: null
};
/** Expected input update to check an form update when create a new form */
const expInput14: InputUpdate = {
    input: Input3idNULL
    , inputOperation: UpdateType.ADD
    , value: null
};
/** Expected input update with "remove" operation type */
const expInputUsingformBase1: InputUpdate = {
    input: Input1
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** Expected input update */
const expInputUsingformBase2: InputUpdate = {
    input: Input2
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** Base form used as a correctude parameter */
const expFormUpdate1: FormUpdate = {
    form: form1
    , updateDate: date
    , inputUpdates: [expInput1]
};
/** Base form used as a correctude parameter */
const expFormUpdate2: FormUpdate = {
    form: form2
    , updateDate: date
    , inputUpdates: [expInput2]
};
/** Base form used as a correctude parameter */
const expFormUpdate3: FormUpdate = {
    form: form3
    , updateDate: date
    , inputUpdates: [
        expInput3
        , expInput4
    ]
};
/** Base form used as a correctude parameter */
const expFormUpdate4: FormUpdate = {
    form: form4
    , updateDate: date
    , inputUpdates: [
        expInputUsingformBase1
        , expInput1
        , expInputUsingformBase2
        , expInput5
        , expInput6
        , expInput7
    ]
};
/** Base form used as a correctude parameter */
const expFormUpdateALL: FormUpdate = {
    form: form5
    , updateDate: date
    , inputUpdates: [
        expInput3
        , expInput8
        , expInput9
        , expInput10
        , expInput2
    ]
};
/** Base form used as a correctude parameter */
const expFormUpdateRESTORE: FormUpdate = {
    form: form6
    , updateDate: date
    , inputUpdates: [
        expInput11
    ]
};
/** Base form used as a correctude parameter */
const expFormUpdateCREATION: FormUpdate = {
    form: form7
    , updateDate: date
    , inputUpdates: [
        expInput12
        , expInput13
        , expInput14
    ]
};
/** Base form used as a correctude parameter */
const expFormUpdateREMOVEALL: FormUpdate = {
    form: emptyForm
    , updateDate: date
    , inputUpdates: [
        expInputUsingformBase1
        , expInput1
        , expInputUsingformBase2
    ]
};
/** Base form used as a correctude parameter */
const expFormUpdateTITLE: FormUpdate = {
    form: form8
    , updateDate: date
    , changed: true
    , inputUpdates: []
};

/** ============================================= */
/**
 * Testing inputUpdate.spec.ts -- compare if an input update went fine
 */
/** Options of the input used to update */
const optstoUpdate: InputUpdateOptions = {
    input: Input1
    , inputOperation: UpdateType.ADD
    , value: null
};
/** The proper update */
const resInputUpdate: InputUpdate = new InputUpdate(optstoUpdate);
/** Input used as comparison at "should create a valid InputUpdate with id null" */
const expInputUpdate: InputUpdate = {
    input: Input1
    , inputOperation: UpdateType.ADD
    , value: null
    , id: null
};
/** ============================================= */
/** Input testing Scenario */

/** Options to create an input with undefined Enabled key */
const inputOptsUndefEnable: InputOptions = {
    placement: 0
    , description: "Description Question 1"
    , question: "Question 1"
    , type: InputType.TEXT
    , validation: []
};
/** Input created from the Undefined Enabled Key options */
const inputUndefEnableKey: Input = new Input(inputOptsUndefEnable);
/**
 * Options to create an input with null Enabled key
 */
const inputOptsNullEnable: InputOptions = {
    placement: 1
    , description: "Description Question 2"
    , question: "Question 2"
    , enabled: null
    , type: InputType.TEXT
    , validation: []
};
/** Input created from the Null Enabled Key options */
const inputNullEnabled: Input = new Input(inputOptsNullEnable);
/** Options to create an input with treu Enabled key */
const inputOptsTrueEnable: InputOptions = {
    placement: 1
    , description: "Description Question 2"
    , question: "Question 2"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
};
/** Input created from the True Enabled Key options */
const inputTrueEnable: Input = new Input(inputOptsTrueEnable);
/** Options to create an input with false Enabled key */
const inputOptsFalseEnable: InputOptions = {
    placement: 1
    , description: "Description Question 2"
    , question: "Question 2"
    , enabled: false
    , type: InputType.TEXT
    , validation: []
};
/** Input created from the Flase Enabled Key options */
const inputFalseEnable: Input = new Input(inputOptsFalseEnable);

/** ============================================= */
/** Enum Handler testing Scenario */
/** Result of stringifying an update, with parameter specifying type 'NONE' */
const stringifiedUpdateNone = EnumHandler.stringifyUpdateType(UpdateType.NONE);
/** Result of stringifying an update, with parameter specifying type 'ADD' */
const stringigiedUpdateAdd = EnumHandler.stringifyUpdateType(UpdateType.ADD);
/** Result of stringifying an update, with parameter specifying type 'REMOVE' */
const stringifiedUpdateRemove = EnumHandler.stringifyUpdateType(UpdateType.REMOVE);
/** Result of stringifying an update, with parameter specifying type 'SWAP' */
const stringifiedUpdateSwap = EnumHandler.stringifyUpdateType(UpdateType.SWAP);
/** Result of stringifying an update, with parameter specifying type 'REENABLED' */
const stringifiedUpdateReenabled = EnumHandler.stringifyUpdateType(UpdateType.REENABLED);

/** Result of parssing an update, with parameter 'add' */
const parsedUpdateAdd = EnumHandler.parseUpdateType("add");
/** Result of parssing an update, with parameter 'ADD' */
const parsedUpdateAddCapitalLetters = EnumHandler.parseUpdateType("ADD");
/** Result of parssing an update, with parameter 'remove' */
const parsedUpdateRemove = EnumHandler.parseUpdateType("remove");
/** Result of parssing an update, with parameter 'REMOVE' */
const parsedUpdateRemoveCapitalLetters = EnumHandler.parseUpdateType("REMOVE");
/** Result of parssing an update, with parameter 'swap' */
const parsedUpdateSwap = EnumHandler.parseUpdateType("swap");
/** Result of parssing an update, with parameter 'SWAP' */
const parsedUpdateSwapCapitalLetters = EnumHandler.parseUpdateType("SWAP");
/** Result of parssing an update, with parameter 'reenabled' */
const parsedUpdateReenabled = EnumHandler.parseUpdateType("reenabled");
/** Result of parssing an update, with parameter 'REENABLED' */
const parsedUpdateReenabledCapitalLetters = EnumHandler.parseUpdateType("REENABLED");
/** Result of parssing an update, with parameter "" */
const parsedUpdateNone = EnumHandler.parseUpdateType("");
/** Result of parssing an update, with parameter 'fool' */
const parsedUpdateFOOL = EnumHandler.parseUpdateType("fool");

/** Result of stringifying an input, with parameter specifying type 'NONE' */
const stringifiedInputNone = EnumHandler.stringifyInputType(InputType.NONE);
/** Result of stringifying an input, with parameter specifying type 'TEXT' */
const stringifiedInputText = EnumHandler.stringifyInputType(InputType.TEXT);
/** Result of stringifying an input, with parameter specifying type 'RADIO' */
const stringifiedInputRadio = EnumHandler.stringifyInputType(InputType.RADIO);
/** Result of stringifying an input, with parameter specifying type 'CHECKBOX' */
const stringifiedInputCheckbox = EnumHandler.stringifyInputType(InputType.CHECKBOX);

/** Result of parssing an input, with parameter '' */
const parsedInputNone = EnumHandler.parseInputType("");
/** Result of parssing an input, with parameter 'text' */
const parsedInputText = EnumHandler.parseInputType("text");
/** Result of parssing an input, with parameter 'TEXT' */
const parsedInputTextCapitalLetters = EnumHandler.parseInputType("TEXT");
/** Result of parssing an input, with parameter 'radio' */
const parsedInputRadio = EnumHandler.parseInputType("radio");
/** Result of parssing an input, with parameter 'RADIO' */
const parsedInputRadioCapitalLetters = EnumHandler.parseInputType("RADIO");
/** Result of parssing an input, with parameter 'checkbox' */
const parsedInputCheckbox = EnumHandler.parseInputType("checkbox");
/** Result of parssing an input, with parameter 'CHECKBOX' */
const parsedInputCheckboxCapitalLetters = EnumHandler.parseInputType("CHECKBOX");
/** Result of parssing an input, with parameter 'fool' */
const parsedInputFOOL = EnumHandler.parseInputType("fool");
/** Result of parssing an input, with parameter 'select' */
const parsedInputSelect = EnumHandler.parseInputType("select");
/** Result of parssing an input, with parameter 'SELECT' */
const parsedInputSelectCapitalLetters = EnumHandler.parseInputType("SELECT");

/** Result of stringifying an validation, with parameter specifying type 'REGEX' */
const stringifiedValidationRegex = EnumHandler.stringifyValidationType(ValidationType.REGEX);
/** Result of stringifying an validation, with parameter specifying type 'MANDATORY' */
const stringifiedValidationMandatory = EnumHandler.stringifyValidationType(ValidationType.MANDATORY);
/** Result of stringifying an validation, with parameter specifying type 'MAXCHAR' */
const stringifiedValidationMaxChar = EnumHandler.stringifyValidationType(ValidationType.MAXCHAR);
/** Result of stringifying an validation, with parameter specifying type 'MINCHAR' */
const stringifiedValidationMinChar = EnumHandler.stringifyValidationType(ValidationType.MINCHAR);
/** Result of stringifying an validation, with parameter specifying type 'TYPEOF' */
const stringifiedValidationTypeOf = EnumHandler.stringifyValidationType(ValidationType.TYPEOF);
/** Result of stringifying an validation, with parameter specifyingtype 'SOMECHAR' */
const stringifiedValidationSomeCheckbox = EnumHandler.stringifyValidationType(ValidationType.SOMECHECKBOX);
/** Result of stringifying an validation, with parameter specifying type 'MAXANSWERS' */
const stringifiedValidationMaxAnswers = EnumHandler.stringifyValidationType(ValidationType.MAXANSWERS);
/** Result of stringifying an validation, with parameter specifying type 'NONE' */
const stringifiedValidationNone = EnumHandler.stringifyValidationType(ValidationType.NONE);

/** Result of parssing an validation, with parameter 'regex' */
const parsedValidationRegex = EnumHandler.parseValidationType("regex");
/** Result of parssing an validation, with parameter 'REGEX' */
const parsedValidationRegexCapitalized = EnumHandler.parseValidationType("REGEX");
/** Result of parssing an validation, with parameter 'mandatory' */
const parsedValidationMandatory = EnumHandler.parseValidationType("mandatory");
/** Result of parssing an validation, with parameter 'MANDATORY' */
const parsedValidationMandatoryCapitalized = EnumHandler.parseValidationType("MANDATORY");
/** Result of parssing an validation, with parameter 'maxchar' */
const parsedValidationMaxChar = EnumHandler.parseValidationType("maxchar");
/** Result of parssing an validation, with parameter 'MAXCHAR' */
const parsedValidationMaxCharyCapitalized = EnumHandler.parseValidationType("MAXCHAR");
/** Result of parssing an validation, with parameter 'minchar' */
const parsedValidationMinChar = EnumHandler.parseValidationType("minchar");
/** Result of parssing an validation, with parameter 'MINCHAR' */
const parsedValidationMinCharyCapitalized = EnumHandler.parseValidationType("MINCHAR");
/** Result of parssing an validation, with parameter 'typeof' */
const parsedValidationTypeOf = EnumHandler.parseValidationType("typeof");
/** Result of parssing an validation, with parameter 'TYPEOF' */
const parsedValidationTypeOfCapitalized = EnumHandler.parseValidationType("TYPEOF");
/** Result of parssing an validation, with parameter 'somecheckbox' */
const parsedValidationSomeCheckbox = EnumHandler.parseValidationType("somecheckbox");
/** Result of parssing an validation, with parameter 'SOMECHECKBOX' */
const parsedValidationSomeCheckboxCapitalized = EnumHandler.parseValidationType("SOMECHECKBOX");
/** Result of parssing an validation, with parameter 'maxanswers' */
const parsedValidationMaxAnswers = EnumHandler.parseValidationType("maxanswers");
/** Result of parssing an validation, with parameter 'MAXANSWERS' */
const parsedValidationMaxAnswersCapitalized = EnumHandler.parseValidationType("MAXANSWERS");
/** Result of parssing an validation, with parameter 'dependency' */
const parsedValidationDependency = EnumHandler.parseValidationType("dependency");
/** Result of parssing an validation, with parameter 'DEPENDENCY' */
const parsedValidationDependencyCapitalized = EnumHandler.parseValidationType("DEPENDENCY");
/** Result of parssing an validation, with parameter '' */
const parsedValidationNone = EnumHandler.parseValidationType("");
/** Result of parssing an validation, with parameter 'fool' */
const parsedValidatioFOOL = EnumHandler.parseValidationType("fool");

/** ============================================= */
/** formUpdate testing Scenario */
/** Input Opts to be used as input parameters */
const inputOptsFull: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: 1
};

/** Input update options to be used as inputUpdateOpts parameter */
const inputUpdateObj: InputUpdateOptions = {
    input: inputOptsFull
    , inputOperation: UpdateType.ADD
    , value: null
};
/** FormOpts that will be used on a update as a parameter */
const formOptsObj: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [inputOptsFull]
};
/** FormUpdate used to test the case where it has null id */
const formUpdateOptsObj: FormUpdateOptions = {
    form: formOptsObj
    , updateDate: new Date()
    , inputUpdates: [inputUpdateObj]
};
/** FormUpdate that will be compared expecting to have null id */
const formUpdateNullId: FormUpdate = new FormUpdate(formUpdateOptsObj);

/** Expected form with null id */
const expFormtoUpdateNullId: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [Input1]
    , answerTimes: true
    , status: true
};
/** Expected form update having null id */
const expFormUpdate: FormUpdate = {
    form: expFormtoUpdateNullId
    , updateDate: new Date()
    , inputUpdates: [expInputUpdate]
    , id: null
};
/** ============================================= */

/** optHandler testing Scenario */

/** InputOpts used to create a form to be used to test its atributes */
const optsInput1: InputOptions = { // equivalente à input 1
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , validation: []
    , id: 1
};
/** InputOpts used to create a form to be used to test its atributes */
const optsInput2: InputOptions = { // equivalente à Input2
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 3
};
/** InputOpts used to create a form to be used to test its atributes */
const optsInput3: InputOptions = { // equivalente à Input3
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: 2
};
/** InputOpts used to create a InputUpdate */
const inputOpts4: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , type: InputType.TEXT
    , validation: []
    , id: 1
};
/** InputOpts that has a sugestion */
const inputOptsSugestionMissingPlacement: any = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , type: InputType.TEXT
    , validation: []
    , sugestions: [
        { value: "Malformed Sugestion" }
        , { value: "Sugestion", placement: 0 }
    ]
    , id: 1
};
/** InputOpts with a sugestion that misses value */
const inputOptsSugestionMissingValue: any = {
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , type: InputType.TEXT
    , validation: []
    , sugestions: [
        { placement: 0 }
        , { value: "Sugestion", placement: 1 }
    ]
    , id: 1
};
/** Form that has no title atribute */
const formMissingTitle: any = {
    id: 1
    , description: "Form Description 1"
    , inputs: [
        OptHandler.input(optsInput1)
        , OptHandler.input(optsInput2)
        , OptHandler.input(optsInput3)
    ],
    answerTimes: true
    , status: true
};
/** Form that has no description atribute */
const formMissingDescription: any = {
    id: 1
    , title: "Form Title 1"
    , inputs: [
        OptHandler.input(optsInput1)
        , OptHandler.input(optsInput2)
        , OptHandler.input(optsInput3)
    ],
    answerTimes: true
    , status: true
};
/** Form that has no input atribute */
const formMissingInputs: any = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , answerTimes: true
    , status: true
};
/** Input that has no placement atribute */
const inputMissingPlacement: any = {
    description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , validation: []
    , inputs: "Fool"
    , id: 1
};
/** Input that has no description atribute */
const inputMissingDescription: any = {
    placement: 0
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , validation: []
    , id: 1
};
/** Input that has no question atribute */
const inputMissingQuestion: any = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , type: InputType.TEXT
    , validation: []
    , id: 1
};
/** Input that has no type atribute */
const inputMissingType: any = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , validation: []
    , id: 1
};
/** Input that has no validation atribute */
const inputMissingValidation: any = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , id: 1
};
/** Input that has a non-array validation atribute */
const inputValidationNotAnArray: any = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , validation: "fool"
    , id: 1
};
/** Correct input options that will be used on dictionaries */
const inputAnswerOpts1: InputAnswerOptions = {
    id: 1
    , idInput: null
    , placement: 0
    , value: "Answer 1 to Question 1 Form 1"
};
/** Correct input options that will be used on dictionaries */
const inputAnswerOpts2: InputAnswerOptions = {
    id: 2
    , idInput: null
    , placement: 0
    , value: "Answer 1 to Question 2 Form"
};
/** Correct input options that will be used on dictionaries */
const inputAnswerOpts3: InputAnswerOptions = {
    id: 3
    , idInput: null
    , placement: 0
    , value: "Answer 1 to Question 3 Form"
};
/** Correct input options that will be used on dictionaries */
const inputAnswerOpts4: InputAnswerOptions = {
    id: 4
    , idInput: null
    , placement: 1
    , value: "Answer 2 to Question 3 Form"
};
/** InputOpt missing id atribute - should return error */
const inputOptsMissingId: any = {
    id: 1
    , placement: 0
    , value: "Answer 1 to Question 1 Form 1"
};
/** InputOpt missing placement atribute */
const inputOptsMissingPlacement: any = {
    id: 1
    , idInput: null
    , value: "Answer 1 to Question 1 Form 1"
};
/** InputOpt missing value property */
const inputOptsMissingValue: any = {
    id: 1
    , idInput: null
    , placement: 0
};
/** Dictionary containing valid inputOpts */
const inputAnswerOptionsDictOptHandler: InputAnswerOptionsDict = {
    1: [inputAnswerOpts1]
    , 2: [inputAnswerOpts2]
    , 3: [inputAnswerOpts3, inputAnswerOpts4]
};
/** Dictionary containing non-valid inputOpts that has no IdInput */
const dictMissingIdInput: InputAnswerOptionsDict = {
    1: [inputOptsMissingId]
};
/** Dictionary containing non-valid inputOpts that has no placment */
const dictMissingPlacement: InputAnswerOptionsDict = {
    1: [inputOptsMissingPlacement]
};
/** Dictionary contaunung non-valid inputOpts that has no value property */
const dictMissingValue: InputAnswerOptionsDict = {
    1: [inputOptsMissingValue]
};

/** FormAnswer that has no form associated */
const formAnswerHasNoFormAssociated: any = {
    id: 1
    , timestamp: date
    , inputsAnswerOptions: inputAnswerOptionsDictOptHandler
};
/** FormAnswer that has no form type associated */
const formAnswerHasNoFormType: any = {
    id: 1
    , form: inputOpts4
    , timestamp: date
    , inputsAnswerOptions: inputAnswerOptionsDictOptHandler
};
/** FormOpts used to create a form with valid porperties  */
const fullFormOptions: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        OptHandler.input(optsInput1)
        , OptHandler.input(optsInput2)
        , OptHandler.input(optsInput3)
    ],
    answerTimes: true
    , status: true
};
const formForAnswer: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        Input1
        , Input2
        , Input3
    ],
    answerTimes: true
    , status: true
};
/** Valid form created used fullFormOptions */
const tmpForm: Form = new Form(OptHandler.form(fullFormOptions));

/** Form missing date property */
const formHasNoDate: any = {
    id: 1
    , form: tmpForm
    , inputsAnswerOptions: inputAnswerOptionsDictOptHandler
};
/** Form with invalid date property */
const formHasNoDateType: any = {
    id: 1
    , form: tmpForm
    , timestamp: "data"
    , inputsAnswerOptions: inputAnswerOptionsDictOptHandler
};
/** Form missing answers dictionary */
const formHasNoDict: any = {
    id: 1
    , form: tmpForm
    , timestamp: date
};
/** Form with input missing it's id */
const formMissingInputOptIdInput: FormAnswerOptions = {
    id: 1
    , form: tmpForm
    , timestamp: date
    , inputsAnswerOptions: dictMissingIdInput
};
/** Form with input missing it's placement */
const formMissingInputOptPlacement: FormAnswerOptions = {
    id: 1
    , form: tmpForm
    , timestamp: date
    , inputsAnswerOptions: dictMissingPlacement
};
/** Form with input missing it's value property */
const formMissingInputOptValue: FormAnswerOptions = {
    id: 1
    , form: tmpForm
    , timestamp: date
    , inputsAnswerOptions: dictMissingValue
};
/** Correct form  */
const validForm: any = {
    id: 1
    , form: tmpForm
    , timestamp: date
    , inputsAnswerOptions: inputAnswerOptionsDictOptHandler
};
/** Valid inputUpdate object, remove type */
const updateObj1: InputUpdateOptions = {
    id: 1
    , input: optsInput1
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** Valid inputUpdate object, remove type */
const updateObj2: InputUpdateOptions = {
    id: 2
    , input: optsInput2
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** Valid inputUpdate object, remove type */
const updateObj3: InputUpdateOptions = {
    id: 3
    , input: optsInput3
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** Valid formUpdate object, remove type */
const validFormUpdateObj: any = {
    id: 1
    , form: fullFormOptions
    , updateDate: date
    , inputUpdates: [
        updateObj1
        , updateObj2
        , updateObj3
    ],
    answerTimes: true
    , status: true
};
/** FormUpdate with non-array inputUpdates */
const formUpdateNotArrayInputUpdates: any = {
    id: 1
    , form: fullFormOptions
    , updateDate: date
    , inputUpdates: updateObj1
};
/** FormUpdate object missing the form to update */
const formUpdateMissingForm: any = {
    id: 1
    , updateDate: date
    , inputUpdates: [
        updateObj1
        , updateObj2
        , updateObj3
    ],
    answerTimes: true
    , status: true
};
/** FormUpdate missing the inputs to update */
const formUpdateMissinginputUpdate: any = {
    id: 1
    , form: fullFormOptions
    , updateDate: date
};
/** InputUpdate with undefined input property and null value */
const inputUpdateUndefinedInput: any = {
    id: 1
    , input: undefined
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdate missing the inputOperation */
const inputUpdateMissingInputOperation: any = {
    id: 1
    , input: inputOpts4
    , value: "Remove question 3 from form 1"
};
/** InputUpdate missing value */
const inputUpdateMissingValue: any = {
    id: 1
    , input: inputOpts4
    , inputOperation: UpdateType.REMOVE
};

/** Valid SubForm. */
const subFormOpts1: SubFormOptions = {
    id: 1
    , inputId: null
    , contentFormId: 2
};
/** Input with SUBFORM type with a valid SubForm. */
const inputWithValidSubForm: any = {
    placement: 1
    , description: "Description"
    , question: "Question"
    , type: InputType.SUBFORM
    , validation: []
    , sugestions: []
    , subForm: subFormOpts1
};
/** Input with SUBFORM type without a SubForm. */
const inputWithoutSubForm: any = {
    placement: 1
    , description: "Description"
    , question: "Question"
    , type: InputType.SUBFORM
    , validation: []
    , sugestions: []
    , subForm: null
};

/**
 * SubForms
 */
/** A invalid SubForm object missing contentFormId property. */
const malformedSubForm1: any = {
    id: 1
    , inputId: 30
};
/** A invalid SubForm object missing contentFormId property. */
const malformedSubForm2: any = {
    id: 1
    , contentFormId: 190
};
/** A valid SubForm object. */
const subFormObj1: SubFormOptions = {
    id: 1
    , inputId: 30
    , contentFormId: 1
};
/** A valid SubForm object. */
const subFormObj2: SubFormOptions = {
    id: 2
    , inputId: 32
    , contentFormId: 6
};
/** A valid SubForm object. */
const subFormObj3: SubFormOptions = {
    id: 3
    , inputId: 32
    , contentFormId: 20
};
/** A valid SubForm object. */
const subFormObj4: SubFormOptions = {
    id: 3
    , inputId: 33
    , contentFormId: 2
};
/** A valid SubForm object. */
const subFormObj5: SubFormOptions = {
    id: 3
    , inputId: 35
    , contentFormId: 9
};
/** A valid SubForm object. */
const subFormObj6: SubFormOptions = {
    id: 3
    , inputId: 36
    , contentFormId: 8
};
/** A valid SubForm object. */
const subFormObj7: SubFormOptions = {
    id: 4
    , inputId: 38
    , contentFormId: 11
};

/** Input with SUBFORM type with a malformed SubForm. */
const inputWithMalformedSubForm1: any = {
    placement: 1
    , description: "Description"
    , question: "Question"
    , type: InputType.SUBFORM
    , validation: []
    , sugestions: []
    , subForm: malformedSubForm1
};

/** Input with SUBFORM type with a malformed SubForm. */
const inputWithMalformedSubForm2: any = {
    placement: 2
    , description: "Description"
    , question: "Question"
    , type: InputType.SUBFORM
    , validation: []
    , sugestions: []
    , subForm: malformedSubForm2
};

/** A input with SUBFORM type with a valid SubForm. */
const inputOptWithValidSubForm1: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 8"
    , question: "Question 1 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , validation: []
    , sugestions: []
    , id: 30
    , subForm: subFormObj1
};
/** A input with SUBFORM type with a valid SubForm. */
const inputOptWithValidSubForm2: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 8"
    , question: "Question 1 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 32
    , subForm: subFormObj2
};
/** A input with SUBFORM type with a valid SubForm. */
const inputOptWithValidSubForm3: InputOptions = {
    placement: 1
    , description: "Description Question 1 Form 8"
    , question: "Question 1 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 32
    , subForm: subFormObj2
};
/** A input with SUBFORM type with a valid SubForm. */
const inputOptWithValidSubForm4: InputOptions = {
    placement: 2
    , description: "Description Question 3 Form 8"
    , question: "Question 3 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 35
    , subForm: subFormObj6
};
/** A input with SUBFORM type with a valid SubForm. */
const inputOptWithValidSubForm5: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 11"
    , question: "Question 1 Form 11"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 36
    , subForm: subFormObj6
};
/** A input with SUBFORM type with a valid SubForm. */
const inputOptWithValidSubForm6: InputOptions = {
    placement: 2
    , description: "Description Question 3 Form 8"
    , question: "Question 3 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 38
    , subForm: subFormObj7
};
/** A simple input for the form with id 8. */
const inputOpt1ForForm8: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 8"
    , question: "Question 2 Form 8"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , sugestions: []
    , id: 31
    , subForm: null
};
/** A simple input for the form with id 8. */
const inputOpt2ForForm8: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 8"
    , question: "Question 2 Form 8"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: []
    , id: 33
    , subForm: null
};
/** A simple input for the form with id 8. */
const inputOpt3ForForm8: InputOptions = {
    placement: 0
    , description: "Description Question 2 Form 8"
    , question: "Question 2 Form 8"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: []
    , id: 33
    , subForm: null
};
/** A simple input for the form with id 9. */
const inputOpt1ForForm9: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 9"
    , question: "Question 2 Form 9"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: []
    , id: 35
};
/** A simple input for the form with id 11. */
const inputOpt1ForForm11: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 11"
    , question: "Question 2 Form 11"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: []
    , id: 37
};
/** A input with a invalid SubForm */
const inputOptWithInvalidSubForm1: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 9"
    , question: "Question 1 Form 9"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 36
    , subForm: subFormObj3
};
/** A simple input for the form with id 8. */
const inputOptWithInvalidSubForm2: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 9"
    , question: "Question 1 Form 9"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 38
    , subForm: subFormObj5
};
/** A input with a invalid SubForm */
const inputOptWithInvalidSubForm3: InputOptions = {
    placement: 2
    , description: "Description Question 4 Form 8"
    , question: "Question 4 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 36
    , subForm: subFormObj6
};
/** A input with a invalid SubForm */
const inputOptWithInvalidSubForm4: InputOptions = {
    placement: 2
    , description: "Description Question 4 Form 8"
    , question: "Question 4 Form 8"
    , enabled: true
    , type: InputType.SUBFORM
    , sugestions: []
    , validation: []
    , id: 36
    , subForm: subFormObj7
};

/** A form with a valid SubForm */
const formWithValidSubForm1: FormOptions = {
    id: 8
    , title: "Form Title 8"
    , description: "Form Description 8"
    , inputs: [
        new Input(inputOptWithValidSubForm1)
        , new Input(inputOpt1ForForm8)
    ],
    answerTimes: true
    , status: true
};
/** A form with a valid SubForm */
const formWithValidSubForm2: FormOptions = {
    id: 11
    , title: "Form Title 11"
    , description: "Form Description 11"
    , inputs: [
        new Input(inputOptWithValidSubForm5)
        , new Input(inputOpt1ForForm11)
    ],
    answerTimes: true
    , status: true
};
/** A form with a invalid SubForm */
const formWithInvalidSubForm1: FormOptions = {
    id: 9
    , title: "Form Title 9"
    , description: "Form Description 9"
    , inputs: [
        inputOptWithInvalidSubForm1
        , inputOpt1ForForm9
    ],
    answerTimes: true
    , status: true
};

/** A form with a invalid SubForm */
const formWithInvalidSubForm2: FormOptions = {
    id: 9
    , title: "Form Title 9"
    , description: "Form Description 9"
    , inputs: [
        inputOptWithInvalidSubForm2
        , inputOpt1ForForm9
    ],
    answerTimes: true
    , status: true
};

/** A updated version of form 8 */
const updatedFormWithValidSubForm1: FormOptions = {
    id: 8
    , title: "Form Title 8"
    , description: "Form Description 8"
    , inputs: [
        inputOptWithValidSubForm2
        , inputOpt2ForForm8
    ],
    answerTimes: true
    , status: true
};
/** A updated version of form 8 */
const updatedFormWithValidSubForm2: FormOptions = {
    id: 8
    , title: "Form Title 8"
    , description: "Form Description 8"
    , inputs: [
        inputOpt3ForForm8
        , inputOptWithValidSubForm3
    ],
    answerTimes: true
    , status: true
};

/** A invalid updated version of form 8 */
const updatedFormWithInvalidSubForm1: FormOptions = {
    id: 8
    , title: "Form Title 8"
    , description: "Form Description 8"
    , inputs: [
        inputOpt3ForForm8
        , inputOptWithValidSubForm3
        , inputOptWithInvalidSubForm4
    ],
    answerTimes: true
    , status: true
};

/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm1: InputUpdateOptions = {
    id: 25
    , input: inputOptWithValidSubForm1
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm2: InputUpdateOptions = {
    id: 26
    , input: inputOpt1ForForm8
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm3: InputUpdateOptions = {
    id: 27
    , input: inputOptWithValidSubForm2
    , inputOperation: UpdateType.ADD
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm4: InputUpdateOptions = {
    id: 28
    , input: inputOpt2ForForm8
    , inputOperation: UpdateType.ADD
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm5: InputUpdateOptions = {
    id: 29
    , input: inputOptWithValidSubForm3
    , inputOperation: UpdateType.SWAP
    , value: "0"
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm6: InputUpdateOptions = {
    id: 30
    , input: inputOpt3ForForm8
    , inputOperation: UpdateType.SWAP
    , value: "1"
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm7: InputUpdateOptions = {
    input: inputOptWithValidSubForm1
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm8: InputUpdateOptions = {
    input: inputOptWithValidSubForm4
    , inputOperation: UpdateType.ADD
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm9: InputUpdateOptions = {
    input: inputOptWithInvalidSubForm3
    , inputOperation: UpdateType.ADD
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm10: InputUpdateOptions = {
    input: inputOptWithValidSubForm3
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions with subForms */
const updateOptForFormWithSubForm11: InputUpdateOptions = {
    input: inputOptWithInvalidSubForm4
    , inputOperation: UpdateType.ADD
    , value: null
};

/** FormUpdateOptions with subForms */
const formUpdateWithSubForm: FormUpdateOptions = {
    id: 11
    , form: updatedFormWithValidSubForm2
    , updateDate: new Date("1999-04-22 11:32:56")
    , changed: false
    , inputUpdates: [
        updateOptForFormWithSubForm1
        , updateOptForFormWithSubForm2
        , updateOptForFormWithSubForm3
        , updateOptForFormWithSubForm4
    ]
};
/** FormUpdateOptions with subForms */
const formUpdateWithSubForm1: FormUpdateOptions = {
    id: 12
    , form: updatedFormWithValidSubForm1
    , updateDate: new Date("1999-04-22 11:32:56")
    , changed: false
    , inputUpdates: [
        updateOptForFormWithSubForm5
        , updateOptForFormWithSubForm6
    ]
};
/** FormUpdateOptions with subForms */
const formUpdateWithSubForm2: FormUpdateOptions = {
    id: 13
    , form: updatedFormWithValidSubForm1
    , updateDate: new Date("1999-04-22 11:32:56")
    , changed: false
    , inputUpdates: [
        updateOptForFormWithSubForm7
        , updateOptForFormWithSubForm8
    ]
};
/** FormUpdateOptions with subForms */
const formUpdateWithSubForm3: FormUpdateOptions = {
    id: 14
    , form: updatedFormWithValidSubForm1
    , updateDate: new Date("1999-04-22 11:32:56")
    , changed: false
    , inputUpdates: [
        updateOptForFormWithSubForm9
        , updateOptForFormWithSubForm10
    ]
};
/** FormUpdateOptions with subForms */
const formUpdateWithSubForm4: FormUpdateOptions = {
    id: 15
    , form: updatedFormWithInvalidSubForm1
    , updateDate: new Date("1999-04-22 11:32:56")
    , changed: false
    , inputUpdates: [
        updateOptForFormWithSubForm11
    ]
};
/** ============================================= */

/** dbHandler testing Scenario */

const dateDBH: Date = new Date("2019-02-21 12:10:25");

/** QueryString obj to be used on a query to insert a form obj */
const queryStringInsertFormid5: string = "INSERT INTO form(id, title, description)\
        VALUES (5, 'Form Title 5', 'Form Description 5');";
/** Query obj to be used to insert a form Obj */
const queryToInsertFormid5: QueryOptions = { query: queryStringInsertFormid5, parameters: [] };
/** QueryString obj to be used on a query to insert another form Obj */
const queryStringInsertFormid6: string = "INSERT INTO form(id, title, description)\
VALUES (6, 'Form Title 6', 'Form Description 6');";
/** Query obj to be used to insert another form Obj */
const queryToInsertFormid6: QueryOptions = { query: queryStringInsertFormid6, parameters: [] };
/** QueryString obj to be used on a query to select all inserted form Objs */
const queryStringSelectAllForms: string = "SELECT * FROM form;";
/** Query obj to be used to select all inserted form Obj */
const queryToSelectAllForms: QueryOptions = { query: queryStringSelectAllForms, parameters: [] };
/** QueryString obj to be used on a query to delete a form Obj */
const queryStringDeleteFormid6: string = "DELETE FROM form WHERE id=6;";
/** Query obj to be used to delete a form Obj */
const queryToDeleteFormid6: QueryOptions = { query: queryStringDeleteFormid6, parameters: [] };
/** QueryString obj to be used on a query to delete a form Obj */
const queryStringDeleteFormid5: string = "DELETE FROM form WHERE id=5;";
/** Query obj to be used to delete a form Obj */
const queryToDeleteFormid5: QueryOptions = { query: queryStringDeleteFormid5, parameters: [] };
/** QueryString obj to be used on a query to insert 2 Input Obj */
const queryStringInsertTwoInputs: string = "INSERT INTO input(id_form, placement, input_type, enabled, question, description)\
        VALUES\
        (2, 3,'TEXT', TRUE, 'Question 3 Form 2', 'Description Question 3 Form 2'),\
        (2, 4,'TEXT', TRUE, 'Question 4 Form 2', 'Description Question 4 Form 2');";
/** Query obj to be used to insert 2 input Obj */
const queryToInsertTwoInputs: QueryOptions = { query: queryStringInsertTwoInputs, parameters: [] };
/** QueryString obj to be used on a query to select all inserted Input Obj */
const queryStringSelectAllInputs: string = "SELECT * FROM input;";
/** Query obj to be used to select all inserted input Obj */
const queryToSelectAllInputs: QueryOptions = { query: queryStringSelectAllInputs, parameters: [] };
/** QueryString obj to be used on a query to try to delete a non-existent input */
const queryStringDeleteNonExistentInput: string = "DELETE FROM input WHERE id=20;";
/** Query obj to be used to try to delete a non-existent  input Obj */
const queryToDeleteNonExistentInput: QueryOptions = { query: queryStringDeleteNonExistentInput, parameters: [] };

/** QueryString obj to be used on a query to remove both previously inserted Input Obj */
const queryStringRemoveBothInputs: string = "DELETE FROM input WHERE id=9 OR id=14 OR id=15;";
/** Query obj to be used to remove the previosly inserted input Obj */
const queryToRemoveBothInputs: QueryOptions = { query: queryStringRemoveBothInputs, parameters: [] };
/** QueryString obj to be used on a query to insert 2 InputValidation Obj */
const queryStringInsertTwoInputVal: string = "INSERT INTO input_validation(id_input, validation_type)\
        VALUES\
        (2, 'MAXCHAR'),\
        (5, 'MANDATORY');";

/** Query obj to be used to insert 2 input Value Obj */
const queryToInsertTwoInputVal: QueryOptions = { query: queryStringInsertTwoInputVal, parameters: [] };
/** QueryString obj to be used on a query to select all inserted InputValidation Obj */
const queryStringSelectAllInputVal: string = "SELECT * FROM input_validation;";
/** Query obj to be used to select all inserted input Value Obj */
const queryToSelectAllInputVal: QueryOptions = { query: queryStringSelectAllInputVal, parameters: [] };
/** QueryString obj to be used on a query to try delete a non-existent InputValidation Obj */
const queryStringRemoveNEInputVal: string = "DELETE FROM input_validation WHERE id=21;";
/** Query obj to be used to try to delete a non-existent input Value Obj */
const queryToRemoveNEInputVal: QueryOptions = { query: queryStringRemoveNEInputVal, parameters: [] };
/** QueryString obj to be used on a query to remove both previously inserted InputValidation Obj */
const queryStringRemoveInputVal: string = "DELETE FROM input_validation WHERE id=9 OR id=10 OR id=13 OR id=14 OR id=17;";
/** Query obj to be used to try to delete the previously inserted input Value Obj */
const queryToRemoveInputVal: QueryOptions = { query: queryStringRemoveInputVal, parameters: [] };
/** QueryString obj to be used on a query to insert a InputValidationArguments Obj */
const queryStringInsertInputValArgs: string = "INSERT INTO input_validation_argument(id_input_validation, placement, argument)\
VALUES\
(1, 2, '10'),\
(2, 2, '2');";
/** Query obj to be used to insert input Value Arguments Obj */
const queryToInsertInputValArgs: QueryOptions = { query: queryStringInsertInputValArgs, parameters: [] };
/** QueryString obj to be used on a query to select all inserted InputValidationArguments Obj */
const queryStringSelectAllInputValArgs: string = "SELECT * FROM input_validation_argument;";
/** Query obj to be used to all inserted input Value Arguments Obj */
const queryToSelectAllInputValArgs: QueryOptions = { query: queryStringSelectAllInputValArgs, parameters: [] };
/** QueryString obj to be used on a query to try to delete a non-existent InputValidationArguments Obj */
const queryStringRemoveNEtInputValArgs: string = "DELETE FROM input_validation_argument WHERE id=15;";
/** Query obj to be used to try to remove a non-existent input Value Arguments Obj */
const queryToRemoveNEInputValArgs: QueryOptions = { query: queryStringRemoveNEtInputValArgs, parameters: [] };
/** QueryString obj to be used on a query to delete the previously inserted InputValidationArguments Obj */
const queryStringRemoveInputValArgs: string = "DELETE FROM input_validation_argument WHERE id=6;";
/** Query obj to be used to remove previosly inserted input Value Arguments Obj */
const queryToRemoveInputValArgs: QueryOptions = { query: queryStringRemoveInputValArgs, parameters: [] };
/** QueryString obj to be used on a query to insert 2 formAnswers Obj */
const queryStringInsertFormAnswers: string = "INSERT INTO form_answer(id ,id_form, answered_at)\
        VALUES\
        (8, 2, '2018-07-02 10:10:25-03'),\
        (9, 3, '2018-06-03 10:11:25-03');";
/** Query obj to be used to insert formAnswers Obj */
const queryToInsertFormAnswers: QueryOptions = { query: queryStringInsertFormAnswers, parameters: [] };
/** QueryString obj to be used on a query to select all inserted formAnswers Obj */
const queryStringSelectAllFormAnswers: string = "SELECT * FROM form_answer;";
/** Query obj to be used to select all formAnswers Obj */
const queryToSelectAllFormAnswers: QueryOptions = { query: queryStringSelectAllFormAnswers, parameters: [] };

/** QueryString obj to be used on a query to try to delete a non-existent formAnswers Obj */
const queryStringRemoveNEFormAnswers: string = "DELETE FROM form_answer WHERE id=11;";
/** Query obj to be used to try to remove a non-existent formAnswers Obj */
const queryToRemoveNEFormAnswers: QueryOptions = { query: queryStringRemoveNEFormAnswers, parameters: [] };
/** QueryString obj to be used on a query to delete both previously inserted formAnswers Obj */
const queryStringRemoveFormAnswers: string = "DELETE FROM form_answer WHERE id=8 OR id=9;";
/** Query obj to be used to remove the previously inserted formAnswers Obj */
const queryToRemoveFormAnswers: QueryOptions = { query: queryStringRemoveFormAnswers, parameters: [] };
/** QueryString obj to be used on a query to insert 2 inputAnswers Obj */
const queryStringInsertInputAnswers: string = "INSERT INTO input_answer(id, id_form_answer, id_input, value, placement)\
        VALUES\
        (18,1, 6,'Answer to Question 1 Form 3',1),\
        (19,1, 7,'Answer to Question 2 Form 3',2);";
/** Query obj to be used to insert inputAnswers Obj */
const queryToInsertInputAnswers: QueryOptions = { query: queryStringInsertInputAnswers, parameters: [] };
/** QueryString obj to be used on a query to select all inserted inputAnswers Obj */
const queryStringSelectInputAnswers: string = "SELECT * FROM input_answer;";
/** Query obj to be used to select all inputAnswers Obj */
const queryToSelectInputAnswers: QueryOptions = { query: queryStringSelectInputAnswers, parameters: [] };
/** QueryString obj to be used on a query to try to delete a non-existent inputAnswers Obj */
const queryStringRemoveNEInputAnswers: string = "DELETE FROM input_answer WHERE id=25;";
/** Query obj to be used to try to remove a non-existent inputAnswers Obj */
const queryToRemoveNEInputAnswers: QueryOptions = { query: queryStringRemoveNEInputAnswers, parameters: [] };
/** QueryString obj to be used on a query to delete both previously inserted inputAnswers Obj */
const queryStringRemoveInputAnswers: string = "DELETE FROM input_answer WHERE id=18 OR id=19;";
/** Query obj to be used to remove the previously inserted inputAnswers Obj */
const queryToRemoveInputAnswers: QueryOptions = { query: queryStringRemoveInputAnswers, parameters: [] };
/** QueryString to be used on a query to delete form */
const queryStringRemoveForm3: string = "UPDATE form SET status='false' WHERE id=3;";
/** Query obj to be used to delete form */
const queryToRemoveForm3: QueryOptions = { query: queryStringRemoveForm3, parameters: [] };

/** 2nd describe */
/** Input Options object to be used on a formOptions */
const inputOptsDBH1: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , validation: []
    , sugestions: []
    , id: 1
};
/** Input Options object to be used on a formOptions */
const inputOptsDBH2: InputOptions = {
    placement: 1
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , sugestions: []
    , id: 2
};
/** Input Options object to be used on a formOptions */
const inputOptsDBH3: InputOptions = {
    placement: 2
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , sugestions: []
    , id: 3
};
/** Input Options object to be used on a formOptions */
const inputOptsDBH4: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MANDATORY, arguments: [] }
    ]
};
/** Input Options object to be used on a formOptions */
const inputOptsDBH5: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 2"
    , question: "Question 2 Form 2"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MINCHAR, arguments: ["5"] }
    ]
};
/** InputOptions object to be used as a base to updates */
const inputObjToUpdateDBH1: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , type: InputType.TEXT
    , validation: []
    , id: 1
};
/** InputUpdateOptions object to do an remotion update */
const updateObjDBH1REMOVE: InputUpdateOptions = {
    id: 1
    , input: inputObjToUpdateDBH1
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions object to do an reenable update */
const updateObjDBH1REENABLE: InputUpdateOptions = {
    id: 1
    , input: inputObjToUpdateDBH1
    , inputOperation: UpdateType.REENABLED
    , value: null
};
/** InputUpdateOptions object to do an remotion update */
const updateObjDBH2REMOVE: InputUpdateOptions = {
    id: 2
    , input: optsInput2
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions object to do an reenable update */
const updateObjDBH2REENABLE: InputUpdateOptions = {
    id: 2
    , input: optsInput2
    , inputOperation: UpdateType.REENABLED
    , value: null
};
/** InputOptions object to be used as a base to updates */
const inputObjToUpdateDBH3: InputOptions = {
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: 2
};
/** InputUpdateOptions object to do an remotion update */
const updateObjDBH3REMOVE: InputUpdateOptions = {
    id: 3
    , input: inputObjToUpdateDBH3
    , inputOperation: UpdateType.REMOVE
    , value: null
};
/** InputUpdateOptions object to do an reenable update */
const updateObjDBH3REENABLE: InputUpdateOptions = {
    id: 3
    , input: inputObjToUpdateDBH3
    , inputOperation: UpdateType.REENABLED
    , value: null
};
/** FormOptions object to be used on formupdateOptions */
const formObjToUpdateDBH: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        inputObjToUpdateDBH1
        , optsInput2
        , inputObjToUpdateDBH3
    ],
    answerTimes: true
    , status: true
};
/** FormOptions object to be used on formupdateOptions */
const formObjToDeleteForm: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        inputObjToUpdateDBH1
        , optsInput2
        , inputObjToUpdateDBH3
    ],
    answerTimes: true
    , status: true
};
/** FormUpdateOptions to Upadte the form and insert a formupdate */
const formUpdateOptsObjDBH1: FormUpdateOptions = {
    id: 1
    , form: formObjToUpdateDBH
    , updateDate: new Date()
    , changed: true
    , inputUpdates: [
        updateObjDBH1REMOVE
        , updateObjDBH2REMOVE
        , updateObjDBH3REMOVE
    ]
};
/** FormUpdateOptions to Upadte the form with a remotion and insert a formupdate */
const formUpdateOptsObjDBH2: FormUpdateOptions = {
    id: 1
    , form: formObjToUpdateDBH
    , updateDate: new Date()
    , changed: false
    , inputUpdates: [
        updateObjDBH1REMOVE
        , updateObjDBH2REMOVE
        , updateObjDBH3REMOVE
    ]
};
/** FormUpdateOptions to Upadte the form with a reenable operation and insert a formupdate */
const formUpdateOptsObjDBH3: FormUpdateOptions = {
    id: 1
    , form: formObjToUpdateDBH
    , updateDate: new Date()
    , changed: false
    , inputUpdates: [
        updateObjDBH1REENABLE
        , updateObjDBH2REENABLE
        , updateObjDBH3REENABLE
    ]
};
/** FormUpdateOptions to Upadte the form and change status to false (delete form) */
const formUpdateOptsObjDBH4: FormUpdateOptions = {
    id: 1
    , form: formObjToDeleteForm
    , updateDate: new Date()
    , changed: true
    , inputUpdates: []
};
/** Form options that will have to be read */
const formOptsObjDBH: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        OptHandler.input(inputOptsDBH1)
        , OptHandler.input(inputOptsDBH2)
        , OptHandler.input(inputOptsDBH3)
    ],
    answerTimes: true
    , status: true
};
/** Form options that will have to be write */
const formOptsObjDBH2: FormOptions = {
    title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        OptHandler.input(inputOptsDBH4)
        , OptHandler.input(inputOptsDBH5)
    ],
    answerTimes: true
    , status: true
};
/** InputAnswerOptions to be used on the first dictionary */
const inputAnswersOptDBH1: InputAnswerOptions = {
    id: 5
    , idInput: 1
    , placement: 0
    , value: "Answer to Question 1 Form 1"
};
/** InputAnswerOptions to be used on the first dictionary */
const inputAnswersOptDBH2: InputAnswerOptions = {
    id: 6
    , idInput: 2
    , placement: 0
    , value: "Answer to Question 2 Form 1"
};
/** InputAnswerOptions to be used on the first dictionary */
const inputAnswersOptDBH3: InputAnswerOptions = {
    id: 7
    , idInput: 3
    , placement: 0
    , value: "Answer to Question 3 Form 1"
};
/** InputAnswerOptions to be used on the second dictionary */
const inputAnswersOptDBH4: InputAnswerOptions = {
    id: undefined
    , idInput: 18
    , placement: 0
    , value: "true"
};
/** InputAnswerOptions to be used on the second dictionary */
const inputAnswersOptDBH5: InputAnswerOptions = {
    id: undefined
    , idInput: 18
    , placement: 1
    , value: "true"
};
/** InputAnswerOptions to be used on the second dictionary */
const inputAnswersOptDBH6: InputAnswerOptions = {
    id: undefined
    , idInput: 18
    , placement: 2
    , value: "false"
};
/** InputAnswerOptions to be used on the second dictionary */
const inputAnswersOptDBH7: InputAnswerOptions = {
    id: undefined
    , idInput: 19
    , placement: 1
    , value: "true"
};
/** InputAnswerOptions to be used on the second dictionary */
const inputAnswersOptDBH8: InputAnswerOptions = {
    id: undefined
    , idInput: 20
    , placement: 1
    , value: "true"
};
/** InputAnswers to be read and written */
const inputAnswerOptionsDictDBH1: InputAnswerOptionsDict = {
    1: [inputAnswersOptDBH1]
    , 2: [inputAnswersOptDBH2]
    , 3: [inputAnswersOptDBH3]
};
/** InputAnswers to be inserted, they have checkbox validation */
const inputAnswerOptionsDictdbh2: InputAnswerOptionsDict = {
    18: [
        inputAnswersOptDBH4
        , inputAnswersOptDBH5
        , inputAnswersOptDBH6
    ]
    , 19: [inputAnswersOptDBH7]
    , 20: [inputAnswersOptDBH8]
    , 21: []
};
/** Input used on a form that will be updated */
const inputDBH1: Input = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: 1
    , sugestions: []
    , subForm: null
};
/** Input with sugestions used on a form */
const inputDBH2: Input = {
    placement: 0
    , description: "Description Question 1 Form 6"
    , question: "Question 1 Form 6"
    , enabled: true
    , type: InputType.CHECKBOX
    , sugestions: [
        { value: "Sugestion 1", placement: 0 }
        , { value: "Sugestion 2", placement: 1 }
        , { value: "Sugestion 3", placement: 2 }
    ]
    , validation: [
        { type: ValidationType.SOMECHECKBOX, arguments: [] }
    ]
    , id: 18
    , subForm: null
};
/** Input with sugestions used on a form */
const inputDBH3: Input = {
    placement: 1
    , description: "Description Question 2 Form 6"
    , question: "Question 2 Form 6"
    , enabled: true
    , type: InputType.RADIO
    , sugestions: [
        { value: "Sugestion 4", placement: 0 }
        , { value: "Sugestion 5", placement: 1 }
        , { value: "Sugestion 6", placement: 2 }
    ]
    , subForm: null
    , validation: []
    , id: 19
};
/** Input with sugestions used on a form */
const inputDBH4: Input = {
    placement: 2
    , description: "Description Question 3 Form 6"
    , question: "Question 3 Form 6"
    , enabled: true
    , type: InputType.SELECT
    , sugestions: [
        { value: "Sugestion 1", placement: 0 }
        , { value: "Sugestion 2", placement: 1 }
    ]
    , subForm: null
    , validation: [
        { type: ValidationType.DEPENDENCY, arguments: ["19", "1"] }
        , { type: ValidationType.DEPENDENCY, arguments: ["20", "1"] }
    ]
    , id: 20
};
/** Input with sugestions used on a form */
const inputDBH5: Input = {
    placement: 3
    , description: "Description Question 4 Form 6"
    , question: "Question 4 Form 6"
    , enabled: true
    , type: InputType.CHECKBOX
    , subForm: null
    , sugestions: [
        { value: "Sugestion n", placement: 0 }
        , { value: "Sugestion n+1", placement: 1 }
        , { value: "Sugestion n+2", placement: 2 }
        , { value: "Sugestion n+3", placement: 4 }
    ]
    , validation: [
        { type: ValidationType.SOMECHECKBOX, arguments: [] }
    ]
    , id: 21
};
/** Input used on a form */
const inputDBH6: Input = {
    placement: 4
    , subForm: null
    , description: "Description Question 5 Form 6"
    , question: "Question 5 Form 6"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.DEPENDENCY, arguments: ["18", "2"] }
    ]
    , id: 22
};
/** Input with 'typeof' validations used on a form */
const inputDBH7: Input = {
    placement: 0
    , subForm: null
    , description: "Description Question 1 Form 7"
    , question: "Question 1 form 7"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["int"] }
        , { type: ValidationType.MAXANSWERS, arguments: ["2"] }
    ]
    , id: 23
};
/** Input with 'typeof' validations used on a form */
const inputDBH8: Input = {
    placement: 1
    , subForm: null
    , description: "Description Question 2 Form 7"
    , question: "Question 2 form 7"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["int"] }
        , { type: ValidationType.MAXANSWERS, arguments: ["1"] }
    ]
    , id: 24
};
/** Input with 'typeof' validations used on a form */
const inputDBH9: Input = {
    placement: 2
    , subForm: null
    , description: "Description Question 3 Form 7"
    , question: "Question 3 form 7"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["float"] }
    ]
    , id: 25
};
/** Input with 'typeof' validations used on a form */
const inputDBH10: Input = {
    placement: 3
    , subForm: null
    , description: "Description Question 4 Form 7"
    , question: "Question 4 form 7"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["float"] }
    ]
    , id: 26
};
/** Input with 'typeof' validations used on a form */
const inputDBH11: Input = {
    placement: 4
    , subForm: null
    , description: "Description Question 1 Form 8"
    , question: "Question 1 form 8"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["date"] }
        , { type: ValidationType.MAXANSWERS, arguments: ["2"] }
    ]
    , id: 27
};
/** Input with 'typeof' validations used on a form */
const inputDBH12: Input = {
    placement: 5
    , subForm: null
    , description: "Description Question 2 Form 8"
    , question: "Question 2 form 8"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["date"] }
    ]
    , id: 28
};
/** Input with 'typeof' validations used on a form */
const inputDBH13: Input = {
    placement: 6
    , subForm: null
    , description: "Description Question 3 Form 8"
    , question: "Question 3 form 8"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.TYPEOF, arguments: ["invalid"] }
        , { type: ValidationType.MAXANSWERS, arguments: ["invalid"] }
        , { type: ValidationType.DEPENDENCY, arguments: ["28", "invalid"] }
    ]
    , id: 29
};
/** Form used on a formUpdate */
const formObjDBH1: Form = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [inputDBH1]
    , answerTimes: false
    , status: true
};
/** Form, with sugestions on the inputs, that will be inserted */
const formObjDBH2: Form = {
    title: "Form Title 6"
    , description: "Form Description 6"
    , inputs: [
        inputDBH2
        , inputDBH3
        , inputDBH4
        , inputDBH5
        , inputDBH6
    ],
    answerTimes: true
    , id: 6
    , status: true
};
/** Form with inputs having 'typeof' on the validation property */
const formObjdbh3: Form = {
    title: "Form Title 7"
    , description: "Form Description 7"
    , inputs: [
        inputDBH7
        , inputDBH8
        , inputDBH9
        , inputDBH10
        , inputDBH11
        , inputDBH12
        , inputDBH13
    ],
    answerTimes: true
    , id: 7
    , status: true
};
/** InputUpdate uesd on a invalid formUpdate */
const inputUpdateObjDBH: InputUpdate = {
    input: inputDBH1
    , inputOperation: 10
    , value: "Invalid Operation"
};
/** Invalid formUpdate, operation not recognized  */
const formUpdateObjDBH1: FormUpdate = {
    form: formObjDBH1
    , updateDate: new Date()
    , inputUpdates: [inputUpdateObjDBH]
};
/** User to be inserted */
const defaultUser: User = new User({
    id: 2
    , name: "User 2"
    , email: "test2@test.com"
    , hash: "hashTest2"
    , enabled: true
});
/** User to be inserted with false enable */
const falseEnabledUser: User = new User({
    id: 3
    , name: "User 3"
    , email: "test3@test.com"
    , hash: "hashTest3"
    , enabled: false
});
/** User to be inserted with null enable */
const nullEnabledUser: User = new User({
    id: 4
    , name: "User 4"
    , email: "test4@test.com"
    , hash: "hashTest4"
});
/** User to be inserted null ID */
const nullIdUser: User = new User({
    name: "User 5"
    , email: "test5@test.com"
    , hash: "hashTest5"
    , enabled: true
});
/** User to be updated */
const userToUpdate: User = new User({
    id: 2
    , name: "User updated"
    , email: "testUpdate@test.com"
    , hash: "hashTest2"
    , enabled: true
});
/** User to update another user's enabled (?) */
const userToUpdate2: User = new User({
    id: 3
    , name: "User 3"
    , email: "test3@test.com"
    , hash: "hashTest3"
    , enabled: true
});

/** Input used on a form that will be updated */
const input1Form6: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 1"
    , question: "Question 1 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: []
    , id: 1
    , sugestions: []
    , subForm: null
};
/** Input with sugestions used on a form */
const input2Form6: InputOptions = {
    placement: 0
    , description: "Description Question 1 Form 6"
    , question: "Question 1 Form 6"
    , enabled: true
    , type: InputType.CHECKBOX
    , sugestions: [
        { value: "Sugestion 1", placement: 0 }
        , { value: "Sugestion 2", placement: 1 }
        , { value: "Sugestion 3", placement: 2 }
    ]
    , validation: [
        { type: ValidationType.SOMECHECKBOX, arguments: [] }
    ]
    , id: 18
    , subForm: null
};
/** Input with sugestions used on a form */
const input3Form6: InputOptions = {
    placement: 1
    , description: "Description Question 2 Form 6"
    , question: "Question 2 Form 6"
    , enabled: true
    , type: InputType.RADIO
    , sugestions: [
        { value: "Sugestion 4", placement: 0 }
        , { value: "Sugestion 5", placement: 1 }
        , { value: "Sugestion 6", placement: 2 }
    ]
    , subForm: null
    , validation: []
    , id: 19
};
/** Input with sugestions used on a form */
const input4Form6: InputOptions = {
    placement: 2
    , description: "Description Question 3 Form 6"
    , question: "Question 3 Form 6"
    , enabled: true
    , type: InputType.SELECT
    , sugestions: [
        { value: "Sugestion 1", placement: 0 }
        , { value: "Sugestion 2", placement: 1 }
    ]
    , subForm: null
    , validation: [
        { type: ValidationType.DEPENDENCY, arguments: ["19", "1"] }
        , { type: ValidationType.DEPENDENCY, arguments: ["20", "1"] }
    ]
    , id: 20
};
/** Input with sugestions used on a form */
const input5Form6: InputOptions = {
    placement: 3
    , description: "Description Question 4 Form 6"
    , question: "Question 4 Form 6"
    , enabled: true
    , type: InputType.CHECKBOX
    , subForm: null
    , sugestions: [
        { value: "Sugestion n", placement: 0 }
        , { value: "Sugestion n+1", placement: 1 }
        , { value: "Sugestion n+2", placement: 2 }
        , { value: "Sugestion n+3", placement: 4 }
    ]
    , validation: [
        { type: ValidationType.SOMECHECKBOX, arguments: [] }
    ]
    , id: 21
};
/** Input used on a form */
const input6Form6: InputOptions = {
    placement: 4
    , subForm: null
    , description: "Description Question 5 Form 6"
    , question: "Question 5 Form 6"
    , enabled: true
    , type: InputType.TEXT
    , sugestions: []
    , validation: [
        { type: ValidationType.DEPENDENCY, arguments: ["18", "2"] }
    ]
    , id: 22
};
/** Form, with sugestions on the inputs, that will be inserted */
const formWithId6: FormOptions = {
    title: "Form Title 6"
    , description: "Form Description 6"
    , inputs: [
        input2Form6
        , input3Form6
        , input4Form6
        , input5Form6
        , input6Form6
    ],
    answerTimes: true
    , id: 6
    , status: true
};
/** ============================================= */
/** form testing Scenario */

/** InputOptions used on a FormOptions */
const optsInput2EnableTrue: InputOptions = { // optsInput2 but with enabled true
    placement: 1
    , description: "Description Question 2 Form 1"
    , question: "Question 2 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.MAXCHAR, arguments: ["10"] }
        , { type: ValidationType.MINCHAR, arguments: ["2"] }
    ]
    , id: 3
};
/** InputOptions used on a FormOptions */
const optsInput3EnableTrue: InputOptions = { // Input 3
    placement: 2
    , description: "Description Question 3 Form 1"
    , question: "Question 3 Form 1"
    , enabled: true
    , type: InputType.TEXT
    , validation: [
        { type: ValidationType.REGEX, arguments: ["\\d{5}-\\d{3}"] }
        , { type: ValidationType.MANDATORY, arguments: [] }
    ]
    , id: 2
};
/** FormOptions to test a receive of a valid form */
const formObjInput1to3WithTrueEnable: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        inputOptsFull
        , optsInput2EnableTrue
        , optsInput3EnableTrue
    ],
    answerTimes: true
    , status: true
};
/** Valid form to post */
const validFormOptsToPost: FormOptions = {
    title: "Form Title 4"
    , description: "Form Description 4"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 4"
            , question: "Question 1 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: []
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 4"
            , question: "Question 2 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 4"
            , question: "Question 3 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 1, arguments: ["\\d{5}-\\d{3}"] }
                , { type: 2, arguments: [] }
            ]
        }
    ],
    answerTimes: true
    , status: true
};

/** Malformed form that misses title */
const formOptsMissingTitle: any = {
    description: "Form Description 4"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 4"
            , question: "Question 1 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: []
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 4"
            , question: "Question 2 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 4"
            , question: "Question 3 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 1, arguments: ["\\d{5}-\\d{3}"] }
                , { type: 2, arguments: [] }
            ]
        }
    ],
    answerTimes: true
    , status: true
};
/** FormOpts to udate with a SWAP operation */
const formOptsToUpdateSWAP: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 1"
            , question: "Question 1 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: []
            , id: 1
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 1"
            , question: "Question 2 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 2
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 1"
            , question: "Question 3 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 3
        }
    ],
    answerTimes: true
    , status: true
};
/** FormOpts to udate with a ADD operation */
const formOptsToUpdateADD: FormOptions = {
    id: 3
    , title: "Form Title 3"
    , description: "Form Description 3"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 3"
            , question: "Question 1 Form 3"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: ValidationType.MANDATORY, arguments: [] }
            ]
            , id: 6
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 3"
            , question: "Question 2 Form 3"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 7
        }
        , {
            placement: 3
            , description: "Description Question 4 Form 3"
            , question: "Question 4 Form 3"
            , enabled: true
            , type: InputType.CHECKBOX
            , validation: []
            , sugestions: [
                { value: "Sugestion 1", placement: 0 }
                , { value: "Sugestion 2", placement: 1 }
            ]
            , id: undefined
        }
        , {
            placement: 4
            , description: "Description Question 5 Form 3"
            , question: "Question 5 Form 3"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: undefined
        }
        , {
            placement: 5
            , description: "Description Question 6 Form 3"
            , question: "Question 6 Form 3"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: undefined
        }
    ],
    answerTimes: true
    , status: true
};
/** FormOpts to udate with a REMOVE operation */
const formOptsToUpdateREMOVE: FormOptions = {
    id: 3
    , title: "Form Title 3"
    , description: "Form Description 3"
    , inputs: [],
    answerTimes: true
    , status: true
};
/** FormOpts to udate with a REENABLE operation */
const formOptsToUpdateREENABLE: FormOptions = {
    id: 3
    , title: "Form Title 3"
    , description: "Form Description 3"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 3"
            , question: "Question 1 Form 3"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: ValidationType.MANDATORY, arguments: [] }
            ]
            , id: 6
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 1"
            , question: "Question 2 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 7
        }
    ],
    answerTimes: true
    , status: true
};
/** FormOpts to update changing the title */
const formOptsToUpdateChangingTheTitle: FormOptions = {
    id: 4
    , title: "Title 4"
    , description: "Description 4"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 4"
            , question: "Question 1 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: ValidationType.MANDATORY, arguments: [] }
            ]
            , id: 8
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 4"
            , question: "Question 2 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 9
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 4"
            , question: "Question 3 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 10
        }
    ],
    answerTimes: false
    , status: true
};
/** FormOpts to delete form */
const formOptsToDeleteForm: FormOptions = {
    id: 4
    , title: "Title 4"
    , description: "Description 4"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 4"
            , question: "Question 1 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: ValidationType.MANDATORY, arguments: [] }
            ]
            , id: 8
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 4"
            , question: "Question 2 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 9
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 4"
            , question: "Question 3 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 10
        }
    ],
    answerTimes: false
    , status: false
};
/** FormOpts to udate to Undo changes */
const formOptsToUpdateUdoingChanges: FormOptions = {
    id: 4
    , title: "Form Title 4"
    , description: "Form Description 4"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 4"
            , question: "Question 1 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: ValidationType.MANDATORY, arguments: [] }
            ]
            , id: 8
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 4"
            , question: "Question 2 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 9
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 4"
            , question: "Question 3 Form 4"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 10
        }
    ],
    answerTimes: false
    , status: true
};
/** A valid formUpdate */
const validFormUpdate2: FormOptions = {
    id: 1
    , title: "Form Title 1"
    , description: "Form Description 1"
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 6"
            , question: "Question 1 Form 6"
            , enabled: true
            , type: InputType.TEXT
            , validation: []
            , id: 1
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 6"
            , question: "Question 2 Form 6"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 2
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 6"
            , question: "Question 3 Form 6"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
        }
    ],
    answerTimes: true
    , status: true
};
/** FormUpdate Options that misses title and description */
const formOptionsToUpdateMissingProperties: any = {
    id: 1
    , inputs: [
        {
            placement: 0
            , description: "Description Question 1 Form 1"
            , question: "Question 1 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: []
            , id: 1
        }
        , {
            placement: 1
            , description: "Description Question 2 Form 1"
            , question: "Question 2 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
            , id: 2
        }
        , {
            placement: 2
            , description: "Description Question 3 Form 1"
            , question: "Question 3 Form 1"
            , enabled: true
            , type: InputType.TEXT
            , validation: [
                { type: 3, arguments: ["10"] }
                , { type: 4, arguments: ["2"] }
            ]
        }
    ],
    answerTimes: true
    , status: true
};

const formReadAnswer: FormAnswer[] =
    [{
        id: 3,
        form:
            new Form({
                id: 1,
                title: "Form Title 1",
                description: "Form Description 1",
                inputs:
                    [{
                        id: 1,
                        placement: 0,
                        description: "Description Question 1 Form 1",
                        question: "Question 1 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation: []
                    },
                    {
                        id: 2,
                        placement: 1,
                        description: "Description Question 3 Form 1",
                        question: "Question 3 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation:
                            [{ type: 1, arguments: ["\\d{5}-\\d{3}"] },
                            { type: 2, arguments: [] }]
                    },
                    {
                        id: 3,
                        placement: 2,
                        description: "Description Question 2 Form 1",
                        question: "Question 2 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation:
                            [{ type: 3, arguments: ["10"] },
                            { type: 4, arguments: ["2"] }]
                    }]
            }),
        timestamp: new Date("21 february 2019 12:10:25 UTC"),
        inputAnswers:
        {
            1:
                [{
                    id: 5,
                    idInput: 1,
                    placement: 0,
                    value: "Answer to Question 1 Form 1",
                    subForm: null
                }],
            2:
                [{
                    id: 6,
                    idInput: 2,
                    placement: 0,
                    value: "Answer to Question 2 Form 1",
                    subForm: null
                }],
            3:
                [{
                    id: 7,
                    idInput: 3,
                    placement: 0,
                    value: "Answer to Question 3 Form 1",
                    subForm: null
                }],
        }
    },
    {
        id: 6,
        form:
            new Form({
                id: 1,
                title: "Form Title 1",
                description: "Form Description 1",
                inputs:
                    [{
                        id: 1,
                        placement: 0,
                        description: "Description Question 1 Form 1",
                        question: "Question 1 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation: []
                    },
                    {
                        id: 2,
                        placement: 1,
                        description: "Description Question 3 Form 1",
                        question: "Question 3 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation:
                            [{ type: 1, arguments: ["\\d{5}-\\d{3}"] },
                            { type: 2, arguments: [] }]
                    },
                    {
                        id: 3,
                        placement: 2,
                        description: "Description Question 2 Form 1",
                        question: "Question 2 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation:
                            [{ type: 3, arguments: ["10"] },
                            { type: 4, arguments: ["2"] }]
                    }],
                answerTimes: true
                , status: true
            }),
        timestamp: new Date("22 january 2019 19:10:25"),
        inputAnswers:
        {
            1:
                [{
                    id: 12,
                    idInput: 1,
                    placement: 0,
                    value: "Answer to Question 1 Form 1",
                    subForm: null
                }],
            2:
                [{
                    id: 13,
                    idInput: 2,
                    placement: 0,
                    value: "Answer to Question 2 Form 1",
                    subForm: null
                }],
            3:
                [{
                    id: 14,
                    idInput: 3,
                    placement: 0,
                    value: "Answer to Question 3 Form 1",
                    subForm: null
                }]
        }
    },
    {
        id: 7,
        form:
            new Form({
                id: 1,
                title: "Form Title 1",
                description: "Form Description 1",
                inputs:
                    [{
                        id: 1,
                        placement: 0,
                        description: "Description Question 1 Form 1",
                        question: "Question 1 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation: []
                    },
                    {
                        id: 2,
                        placement: 1,
                        description: "Description Question 3 Form 1",
                        question: "Question 3 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation:
                            [{ type: 1, arguments: ["\\d{5}-\\d{3}"] },
                            { type: 2, arguments: [] }]
                    },
                    {
                        id: 3,
                        placement: 2,
                        description: "Description Question 2 Form 1",
                        question: "Question 2 Form 1",
                        enabled: true,
                        type: 0,
                        sugestions: [],
                        subForm: null,
                        validation:
                            [{ type: 3, arguments: ["10"] },
                            { type: 4, arguments: ["2"] }]
                    }],
                answerTimes: true
                , status: true
            }),
        timestamp: new Date("10 february 2020 14:07:49 UTC"),
        inputAnswers:
        {
            1:
                [{
                    id: 15,
                    idInput: 1,
                    placement: 0,
                    value: "Answer to Question 1 Form 1",
                    subForm: null
                }],
            2:
                [{
                    id: 16,
                    idInput: 2,
                    placement: 0,
                    value: "12345-000",
                    subForm: null
                }],
            3:
                [{
                    id: 17,
                    idInput: 3,
                    placement: 0,
                    value: "MAXCHAR 10",
                    subForm: null
                }]
        }
    }];

/** A message that is used in cases where the update is a success */
const successMsg = "Updated";
/** A message that is used in cases where the update is unsuccess */
const unsuccessMsg = "Could not update Form. Some error has ocurred. Check error property for details.";

/** ================================================== */
/** form testing Scenario */
/** Valid formAnswer */
const validFormAnswers: object = {
    1: ["Answer to Question 1 Form 1"]
    , 2: ["12345-000"]
    , 3: ["MAXCHAR 10"]
};
/** Invalid formAnswer - wrong RegEx and more than max char limitation */
const invalidFormAnswer: object = {
    1: ["Answer to Question 1 Form 1"]
    , 2: ["12a345-000"]
    , 3: ["MAXCHAR 10 AND MORE"]
};

/** Answers for forms with subForms */
/** Date for form answers */
const date1: Date = new Date("07/08/2007 14:20");

/** Answer Form 6 */
const inputAnswerSubForm5: InputAnswerOptions = {
    id: 28
    , idInput: 18
    , placement: 0
    , value: "true"
};
/** Answer Form 6 */
const inputAnswerSubForm6: InputAnswerOptions = {
    id: 29
    , idInput: 18
    , placement: 1
    , value: "true"
};
/** Answer Form 6 */
const inputAnswerSubForm7: InputAnswerOptions = {
    id: 30
    , idInput: 18
    , placement: 2
    , value: "false"
};
/** Answer Form 6 */
const inputAnswerSubForm8: InputAnswerOptions = {
    id: 31
    , idInput: 19
    , placement: 1
    , value: "true"
};
/** Answer Form 6 */
const inputAnswerSubForm9: InputAnswerOptions = {
    id: 32
    , idInput: 20
    , placement: 1
    , value: "true"
};
/** Answers dictionary for form 6 */
const inputAnswerOptDictForm6: InputAnswerOptionsDict = {
    18: [
        inputAnswerSubForm5
        , inputAnswerSubForm6
        , inputAnswerSubForm7
    ]
    , 19: [inputAnswerSubForm8]
    , 20: [inputAnswerSubForm9]
    , 21: []
};

/** SubForm Options for form 8 */
const subFormAnswerOptForm6: FormAnswerOptions = {
    form: new Form(formWithId6)
    , timestamp: date1
    , inputsAnswerOptions: inputAnswerOptDictForm6
    , id: 12
};
/** Answer Form 8 */
const inputAnswerSubForm3: InputAnswerOptions = {
    id: 33
    , idInput: 33
    , placement: 1
    , value: "Hey you!"
};
/** Answer Form 8 */
const inputAnswerSubForm4: InputAnswerOptions = {
    id: 27
    , idInput: 32
    , placement: 1
    , value: ""
    , subForm: subFormAnswerOptForm6
};
/** Answers dictionary for form 8 */
const inputAnswerOptDictForm8: InputAnswerOptionsDict = {
    32: [inputAnswerSubForm4]
    , 33: [inputAnswerSubForm3]
};

/** SubForm Options for form 11 */
const subFormAnswerOptForm8: FormAnswerOptions = {
    form: new Form(updatedFormWithValidSubForm2)
    , timestamp: date1
    , inputsAnswerOptions: inputAnswerOptDictForm8
    , id: 11
};
/** Answer Form 11 */
const inputAnswerSubForm1: InputAnswerOptions = {
    id: 26
    , idInput: 36
    , placement: 0
    , value: ""
    , subForm: subFormAnswerOptForm8
};
/** Answer Form 11 */
const inputAnswerSubForm2: InputAnswerOptions = {
    id: 34
    , idInput: 37
    , placement: 1
    , value: "Hey!"
};
/** Answers dictionary for form 11 */
const inputAnswerOptDictForm11: InputAnswerOptionsDict = {
    36: [inputAnswerSubForm1]
    , 37: [inputAnswerSubForm2]
};

/** Form Answer for form 11 */
const formAnswerOptionsForm11: FormAnswerOptions = {
    form: new Form(formWithValidSubForm2)
    , timestamp: date1
    , inputsAnswerOptions: inputAnswerOptDictForm11
    , id: 10
};
/////// form 8 updatedFormWithValidSubForm2
/////// form 6 formObjDBH2
/////// anwser formWithValidSubForm2 form 11

/** ================================================== */
/** User testing Scenario */

/** Test user to sign up */
const userTest: User = new User({
    name: "Test_name"
    , email: "test_email@test.com"
    , hash: "Test_pw"
});
/** Test user with the same email as userTest */
const userTest2: User = new User({
    name: "Test_name2"
    , email: "test_email@test.com"
    , hash: "Test_pw"
});
/** User with null hash property */
const userNullHash: User = new User({
    name: "Test_name"
    , email: "test_email@test.com"
    , hash: null
});
/** User with null name property */
const userNullName: any = {
    email: "test_email@test.com"
    , hash: "Test_pw"
};
/** User with null email property */
const userNullEmail: any = {
    name: "Test_name"
    , hash: "Test_pw"
};

/** Sorter test scenario */
export const sortScenario = {
    sortByPlacementRandom: randomPlacement,
    orderedPlacement: orderedPlacement
};
/** ValidationHandler test scenario */
export const validationHScenario = {
    /** Date used on tests */
    date: date,
    /** Input Dictionary for testing min char from an input */
    dictMinCharNumber: AnswerDictMinCharNumber,
    /** Input Dictionary for testing an mandatory  */
    dictMandatoryInput: AnswerDictMandatoryInput,
    /** Input Dictionary for testing max char from an input */
    dictMaxCharNumber: AnswerDictMaxChar,
    /** Input Dictionary for testing regular expression from an input */
    dictHasARegEx: DictWithRegExInput,
    /** Input Dictionary for testing cases where the input isn't:
     * Number
     * Float
     * Date
     * Valid answer (including to have more than the form limit answers)
     */
    dictCNFD: AnswerOptionsDict,
    /**
     * Input Dictionary for testing some properties
     */
    dictHasSugestion: AnswerDictHasSugestionInput
};

/** DiffHandler testing Scenario */
export const diffHandlerScenario = {
    /** New form that should be the result of an REMOVE operation over the base form */
    newFormObjREMOVE: form1,
    /** Old form (without any operations) used as a base parameter */
    oldFormObj: formBase,
    /** Expected resulting form after REMOVE operation */
    expFormUpdateREMOVE: expFormUpdate1,
    /** New form that should be the result of an ADD operation over the base form */
    newFormObjADD: form2,
    /** Expected resulting form after ADD operation */
    expFormUpdateADD: expFormUpdate2,
    /** New form that should be the result of an SWAP operation over the base form */
    newFormObjSWAP: form3,
    /** Expected resulting form after SWAP operation */
    expFormUpdateSWAP: expFormUpdate3,
    /** New form that should be the result of a REMOVE and ADD operations over the base form */
    newFormObjREMOVEandADD: form4,
    /** Expected resulting form after REMOVE and ADD operations */
    expFormUpdateREMOVEandADD: expFormUpdate4,
    /** Old form (without any operations) used as a base parameter when testing all operations */
    oldFormAll: formBase2,
    /** New form that should be the result of all operations over the base form */
    newFormObjALL: form5,
    /** Expected resulting form after all operations */
    expFormUpdateALL: expFormUpdateALL,
    /** New form that should be the result a restoration of an old form */
    newFormObjRESTORE: form6,
    /** Old form to be restored */ // REVER
    oldFormRestore: formBase3,
    /** Expected resulting form after all operations */
    expFormUpdateRESTORE: expFormUpdateRESTORE,
    /** New form that should be the result from the creation of a new form */
    newFormObjCREATE: form7,
    /** Old empty form to be compared with the newly created */
    FormObjEmpty: emptyForm,
    /** Expected resulting form after a creation */
    expFormUpdateCREATE: expFormUpdateCREATION,
    /** Expected resulting form after removing all inputs */
    expFormUpdateREMOVEALL: expFormUpdateREMOVEALL,
    /** New form with a wrong title */
    newFormObjWrongTitle: form8,
    /** Old form with the correct title */
    odlFormObjCorrectTitle: form1,
    /** Expected resulting form after updating the title */
    expFormUpdateTITLE: expFormUpdateTITLE,
};
/** InputUpdate testing scenario */
export const inputUpdateScenario = {
    /** Answer input recieved to update */
    resInputUpdate: resInputUpdate,
    /** Expected input after the update */
    expInputUpdate: expInputUpdate
};
/** input testing scenario */
export const inputScenario = {
    /** Input to be checked its Enable key that should be undefined */
    inputUndefEnable: inputUndefEnableKey,
    /** Input to be checked its Enable key that should be null */
    inputNullEnable: inputNullEnabled,
    /** Input to be checked its Enable key that should be true */
    inputTrueEnable: inputTrueEnable,
    /** Input to be checked its Enable key that should be false */
    inputFalseEnable: inputFalseEnable
};
/** Enum Handler testing scenario */
export const enumHandlerScenario = {

    /** Result of stringifying an update, with parameter specifying type 'NONE' */
    sUpdateNone: stringifiedUpdateNone,
    /** Result of stringifying an update, with parameter specifying type 'add' */
    sUpdateAdd: stringigiedUpdateAdd,
    /** Result of stringifying an update, with parameter specifying type 'remove' */
    sUpdateRemove: stringifiedUpdateRemove,
    /** Result of stringifying an update, with parameter specifying type 'swap' */
    sUpdateSwap: stringifiedUpdateSwap,
    /** Result of stringifying an update, with parameter specifying type 'reenabled' */
    sUpdateReenabled: stringifiedUpdateReenabled,

    /** Result of parssing an validation, with parameter 'add' */
    pUpdateAdd: parsedUpdateAdd,
    /** Result of parssing an validation, with parameter 'ADD' */
    pUpdateAddCapitalLetters: parsedUpdateAddCapitalLetters,
    /** Result of parssing an validation, with parameter 'remove' */
    pUpdateRemove: parsedUpdateRemove,
    /** Result of parssing an validation, with parameter 'REMOVE' */
    pUpdateRemoveCapitalLetters: parsedUpdateRemoveCapitalLetters,
    /** Result of parssing an validation, with parameter 'swap' */
    pUpdateSwap: parsedUpdateSwap,
    /** Result of parssing an validation, with parameter 'SWAP' */
    pUpdateSwapCapitalLetters: parsedUpdateSwapCapitalLetters,
    /** Result of parssing an validation, with parameter 'reenabled' */
    pUpdateReenabled: parsedUpdateReenabled,
    /** Result of parssing an validation, with parameter 'REENABLED' */
    pUpdateReenabledCapitalLetters: parsedUpdateReenabledCapitalLetters,
    /** Result of parssing an validation, with parameter '' */
    pUpdateNone: parsedUpdateNone,
    /** Result of parssing an validation, with parameter 'fool' */
    pUpdateFOOL: parsedUpdateFOOL,

    /** Result of stringifying an update, with parameter specifying type 'NONE' */
    sInputNone: stringifiedInputNone,
    /** Result of stringifying an update, with parameter specifying type 'TEXT' */
    sInputText: stringifiedInputText,
    /** Result of stringifying an update, with parameter specifying type 'RADIO' */
    sInputRadio: stringifiedInputRadio,
    /** Result of stringifying an update, with parameter specifying type 'CHECKBOX' */
    sInputCheckbox: stringifiedInputCheckbox,

    /** Result of parssing an validation, with parameter '' */
    pInputNone: parsedInputNone,
    /** Result of parssing an validation, with parameter 'text' */
    pInputText: parsedInputText,
    /** Result of parssing an validation, with parameter 'TEXT' */
    pInputTextCapitalLetters: parsedInputTextCapitalLetters,
    /** Result of parssing an validation, with parameter 'radio' */
    pInputRadio: parsedInputRadio,
    /** Result of parssing an validation, with parameter 'RADIO' */
    pInputRadioCapitalLetters: parsedInputRadioCapitalLetters,
    /** Result of parssing an validation, with parameter 'checkbox' */
    pInputCheckbox: parsedInputCheckbox,
    /** Result of parssing an validation, with parameter 'CHECKBOX' */
    pInputCheckboxCapitalLetters: parsedInputCheckboxCapitalLetters,
    /** Result of parssing an validation, with parameter 'fool' */
    pInputFOOL: parsedInputFOOL,
    /** Result of parssing an validation, with parameter 'select' */
    pInputSelect: parsedInputSelect,
    /** Result of parssing an validation, with parameter 'SELECT' */
    pInputSelectCapitalLetters: parsedInputSelectCapitalLetters,

    /** Result of stringifying an update, with parameter specifying type 'REGEX' */
    sValidationRegex: stringifiedValidationRegex,
    /** Result of stringifying an update, with parameter specifying type 'MANDATORY' */
    sValidationMandatory: stringifiedValidationMandatory,
    /** Result of stringifying an update, with parameter specifying type 'MAXCHAR' */
    sValidationMaxChar: stringifiedValidationMaxChar,
    /** Result of stringifying an update, with parameter specifying type 'MINCHAR' */
    sValidationMinChar: stringifiedValidationMinChar,
    /** Result of stringifying an update, with parameter specifying type 'TYPEOF' */
    sValidationTypeOf: stringifiedValidationTypeOf,
    /** Result of stringifying an update, with parameter specifying type 'SOMECHECKBOX' */
    sValidationSomeCheckbox: stringifiedValidationSomeCheckbox,
    /** Result of stringifying an update, with parameter specifying type 'MAXANSWERS' */
    sValidationMaxAnswers: stringifiedValidationMaxAnswers,
    /** Result of stringifying an update, with parameter specifying type 'NONE' */
    sValidationNone: stringifiedValidationNone,

    /** Result of parssing an validation, with parameter 'regex' */
    pValidationRegex: parsedValidationRegex,
    /** Result of parssing an validation, with parameter 'REGEX' */
    pValidationRegexCapitalized: parsedValidationRegexCapitalized,
    /** Result of parssing an validation, with parameter 'mandatory' */
    pValidationMandatory: parsedValidationMandatory,
    /** Result of parssing an validation, with parameter 'MANDATORY' */
    pValidationMandatoryCapitalized: parsedValidationMandatoryCapitalized,
    /** Result of parssing an validation, with parameter 'maxchar' */
    pValidationMaxChar: parsedValidationMaxChar,
    /** Result of parssing an validation, with parameter 'MAXCHAR' */
    pValidationMaxCharyCapitalized: parsedValidationMaxCharyCapitalized,
    /** Result of parssing an validation, with parameter 'minchar' */
    pValidationMinChar: parsedValidationMinChar,
    /** Result of parssing an validation, with parameter 'MINCHAR' */
    pValidationMinCharyCapitalized: parsedValidationMinCharyCapitalized,
    /** Result of parssing an validation, with parameter 'typeof' */
    pValidationTypeOf: parsedValidationTypeOf,
    /** Result of parssing an validation, with parameter 'TYPEOF' */
    pValidationTypeOfCapitalized: parsedValidationTypeOfCapitalized,
    /** Result of parssing an validation, with parameter 'somecheckbox' */
    pValidationSomeCheckbox: parsedValidationSomeCheckbox,
    /** Result of parssing an validation, with parameter 'SOMECHECKBOX' */
    pValidationSomeCheckboxCapitalized: parsedValidationSomeCheckboxCapitalized,
    /** Result of parssing an validation, with parameter 'maxanswers' */
    pValidationMaxAnswers: parsedValidationMaxAnswers,
    /** Result of parssing an validation, with parameter 'MAXANSWERS' */
    pValidationMaxAnswersCapitalized: parsedValidationMaxAnswersCapitalized,
    /** Result of parssing an validation, with parameter 'dependency' */
    pValidationDependency: parsedValidationDependency,
    /** Result of parssing an validation, with parameter 'DEPENDENCY' */
    pValidationDependencyCapitalized: parsedValidationDependencyCapitalized,
    /** Result of parssing an validation, with parameter '' */
    pValidationNone: parsedValidationNone,
    /** Result of parssing an validation, with parameter 'fool' */
    pValidatioFOOL: parsedValidatioFOOL

};

/** formUpdate testing scenario */
export const formUpdateScenario = {
    /** new updated form that should have null id */
    resFormUpdateIdNull: formUpdateNullId,
    /** Expected form after the update */
    expFormUpdate: expFormUpdate
};

/** optHandler testing scenario */
export const optHandlerScenario = {
    /** Form missing Title property */
    formMissingTitle: formMissingTitle,
    /** Form missing Description property */
    formMissingDescription: formMissingDescription,
    /** Form missing Inputs properties */
    formMissingInputs: formMissingInputs,
    /** Form with Input properties with wrong format */
    formInputNotAnArray: formMissingInputs,
    /** Input missing it's Placement property */
    inputMissingPlacement: inputMissingPlacement,
    /** Input missing it's Description property */
    inputMissingDescription: inputMissingDescription,
    /** Input missing it's Question property */
    inputMissingQuestion: inputMissingQuestion,
    /** Input missing it's Type property */
    inputMissingType: inputMissingType,
    /** Input missing it's Validation property */
    inputMissingValidation: inputMissingValidation,
    /** Input with wrong Validation property format */
    inputValidationNotAnArray: inputValidationNotAnArray,
    /** Input with a invalid SubForm. */
    inputWithSubFormWithoutContentFormId: inputWithMalformedSubForm1,
    /** Input with a invalid SubForm. */
    inputWithSubFormWithoutInputId: inputWithMalformedSubForm2,
    /** FormAnswer with no form associated */
    noFormAssociated: formAnswerHasNoFormAssociated,
    /** FormAnswer with no form associated */
    noFormType: formAnswerHasNoFormType,
    /** FormAnswer with no Date property */
    formHasNoDate: formHasNoDate,
    /** FormAnswer with wrong Date property type */
    formNoDateType: formHasNoDateType,
    /** FormAnswer with no inputAnswerOptions dictionary */
    formHasNoDict: formHasNoDict,
    /** FormAnswer, InputAnswerOpts missing idInput property */
    missingIdInputOpt: formMissingInputOptIdInput,
    /** FormAnswer, InputAnswerOpts missing Placement property */
    missingPlacementInputOpt: formMissingInputOptPlacement,
    /** FormAnswer, InputAnswerOpts missing value property */
    missingValueInputOpt: formMissingInputOptValue,
    /** FormAnswer containing an valid form */
    validForm: validForm,
    /** valid FormUpdate Obj */
    validFormUpdate: validFormUpdateObj,
    /** FormUpdate, inputUpdate is not an array */
    nonArrayInputUpdate: formUpdateNotArrayInputUpdates,
    /** FormUpdate, missing form property */
    missingFormProperty: formUpdateMissingForm,
    /** FormUpdate, missing inputUpdate property */
    missingInputUpdate: formUpdateMissinginputUpdate,
    /** InputUpdate missing Input property */
    inputUpdateMissingInput: inputUpdateUndefinedInput,
    /** InputUpdate missing inputOperation property */
    missinginputOperation: inputUpdateMissingInputOperation,
    /** InputUpdate missing value property */
    missingValueProperty: inputUpdateMissingValue,
    /** InputOpt with malformed sugestion that misses placement */
    malformedSugestionMissingPlacement: inputOptsSugestionMissingPlacement,
    /** InputOpt with malformed sugestion that misses value */
    malformedSugestionMissingValue: inputOptsSugestionMissingValue,
    /** InputOpt type SubForm with a valid subForm */
    validInputWithSubForm: inputWithValidSubForm,
    /** InputOpt type SubForm without a SubForm */
    missingSubFormProperty: inputWithoutSubForm
};

/** dbHandler testing scenario */
export const dbHandlerScenario = {
    /** Date used in some objects */
    date: dateDBH,
    /** Query to insert a form with id 5 on the Database */
    insertForm5: queryToInsertFormid5,
    /** Query to insert a form with id 6 on the Database */
    insertForm6: queryToInsertFormid6,
    /** Query to select all the forms on the Database */
    selectAllForm: queryToSelectAllForms,
    /** Query to delete the form with id 6 from the Database */
    deleteForm6: queryToDeleteFormid6,
    /** Query to delete the form with id 5 from the Database */
    deleteForm5: queryToDeleteFormid5,
    /** Query to insert inputs on the Database */
    insertInputs: queryToInsertTwoInputs,
    /** Query to select all the inputs on the Database */
    selectAllInputs: queryToSelectAllInputs,
    /** Query to try to delete a input that doesn't exist on the Database */
    deleteNonExistentInput: queryToDeleteNonExistentInput,
    /** Query to delete the inputs from the Database */
    deleteBothInputs: queryToRemoveBothInputs,
    /** Query to insert two input validations on the Database */
    insertInputValidations: queryToInsertTwoInputVal,
    /** Query to select all the input validations on the Database */
    selectInputValidations: queryToSelectAllInputVal,
    /** Query to try to delete a  input validation that doesn't exisit on the Database */
    deleteNonExistetnValidations: queryToRemoveNEInputVal,
    /** Query to delete the input validations from the Database */
    deleteInputValidations: queryToRemoveInputVal,
    /** Query to insert input validation arguments on the Database */
    insertInputValArguments: queryToInsertInputValArgs,
    /** Query to select all the input validation arguments on the Database */
    selectInputValidationArgumetns: queryToSelectAllInputValArgs,
    /** Query to try to delete a input validation argument that doesn't exist on the Database */
    deleteNEInputValArgs: queryToRemoveNEInputValArgs,
    /** Query to insert input validation arguments from the Database */
    deleteInputValArgs: queryToRemoveInputValArgs,
    /** Query to insert form answers on the Database */
    insertFormAnswers: queryToInsertFormAnswers,
    /** Query to select all form answers on the Database */
    selectFormAnswers: queryToSelectAllFormAnswers,
    /** Query to try to delete a form answer that doesn't exist on the Database */
    deleteNEFormAnswers: queryToRemoveNEFormAnswers,
    /** Query to delete the form answers from the Database */
    deleteFormAnswers: queryToRemoveFormAnswers,
    /** Query to insert input answers on the Database */
    insertInputAnswers: queryToInsertInputAnswers,
    /** Query to select all the input answers on the Database */
    selectInputAnswers: queryToSelectInputAnswers,
    /** Query to try to delete a input answer that doesn't exist on the Database */
    removeNEInputAnswers: queryToRemoveNEInputAnswers,
    /** Query to remove the input answers from the Database */
    removeInputAnswers: queryToRemoveInputAnswers,
    /** Query to delete form with id 3 */
    deleteForm3: queryToRemoveForm3,

    /** Form options that will have to be read */
    formToRead: formOptsObjDBH,
    /** Form options that will have to be write */
    formToWrite: formOptsObjDBH2,
    /** Dictionary of inputAnswertOptions that will have to be read */
    inputAnswerToRead: inputAnswerOptionsDictDBH1,
    /** Dictionary of inputAnswertOptions that will have to be write */
    inputAnswerToWrite: inputAnswerOptionsDictDBH1,
    /** Form update options that will have to update the form and insert a formupdate */
    updateForm: formUpdateOptsObjDBH1,
    /** Input update options that will have to update the form and insert a formupdate */
    updateInput: formUpdateOptsObjDBH2,
    /** Form update options that will have to reenable a input and insert a formupdate */
    updateDelete: formUpdateOptsObjDBH4,
    /** Form update options that will have to update status on a form to false */
    reenabledInputs: formUpdateOptsObjDBH3,
    /** Form update  that will fail to update by not having it's operation recognized */
    failedUpdate: formUpdateObjDBH1,
    /** Form that will have to to be inserted, the inputs have sugestions */
    formWithInputAnswerSugestions: formObjDBH2,
    /** Form that will have to to be inserted, the inputs have 'typeof' validations */
    formWithTypeOfValidation: formObjdbh3,
    /** Input options that will have to to be inserted, it has 'somecheckbox' validation */
    inputAnswerValidationCheckbox: inputAnswerOptionsDictdbh2,
    /** Form with a SubForm */
    formWithSubForm1: formWithValidSubForm1,
    /** Form with a SubForm */
    formWithSubForm2: formWithValidSubForm2,
    /** Form with a SubForm */
    updatedFormWithValidSubForm1: updatedFormWithValidSubForm1,
    /** Form with a SubForm */
    updatedFormWithValidSubForm2: updatedFormWithValidSubForm2,
    /** FormUpdate with a SubForm */
    formUpdateDeleteAddWithSubForm: formUpdateWithSubForm,
    /** FormUpdate with a SubForm */
    formUpdateSwapWithSubForm: formUpdateWithSubForm1,
    /** Form with a SubForm */
    formWithInvalidSubForm1: formWithInvalidSubForm1,
    /** Form with a SubForm */
    formWithInvalidSubForm2: formWithInvalidSubForm2,
    /** Form with a SubForm */
    formWithInvalidSubForm3: formWithInvalidSubForm1,
    /** FormUpdate with a SubForm */
    formUpdateAddRemoveSubForm: formUpdateWithSubForm1,
    /** FormUpdate with a SubForm */
    formUpdateHimselfAsSubForm: formUpdateWithSubForm3,
    /** FormUpdate with a SubForm */
    formUpdateWithSubFormLoop: formUpdateWithSubForm4,
    /** FormAnswer for Form with SubForm */
    formAnswerWithSubForms: formAnswerOptionsForm11,

    /** User obj to be inserted */
    toBeInserted: defaultUser,
    /** User obj to be inserted with false enabled value */
    falseEnabled: falseEnabledUser,
    /** User obj to be inserted with null enabled value */
    nullEnabled: nullEnabledUser,
    /** User obj to be inserted with null ID value */
    nullId: nullIdUser,
    /** User obj to be used to update another user */
    toupdate: userToUpdate,
    /** User obj to be used to update another user */
    updateEnable: userToUpdate2,
    formTest: form6
};

/** form testing scenario */
export const formScenario = {
    /** Test recieving a valid form */
    validForm: formObjInput1to3WithTrueEnable,
    /** Valid form to test posting */
    formToPost: validFormOptsToPost,
    /** malformed form to test postng */
    formMissingTitle: formOptsMissingTitle,
    /** Update to swap inputs of the form */
    formToSwapInputs: formOptsToUpdateSWAP,
    /** Update to add Inputs on the form */
    formToAddInputs: formOptsToUpdateADD,
    /** Update to remove inputs from the form */
    formToRemoveInputs: formOptsToUpdateREMOVE,
    /** Update to reenable inputs of the form */
    formToReenableInputs: formOptsToUpdateREENABLE,
    /** Update to change the form title */
    changeTitle: formOptsToUpdateChangingTheTitle,
    /** Update to delete form */
    deleteForm: formOptsToDeleteForm,
    /** Update by undoing changes */
    undo: formOptsToUpdateUdoingChanges,
    /** A valid formUpdate being used on a non-existent form */
    validUpdate: validFormUpdate2,
    /** A malformed try to update a form */
    malformedUpdate: formOptionsToUpdateMissingProperties,
    /** Successfuly updating message */
    msg: successMsg,
    /** Unsuccesfuly updating message */
    msg2: unsuccessMsg,

};

/** form testing scenario */
export const formAnswerScenario = {
    /** Valid formAnswer being recieved by a post */
    validAnswer: validFormAnswers,
    /** Invalid formAnswer being recieved by a post */
    invalidAnswer: invalidFormAnswer,
    /** Form Awnser to be read */
    formAnswerRead: formReadAnswer
};

/** User testing scenario */
export const userScenario = {
    /** Correct user to be signed up */
    user: userTest,
    /** User with null hash value */
    nullHash: userNullHash,
    /** User with null name value */
    nullName: userNullName,
    /** User with null email value */
    nullEmail: userNullEmail,
    /** User with conflicting email with another already on the db */
    sameEmail: userTest2

};
