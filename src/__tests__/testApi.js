'use strict';

// Node imports
const request = require('supertest');
require("dotenv").config();

// Own imports
const app = require('../app');
const { gameStatus } = require('../utils/dictionary-codes');


describe('1. Boards with good inputs', () => {
    it('Test 1.1 GET /api/plays, bot is X player and the play will be to win the game', done => {
        /*
        | X |   | O |           | X |   | O |
        | O | X | O |   -->     | O | X | O |   -->     X WINNER 
        |   | X |   |           |   | X | X |
        */
        const body = {
            board: ["X", "", "O", "O", "X", "O", "", "X", ""],
            isBotX: true
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(200)
            .expect({ board: ["X", "", "O", "O", "X", "O", "", "X", "X"], gameStatus: `X ${gameStatus.WINNER}` }, done);
    });

    it('Test 1.2 GET /api/plays, bot is O player, but it is turn of X player, so return Invalid turn', done => {
        /*
        | X |   | O |           | X |   | O |
        | O | X | O |   -->     | O | X | O |   -->     INVALID_TURN
        |   | X |   |           |   | X |   |
        */
        const body = {
            board: ["X", "", "O", "O", "X", "O", "", "X", ""],
            isBotX: false
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(422)
            .expect({ board: ["X", "", "O", "O", "X", "O", "", "X", ""], error: gameStatus.INVALID_TURN }, done);
    });

    it('Test 1.3 GET /api/plays, bot is X player and receives a full fillen board with a draw game', done => {
        /*
        | X | X | O |           | X | X | O |
        | O | O | X |   -->     | O | O | X |   -->     DRAW 
        | X | O | X |           | X | O | X |
        */
        const body = {
            board: ["X", "X", "O", "O", "O", "X", "X", "O", "X"],
            isBotX: true
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(200)
            .expect({ board: ["X", "X", "O", "O", "O", "X", "X", "O", "X"], gameStatus: `${gameStatus.DRAW}` }, done);
    });

    it('Test 1.4 GET /api/plays, bot is X player and receives a board that is currently finished with an O victory', done => {
        /*
        | X | O | O |           | X | O | O |
        |   | O | X |   -->     |   | O | X |   -->     O WINNER 
        | X | O | X |           | X | O | X |
        */
        const body = {
            board: ["X", "O", "O", "", "O", "X", "X", "O", "X"],
            isBotX: true
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(200)
            .expect({ board: ["X", "O", "O", "", "O", "X", "X", "O", "X"], gameStatus: `O ${gameStatus.WINNER}` }, done);
    });

    it('Test 1.5 GET /api/plays, bot is O player and receives a board that is currently finished with an X victory', done => {
        /*
        | X |   | O |           | X |   | O |
        | O | O |   |   -->     | O | O |   |   -->     X WINNER 
        | X | X | X |           | X | X | X |
        */
        const body = {
            board: ["X", "", "O", "O", "O", "", "X", "X", "X"],
            isBotX: false
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(200)
            .expect({ board: ["X", "", "O", "O", "O", "", "X", "X", "X"], gameStatus: `X ${gameStatus.WINNER}` }, done);
    });

    it('Test 1.6 GET /api/plays, bot is O player and receives a board that has an X win condition that bot has to repel', done => {
        /*
        | X | X |   |           | X | X | O |
        |   | O |   |   -->     |   | O |   |   -->     GAME_IN_PROGRESS
        |   |   |   |           |   |   |   |
        */
        const body = {
            board: ["X", "X", "", "", "O", "", "", "", ""],
            isBotX: false
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(200)
            .expect({ board: ["X", "X", "O", "", "O", "", "", "", ""], gameStatus: `${gameStatus.GAME_IN_PROGRESS}` }, done);
    });

    it('Test 1.7 GET /api/plays, bot is O player and receives a board to realize a random play', done => {
        /*
        | X |   |   |           | X | O |   |
        |   |   |   |   -->     |   |   |   |   -->     GAME_IN_PROGRESS
        |   |   |   |           |   |   |   |
        */
        const body = {
            board: ["X", "", "", "", "", "", "", "", ""],
            isBotX: false
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(200)
            .expect({ board: ["X", "O", "", "", "", "", "", "", ""], gameStatus: `${gameStatus.GAME_IN_PROGRESS}` }, done);
    });
});

describe('2. Boards with bad inputs', () => {
    it('Test 2.1 GET /api/plays, bot side is not send to API', done => {
        /*
        | X |   | O |
        | O | X | O |
        |   | X |   |
        */
        const body = {
            board: ["X", "", "O", "O", "X", "O", "", "X", ""]
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(422)
            .expect({ status: 422, data: 'Validation failed - isBotX MUST_NOT_BE_EMPTY' }, done);
    });

    it('Test 2.2 GET /api/plays, board is not a 3x3 size', done => {
        const body = {
            board: ["X", "", "O", "O", "X", "O", "", "X"],
            isBotX: true
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(422)
            .expect({ status: 422, data: 'Validation failed - board MUST_BE_ARRAY_9_ELEMENTS' }, done);
    });

    it('Test 2.3 GET /api/plays, board positions are not X, O or ""', done => {
        const body = {
            board: ["A", "", "B", "C", "D", "E", "", "f", ""],
            isBotX: true
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(422)
            .expect({ status: 422, data: 'Validation failed - board[0] MUST_BE_X_OR_O' }, done);
    });

    it('Test 2.4 GET /api/plays, board positions are not X, O or ""', done => {
        const body = {
            board: ["X", "XX", "O", "X", "O", "X", "OOO", "O", "XO"],
            isBotX: true
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(422)
            .expect({ status: 422, data: 'Validation failed - board[1] Invalid value' }, done);
    });

    it('Test 2.5 GET /api/plays, isBotX field is not a boolean parameter', done => {
        const body = {
            board: ["X", "", "", "", "", "", "", "", ""],
            isBotX: "yes"
        };
        request(app)
            .post('/api/plays')
            .send(body)
            .expect(422)
            .expect({ status: 422, data: 'Validation failed - isBotX MUST_BE_BOOLEAN' }, done);
    });
});