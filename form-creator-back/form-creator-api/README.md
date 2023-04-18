# Form Creator API
[![Build Status](https://gitlab.c3sl.ufpr.br/simmctic/form-creator/form-creator-api/badges/master/pipeline.svg)](https://gitlab.c3sl.ufpr.br/simmctic/form-creator/form-creator-api/commits/master)
[![Coverage Report](https://gitlab.c3sl.ufpr.br/simmctic/form-creator/form-creator-api/badges/master/coverage.svg)](https://gitlab.c3sl.ufpr.br/simmctic/form-creator/form-creator-api/commits/master)

RESTful API used to manage and answer forms.

Backend installation instructions:

- Be sure your system is 64-bits or Docker will not work.
- Git clone this repo, doesn't matter if it's done with SSH or HTTPS.
- Use $~ git submodule update --init --recursive command to pull the database submodule inside the project.
- Use $~ sudo apt install docker.io command to install Docker.
- Use $~ sudo apt install docker-compose command to install docker-compose.
- Use $~ mv .env.example .env command to set the env file.
- Use $~ cd config/ command and then $~ mv config.env.example config.env commando to set config env.
- Use $~ cp config.env test.env to copy the env to the test env.
- Use $~ vim(vi) test.env and change the port to 3001, for example (optional so tests don't break).
- Use $~ sudo docker-compose up --build to run docker.
- If everything worked out good there'll be a message "server listening on port 3000".
- Open a new terminal, go to the form-creator-api directory and execute $~ sudo docker exec -it formcreatorapi_form-creator-api-backend_1 bash.
- Now, inside this backend docker, run $~ yarn run test.
- Use $~ sudo docker exec -it form-postgres bash, then type psql -U postgres on this docker that just opened.
- You are, now, inside postgreSQL, you can use \dt command to list all tables, be sure you have 13.
- That's it, backend installed.

## Objective

The main objective of this project is create a *Web Service* which allows users
to create and update its own forms offering the following features.

If you want to update a VM follow the steps described on issue #67 (in portuguese): https://gitlab.c3sl.ufpr.br/simmctic/form-creator/form-creator-api/issues/67 

* Versionable
    * The form can be updated, and answers of several versions are stored.
* Validable
    * The forms can contain constraints and only valid answers are stored.
