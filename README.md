# SpaceSpot

This is the React front-end project for SpaceSpot.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Setup

(1) Add a Personal Access Token in Github for Spacespot (if you don't have one already for Spacespot, you may also be able to use your current GL token if you have the PW):

(a) Click your profile picture dropdown, and click on "Developer Settings" on the left hand sidebar
(b) Go to "Personal access tokens"
(c) Generate a new token (selected options should be at a minimum "repo", but other options may apply as well (i.e., write:packages, admin:org, admin:repo_hook))
(d) Copy the token generated (it will be a string).  This will be your password when you authenticate to NPM.
(e) Enable SSO by clicking on the Enable SSO button, go through normal SSO login to enable your token

(2) Once you have a token password to setup, issue the following command at the root of the project:

npm login --registry=https://npm.pkg.github.com --scope=@cbreenterprise

You will be prompted with a username, password, and e-mail.  
- For username, use your cbre username (i.e., mine was rshaughnessy)
- For password, use the Personal Access Token generated in step (1) or your existing PAT if it works
- For e-mail, enter your CBRE e-mail address

(3) Once you have authenticated properly, you can install the libraries needed for the front end:

- at root, issue the following command: 

`yarn`

Alternatively, you can use npm install and it should work, yarn is preferred for front end packages generally.

(4) Now we need to ensure the node.js server that will be used to proxy requests has it's packages setup.

- cd to the "proxy" folder (i.e, `cd proxy`)
- issue the following command:

`npm install`

(5) Your environment should now be setup and ready to go.


## Available Scripts

In the project directory, you can run:

### `yarn start`

```
yarn start
```

alternatively

### `npm start`


Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npx majestic`

Launches the test runner in graphic mode

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## E2E tests

We are using webdriver.io for E2E testing.

### Launch E2E tests

```
yarn run e2e
```

## Docker & deployment

A Docker image can be built for production with:

```
docker build -f Docker/Dockerfile-prod -t cbredigitalspain/spacespot:webapp --build-arg Environment=dev --build-arg TOKEN=<github-personal-token> .
```

The image can be run with:

```
docker run -p 443:443 -p 80:80 -d cbredigitalspain/spacespot:webapp
```

## Analyze bundle

```
npx source-map-explorer build/static/js/*.js
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Service name conventions

### API

For API calls use:

(get|put|post){Entity}

### Selectors

For the store selectors use:

attrName(store)

The selectors should be default-exported as an object

### Actions

For the actions use:

(get|create|update|...verb)

Each one with its respective success / error

The actions should be default-exported as an object too

### Sagas

Use:

{get|create|update|... verb}{Entity}Saga
