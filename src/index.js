'use strict';

// Node imports
const https = require('https');
const fs = require('fs');

// Load env variables
require('dotenv').config();

// Create server application and start server
const app = require('./app');

// Prepare certs
const certs = {
  key: fs.readFileSync('./certs/example.com+5-key.pem'),
  cert: fs.readFileSync('./certs/example.com+5.pem')
};

const server = https.createServer(certs, app);
const port = process.env.PORT || 3000;

server.listen(port, console.log(`OK - API server is running on port ${port}`));