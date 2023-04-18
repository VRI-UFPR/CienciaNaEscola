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
 * Error's handler. Manage error message through the project.
 */
export class ErrorHandler {

    /**
     * Return an error instance with a default message when ids amount is different than 1.
     * @param idNumber - Amount of ids found.
     * @returns - An error instance with correct message.
     */
    public static badIdAmount(idNumber: number): Error {
        return new Error("Bad amount of ids returned: found '" + idNumber + "' should be 1");
    }

    /**
     * Return an error instance when a object is not inserted.
     * @param objectName - Name of object, usually the name of the table.
     * @returns - An error instance with correct message.
     */
    public static notInserted(objectName: string): Error {
        return new Error(objectName + " not inserted");
    }

    /**
     * Return an error when a object is not found.
     * @param objectName - Name of object, usually the name of the table.
     * @returns - An error instance with correct message.
     */
    public static notFound(objectName: string): Error {
        return new Error("The dataType named '" + objectName + "' was not found");
    }
}
