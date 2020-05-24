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

    const { board, isPlayerX } = req.body;
 
    const player = playsService.getPlayerSide(isPlayerX);
    const rival = playsService.getRivalSide(isPlayerX);
    
    let gameStatus = playsService.getGameStatus(board, player, rival);

    if (gameStatus !== dictionaryCodes.gameStatus.GAME_IN_PROGRESS) {
        return res.status(200).json({ board, gameStatus });
    }

    const newBoard = playsService.getNewPlay(board, player, rival);
    gameStatus = playsService.getGameStatus(newBoard, player, rival);
    
    res.status(200).json({ board: newBoard, gameStatus });
};


module.exports = {
    getNewPlay
}