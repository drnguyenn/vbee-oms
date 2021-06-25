# Express Boilerplate

This Express boilerplate for building RESTful APIs and microservices using Node.js, Express and MongoDB

## Requirements

- [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node](https://nodejs.org/en/download/) (or [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/))

**Notes**: You can skip installing Docker Compose as it is already included along with Docker Desktop for Windows.

## Getting Started

### Installation

- First, fork [this repository](https://github.com/minhqp/express_boilerplate.git) and clone it to your local machine (replace `YOUR_USERNAME` with your Github account's username).

```bash
$ git clone https://github.com/YOUR_USERNAME/express_boilerplate.git
$ cd express_boilerplate
```

- Then, run the following command to install dependencies and go grab a cup of water 🥤 while waiting for it to finish (it will take a few minutes):

```bash
$ npm install
```

- Once the command finishes, run this command to se environment variables:

```bash
$ cp env .env

# open .env and modify the environment variables (if needed)
```

### Running

- Running Locally

```bash
$ npm run dev
```

- Running in Production

```bash
$ npm start
```

## Project Structure

```
src\
 |--configs\        # Environment variables and configuration related things
 |--constants       # Const variables which can be used in the whole project
 |--controllers\    # Route controllers (controller layer)
 |--daos\           # Data access object
 |--errors\         # Custom error handling
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--index.js        # App entry point
```

### Configs

The config folder defines the environment variables for the project e.g. SERVER_PORT, API Keys, database string connections etc. This could be load from `.env` file, however, I like to add an extra step, I use an object to store the variables.

Configs which are common in whole project should be defined in `configs/index.js`. Different modules in project should have self-contained config files. While creating new config files, in the mind that self-contained config files will help in scaling the application as well as make it more maintainable.

### Constants

The constants folder defines the const variables for the project e.g. ROLE.

> DO NOT include sensitive information like credentials of database in the constants, they should be defined in the .env file which is explained.

Constants which are common in whole project should be defined in `constants/index.js`. Constants which are specific for modules should be defined in self-contained constant files.

### Models

The models define the structure of database. Each model should write into own file e.g. User model in `models/user.js`. Check the [documentation](https://mongoosejs.com/docs/guide.html) for more details on how to write mongo schema.

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('User', UserSchema);
```

### Daos

The daos folder define the functions you can use to manipulate the data. All the CRUD operations for models are taken care of in this folder. This directory makes unit testing easier when you need to test a database query, you just need to test at the dao.

### Services

The services folder contain all the business logic of your application. For example, logic that encapsulates your business requirements, calls your dao, calls APIs external to the Node application. And in general, contains most of your algorithmic code.

### Controllers

The controllers folder contains controller files which control the service calls and take the request and send the response as well.

> DO NOT put your business logic inside the controllers.

When you put your business logic inside the controllers, unit testing becomes difficult. For example, you want to test a service, instead of just caring what the input includes variables, what the expect output, you must care the body, header and params.

### Routes

The routes folder contain route files, where Routing refers to how an application’s endpoints (URIs) respond to client requests. It basically defines your app routes.

### Errors

The project has a centralized error handling mechanism.

The error handling sends an error response, which has the following format:

```json
{
  "code": 1001,
  "message": "User is not found"
}
```

The app has a CustomError class to which you can attach a response code and a message, and then throw it from anywhere.

For example, if you are trying to get a user from the DB who is not found, and you want to send a 1001 error, the code should look something like:

```javascript
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const UserDao = require('../daos/user');

const getUser = async email => {
  const user = await UserDao.find({ email });
  if (!user) throw new CustomError(errorCodes.INVALID_CREDENTIALS);
};
```

### Middlewares

The middlewares folder contains any common functions that are needed across routes. All the middlewares should be a function which takes either (req, res, next) or (err, req, res, next) as argument.

Example: To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
quire('../controllers/auth');

/* eslint-disable prettier/prettier */
router.get(
  '/auth/verify',
  auth,
  asyncMiddleware(UserController.verifyAccessToken)
);
/* eslint-enable prettier/prettier */

module.exports = router;
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the login (`POST /api/v1/auth/login`) endpoints.

An access token is valid for a week. You can modify this expiration time by changing the `JWT_EXPIRATION_TIME` environment variable in the .env file.

### Validation

Request data is validated using `express-validator`. Check the [documentation](https://express-validator.github.io/docs/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes.

```javascript
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { loginValidate } = require('../validations/auth');
const UserController = require('../controllers/auth');

/* eslint-disable prettier/prettier */
router.post(
  '/auth/login',
  loginValidate,
  asyncMiddleware(UserController.login)
);
/* eslint-enable prettier/prettier */

module.exports = router;
```

### Utils

The utils folder contain functions that are used frequently in the project. For example, we have `utils/random.js`, that a function is responsible for generating the random string. These are general enough - and reusable enough - that they deserve to go in their own folder.

## Contribution Workflow

To start contributing to this project, you first need to fork this repository and clone it to your local machine. Each time you want to change something, do the following steps:

- Create a new branch named `task/{sort_name}/{sub_name}` or `bugfix/{sort_name}/{sub_name}` or `refactor/{sort_name}/{sub_name}`.
- Commit your changes (1-3 commits/merge request). Prefix your commit messages with the type of the issue, e.g. _task: Added mobile responsiveness_.
- Open a new merge request, from source branch `task/{sort_name}/{sub_name}` to target branch `master`. Also prefix your merge request's title with the type of the issue.
- Ping reviewers to review your merge request.

After your merge request has been accepted, sync your repository with the `upstream` repository (you need to [specify the remote `upstream` repository](https://help.github.com/en/articles/configuring-a-remote-for-a-fork) first):

```bash
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```
