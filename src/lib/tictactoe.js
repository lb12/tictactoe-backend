'use strict';


const {
    gameStatus
} = require('../utils/dictionary-codes');

const {
    isPair
} = require("./math");


class TicTacToe {

    constructor(board, boardSize) {
        this.board = board;
        this.boardSize = boardSize;
    }

    // Devuelve el número de la fila a partir del index del array
    getRowNum = id => {
        let row = 0;

        do {
            if (id < this.boardSize * (row + 1)) break;
            row++;
        } while (row < this.boardSize);

        return row;
    }

    // Devuelve el número de la columna a partir del index del array
    getColNum = id => {
        let col = 0;

        do {
            if ((id - col) % this.boardSize === 0) break;
            col++;
        } while (col < this.boardSize);

        return col;
    };

    // Devuelve los índices de una fila dado un índice del array
    getRowPoints = rowNum => {
        const rowPoints = [];

        const firstRowPoint = rowNum * this.boardSize;

        for (let i = 0; i < this.boardSize; i++) {
            rowPoints.push(firstRowPoint + i);
        }
        return rowPoints;
    };

    // Devuelve los índices de una columna dado un índice del array
    getColPoints = colPoint => {
        const colPoints = [];
        let counter = 0;

        while (counter < this.boardSize) {
            colPoints.push(colPoint + this.boardSize * counter);
            counter++;
        }

        return colPoints;
    };

    // Devuelve los índices de la diagonal superior izq-der
    getLeftDiagonalPoints = () => {
        const diagonalPoints = [];
        for (let row = 0; row < this.boardSize; row++) {
            const index = row + this.boardSize * row;
            diagonalPoints.push(index);
        }

        return diagonalPoints;
    }

    // Devuelve los índices de la diagonal superior der-izq
    getRightDiagonalPoints = () => {
        const diagonalPoints = [];
        let col = this.boardSize - 1;

        for (let row = 0; row < this.boardSize; row++, col--) {
            const index = col + this.boardSize * row;
            diagonalPoints.push(index);
        }

        return diagonalPoints;
    }

    // Devuelve las posiciones en las que se encuentran las letras indicadas como parámetro
    getPlayerIndexes = letterSide => this.board.map((point, index) => point === letterSide ? index : "").filter(point => point !== "");

    // Devuelve una posición aleatoria que quede libre en el tablero
    getRandomIndex = () => this.board.map((point, index) => point === "" ? index : undefined).filter(point => point !== undefined)[0];

    getBoardLength = () => Math.pow(this.boardSize, 2);

    // Comprueba si dado un punto se puede trazar una diagonal
    isDiagonalAvailable = (row, col) => isPair(row) && isPair(col);

    // Devuelve una posición que le de la victoria al jugador
    obtainWinnerPoint = (player1Indexes, player2Indexes) => {
        // Para hacer victoria al menos tiene que haber marcado dos puntos
        if (player1Indexes.length > 2) {
            let winnerPoint = -1;
            for (let i = 0; i < player1Indexes.length; i++) {
                const player1Index = player1Indexes[i];

                winnerPoint = this.obtainWinnerRowPoint(player1Index, player1Indexes, player2Indexes);
                if (winnerPoint !== -1) return winnerPoint;

                winnerPoint = this.obtainWinnerColPoint(player1Index, player1Indexes, player2Indexes);
                if (winnerPoint !== -1) return winnerPoint;

                winnerPoint = this.obtainerWinnerDiagonalPoint(player1Index, player1Indexes, player2Indexes);
                if (winnerPoint !== -1) return winnerPoint;
            }
        }
        return -1;
    }

    obtainWinnerRowPoint = (currentPlayer1Index, player1Indexes, player2Indexes) => {
        // Sacar número de fila
        const rowNum = this.getRowNum(currentPlayer1Index);
        // Sacar puntos de la fila
        const rowIndexes = this.getRowPoints(rowNum);
        return this.obtainPossibleWinnerIndex(rowIndexes, player1Indexes, player2Indexes);
    }

    obtainPossibleWinnerIndex = (indexes, player1Indexes, player2Indexes) => {
        const unmarkedIndexes = indexes.filter(index => !player1Indexes.includes(index));
        return this.obtainWinnerIndexIfNotChosen(unmarkedIndexes, player2Indexes);
    }

    obtainWinnerIndexIfNotChosen = (unmarkedIndexes, player2Indexes) => {
        const moreThanOnePossibility = unmarkedIndexes.length > 1;

        if (moreThanOnePossibility) return -1;

        const possibleWinnerIndex = unmarkedIndexes[0];

        if (!player2Indexes.includes(possibleWinnerIndex)) {
            return possibleWinnerIndex;
        }

        return -1;
    }

    obtainWinnerColPoint = (currentBotIndex, player1Indexes, player2Indexes) => {
        // Sacar número de columna
        const colNum = this.getColNum(currentBotIndex);
        // Sacar puntos de la columna
        const colIndexes = this.getColPoints(colNum);
        return this.obtainPossibleWinnerIndex(colIndexes, player1Indexes, player2Indexes);
    }

    obtainerWinnerDiagonalPoint = (currentBotIndex, player1Indexes, player2Indexes) => {
        const rowNum = this.getRowNum(currentBotIndex);
        const colNum = this.getColNum(currentBotIndex);

        if (!this.isDiagonalAvailable(rowNum, colNum)) {
            return -1;
        }

        let possibleIndex = -1;

        const leftDiagonalIndexes = this.getLeftDiagonalPoints();
        possibleIndex = this.obtainPossibleWinnerIndex(leftDiagonalIndexes, player1Indexes, player2Indexes);

        if (possibleIndex === -1) {
            const rightDiagonalIndexes = this.getRightDiagonalPoints();
            possibleIndex = this.obtainPossibleWinnerIndex(rightDiagonalIndexes, player1Indexes, player2Indexes);
        }

        return possibleIndex;
    }

    hasPlayerWon = (playerIndexes, playerSide) => {
        for (let i = 0; i < playerIndexes.length; i++) {
            const playerIndex = playerIndexes[i];

            // compruebas la fila
            const rowNum = this.getRowNum(playerIndex);
            const rowPoints = this.getRowPoints(rowNum);

            let win = this.checkPointsWereClickedByBot(rowPoints, playerSide);

            // compruebas la columna
            if (!win) {
                const colNum = this.getColNum(playerIndex);
                const colPoints = this.getColPoints(colNum);
                win = this.checkPointsWereClickedByBot(colPoints, playerSide);
            }

            // compruebas las diagonales
            if (!win) {
                // Compruebas la diagonal izq
                const leftDiagonalPoints = this.getLeftDiagonalPoints();
                win = this.checkPointsWereClickedByBot(leftDiagonalPoints, playerSide);
                // Compruebas la diagonal der
                if (!win) {
                    const rightDiagonalPoints = this.getRightDiagonalPoints();
                    win = this.checkPointsWereClickedByBot(rightDiagonalPoints, playerSide);
                }
            }

            if (win) {
                return `${playerSide} ${gameStatus.WINNER}`;
            }
        }
        return false;
    }

    checkPointsWereClickedByBot = (points, playerSide) => {
        let allClicked = true;
        for (let j = 0; j < points.length; j++) {
            const pointClicked = points[j];
            if (this.board[pointClicked] !== playerSide) {
                allClicked = false;
                break;
            }
        }

        return allClicked;
    }

    // Comprobar si un tablero está acabado o no
    isGameFinished = () => {
        const filledPoints = this.board.filter(index => index != "");
        return filledPoints.length === this.getBoardLength();
    }
}

module.exports = TicTacToe;