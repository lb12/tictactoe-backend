const {
  isPair
} = require("./math");

// Devuelve el número de la fila a partir del index del array
const getRowNum = (id, totalRows) => {
  let row = 0;

  do {
    if (id < totalRows * (row + 1)) break;
    row++;
  } while (row < totalRows);

  return row;
};

// Devuelve el número de la columna a partir del index del array
const getColNum = (id, totalCols) => {
  let col = 0;

  do {
    if ((id - col) % totalCols === 0) break;
    col++;
  } while (col < totalCols);

  return col;
};

// Comprueba si hay una diagonal ganadora a partir de un punto
const checkTicTacToeDiagonales = (
  row,
  col,
  totalRows,
  currentSquares,
  currentLetterTurn
) => {
  const diagonales = [];
  let ticTacToe = true;

  if (!isDiagonalAvailable(row, col) && row !== col) return false;



  if (!ticTacToe) {
    let _col = totalRows - 1;
    ticTacToe = true;
    diagonales.length = 0;
    for (let _row = 0; _row < totalRows; _row++, _col--) {
      const squareId = _col + totalRows * _row;

      if (currentSquares[squareId] !== currentLetterTurn) {
        ticTacToe = false;
        break;
      }

      diagonales.push(squareId);
    }
  }

  // TODO : Devolver diagonales si queremos saber cual es la diagonal ganadora

  return ticTacToe;
};

// Comprueba si dado un punto se puede trazar una diagonal
const isDiagonalAvailable = (row, col) => isPair(row) && isPair(col);

// Comprueba si una fila o columna hay una coincidencia de 3
const checkTicTacToeRowOrCol = (
  rowOrColList,
  currentSquares,
  currentLetterTurn
) => {
  let ticTacToe = true;

  for (let i = 0; i < rowOrColList.length; i++) {
    const pointChecked = currentSquares[rowOrColList[i]];

    if (pointChecked !== currentLetterTurn) {
      ticTacToe = false;
      break;
    }
  }

  return ticTacToe;
};

// Devuelve los índices de una fila dado un índice del array
const getRowPoints = (rowNum, BOARD_SIZE) => {
  const rowPoints = [];

  const firstRowPoint = rowNum * BOARD_SIZE;

  for (let i = 0; i < BOARD_SIZE; i++) {
    rowPoints.push(firstRowPoint + i);
  }
  return rowPoints;
};

// Devuelve los índices de una columna dado un índice del array
const getColPoints = (colPoint, BOARD_SIZE) => {
  const colPoints = [];
  let counter = 0;

  while (counter < BOARD_SIZE) {
    colPoints.push(colPoint + BOARD_SIZE * counter);
    counter++;
  }

  return colPoints;
};

const getLeftDiagonalPoints = (BOARD_SIZE) => {
  const diagonalPoints = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const index = row + BOARD_SIZE * row;
    diagonalPoints.push(index);
  }

  return diagonalPoints;
}

const getRightDiagonalPoints = (BOARD_SIZE) => {
  const diagonalPoints = [];
  let col = BOARD_SIZE - 1;

  for (let row = 0; row < BOARD_SIZE; row++, col--) {
    const index = col + BOARD_SIZE * row;
    diagonalPoints.push(index);
  }

  return diagonalPoints;
}

module.exports = {
  isDiagonalAvailable,
  getRowPoints,
  getRowNum,
  getColPoints,
  getColNum,
  isDiagonalAvailable,
  getLeftDiagonalPoints,
  getRightDiagonalPoints
}











/*


// Comprueba diagonales, filas y columnas para saber si hay una coincidencia de 3.
// Devuelve VICTORIA, EMPATE, SEGUIR JUGANDO
const checkWin = (
  rowPoint,
  colPoint,
  turnLetter,
  BOARD_SIZE,
  currentSquares
) => {
  let ticTacToeRow = checkTicTacToeRowOrCol(
    getRowPoints(rowPoint, BOARD_SIZE),
    currentSquares,
    turnLetter
  );
  let ticTacToeCol = checkTicTacToeRowOrCol(
    getColPoints(colPoint, BOARD_SIZE),
    currentSquares,
    turnLetter
  );
  let ticTacToeDiagonal = checkTicTacToeDiagonales(
    rowPoint,
    colPoint,
    BOARD_SIZE,
    currentSquares,
    turnLetter
  );

  const isVictory = ticTacToeRow || ticTacToeCol || ticTacToeDiagonal;

  const isDraw =
    currentSquares.filter(cs => cs !== undefined).length ===
    Math.pow(BOARD_SIZE, 2);

  const finalMessage = isVictory ?
    `'${turnLetter}' GANA` :
    isDraw ?
    "EMPATE" :
    `Turno de '${turnLetter === "X" ? "O" : "X"}'`;

  return finalMessage;
};


*/