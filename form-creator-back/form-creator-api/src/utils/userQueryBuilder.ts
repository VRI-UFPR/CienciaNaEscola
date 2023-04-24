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

import { eachSeries, map, waterfall } from "async";
import { Pool, PoolConfig, QueryResult } from "pg";
import { User, UserOptions } from "../core/user";
import { ErrorHandler} from "./errorHandler";
import { QueryBuilder, QueryOptions } from "./queryBuilder";

export class UserQueryBuilder extends QueryBuilder {

    constructor(pool: Pool) {
        super(pool);
    }

     /**
      * Asynchronously read a User from database.
      * @param id - User identifier to be founded.
      * @param cb - Callback function which contains the data read.
      * @param cb.err - Error information when the method fails.
      * @param cb.User - User or null if User not exists.
      */
    public read(id: number, cb: (err: Error, user?: User) => void) {

        waterfall([
            (callback: (err: Error, result?: QueryResult) =>  void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },

            (callback: (err: Error, result?: User) => void) => {
                this.readController(id, (error: Error, resultUser?: User) => {
                    callback(error, resultUser);
                });
            },

            (user: User, callback: (err: Error, result?: User) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, user);
                });
            }

        ], (err, user?: User) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                    return;
                });
                return;
            }
            cb(null, user);
        });
    }

    /**
     * Asynchronously read a User from database without transactions.
     * @param id - User identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.User - User or null if User does not exists.
     */
    private readController(id: number, cb: (err: Error, user?: User) => void) {

        this.executeReadUser(id, (error: Error, result: QueryResult) => {

            if (result.rowCount !== 1) {
                cb(ErrorHandler.badIdAmount(result.rowCount));
                return;
            }

            const userTmp: User = {
                id: result.rows[0]["id"]
                , name: result.rows[0]["name"]
                , email: result.rows[0]["email"]
                , hash: result.rows[0]["hash"]
                , enabled: result.rows[0]["enabled"]
                , forms: null
            };

            cb(error, userTmp);
        });
    }

    /**
     * Asynchronously read an User without transactions.
     * @param id - user identifier to be founded.
     * @param cb - Callback function which contains the data read.
     * @param cb.err - Error information when the method fails.
     * @param cb.user - User or null if User does not exists.
     */
    private executeReadUser(id: number, cb: (err: Error, user?: QueryResult) => void) {
        const queryString: string = "SELECT id, name, email, hash, enabled FROM form_user WHERE id=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [id]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously write a user on database.
     * @param user - User to be inserted.
     * @param cb - Callback function which contains the inserted data.
     * @param cb.err - Error information when the method fails.
     * @param cb.UserResult - User or null if user any error occurs.
     */
    public write(user: User, cb: (err: Error, user?: User) => void) {

        waterfall([
            (callback: (err: Error, result?: QueryResult) => void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: number) => void) => {
                this.writeController(user, (error: Error, resultId?: number) => {
                    callback(error, resultId);
                });
            },
            (userId: number, callback: (err: Error, result?: number) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, userId);
                });
            },
            (userId: number, callback: (err: Error, result?: User) => void) => {
                this.read(userId, (error: Error, resultUser?: User) => {
                    callback(error, resultUser);
                });
            }
        ], (err, userResult?: User) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                    return;
                });
                return;
            }
            cb(null, userResult);
        });
    }

    /**
     * Asynchronously write a user on database without transactions.
     * @param user - User to be inserted.
     * @param cb - Callback function which contains the inserted data.
     * @param cb.err - Error information when the method fails.
     * @param cb.formId - Form identifier or null if form any error occurs.
     */
    private writeController(user: User, cb: (Err: Error, userId?: number) => void) {
        waterfall([
            (callback: (err: Error) => void) => {
                this.executeVerifyEmail (user.email, (err: Error, id?: number) => {
                    callback(err);
                });
            },
            (callback: (err: Error, result?: number) => void) => {
                this.executeWriteUser(user, (error: Error, resultId?: number) => {
                    callback(error, resultId);
                });
            }
        ], (err, id: number) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, id);
        });

    }

    /**
     * Asynchronously write a user on database.
     * @param email - Email to be verified
     * @param cb - Callback function which contains the error if there is any.
     * @param cb.err - Error information when the method fails.
     */
    public executeVerifyEmail(email: string, cb: (err: Error, id?: number) => void) {
        const queryString: string = "SELECT id FROM form_user WHERE email = $1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [ email ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }

            if (result.rowCount !== 0) {
                cb(new Error("Email exists on the database."), result.rows[0]["id"]);
                return;
            }

            cb(null);
        });
    }

    /**
     * Asynchronously insert an User on database without transactions.
     * @param user - User to be inserted.
     * @param cb - Callback function which contains informations about method's execution.
     * @param cb.err - Error information when the method fails.
     * @param cb.result - User identifier or null if any error occurs.
     */
    private executeWriteUser(user: User, cb: (err: Error, result?: number) => void) {
        const queryString: string = "INSERT INTO form_user (name, email, hash, enabled) \
                                     VALUES ($1, $2, $3, $4) \
                                     RETURNING id;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                user.name
                , user.email
                , user.hash
                , user.enabled
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null, result.rows[0]["id"]);
        });
    }

    /**
     * Asynchronously update a user on database.
     * @param user- User to be updated.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    public update(userUpdate: User, id: number, cb: (err: Error) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) =>  void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: User) => void) => {
                this.executeUpdateUser(userUpdate, id, (error: Error) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: User) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            }
        ], (err) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                    return;
                });
                return;
            }
            cb(null);
        });
    }

    /**
     * Asynchronously update user's fields on database.
     * @param value - An User to be inserted in database.
     * @param id - The user id that should be updated.
     * @param cb - Callback function.
     * @param cb.err - Error information when method fails.
     */
    private executeUpdateUser(value: User, id: number, cb: (err: Error) => void) {
        const queryString: string = "UPDATE form_user SET name = $1, email = $2, enabled = $3 WHERE id = $4;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                value.name
                , value.email
                , value.enabled
                , id
            ]
        };
        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }

    /**
     * Asynchronously delete an user from database.
     * @param user- User to be deleted.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    public delete(id: number, cb: (err: Error) => void) {

        waterfall([
            (callback: (err: Error, result?: QueryResult) =>  void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },

            (callback: (err: Error, result?: User) => void) => {
                this.deleteUserController(id, (error: Error, resultUser?: User) => {
                    callback(error, resultUser);
                });
            },

            (user: User, callback: (err: Error, result?: User) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error, user);
                });
            }

        ], (err) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                    return;
                });
                return;
            }
            cb(null);
        });
    }

    private deleteUserController(id: number, cb: (error: Error, resultUser?: User) => void) {

        this.executeDeleteUser(id, (error: Error, result?: QueryResult) => {

            if (result.rowCount !== 1) {
                cb(new Error("Invalid ID, user doesn't exist."));
                return;
            }

            cb(null);
        });

    }

    private executeDeleteUser(id: number, cb: (err: Error, result?: QueryResult) => void) {
        const queryString: string = "DELETE FROM form_user WHERE id=$1;";
        const query: QueryOptions = {
            query: queryString
            , parameters: [ id ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err, result);
        });
    }

    /**
     * Asynchronously assigns an user to a form.
     * @param userId - User ID to be assigned to the form.
     * @param formId - Form ID to be assigned to the user.
     * @param cb - Callback function which contains information about method's execution.
     * @param cb.err - Error information when the method fails.
     */
    public assign(userId: number, formId: number, cb: (err: Error) => void) {
        waterfall([
            (callback: (err: Error, result?: QueryResult) =>  void) => {
                this.begin((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: User) => void) => {
                this.executeUpdateOwnerList(userId, formId, (error: Error) => {
                    callback(error);
                });
            },
            (callback: (err: Error, result?: User) => void) => {
                this.commit((error: Error, results?: QueryResult) => {
                    callback(error);
                });
            }
        ], (err) => {
            if (err) {
                this.rollback((error: Error, results?: QueryResult) => {
                    cb(err);
                    return;
                });
            }
            cb(null);
        });
    }

    /**
     * Asynchronously assigns an user to a form in the database.
     * @param userId - User ID to be assigned to the form.
     * @param formId - Form ID to be assigned to the user.
     * @param cb - Callback function.
     * @param cb.err - Error information when the method fails.
     */
    private executeUpdateOwnerList(userId: number, formId: number, cb: (err: Error) => void) {
        const queryString: string = "INSERT INTO form_owner (id_user, id_form) \
                                     VALUES ( $1, $2 );";
        const query: QueryOptions = {
            query: queryString
            , parameters: [
                userId
                , formId
            ]
        };

        this.executeQuery(query, (err: Error, result?: QueryResult) => {
            cb(err);
        });
    }

}
