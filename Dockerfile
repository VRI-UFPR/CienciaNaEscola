# Copyright (C) 2024 Laboratorio Visao Robotica e Imagem
# 
# Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR
# 
# This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the
# GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
# version. CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
# of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>

FROM node:20-alpine

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY uploads /app/uploads

# Define a variável de ambiente para a porta
ENV PORT=3001

EXPOSE 3001

# Os comandos a seguir são necessários somente caso o compose não seja utilizado
# RUN npm install

# CMD ["npm", "start"]