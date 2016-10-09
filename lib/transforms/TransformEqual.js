/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');

class TransformEqual extends Transform {
    doTransform() {
        return this._value === this._options.value;
    }
}

module.exports = TransformEqual;
