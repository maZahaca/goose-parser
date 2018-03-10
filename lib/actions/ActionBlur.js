/**
 * @fileOverview
 *
 * Perform click to specified selector on the page
 */

const Action = require('./Action');

class ActionBlur extends Action {
    async perform() {
        this.log('blur on %s', this._selector);
        const blurredCount = await this._env.evaluateJs(this._selector, /* @covignore */ function (selector) {
            const nodes = Sizzle(selector);
            for (var i = 0, l = nodes.length; i < l; i++) {
                nodes[i].blur();
            }

            return nodes.length;
        });
        this.log('blured consequently %s nodes', blurredCount);
        return result;
    }
}

module.exports = ActionBlur;
