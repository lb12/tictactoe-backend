'use strict';

// Node imports
const { validationResult } = require('express-validator');

// Own imports
const playsService = require('../../services/PlaysService');

const getNewPlay = (req, res, next) => {
    try {
        validationResult(req).throw();
    } catch (error) {
        return next(error);
    }

    const { board, isPlayerX } = req.body;

    const player = isPlayerX ? 'X' : 'O';
    const rival = isPlayerX ? 'O' : 'X';

    const message = playsService.getNewPlay(board, player, rival);
    res.status(200).json(message);
};


module.exports = {
    getNewPlay
}