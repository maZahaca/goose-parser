'use strict';

const debug = require('debug')('Transforms');
const Storage = require('./Storage');
const transformsFactory = require('./transforms/transformsFactory');

function Transforms(options) {
    this._storage = options.storage || new Storage();
}

Transforms.prototype = {
    constructor: Transforms,

    /**
     * Perform transformations to result value
     * @param {Array.<Transform>} transforms
     * @param {*} value
     * @returns {*}
     */
    produce: function(transforms, value) {
        transforms = transforms || [];
        debug('transforms are producing for %o on %o', transforms, value);
        return transforms.reduce((value, options) => {
            value = typeof value === 'undefined' ? '' : value;
            const transform = transformsFactory.createTransform({
                options,
                value,
                storage: this._storage
            });

            if (!transform) {
                throw new Error('Unsupported transform type: ' + options.type);
            }

            return transform.transform();
        }, value);
    },

    /**
     * Add custom transform
     * @param {string} type
     * @param {Function} transform
     */
    addTransform: function(type, transform) {
        transformsFactory.addTransform(type, transform);
    },

    /**
     * @deprecated use addTransform instead
     */
    addTransformation: function(type, transform) {
        this.addTransform(type, transform);
    }
};

module.exports = Transforms;
