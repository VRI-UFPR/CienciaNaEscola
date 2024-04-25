FROM node:20-alpine

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

# Define a variável de ambiente para a porta
ENV PORT=3001

EXPOSE 3001

# Os comandos a seguir são necessários somente caso o compose não seja utilizado
# RUN npm install

# CMD ["npm", "start"]