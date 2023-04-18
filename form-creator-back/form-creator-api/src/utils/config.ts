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

import { PoolConfig } from "pg";

class Config {
    private static instance: Config;
    private user: string;
    private host: string;
    private database: string;
    private password: string;
    private port: number;
    public readonly poolconfig: PoolConfig;

    private constructor(){
        this.user = process.env["DB_USER"];
        this.host = process.env["DB_HOST"];
        this.database = process.env["DB_NAME"];
        this.password = process.env["DB_PASSWORD"];
        this.port = parseInt(process.env["DB_PORT"], 10);
        this.poolconfig = {
           user: this.user,
           database: this.database,
           password: this.password,
           host: this.host,
           port: this.port,
           max: 10,
           idleTimeoutMillis: 3000
        };
    }

    public static get Configurations(){
        return this.instance || (this.instance = new this());
    }
}

export const configs = Config.Configurations;
