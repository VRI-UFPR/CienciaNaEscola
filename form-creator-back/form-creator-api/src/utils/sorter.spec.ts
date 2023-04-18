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

import { expect } from "chai";
import { sortScenario } from "../../test/scenario";
import { Sorter } from "./sorter";

describe("Sorter", () => {

    it("should sort objects with placement option", (done) => {
        const resArray: any[] = Sorter.sortByPlacement(sortScenario.sortByPlacementRandom);
        const expArray = sortScenario.orderedPlacement;
        for (let i = 0; i < resArray.length; i++) {
            expect(resArray[i].placement).to.be.equal(expArray[i].placement);
        }
        done();
    });
});
