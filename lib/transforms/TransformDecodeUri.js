/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');

class TransformDecodeUri extends Transform {
    doTransform() {
        return decodeURI(this._value);
    }
}

module.exports = TransformDecodeUri;
