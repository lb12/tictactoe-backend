'use strict';

const ticTacToe = require('../../lib/tictactoe');
const tictactoe = require('../../lib/tictactoe');

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
    if (playedIndex === -1)
        playedIndex = -1; // aleatorio

    return { playedIndex };
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
            
            // Comprobar diagonales
                // Sacar diagonal de este punto
                    // Comprobar si los puntos de esta diagonal están en los puntos donde ha jugado el jugador
                        // Si hay 2 coincidencias, podemos hacer victoria en el punto de la diagonal que falta si no está ocupado ya.
        }
    }
    return -1;
}

const obtainWinnerRowPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    // Sacar fila de este punto
    const rowNum = tictactoe.getRowNum(currentPlayerIndex, 3);
    // Sacar fila de este punto
    const rowPoints = tictactoe.getRowPoints(rowNum, 3);
    return obtainWinnerRowColPoint(rowPoints, playerIndexes, rivalIndexes);
}

const obtainWinnerRowColPoint = (rowOrColPoints, playerIndexes, rivalIndexes) => {
    // Obtener los puntos de esta fila o col que NO están dentro de los puntos donde ha jugado el jugador
    const unmarkedPoints = rowOrColPoints.filter( point => !playerIndexes.includes(point));
    if (unmarkedPoints.length > 1) return -1;
    // Si hay 2 coincidencias, podemos hacer victoria en el punto de la fila o col que falta si no está ocupado ya.
    const possibleWinnerIndex = unmarkedPoints[0];
    if (!rivalIndexes.includes(possibleWinnerIndex)) {
        // devolver el index para marcarlo en el tablero.
        return possibleWinnerIndex;
    }
    return -1;
}

const obtainWinnerColPoint = (currentPlayerIndex, playerIndexes, rivalIndexes) => {
    // Sacar número de columna
    const colNum = tictactoe.getColNum(currentPlayerIndex, 3);
    // Sacar puntos de la columna
    const colPoints = tictactoe.getColPoints(colNum, 3);
    return obtainWinnerRowColPoint(colPoints, playerIndexes, rivalIndexes);
}



module.exports = {
    getNewPlay
}