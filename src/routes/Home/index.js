'use strict';

// Node imports
const express = require('express');

const router = express.Router();


router.get(`/`, (req, res, next) => {
    const port = process.env.PORT || 3000;
    res.status(200).json({ message: 'Welcome to Tic Tac Toe API!', info: `You can find more info about this API in: 'https://localhost:${port}/api/doc'` });
});

module.exports = router;