'use strict';

// Node import
const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerConfig = YAML.load("./swagger.yaml");

// Own imports
const { HomeRouter, PlaysRouter } = require('./routes');
const { ErrorMiddleware } = require('./middlewares');

// App express
const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use(`/api/plays`, PlaysRouter)
app.use([`/api`, `/`], HomeRouter);
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use(ErrorMiddleware);

module.exports = app;