#! /bin/bash

# form-creator-api. RESTful API to manage and answer forms.
# Copyright (C) 2019 Centro de Computacao Cientifica e Software Livre
# Departamento de Informatica - Universidade Federal do Parana - C3SL/UFPR
#
# This file is part of form-creator-api.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

confFile=${1:-config/test.env}
if [[ ! (-r $confFile) ]]; then
    echo "The config $confFile does not exist."
    echo "You should create it."
    echo "Use the example files  in the config dir as example!"
    exit 1
fi

env $(cat config/test.env | grep -v '#') ts-node node_modules/istanbul/lib/cli.js cover -x \"**/*.spec.ts\" -e .ts _mocha
