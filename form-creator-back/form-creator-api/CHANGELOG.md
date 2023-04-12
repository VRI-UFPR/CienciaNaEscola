# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## 1.2.7 - 13/10/2020
## Added
- Property times added to form table #80 (Richard Heise)


## 1.2.6 - 19/06/2020
## Added
- A extra function on optHandler to better handle form edits #77 (Richard Heise)


## 1.2.5 - 02/06/2020
## Changed
- Route to list forms now returns all the dates and answers of the forms #75 (Richard Heise)
- Added two extras steps on route waterfall using eachSeries.
- Tests weren't changed since the steps where tested by themselfs in other routes.


## 1.2.4 - 01/06/2020
## Added
- Created route to get modified dates of a form #76 (Richard Heise)
- Created methods to communicate with the DB


## 1.2.3 - 29/04/2020
## Changed 
- Api to create a subform input without needing input ID from body #73 (Richard Heise)
- OptHandler to not return error when there's no input ID
- Subform in core/ to have an optional input ID


## 1.2.2 - 07-04-2020
## Added 
- Route to return the number of answers in a form #72 (Richard Heise)


## 1.2.1 - 05-03-2020
## Added
- Cors to integrate front-end with back-end #68 (Richard Heise)
### Changed
- Minor route order changes on main.ts to make it more intuitive
- Port on config.env from 3000 to 3333 for integration purpose


## 1.2.0 - 19-02-2020
### Changed
- Created a stable version with user


## 1.1.13 - 10-02-2020
### Added
- Route to read Form Answer #66 (Richard Heise & Gianfranco)
- Method to get IDs from form answers from a form
- Read all answers from a form
- Scenario form test to read


## 1.1.12 - 04-02-2020
### Added
- Route to update an user #65 (Richard Heise)
## Changed 
- Opthandler can create user without hash
- UserQueryBuilder Update now needs an id
- UserOptions hash is not obrigatory


## 1.1.11 - 04-02-2020
## Changed
- Form controller update route to verify if a user own the form #62 (Gianfranco)


## 1.1.10 - 03-02-2020
### Added
- Route to list forms #61 (Richard Heise)
## Changed
- List from FormQueryBuilder now lists an user's forms


## 1.1.9 - 03-02-2020
### Added
- Route to change an user's password #63 (Richard Heise)
## Changed
- Delete route now has the token validation


## 1.1.8 - 30-01-2020
### Added
- Route to assign users to forms #60 (Richard Heise)
## Changed
- Route to write a form now has an extra stage in the waterfall
- This stage assigns the user to a form by ID


## 1.1.7 - 29-01-2020
### Added
- Function to assign users to forms #54 (Gianfranco)
- Assign added to userQueryBuilder file


## 1.1.6 - 24-01-2020
### Added
- Middleware to validate tokens #56 (Richard Heise)
- Route do delete an user #59 (Richard Heise)
- Delete control methods on UserQueryBuilder
## Changed
- Initial user tests are now on the form.spec.ts


## 1.1.5 - 22-01-2020
### Added
- SubForm class #57 (Gianfranco)
- InputType SubForm
- FormQueryBuilder methods to handle with SubForms
- AnswerQueryBuilder methods to handle with SubForms answers
- OptHandler method to validate SubForm
- TestHandler method to compare two SubForms
- Database table for SubForms
## Changed
- Input class to contain a SubForm object
- OptHandler methods to handle SubForms Answers
- Scenario file with new objects to test SubForms
- TestHandler method to compare two SubFormsAnswer


## 1.1.4 - 19-12-2019
### Added
- SignIn route to possibilitate logins #55 (Richard Heise)
- JWT (Json Web Token) library and its types to dependencies
- Tokens can be created once an user is considered valid
## Changed
- UserQueryBuilder has, now, a public function to verify if an email is in the DB
- The requires are now imports for padronization reasons


## 1.1.3 - 12-12-2019
### Added
- UserCtrl class created to control the user routes #52 (Richard Heise)
- The bcrypt library and its types to dependencies
- User route tests
### Changed
- User Query Builder now has writeController to validate an unique email user in the database


## 1.1.2 - 25-11-2019
### Added
- User class to create an user object #53 (Richard Heise)
- User Query Builder to write, read and update an user in the database
- User tests
- An user table in the database


## 1.1.1 - 17-10-2019
### Added
- Fixture class to manage the database #49 (Gianfranco)
- Database module inside the api
- Before test to call fixture class
### Changed
- Database to work with usql-manager
- Config class to receive the new parameters


