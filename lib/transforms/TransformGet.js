/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');
const _ = require('lodash');

class TransformGet extends Transform {
    doTransform() {
        const defaultValue = this._options.default || '';
        return _.get(this._value, this._options.path, defaultValue);
    }
}

module.exports = TransformGet;
