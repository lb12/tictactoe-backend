'use strict';

// Node imports
const { body, check } = require("express-validator");

// Own imports
const { validation: codes } = require('../../../utils/dictionary-codes');

module.exports = {
    getNewPlayValidation: [
        body('board')
            .exists({ checkFalsy: true, checkNull: true }).withMessage(codes.MUST_NOT_BE_EMPTY)
            .isArray({ max: 9 }).withMessage(codes.MUST_BE_ARRAY_9_ELEMENTS),
        check('board.*')
            .isString().isLength({ min: 0, max: 1 }).withMessage(codes.MUST_BE_MAX_9_CHARS)
            .matches(/[XO]/).withMessage(codes.MUST_BE_X_OR_O),
        body('isPlayerX')
            .exists({checkFalsy: false, checkNull: true}).withMessage(codes.MUST_NOT_BE_EMPTY)
            .isBoolean().withMessage(codes.MUST_BE_BOOLEAN)
    ]
}