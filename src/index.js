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
  key: fs.readFileSync(process.env.KEY_FILE_PATH),
  cert: fs.readFileSync(process.env.CERT_FILE_PATH)
};

const server = https.createServer(certs, app);
const port = process.env.PORT || 3000;

server.listen(port, console.log(`OK - API server is running on port ${port}`));