## 1.1.0 - 11-10-2019
### Changed
- Create a stable version


## 1.0.10 - 10-10-2019
### Added
- Validation type DEPENDENCY #41 (Gianfranco)
### Changed
- ValidateInput method to receive a vector of inputs


## 1.0.9 - 09-10-2019
### Added
- Validation type MAXANSWERS #38 (Gianfranco)


## 1.0.8 - 08-10-2019
### Added
- Validation type SOMECHECKBOX #39 (Gianfranco)
### Changed
- ValidateInput method to receive a vector of input answers


## 1.0.7 - 01-10-2019
### Added
- Validation type TYPEOF #37 (Gianfranco)


## 1.0.6 - 30-09-2019
### Added
- QueryBuilder Class #47 (Gianfranco)
- FormQueryBuilder Class #47
- AnswerQueryBuilder Class #47
### Changed
- DbHandler to only have database connections


## 1.0.5 - 27-09-2019
### Added
- Input type Select #36 (Gianfranco)


## 1.0.4 - 26-09-2019
### Added
- Input type Radio #35 (Gianfranco)


## 1.0.3 - 24-09-2019
### Changed
- Refactor DbHandler #46 (Gianfranco)
- Fix api routes
- Set false to max-classes-per-file on tslint


## 1.0.2 - 27-08-2019
### Added
- Input type Checkbox #34 (Gianfranco)
- Sugestions for input answers
### Changed
- OptHandler to validate Sugestions
- DbHandler to insert Sugestions on database


## 1.0.1 - 20-08-2019
### Added
- DbHandler methods to update form table #42 (Gianfranco)
### Changed
- FormUpdate to receive a options changed
- DiffHandler to recognize changes on forms


## 1.0.0 - 19-08-2019
### Changed
- Create a stable version


## 0.0.27 - 15-08-2019
### Added
- DbHandler methods to update database #32 (Gianfranco)
- Reenabled UpdateType on EnumHandler wich reenabled a input
- Update route tests
### Changed
- writeInputWithFormId method to return the id
- readInputWithFormId to not list the disabled inputs
- Fix tests of DiffHandler and DbHandler class
- DiffHandler to detect reenabled requests
- Update route to call the updateDatabase method


## 0.0.26 - 26-07-2019
### Changed
- Write form route to create a formUpdate on create a new form #33 (Gianfranco)
- Fix DiffHandler to add inputs with id
- Fix tests of DiffHandler, OptHandler and Form route


## 0.0.25 - 25-07-2019
### Changed
- Renamed routes from 'forms' to 'form' #31 (Gianfranco)


## 0.0.24 - 23-07-2019
### Added
- DiffHandler to find out the differences between two forms (Gianfranco)
- Sorter with methods to sort arrays
- DiffHandler and Sorter tests
### Changed
- Main archive to add an update route #27
- Api controller to update forms
- TestHandler to test two FormUpdate objects


## 0.0.23 - 10-07-2019
### Changed
- FormUpdate to receive an Form class (Gianfranco)
- InputUpdate to receive an Input class
- FormUpdate to receive an array of inputs
- OptHandler to handle with the new features


## 0.0.22 - 09-07-2019
### Added
- Created a new enum UpdateType (Gianfranco)
- Add stringfy and parse methods to UpdateType


## 0.0.21 - 01-07-2019
### Added
- Add InputUpdate and a FormUpdate Class to store updates from inputs and forms #26 (Gianfranco)
- Create writeFormUpdate method to insert a FormUpdate into database
- Create writeInputUpdate method to insert a InputUpdate into database
- Create updateForm method to unify writeFormUpdate and writeInputUpdate methods
- Create inputUpdate method in OptHandler
- Create formUpdate method in OptHandler


## 0.0.20 - 28-06-2019
## Changed
- Class Input to receive a Enabled atribute (Gianfranco)


## 0.0.19 - 12-06-2019
### Added
- A route to POST a form Answer #21 (Horstmann)
- Create ValidationError Class that extends error class, with the objective to return a dictionary of invalid answers (Horstmann)
### Changed
- DbHandler's tests to suite with new forms answers added (Horstmann)
- ValidationHandler to validate a Forms Answer instead of inputsAnswer
- ValidationHandler's tests to suite new method to validate a Forms Answer


## 0.0.18 - 25-05-2019
### Added
- Create readFormAnswer method to read formAnswer from database #24 (Horstmann)
- Create writeFormAnswer method to insert formAnswer into database #24 (Horstmann)
- Create TestHandler to tests FormAnswers
### Changed
- Fix OptHandler to return id in inputAnswer


