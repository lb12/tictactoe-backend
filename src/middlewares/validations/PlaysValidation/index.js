'use strict';

// Node imports
const { body, check } = require("express-validator");

// Own imports
const { validation: codes } = require('../../../utils/dictionary-codes');

const BOARD_LENGTH = Math.pow(process.env.BOARD_SIZE, 2);

module.exports = {
    getNewPlayValidation: [
        body('board')
            .exists({ checkFalsy: true, checkNull: true }).withMessage(codes.MUST_NOT_BE_EMPTY)
            .isArray({ min: BOARD_LENGTH, max: BOARD_LENGTH }).withMessage(codes.MUST_BE_ARRAY_9_ELEMENTS),
        check('board.*')
            .isString().isLength({ min: 0, max: 1 }).withMessage(codes.MUST_BE_MAX_9_CHARS)
            .matches(/^$|[XO]/).withMessage(codes.MUST_BE_X_OR_O),
        body('isBotX')
            .exists({checkFalsy: false, checkNull: true}).withMessage(codes.MUST_NOT_BE_EMPTY)
            .isBoolean().withMessage(codes.MUST_BE_BOOLEAN)
    ]
}