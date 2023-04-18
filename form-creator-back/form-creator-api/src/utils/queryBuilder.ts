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

/** Parameters used to create a parametrized query, to avoid SQL injection */
export interface QueryOptions {
    /** Query string to execute */
    query: string;
    /** Array of input. containing question */
    parameters: any[];
}

/**
 * Class used to build and execute queries in the database.
 * Querybuilder classes should be used to abstract the access of objects in the database.
 */
export abstract class QueryBuilder {

    /** Information used to connect with a PostgreSQL database. */
    private pool: Pool;

    /**
     * Creates a new adapter with the database connection configuration.
     * @param config - The information required to create a connection with the database.
     */
    constructor(pool: Pool) {
        this.pool = pool;
    }

    /**
     * Asynchronously executes a query and get its result.
     * @param query - Query (SQL format) to be executed.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - Query result.
     */
    public executeQuery(query: QueryOptions, cb: (err: Error, result?: QueryResult) => void): void {

        this.pool.connect((err, client, done) => {

            if (err) {
                cb(err);
                return;
            }

            client.query(query.query, query.parameters, (error, result) => {
                // call 'done()' to release client back to pool
                done();
                cb(error, (result) ? result : null);
            });
        });
    }

    /**
     * Asynchronously ends a transaction
     */
    public commit(cb: (err: Error, result?: QueryResult) => void) {
        this.executeQuery({query: "COMMIT;", parameters: []}, cb);
    }

    /**
     * Asynchronously rollback a transaction
     */
    public rollback(cb: (err: Error, result?: QueryResult) => void) {
        this.executeQuery({query: "ROLLBACK;", parameters: []}, cb);
    }

    /**
     * Asynchronously starts a transaction
     */
    public begin(cb: (err: Error, result?: QueryResult) => void) {
        this.executeQuery({query: "BEGIN;", parameters: []}, cb);
    }
}
