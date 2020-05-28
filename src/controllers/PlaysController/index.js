'use strict';

// Node imports
const { validationResult } = require('express-validator');

// Own imports
const playsService = require('../../services/PlaysService');
const dictionaryCodes = require('../../utils/dictionary-codes');

const getNewPlay = (req, res, next) => {
    try {
        validationResult(req).throw();
    } catch (error) {
        return next(error);
    }

    const { board, isBotX } = req.body;

    const bot = playsService.getBotSide(isBotX);
    const rival = playsService.getRivalSide(isBotX);
    
    let gameStatus = playsService.getGameStatus(board, bot, rival);

    if (gameStatus !== dictionaryCodes.gameStatus.GAME_IN_PROGRESS) {
        return res.status(200).json({ board, gameStatus });
    }

    if (!playsService.isBotTurnValid(board, isBotX)) {
        return res.status(422).json({ board, error: dictionaryCodes.gameStatus.INVALID_TURN });
    }
    const newBoard = playsService.getNewPlay(board, bot, rival);
    gameStatus = playsService.getGameStatus(newBoard, bot, rival);
    
    res.status(200).json({ board: newBoard, gameStatus });
};


module.exports = {
    getNewPlay
}