## 0.0.17 - 25-05-2019
### Added
- inputAnswer method in OptHandler #23 (Horstmann)
- formAnswer method in OptHandler #23 (Horstmann)

### Changed
-  FormsAnswer class to have an dictionary of InputsAnswer
-  FormsAnswer's constructor to use dictionary


## 0.0.16 - 06-05-2019
### Added
- A FormsAnswer Class to store answers from forms #22 (Horstmann)
- A inputsAnswer Class to be the answer for each input in form #22 (Horstmann)
### Changed
-  Form's  constructor documentation
-  Input's  constructor documentation


## 0.0.15 - 26-04-2019
### Added
- A QueryOptions interface, that is used on dbHandler's executeQuery #20
### Changed
-  dbHandler's tests to fit into new interface
### Security
- Now dbHandler's executeQuery uses parametrized query to avoid SQL injection


## 0.0.14 - 26-04-2019
### Removed
- Dummies files as Item and Collection #16 (Horstmann)


## 0.0.13 - 26-04-2019
### Added
- A route to POST a form #10 (Horstmann)
- Tests on route POST (Horstmann)
### Changed
- dbHandler's tests to suit with new forms and inputs insertion


## 0.0.12 - 25-04-2019
### Added
- OptHandler to standardize constructors from Forms and Inputs #19 (Horstmann)
- InputOptions  interface on class Input #19 (Horstmann)
- FormOptions  interface on class Form #19 (Horstmann)
### Changed
- Tests to adapt to new standard of options
- dbHandler's readInputValidationWithInputId method to return a InputOptions instead of an input
- Tests to adapt to new standard of options
- ErrorHandler to add a new error message



## 0.0.11 - 17-04-2019
### Added
- ErrorHandler to standardize errors message through the project #17 (Horstmann)
### Changed
- TestHandler documentation title
- dbHandler tests to use ErrorHandler #18 (Horstmann)


## 0.0.10 - 16-04-2019
### Added
- TestHandler to test form and inputs #18 (Horstmann)
### Changed
- controller form tests to use testHandler #18 (Horstmann)
- controller form to improve code coverage
- dbHandler tests to use testHandler #18 (Horstmann)
- ValidationType to has as arguments an array of strings
- ValidationHandler to receive a string as size instead number as validation arguments
- ValidationHandler to cast size to number
- ValidationHandler tests to use string instead of number as validation arguments


## 0.0.9 - 10-04-2019
### Added
- Method read in Form controller to get a Form


## 0.0.8 - 10-04-2019
### Changed
- main.ts to remove more dummie class
- dbHandler to include method listForms
### Added
- Form controller and method to list all forms


## 0.0.7 - 10-04-2019
### Changed
- main.ts to include dbHandler Middleware and remove dummie class
### Added
- Create dbHandler Middleware to be able to access by routes #15 (Horstmann)


## 0.0.6 - 01-04-2019
### Changed
- Input class to match with database model (Add id and description) (Horstmann)
- Form class to match with database model (Remove version add description) (Horstmann)
- enumHandler to remove sides whitespaces (Horstmann)
### Added
- Create readForm method to read form from database #7 (Horstmann)
- Create readInput method to read input from database #7 (Horstmann)
- Create writeForm method to insert form into database (Horstmann)
- Comments to coverage ignore errors that are not reached on tests.


## 0.0.5 - 19-03-2019
### Changed
- Remove tslint-stylish from package.json, package is deprecated (Horstmann)
- Update yarn.lock to avoid vulnerabilities (Horstmann)
- Update CI file to handle database (Horstmann)
### Added
- Class config using singleton patern, to centralize all configuration in one module (Horstmann)
- DbHandler to be a layer between API and database #1 (Horstmann)

## 0.0.4 - 12-02-2019
### Added
- Class Form #3 (Horstmann)


## 0.0.3 - 07-02-2019
### Changed
- Added a new type of enum ValitationType #2 (Horstmann)
### Added
- ValidationHandle to valited answer given a input #2 (Horstmann)


## 0.0.2 - 05-02-2019
### Added
- EnunHandler to handle types of inputs #4 (Horstmann)


## 0.0.1 - 04-02-2019
### Added
- This CHANGELOG file to hopefully serve as an evolving example of a  standardized open source project CHANGELOG.
- CI file to enable Gitlab Continuous Integration.
- Docker files, as Dockerfile and docker-compose, to make easy development and Deploy #6 (Horstmann).
- Update Node to 10.* #6 (Horstmann).
