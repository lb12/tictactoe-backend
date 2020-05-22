'use strict';

module.exports = (err, req, res, next) => {
    const jsonError = {
        status: err.status || 500,
        data: err.message || 'Uncontrolled error'
    };

    if (err.array) {     
        const errInfo = err.array({ onlyFirstError: true })[0];
        jsonError.status = 422;
        jsonError.data = `Validation failed - ${errInfo.param} ${errInfo.msg}`;
    } else if (err.status === 422) {
        jsonError.data = `Validation failed - ${err.param} ${err.msg}`;
    }

  return res.status(jsonError.status).json(jsonError);
}