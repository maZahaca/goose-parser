/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');

class TransformSplit extends Transform {
    doTransform() {
        const index = this._options.index || 0;
        const dataType = this._options.dataType || 'string';
        let separator = this._options.separator;
        separator = Array.isArray(separator) ? RegExp.apply(null, separator) : separator || ',';
        matches = (this._value || '').split(separator).map(function(item) {
            return item.trim();
        });
        if (dataType === 'array') {
            return matches;
        }
        return Array.isArray(matches) && matches[index] !== undefined ? matches[index] : null;
    }
}

module.exports = TransformSplit;
