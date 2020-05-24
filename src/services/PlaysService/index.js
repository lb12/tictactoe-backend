'use strict';

const tictactoe = require('../../lib/tictactoe');
const { gameStatus } = require('../../utils/dictionary-codes');

const BOARD_SIZE = process.env.BOARD_SIZE || 3;



const isBotTurnValid = (board, isBotX) => {
    const botIndexes = getBotIndexes(board, getBotSide(isBotX));
    const rivalIndexes =  getBotIndexes(board, getRivalSide(isBotX));

    const botPlayedLastTime = (isBotX && botIndexes.length > rivalIndexes.length) || 
        (!isBotX && botIndexes.length === rivalIndexes.length);
    
    return !botPlayedLastTime;
}

const getGameStatus = (board, bot, rival) => {
    const botIndexes = getBotIndexes(board, bot);
    const rivalIndexes =  getBotIndexes(board, rival);

    let result = false;
    // Comprobar si hemos ganado
    result = checkBotWin(board, botIndexes, bot);

    // Comprobar si hemos perdido
    if (!result) {
        result = checkBotWin(board, rivalIndexes, rival);
    }

    if (!result && !isGameFinished(board)) {
        return gameStatus.GAME_IN_PROGRESS;
    }

    // Comprobar si hemos empatado
    if (!result) {
        result = gameStatus.DRAW;
    }

    return result;
}

const checkBotWin = (board, botIndexes, botSide) => {
    for (let i = 0; i < botIndexes.length; i++) {
        const botIndex = botIndexes[i];
        
        // compruebas la fila
        const rowNum = tictactoe.getRowNum(botIndex, BOARD_SIZE);
        const rowPoints = tictactoe.getRowPoints(rowNum, BOARD_SIZE);

        let win = checkPointsWereClickedByBot(rowPoints, botSide, board);

        // compruebas la columna
        if (!win) {
            const colNum = tictactoe.getColNum(botIndex, BOARD_SIZE);
            const colPoints = tictactoe.getColPoints(colNum, BOARD_SIZE);
            win = checkPointsWereClickedByBot(colPoints, botSide, board);
        }

        // compruebas las diagonales
        if (!win) {
            // Compruebas la diagonal izq
            const leftDiagonalPoints = tictactoe.getLeftDiagonalPoints(BOARD_SIZE);
            win = checkPointsWereClickedByBot(leftDiagonalPoints, botSide, board);
            // Compruebas la diagonal der
            if (!win) {
                const rightDiagonalPoints = tictactoe.getRightDiagonalPoints(BOARD_SIZE);
                win = checkPointsWereClickedByBot(rightDiagonalPoints, botSide, board);
            }
        }

        if (win) {
            return `${botSide} ${gameStatus.WINNER}`;
        }
    }
    return false;
}

const checkPointsWereClickedByBot = (points, botSide, board) => {
    let allClicked = true;
    for (let j = 0; j < points.length; j++) {
        const pointClicked = points[j];
        if (board[pointClicked] !== botSide) {
            allClicked = false;
            break;
        }
    }

    return allClicked;
}

/**
 * Comprobar si un tablero está acabado o no
 */
const isGameFinished = board => {
    const filledPoints = board.filter(index => index != "");
    const boardLength = Math.pow(process.env.BOARD_SIZE, 2);
    return filledPoints.length === boardLength;
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
    const botIndexes = getBotIndexes(board, bot);
    const rivalIndexes =  getBotIndexes(board, rival);

    console.log(botIndexes);
    console.log(rivalIndexes);
    

    let playedIndex = -1;

    // Comprobar si podemos hacer una jugada de victoria: 
    playedIndex = obtainWinnerPoint(botIndexes, rivalIndexes);
    
    // Si no, comprobar si podemos hacer una jugada para evitar una derrota
    if (playedIndex === -1) {
        playedIndex = obtainWinnerPoint(rivalIndexes, botIndexes);
    }

    // Si no, marcar aleatoriamente
    if (playedIndex === -1) {
        
        playedIndex = getRandomIndex(board); // aleatorio
        console.log('marco aleatorio', playedIndex);
    }

    board[playedIndex] = bot;

    return board;
};

