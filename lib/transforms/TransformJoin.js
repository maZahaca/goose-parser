/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');

class TransformJoin extends Transform {
    doTransform() {
        const glue = this._options.glue !== undefined ? this._options.glue : ' ';
        return Array.isArray(this._value) ? this._value.join(glue) : this._value;
    }
}

module.exports = TransformJoin;
