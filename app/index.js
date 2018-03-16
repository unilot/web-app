// Requires
const config = require('../config');
const express = require('express');
const popsicle = require('popsicle');
const fs = require('fs');
const path = require('path');

// Server setup
const port = process.env.PORT || 3000;
const app = express();
    
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
      url: `${config.url}/o2/token/`,
      body: {
        client_id: config.client_id,
        client_secret: config.client_secret,
        grant_type: 'client_credentials'
      }
    })
    .use(popsicle.plugins.parse('json'))
    .then((response) => {
      if(response.status === 200) {
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

app.get('/token/', (request, response) => {
  getClientConfig()
    .then(getAuthToken)
    .then((result) => {response.send(result)})
    .catch((error) => {response.send(error)})  
});

// Start server
app.use(express.static(path.dirname(__dirname) + '/' + config.webroot));
app.use(express.static(path.dirname(__dirname) + '/' + config.webroot));

app.listen(port);
console.log(`Server listening to port ${port}`);