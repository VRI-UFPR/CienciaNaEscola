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

/** Parameters used to create an User object. */
export interface UserOptions {
    /** Unique identifier of an User instance. */
    id?: number;
    /** Unique User e-mail. */
    email: string;
    /** User's name. */
    name: string;
    /** Unique User's hash. */
    hash?: string;
    /** Determine either an user is electable or not */
    enabled?: boolean;
    /** User forms */
    forms?: number[];
}

/**
 * Export class to manage project's User.
 */
export class User {
    /** Unique identifier of an User instance. */
    public readonly id: number;
    /** Unique User e-mail. */
    public readonly email: string;
    /** User's name. */
    public readonly name: string;
    /** Unique User's hash. */
    public readonly hash: string;
    /** Determine either an user is electable or not */
    public readonly enabled: boolean;
    /** User forms */
    public readonly forms: number[];

    /**
     * Creates a new instance of User class.
     * @param options - Inputs to create an User.
     */
    constructor(options: UserOptions) {
        this.id = options.id ? options.id : null;
        this.email = options.email;
        this.name  = options.name;
        this.hash  = options.hash;
        this.enabled = options.enabled;
        if ((options.enabled === undefined) || (options.enabled === null) ) {
            this.enabled = true;
        }
        this.forms = options.forms ? options.forms : null;
    }
}
