'use strict';

// Node imports
const express = require('express');

const router = express.Router();

const { getNewPlayValidation } = require('../../middlewares/validations/PlaysValidation');
const { getNewPlay } = require('../../controllers/PlaysController');


router.get(`/`, getNewPlayValidation, getNewPlay);

module.exports = router;