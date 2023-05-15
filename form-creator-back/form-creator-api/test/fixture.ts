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

import * as child from "child_process";
import * as fs from "fs";
import * as path from "path";

export class Fixture {
    private scriptPath: string;
    private workspacePath: string;

    constructor() {
        this.scriptPath = path.normalize(__dirname + "/../form-creator-database/psql-manager/manager.sh");
        this.workspacePath = path.normalize(__dirname + "/../form-creator-database/workspace");
    }

    public drop(cb: (err: Error) => void): void {
        const exec: child.ChildProcess = child.execFile(this.scriptPath, ["psql", "drop"], (error: Error) => {
            cb(error);
        });
    }

    public create(cb: (err: Error) => void): void {
        const exec: child.ChildProcess = child.execFile(this.scriptPath, ["psql", "create", this.workspacePath], (error: Error) => {
            cb(error);
        });
    }

    public fixture(cb: (err: Error) => void): void {
        const exec: child.ChildProcess = child.execFile(this.scriptPath, ["psql", "fixture", this.workspacePath], (error: Error) => {
            cb(error);
        });
    }
}