const getBotIndexes = (board, botSide) => {
    return board.map((point, index) => point === botSide ? index : "").filter(point => point !== "");
}

const obtainWinnerPoint = (botIndexes, rivalIndexes) => {
    // Para hacer victoria al menos tiene que haber marcado dos puntos
    if (botIndexes.length > 2) {
        let winnerPoint = -1;
        // Por cada punto, 
        for (let i = 0; i < botIndexes.length; i++) {
            const botIndex = botIndexes[i];
                   
            winnerPoint = obtainWinnerRowPoint(botIndex, botIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
            
            winnerPoint = obtainWinnerColPoint(botIndex, botIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
            
            winnerPoint = obtainerWinnerDiagonalPoint(botIndex, botIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
        }
    }
    return -1;
}

const obtainWinnerRowPoint = (currentBotIndex, botIndexes, rivalIndexes) => {
    // Sacar número de fila
    const rowNum = tictactoe.getRowNum(currentBotIndex, BOARD_SIZE);
    // Sacar puntos de la fila
    const rowIndexes = tictactoe.getRowPoints(rowNum, BOARD_SIZE);
    return obtainPossibleWinnerIndex(rowIndexes, botIndexes, rivalIndexes);
}

const obtainPossibleWinnerIndex = (indexes, botIndexes, rivalIndexes) => {
    const unmarkedIndexes = indexes.filter( index => !botIndexes.includes(index));
    return obtainWinnerIndexIfNotChosen(unmarkedIndexes, rivalIndexes);
}

const obtainWinnerIndexIfNotChosen = (unmarkedIndexes, rivalIndexes) => {
    const moreThanOnePossibility = unmarkedIndexes.length > 1;

    if (moreThanOnePossibility) return -1;    

    const possibleWinnerIndex = unmarkedIndexes[0];

    if (!rivalIndexes.includes(possibleWinnerIndex)) {
        return possibleWinnerIndex;
    }

    return -1;
}

const obtainWinnerColPoint = (currentBotIndex, botIndexes, rivalIndexes) => {
    // Sacar número de columna
    const colNum = tictactoe.getColNum(currentBotIndex, BOARD_SIZE);
    // Sacar puntos de la columna
    const colIndexes = tictactoe.getColPoints(colNum, BOARD_SIZE);
    return obtainPossibleWinnerIndex(colIndexes, botIndexes, rivalIndexes);
}

const obtainerWinnerDiagonalPoint = (currentBotIndex, botIndexes, rivalIndexes) => {
    const rowNum = tictactoe.getRowNum(currentBotIndex, BOARD_SIZE);
    const colNum = tictactoe.getColNum(currentBotIndex, BOARD_SIZE);
    
    if (!tictactoe.isDiagonalAvailable(rowNum, colNum)) {
        return -1;
    }

    let possibleIndex = -1;

    const leftDiagonalIndexes = tictactoe.getLeftDiagonalPoints(BOARD_SIZE);
    possibleIndex = obtainPossibleWinnerIndex(leftDiagonalIndexes, botIndexes, rivalIndexes);
    
    if (possibleIndex === -1) {
        const rightDiagonalIndexes = tictactoe.getRightDiagonalPoints(BOARD_SIZE);
        possibleIndex = obtainPossibleWinnerIndex(rightDiagonalIndexes, botIndexes, rivalIndexes);
    }

    return possibleIndex;
}

const getRandomIndex = board => {
    return board.map((point, index) => point === "" ? index : undefined).filter(point => point !== undefined)[0];
}

const getBotSide = isBotX => isBotX ? 'X' : 'O';
const getRivalSide = isBotX => getBotSide(!isBotX);

module.exports = {
    getGameStatus,
    getNewPlay,
    getBotSide,
    getRivalSide,
    isBotTurnValid
}