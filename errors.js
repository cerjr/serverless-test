'use strict';

function MustRetryError(message) {
    this.name = 'MustRetryError';
    this.message = message;
}
MustRetryError.prototype = new Error();

module.exports.MustRetryError = MustRetryError;