# 1up Health Demo Web Application
Example application built using node js

## Before you start
Create an application via the 1uphealth devconsole [https://1up.health/devconsole](https://1up.health/devconsole) for testing purposes.  Use `http://localhost:3000/` for your app's callback url. Make sure you save your client secret as it'll only be shown once.

This test application defaults to localhost:3000. 

### Use of client id and secret
When ran, the test application provides html form fields that will collect credentials and provides narration needed to use the application.  

### Configurations are stored in configuration/config.js
modify the localhost values, e.g. port number, as needed

### Session state is stored in-memory, on the server
The application should not be deployed to a production environment without using client side session state. The current approach results in memory leaks when accessed by multiple users. 

## Application is not designed for production use
The application design assumes that localhost will be used to capture a development clientid, secret, and health system user information.

## Install & run the app
``````
npm install
node server.js
``````

## Access http://localhost:3000/
Accessing localhost base path will cause the application to serve up index.html. Subsequent visits to localhost base url will utalize previously stored session state information, e.g. like when a callback occurs during an OAuth sequence. 

#Please be sure to complete all steps (i.e click every green button in order)
