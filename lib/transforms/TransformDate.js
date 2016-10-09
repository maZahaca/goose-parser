/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');
const moment = require('moment');

class TransformDate extends Transform {
    doTransform() {
        return moment(this._value, this._options.from, this._options.locale || 'en')
            .format(this._options.to);
    }
}

module.exports = TransformDate;
