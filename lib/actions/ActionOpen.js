/**
 * @fileOverview
 *
 * Opens a page
 */

'use strict';

const Action = require('./Action');

class ActionOpen extends Action {
    perform () {
        return this._env.evaluateJs(this._options.url, function (url) {
            window.location = url;
        });
    }
}

module.exports = ActionOpen;

