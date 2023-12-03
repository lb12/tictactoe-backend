'use strict';

// Node imports
const http = require('http');

// Load env variables
require('dotenv').config();

// Create server application and start server
const app = require('./app');

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, console.log(`OK - API server is running on port ${port}`));