var Environment = require('./Environment'),
    debug = require('debug')('JsDOMEnvironment'),
    _ = require('lodash'),
    jsdom = require('jsdom')
    path = require('path'),
    vow = require('vow');

const defaultOptions = {
    // Custom environment options
    snapshot: false,
    snapshotDir: 'snapshots',
    proxy: null,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12',
};

/**
 * @param {object} options
 * @constructor
 */
function JsDOMEnvironment(options) {
    debug('Initializing...');
    this._options = _.defaults(_.clone(options) || {}, defaultOptions);
    this._proxy = this._options.proxy;
    this._url = options.url;

    if (!this._url) {
        throw new Error('You must pass `url` to JsDOMEnvironment');
    }
    this._window = this._document = null;
}

JsDOMEnvironment.prototype = _.create(Environment.prototype, /**@lends JsDOMEnvironment*/{

    /**
     * Prepare environment
     * @returns {Promise}
     */
    prepare: function() {
        debug('Preparing...');
        const deferred = vow.defer();

        const params = {
            url: this._url,
            // scripts: ['https://cdnjs.cloudflare.com/ajax/libs/sizzle/2.3.3/sizzle.min.js'],
            scripts: ['file:' + path.resolve(__dirname, '../vendor/sizzle.min.js')],
            done: (error, window) => {
                debug('Page is initialized in JsDom');
                if (error) {
                    return deferred.reject(error);
                }
                deferred.resolve(this._window = window);
            }
        };
        this._setProxy(params)
            ._setUserAgent(params);

        jsdom.env(params);
        return deferred.promise();
    },

    /**
     * Tear down environment
     * @returns {Promise}
     */
    tearDown: function() {
        debug('Tear down...');
        if (this._window) {
            this._window.close();
        }
        return vow.resolve();
    },

    /**
     * EvaluateJs in the environment
     * @returns {Promise}
     */
    evaluateJs: function() {
        debug('.evaluateJs() has called');
        const args = Array.prototype.slice.call(arguments, 0);

        const evalFunc = args.pop();
        if (typeof evalFunc !== 'function') {
            throw new Error('You must pass function as last argument to JsDOMEnvironment.evaluateJs');
        }

        if (!global.window) {
            global.window = this._window;
        }

        if (!global.document) {
            global.document = this._window.document;
        }

        if (!global.Sizzle) {
            global.Sizzle = window.Sizzle;
        }

        return Promise.resolve(evalFunc.apply(null, args));
    },

    /**
     * @param {object} params
     * @private
     */
    _setProxy(params) {
        if (this._proxy) {
            params.proxy = '';
            if (this._proxy.username) {
                params.proxy += this._proxy.username;
            }
            if (this._proxy.password) {
                params.proxy += `:${this._proxy.password}`;
            }
            if (params.proxy) {
                params.proxy += '@';
            }
            params.proxy += `${this._proxy.host}:${this._proxy.port}`;
            debug('.proxy() to ' + params.proxy);
        }

        return this;
    },

    _setUserAgent(params) {
        var userAgent = this._options.userAgent;
        if (Array.isArray(userAgent)) {
            userAgent = _.sample(this._options.userAgent);
        }
        debug('.userAgent() to ' + userAgent);
        params.userAgent = userAgent;
    },
});

module.exports = JsDOMEnvironment;
