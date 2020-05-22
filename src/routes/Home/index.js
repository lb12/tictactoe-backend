'use strict';

const express = require('express');
const router = express.Router();

router.get(`/`, (req, res, next) => {
    res.status(200).json({ message: 'Welcome to Tic Tac Toe API!', info: `You can find more info about this API in: 'https://localhost:3000/api/doc'` });
});

module.exports = router;