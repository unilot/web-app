// Requires
const path = require('path');
const express = require('express');
const cors = require('cors');
const popsicle = require('popsicle');
const fs = require('fs');

// Server setup
var port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
    
// Functions for API auth
function getClientConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('config.json', (error, config) => {
      if(error) {reject(error)}
      else {resolve(JSON.parse(config))}
    })
  })
}

function getAuthToken(config) {
  return new Promise((resolve, reject) => {
    popsicle.request({
      method: 'POST',
      url: config.url,
      body: {
        client_id: config.client_id,
        client_secret: config.client_secret,
        grant_type: 'client_credentials'
      }
    })
    .use(popsicle.plugins.parse('json'))
    .then((response) => {
      if(response.status == 200) {
        resolve(response.body.access_token);
      }
      else {
        reject(`[${response.status}] ${response.statusText}`);
      }
    })
    .catch((error) => {
      reject(`[${error.code}] ${error}`);
    });
  });
}

// Working with CORS
var corsOptions = {
  origin: 'https://dev.unilot.io',  //TODO: move to config
  optionsSuccessStatus: 200
}

// Routes
app.get('/', cors(corsOptions), (request, response) => {
  response.render('index')
});

app.get('/token/', (request, response) => {
  getClientConfig()
    .then(getAuthToken)
    .then((result) => {response.send(result)})
    .catch((error) => {response.send(error)})  
});

// Start server
app.listen(port);
console.log(`Server listening to port ${port}`);