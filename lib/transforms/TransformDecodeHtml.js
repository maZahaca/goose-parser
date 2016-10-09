/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

'use strict';

const Transform = require('./Transform');
const entities = require('html-entities').Html5Entities;

class TransformDecodeHtml extends Transform {
    doTransform() {
        return entities.decode(this._value);
    }
}

module.exports = TransformDecodeHtml;
