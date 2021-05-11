const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
const fs = require('fs');
const util = require('./util');

const server = express();
const ticks = ((new Date().getTime() * 10000) + 621355968000000000);
const devSecret = `c88a9bd72afa4e5f956103fb3064cf4deb539553c9214e45b5f0f5949ca603204ab37e6d612e456da0f24a2b3e050976${ticks}`;

server.use(express.static(__dirname + '/components'));
server.use(express.static(__dirname + '/configuration'));
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use(session({
    secret: devSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
eval(fs.readFileSync(__dirname + '/configuration/config.js', encoding = 'ascii'))

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
})

server.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html')
})

function getPatientId(res){

}

server.get('/components/json-viewer.js', function (req, res, next) {
    res.sendFile(__dirname + '/components/json-viewer.js')
})

server.get('/components/client.js', function (req, res, next) {
    res.sendFile(__dirname + '/components/client.js')
})

server.get('/configuration/config.js', function (req, res, next) {
    res.sendFile(__dirname + '/configuration/config.js')
})

server.get('/components/json-viewer.css', function (req, res, next) {
    res.sendFile(__dirname + '/components/json-viewer.css')
})

server.get('/session', function (req, res) {
    res.json(req.session)
})

server.post('/create-1up-user', (req, res, next) => {
    postUser(config.externalServiceUrls.createUserUrl, req, res, next)
})

server.post('/generate-auth-code', (req, res, next) => {
    postUser(config.externalServiceUrls.authCodeUrl, req, res, next)
})

server.post('/exchange-for-access-token', (req, res, next) => {
    let headerConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let params = new URLSearchParams()
    params.append('client_id',req.body.client_id)
    params.append('client_secret',req.body.client_secret)
    params.append('code',req.body.code)
    params.append('grant_type', config.tokenGrantType)

    axios.post(config.externalServiceUrls.tokenUrl, params, headerConfig).then(response => {
        console.log(`Status Code: ${response.status}`)
        console.log(JSON.stringify(response.data))

        req.session.accessTokenPayload = response.data
        res.json(response.data)
    }, error => {
        console.log(`Error: ${JSON.stringify(error)}`)

        res.json(error)
    }).catch(next)
})

server.post('/connected-health-system-id-search', (req, res, next) => {
    let queryParams = {
        params: {
            client_id: req.body.client_id,
            client_secret: req.body.client_secret
        }
    }

    axios.get(config.externalServiceUrls.healthSystemUrl,queryParams)
        .then(response => {
            console.log(`Status Code: ${response.status}`)
            console.log(JSON.stringify(response.data[0]))
            let hasMatch = util.getHealthSystemById(response.data, parseInt(req.body.id))
            if(hasMatch.length > 0){
                req.session.healthSystemPayload = hasMatch[0]
                res.json(hasMatch[0])
            } else{
                res.json({
                    error: `No match found for the specified id ${req.body.id}`,
                    exampleHealthSystems: response.data.slice(0,10)
                })
            }
        }, error => {
            console.log(`Error: ${JSON.stringify(error)}`)
            res.json(error)
        }).catch(next)
})

server.post('/findPatient', (req, res, next) => {
    let headerConfig = {
        headers: {
            Authorization: 'Bearer '+ req.body.accessToken,
            Accept: 'application/json'
        }
    }

    var fhirResourcePath = util.buildFhirResourcePath(req.body.fhirVersionPath, req.body.fhirResourceType);

    axios.get(fhirResourcePath,headerConfig)
        .then(response => {
            console.log(`Status Code: ${response.status}`)
            console.log(JSON.stringify(response.data))
            req.session.patientResource = response.data.entry[0].resource;
            req.session.fhirPatientId = response.data.entry[0].resource.id
            res.json(response.data.entry[0].resource)
        }, error => {
            console.log(`Error: ${JSON.stringify(error)}`)
            res.json(error)
        }).catch(next)
})

server.post('/fetchFhirResources', (req, res, next) => {
    let headerConfig = {
        headers: {
            Authorization: 'Bearer '+ req.body.accessToken,
            Accept: 'application/json'
        }
    }

    var fhirResourcePath = util.buildFhirResourcePath(req.body.fhirVersionPath,
        req.body.fhirResourceType, req.body.fhirResourceId,
        req.body.fhirOperation, req.body.fhirQueryString,
        req.body.skip);

    axios.get(fhirResourcePath,headerConfig)
        .then(response => {
            console.log(`Status Code: ${response.status}`)
            console.log(JSON.stringify(response.data))

            req.session.fhirResources = response.data
            res.json(response.data)
        }, error => {
            console.log(`Error: ${JSON.stringify(error)}`)
            res.json(error)
        }).catch(next)
})

server.listen(config.servicePort, () => {
    console.log(`Started on ${config.localServiceBasePath}`);
    console.log(__dirname)
})

function postUser( path, req, res, next ){
    var queryParams = {
        params: {
            client_id: req.body.client_id,
            client_secret: req.body.client_secret,
            app_user_id: req.body.app_user_id
        }
    }
    axios.post(path, null, queryParams).then(response => {
        console.log(`Status Code: ${response.status}`)
        console.log(JSON.stringify(response.data))

        req.session.authCodePayload = response.data
        res.json(response.data)
    }, error => {
        console.log(`Error: ${JSON.stringify(error)}`)
        res.json(error)
    }).catch(next)
}
module.exports = server









