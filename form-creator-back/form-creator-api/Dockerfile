FROM node:12-buster-slim

# Set an environment variable to store where the app is installed to inside of the Docker image.
ENV WORKSPACE="/app"
RUN mkdir -p $WORKSPACE

# Change WORKSPACE owner
RUN  chown -R node:node $WORKSPACE

# Install psql
RUN apt-get update -q -y
RUN apt-get install wget gnupg -y
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg 11 main" > /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get install -y postgresql-client-11 make gcc g++ python
# ENV POSTGRES_HOST_AUTH_METHOD=trust
RUN echo POSTGRES_HOST_AUTH_METHOD

# This sets the context of where commands will be ran in and is documented
# on Docker's website extensively.
# Set app directory
WORKDIR $WORKSPACE

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

# RUN npm install
# RUN npm rebuild bcrypt --build-from-source


RUN  yarn install --non-interactive
# If you are building your code for production
# RUN yarn install --production --frozen-lockfile --silent --non-interactive


# Bundle app source
COPY --chown=node:node . .


EXPOSE 3333


CMD [ "yarn", "start" ]