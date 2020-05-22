'use strict';

const ticTacToe = require('../../lib/tictactoe');

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
    console.log(`board`, board);
    
    const playerIndexes = getPlayerIndexes(board, player);
    const rivalIndexes =  getPlayerIndexes(board, rival);

    let playedIndex = -1;

    // Comprobar si podemos hacer una jugada de victoria: 
    console.log("Compruebo si puedo ganar");      
    playedIndex = obtainWinnerPoint(playerIndexes, rivalIndexes);
    console.log("Punto retornado: ", playedIndex);      
    
    // Si no, comprobar si podemos hacer una jugada para evitar una derrota
    console.log("Compruebo si puedo perder");      
    if (playedIndex === -1) {
        playedIndex = obtainWinnerPoint(rivalIndexes, playerIndexes);
        console.log("Punto retornado: ", playedIndex); 
    }

    // Si no, marcar aleatoriamente
    if (playedIndex === -1) {
        playedIndex = getRandomIndex(board); // aleatorio
        console.log("Punto retornado: ", playedIndex);
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
        
            console.log('Compruebo filas');            
            winnerPoint = obtainWinnerRowPoint(playerIndex, playerIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
            
            console.log('Compruebo columnas');
            winnerPoint = obtainWinnerColPoint(playerIndex, playerIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
            
            console.log('Compruebo diagonales');
            winnerPoint = obtainerWinnerDiagonalPoint(playerIndex, playerIndexes, rivalIndexes);            
            if (winnerPoint !== -1) return winnerPoint;
        }
    }
    return -1;
}

const obtainWinnerRowPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    // Sacar número de fila
    const rowNum = ticTacToe.getRowNum(currentPlayerIndex, 3);
    // Sacar puntos de la fila
    const rowIndexes = ticTacToe.getRowPoints(rowNum, 3);
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
    const colNum = ticTacToe.getColNum(currentPlayerIndex, 3);
    // Sacar puntos de la columna
    const colIndexes = ticTacToe.getColPoints(colNum, 3);
    return obtainPossibleWinnerIndex(colIndexes, playerIndexes, rivalIndexes);
}

const obtainerWinnerDiagonalPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    const rowNum = ticTacToe.getRowNum(currentPlayerIndex, 3);
    const colNum = ticTacToe.getColNum(currentPlayerIndex, 3);
    
    if (!ticTacToe.isDiagonalAvailable(rowNum, colNum)) {
        return -1;
    }

    let possibleIndex = -1;

    const leftDiagonalIndexes = ticTacToe.getLeftDiagonalPoints(3);
    possibleIndex = obtainPossibleWinnerIndex(leftDiagonalIndexes, playerIndexes, rivalIndexes);
    
    if (possibleIndex === -1) {
        const rightDiagonalIndexes = ticTacToe.getRightDiagonalPoints(3);
        possibleIndex = obtainPossibleWinnerIndex(rightDiagonalIndexes, playerIndexes, rivalIndexes);
    }

    return possibleIndex;
}

const getRandomIndex = board => {
    return board.filter(index => !index)[0];
}


module.exports = {
    getNewPlay
}