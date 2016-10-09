/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');

class TransformReplace extends Transform {
    doTransform() {
        const re = this._options.re;
        if (!Array.isArray(re)) {
            throw new Error('You must pass an array as `re` to `replace` transform');
        }

        return (this._value || '').replace(RegExp.apply(null, re), this._options.to);
    }
}

module.exports = TransformReplace;
