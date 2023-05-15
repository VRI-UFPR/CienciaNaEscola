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

import * as express from "express";
import { DbHandler } from "../utils/dbHandler";

/**
 * Extension of Express requests that suports the addition
 * of an engine and an adapter.
 * This extension is required because some Middlewares
 * add some objetcs, in this case metrics and dimensions,
 * to the Request object. To typescript compiler do not
 * return a error the extension must be made.
 */
export interface Request extends express.Request {
    userData: string | object;
    /** A Database handler instace */
    db: DbHandler;
}

/**
 * Extension Middleware function of ExpressJS Module.
 * Uses the custom Request object and is used to define
 * the middlewares.
 */
export type Middleware = (req: Request, res: express.Response, next: express.NextFunction) => void;
