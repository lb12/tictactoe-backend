'use strict';

const tictactoe = require('../../lib/tictactoe');
const { gameStatus } = require('../../utils/dictionary-codes');

const BOARD_SIZE = process.env.BOARD_SIZE || 3;

const getGameStatus = (board, player, rival) => {
    const playerIndexes = getPlayerIndexes(board, player);
    const rivalIndexes =  getPlayerIndexes(board, rival);

    let result = false;
    // Comprobar si hemos ganado
    result = checkPlayerWin(board, playerIndexes, player);

    // Comprobar si hemos perdido
    if (!result) {
        result = checkPlayerWin(board, rivalIndexes, rival);
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

const checkPlayerWin = (board, playerIndexes, playerSide) => {
    for (let i = 0; i < playerIndexes.length; i++) {
        const playerIndex = playerIndexes[i];
        
        // compruebas la fila
        const rowNum = tictactoe.getRowNum(playerIndex, BOARD_SIZE);
        const rowPoints = tictactoe.getRowPoints(rowNum, BOARD_SIZE);

        let win = checkPointsWereClickedByPlayer(rowPoints, playerSide, board);

        // compruebas la columna
        if (!win) {
            const colNum = tictactoe.getColNum(playerIndex, BOARD_SIZEBOARD_SIZE);
            const colPoints = tictactoe.getColPoints(colNum, BOARD_SIZE);
            win = checkPointsWereClickedByPlayer(colPoints, playerSide, board);
        }

        // compruebas las diagonales
        if (!win) {
            // Compruebas la diagonal izq
            const leftDiagonalPoints = tictactoe.getLeftDiagonalPoints(BOARD_SIZE);
            win = checkPointsWereClickedByPlayer(leftDiagonalPoints, playerSide, board);
            // Compruebas la diagonal der
            if (!win) {
                const rightDiagonalPoints = tictactoe.getRightDiagonalPoints(BOARD_SIZE);
                win = checkPointsWereClickedByPlayer(rightDiagonalPoints, playerSide, board);
            }
        }

        if (win) {
            return `${playerSide} ${gameStatus.WINNER}`;
        }
    }
    return false;
}

const checkPointsWereClickedByPlayer = (points, playerSide, board) => {
    let allClicked = true;
    for (let j = 0; j < points.length; j++) {
        const pointClicked = points[j];
        if (board[pointClicked] !== playerSide) {
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
    const filledPoints = board.filter(index => index != undefined);
    
    return filledPoints.length === 9;
}


/**
 * Realiza una jugada por el player en el tablero pasado
 * 
 * @param board tablero actual
 * @param player jugador que hay que generar una jugada (X ó O)
 * @param rival jugador rival al que nos enfrentamos (X ó O)
 * 
 * @returns tablero con la nueva jugada añadida
 */
const getNewPlay = (board, player, rival) => {    
    const playerIndexes = getPlayerIndexes(board, player);
    const rivalIndexes =  getPlayerIndexes(board, rival);

    let playedIndex = -1;

    // Comprobar si podemos hacer una jugada de victoria: 
    playedIndex = obtainWinnerPoint(playerIndexes, rivalIndexes);
    
    // Si no, comprobar si podemos hacer una jugada para evitar una derrota
    if (playedIndex === -1) {
        playedIndex = obtainWinnerPoint(rivalIndexes, playerIndexes);
    }

    // Si no, marcar aleatoriamente
    if (playedIndex === -1) {
        playedIndex = getRandomIndex(board); // aleatorio
    }

    board[playedIndex] = player;

    return board;
};

const getPlayerIndexes = (board, playerSide) => {
    return board.map((point, index) => point === playerSide ? index : undefined).filter(point => point !== undefined);
}

const obtainWinnerPoint = (playerIndexes, rivalIndexes) => {
    // Para hacer victoria al menos tiene que haber marcado dos puntos
    if (playerIndexes.length > 2) {
        let winnerPoint = -1;
        // Por cada punto, 
        for (let i = 0; i < playerIndexes.length; i++) {
            const playerIndex = playerIndexes[i];
                   
            winnerPoint = obtainWinnerRowPoint(playerIndex, playerIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
            
            winnerPoint = obtainWinnerColPoint(playerIndex, playerIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
            
            winnerPoint = obtainerWinnerDiagonalPoint(playerIndex, playerIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
        }
    }
    return -1;
}

const obtainWinnerRowPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    // Sacar número de fila
    const rowNum = tictactoe.getRowNum(currentPlayerIndex, BOARD_SIZE);
    // Sacar puntos de la fila
    const rowIndexes = tictactoe.getRowPoints(rowNum, BOARD_SIZE);
    return obtainPossibleWinnerIndex(rowIndexes, playerIndexes, rivalIndexes);
}

const obtainPossibleWinnerIndex = (indexes, playerIndexes, rivalIndexes) => {
    const unmarkedIndexes = indexes.filter( index => !playerIndexes.includes(index));
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

const obtainWinnerColPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    // Sacar número de columna
    const colNum = tictactoe.getColNum(currentPlayerIndex, BOARD_SIZE);
    // Sacar puntos de la columna
    const colIndexes = tictactoe.getColPoints(colNum, BOARD_SIZE);
    return obtainPossibleWinnerIndex(colIndexes, playerIndexes, rivalIndexes);
}

const obtainerWinnerDiagonalPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    const rowNum = tictactoe.getRowNum(currentPlayerIndex, BOARD_SIZE);
    const colNum = tictactoe.getColNum(currentPlayerIndex, BOARD_SIZE);
    
    if (!tictactoe.isDiagonalAvailable(rowNum, colNum)) {
        return -1;
    }

    let possibleIndex = -1;

    const leftDiagonalIndexes = tictactoe.getLeftDiagonalPoints(BOARD_SIZE);
    possibleIndex = obtainPossibleWinnerIndex(leftDiagonalIndexes, playerIndexes, rivalIndexes);
    
    if (possibleIndex === -1) {
        const rightDiagonalIndexes = tictactoe.getRightDiagonalPoints(BOARD_SIZE);
        possibleIndex = obtainPossibleWinnerIndex(rightDiagonalIndexes, playerIndexes, rivalIndexes);
    }

    return possibleIndex;
}

const getRandomIndex = board => {
    return board.filter(index => !index)[0];
}


module.exports = {
    isGameFinished,
    getGameStatus,
    getNewPlay
}