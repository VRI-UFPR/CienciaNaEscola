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

export class Sorter {

    /**
     * A method to return a array sorted by placement field
     * @param array - Array with objects that have placement field
     * @returns - A sorted array by placement
     */
    public static sortByPlacement(array: any[]): any[] {

        const sortedByPlacementArray: any[] = array.sort((obj1, obj2) => {
            if (obj1["placement"] > obj2["placement"]) {
                return 1;
            }

            if (obj1["placement"] < obj2["placement"]) {
                return -1;
            }

            return 0;
        });

        return sortedByPlacementArray;
    }

    /**
     * A method to return a array sorted by id field
     * @param array - Array with objects that have id field
     * @returns - A sorted array by id
     */
    public static sortById(array: any[]): any[] {

        const sortedByIdArray: any[] = array.sort((obj1, obj2) => {
            if (obj1["id"] > obj2["id"]) {
                return 1;
            }

            if (obj1["id"] < obj2["id"]) {
                return -1;
            }

            return 0;
        });

        return sortedByIdArray;
    }

    /**
     * A method to return a array sorted by inputId field
     * @param array - Array with objects that have id field
     * @returns - A sorted array by id
     */
    public static sortByInputId(array: any[]): any[] {

        const sortedByInputIdArray: any[] = array.sort((obj1, obj2) => {
            if (obj1["inputId"] > obj2["inputId"]) {
                return 1;
            }

            if (obj1["inputId"] < obj2["inputId"]) {
                return -1;
            }

            return 0;
        });

        return sortedByInputIdArray;
    }
}
