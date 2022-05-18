## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows download and install manually [Node.js](https://nodejs.org/en/download/)

Install yarn globally

```bash
npm install --global yarn
```

Install MongoDB database.

- on OSX follow [MongoDB](https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-os-x/)
- on Windows download and install manually [MongoDB](https://www.mongodb.com/try/download/community)

Install redis database.

- on OSX follow [Redis](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)`brew install redis`
- on Windows you need docker to install redis. Follow [Installation](https://docs.docker.com/desktop/windows/install/) docs.

### Step 2: Prepare Project

- Clone this project. Configure your package.json for your new project.
- Then copy the `.env.example` file and rename it to `.env`.
- Add database urls and fill all the env variables
- Create a new database with the name you have in your `.env` file.

### Step 3: Serve your App

```bash
yarn && yarn dev
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the server according to these changes.
> The server address will be displayed to you as `http://127.0.0.1:4000`.

## ❯ Scripts and Tasks

### Install

- Install all dependencies with `yarn install`

### Type Checking

- Run code type checking using `yarn type-check`. This runs tsc.

### Linting

- Run code quality analysis using `yarn lint`. This runs eslint.
- There is also a linting fix task available `yarn lint-fix`.

### Formatting

- Run code formatting analysis using `yarn format`. This runs prettier.
- There is also a formatting fix task available `yarn format-fix`.

### Building the project and run it

- Run `yarn build` to generated all JavaScript files from the TypeScript sources.
- To start the builded app located in `dist` use `yarn start`.

## ❯ API Routes

The route prefix is `/api` by default, but you can change this in the `.env` file `APP_ROUTE_PREFIX`.

## ❯ Logging

Our logger is [winston](https://github.com/winstonjs/winston). To log http request we use the express middleware [morgan](https://github.com/expressjs/morgan).
We created a simple logger for log our project logs (see example below).

```typescript
import logger from '@lib/logger';

logger.info('From Logger');
```

## ❯ License

[MIT](/LICENSE)
