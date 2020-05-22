'use strict';

// Node imports
const { body } = require("express-validator");

// Own imports
const { validation: codes } = require('../../../utils/dictionary-codes');

module.exports = {
    getNewPlayValidation: [
        body('board')
            .exists({checkFalsy: true, checkNull: true}).withMessage(codes.MUST_NOT_BE_EMPTY)
            .isArray().withMessage(codes.MUST_BE_ARRAY),
            // .isLength({ min: 9, max: 9 }).withMessage(codes.MUST_BE_MAX_9_CHARS),
        body('isPlayerX')
            .exists({checkFalsy: true, checkNull: true}).withMessage(codes.MUST_NOT_BE_EMPTY)
            .isBoolean().withMessage(codes.MUST_BE_BOOLEAN)
    ]
}