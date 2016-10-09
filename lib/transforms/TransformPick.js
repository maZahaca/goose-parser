/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');
const _ = require('lodash');

class TransformPick extends Transform {
    doTransform() {
        return _.pick(this._value, this._options.prop);
    }
}

module.exports = TransformPick;
