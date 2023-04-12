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

/**
 * Available Input types
 */
export enum InputType {
    /** Text type, when input is a text */
    TEXT,
    CHECKBOX,
    RADIO,
    SELECT,
    SUBFORM,
    NONE
}

export enum UpdateType {
    ADD,
    REMOVE,
    SWAP,
    REENABLED,
    NONE
}

/**
 * Available Validation types.
 */
export enum ValidationType {
    /** Used as error code. No suitable validation found. */
    NONE,
    /** Regex type, when input need a regex to validate. */
    REGEX,
    /** Mandatory type, when input is mandatory. */
    MANDATORY,
    /** MaxChars type, when input has maximum char limit. */
    MAXCHAR,
    /** MinChars type, when input has minimum char limit. */
    MINCHAR,
    /** TypeOf type, when input needs to be a certain type. */
    TYPEOF,
    /** SomeCheckbox type, when at least one checkbox must be selected. */
    SOMECHECKBOX,
    /** MAXANSWERS type, when input has maximum answer limit. */
    MAXANSWERS,
    /** DEPENDENCY type, when input depends on another input. */
    DEPENDENCY
}

/**
 * ENUM's handler. Manage parse through the project.
 */
export class EnumHandler {

    /**
     * Parse an enum(Input type) to string.
     * @param a - Input type to be stringified.
     * @returns - Input Type as string.
     */
    public static stringifyInputType(a: InputType): string {
        switch (a) {
            case InputType.TEXT:
                return "text";
            case InputType.CHECKBOX:
                return "checkbox";
            case InputType.RADIO:
                return "radio";
            case InputType.SELECT:
                return "select";
            case InputType.SUBFORM:
                return "subform";
            default:
                return  "";
        }
    }

    /**
     * Parse a string to enum(InputType).
     * @param str - InputType in string format.
     * @returns - Matching InputType
     */
    public static parseInputType(str: string): InputType {
        str = str.toLocaleLowerCase().trimLeft().trimRight();
        switch (str) {
            case "text":
                return InputType.TEXT;
            case "checkbox":
                return InputType.CHECKBOX;
            case "radio":
                return InputType.RADIO;
            case "select":
                return InputType.SELECT;
            case "subform":
                return InputType.SUBFORM;
            default:
                return InputType.NONE;
        }
    }

    /**
     * Parse an enum(Validation type) to string.
     * @param a - Validation Type to be stringified.
     * @returns - Validation Type as string
     */
    public static stringifyValidationType(a: ValidationType): string {
        switch (a) {
            case ValidationType.REGEX:
                return "regex";
            case ValidationType.MANDATORY:
                return "mandatory";
            case ValidationType.MAXCHAR:
                return "maxchar";
            case ValidationType.MINCHAR:
                return "minchar";
            case ValidationType.TYPEOF:
                return "typeof";
            case ValidationType.SOMECHECKBOX:
                return "somecheckbox";
            case ValidationType.MAXANSWERS:
                return "maxanswers";
            case ValidationType.DEPENDENCY:
                return "dependency";
            default:
                return  "";
        }
    }
    /**
     * Parse a string to enum(InputType).
     * @param str - InputType in string format.
     * @returns - Matching ValidationType
     */
    public static parseValidationType(str: string): ValidationType {
        str = str.toLocaleLowerCase().trimLeft().trimRight();
        switch (str) {
            case "mandatory":
                return ValidationType.MANDATORY;
            case "regex":
                return ValidationType.REGEX;
            case "maxchar":
                return ValidationType.MAXCHAR;
            case "minchar":
                return ValidationType.MINCHAR;
            case "typeof":
                return ValidationType.TYPEOF;
            case "somecheckbox":
                return ValidationType.SOMECHECKBOX;
            case "maxanswers":
                return ValidationType.MAXANSWERS;
            case "dependency":
                return ValidationType.DEPENDENCY;
            default:
                return ValidationType.NONE;
        }
    }

    /**
     * Parse an UpdateType object to string
     * @param a - Update type to be stringified.
     * @returns - Update Type as string
     */
    public static stringifyUpdateType(a: UpdateType): string {
        switch (a) {
            case UpdateType.ADD:
                return "add";
            case UpdateType.REMOVE:
                return "remove";
            case UpdateType.SWAP:
                return "swap";
            case UpdateType.REENABLED:
                return "reenabled";
            default:
                return  "";
        }
    }

    /**
     * Parse a string to UpdateType object
     * @param str - UpdateType in string format.
     * @returns - Matching UpdateType
     */
    public static parseUpdateType(str: string): UpdateType {
        str = str.toLocaleLowerCase().trimLeft().trimRight();
        switch (str) {
            case "add":
                return UpdateType.ADD;
            case "remove":
                return UpdateType.REMOVE;
            case "swap":
                return UpdateType.SWAP;
            case "reenabled":
                return UpdateType.REENABLED;
            default:
                return UpdateType.NONE;
        }
    }
}
