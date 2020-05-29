'use strict';

const { gameStatus } = require('../../utils/dictionary-codes');
const TicTacToe = require('../../lib/tictactoe');
const BOARD_SIZE = process.env.BOARD_SIZE || 3;

let ticTacToe;


const getBotSide = isBotX => isBotX ? 'X' : 'O';
const getRivalSide = isBotX => getBotSide(!isBotX);


const getGameStatus = (board, bot, rival) => {
    ticTacToe = new TicTacToe(board, BOARD_SIZE);

    const botIndexes = ticTacToe.getPlayerIndexes(bot);
    const rivalIndexes = ticTacToe.getPlayerIndexes(rival);

    let result;

    result = ticTacToe.hasPlayerWon(botIndexes, bot);

    if (!result) {
        result = ticTacToe.hasPlayerWon(rivalIndexes, rival);
    }

    if (!result && !ticTacToe.isGameFinished()) {
        return { gameStatus: gameStatus.GAME_IN_PROGRESS, winnerCombination: [] };
    }

    if (!result) {
        result = { gameStatus: gameStatus.DRAW, winnerCombination: [] };
    }

    return result;
}


const isBotTurnValid = (board, isBotX) => {
    ticTacToe = ticTacToe || new TicTacToe(board, BOARD_SIZE);

    const botIndexes = ticTacToe.getPlayerIndexes(getBotSide(isBotX));
    const rivalIndexes = ticTacToe.getPlayerIndexes(getRivalSide(isBotX));

    const botPlayedLastTime = (isBotX && botIndexes.length > rivalIndexes.length) || 
        (!isBotX && botIndexes.length === rivalIndexes.length);
    
    return !botPlayedLastTime;
}


/**
 * Realiza una jugada por el bot en el tablero pasado
 * 
 * @param board tablero actual
 * @param bot jugador que hay que generar una jugada (X ó O)
 * @param rival jugador rival al que nos enfrentamos (X ó O)
 * 
 * @returns tablero con la nueva jugada añadida
 */
const getNewPlay = (board, bot, rival) => {
    ticTacToe = new TicTacToe(board, BOARD_SIZE);
    
    const botIndexes = ticTacToe.getPlayerIndexes(bot);
    const rivalIndexes = ticTacToe.getPlayerIndexes(rival);

    let playedIndex = -1;

    // Comprobar si podemos hacer una jugada de victoria: 
    playedIndex = ticTacToe.obtainWinnerPoint(botIndexes, rivalIndexes);
    
    
    // Si no, comprobar si podemos hacer una jugada para evitar una derrota
    if (playedIndex === -1) {
        playedIndex = ticTacToe.obtainWinnerPoint(rivalIndexes, botIndexes);
    }
    
    // Si no, marcar aleatoriamente
    if (playedIndex === -1) {        
        playedIndex = ticTacToe.getRandomIndex(); // aleatorio
    }
    
    board[playedIndex] = bot;

    return board;
};


module.exports = {
    getGameStatus,
    getNewPlay,
    getBotSide,
    getRivalSide,
    isBotTurnValid
}