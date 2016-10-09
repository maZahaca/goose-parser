/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');

class TransformCompare extends Transform {
    doTransform() {
        return this._value === this._storage.get(this._options.field);
    }
}

module.exports = TransformCompare;
