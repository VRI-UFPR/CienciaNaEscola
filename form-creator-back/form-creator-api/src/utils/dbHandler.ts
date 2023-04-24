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

import { Pool, PoolConfig, QueryResult } from "pg";
import { User } from "../core/user";
import { AnswerQueryBuilder } from "./answerQueryBuilder";
import { configs } from "./config";
import { FormQueryBuilder } from "./formQueryBuilder";
import { UserQueryBuilder } from "./userQueryBuilder";

/**
 * Class of the SGBD from the Form Creator Api perspective. Used to
 * perform all the operations into the database that the Form Creator Api
 * requires.
 */
export class DbHandler {

    /** Object used to control Form operations. */
    public readonly form: FormQueryBuilder;
    /** Object used to control FormAnswer operations. */
    public readonly answer: AnswerQueryBuilder;
    /** OBject used to control User operations */
    public readonly user: UserQueryBuilder;
    /** Information used to connect with a PostgreSQL database. */
    private pool: Pool;

    /**
     * Creates a new adapter with the database connection configuration.
     */
    constructor(config: PoolConfig) {
        this.pool = new Pool(config);
        this.form = new FormQueryBuilder(this.pool);
        this.answer = new AnswerQueryBuilder(this.form, this.pool);
        this.user = new UserQueryBuilder(this.pool);
    }
}
