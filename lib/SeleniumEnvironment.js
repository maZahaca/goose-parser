var _ = require('lodash'),
    Environment = require('./Environment'),
    debug = require('debug')('SeleniumEnvironment'),
    vow = require('vow'),
    selenium = require('selenium-standalone'),
    webdriverio = require('webdriverio'),
    seleniumPromise = null,
    fs = require('fs'),
    path = require('path');

var defaultOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

/**
 * @param {object} options
 * @constructor
 */
function SeleniumEnvironment (options) {
    debug('Initializing..');
    Environment.call(this, options);

    this._options = _.defaults(_.clone(options) || {}, defaultOptions);
    this._url = options.url;

    if (!this._url) {
        throw new Error('You must pass `url` to SeleniumEnvironment');
    }

    this._client = null;
}

SeleniumEnvironment.prototype = _.create(Environment.prototype, /**@lends SeleniumEnvironment*/{
    prepare: function () {
        debug('Preparing..');
        return Environment.prototype.prepare
            .call(this)
            .then(this._runSelenium, this)
            .then(this._navigate, this)
            .then(this._inject, this);
    },

    _runSelenium: function () {
        if (seleniumPromise) {
            debug('Selenium has already run, using running instance..');
            return seleniumPromise;
        }

        var deferred = vow.defer(),
            self = this;
        seleniumPromise = deferred.promise();

        debug('Install selenium...');
        selenium.install(function (err) {
            if (err) return deferred.reject(err);

            debug('Run selenium...');
            selenium.start(function (err, child) {
                if (err) return deferred.reject(err);

                process.on('exit', function () {
                    debug('Kill selenium...');
                    child.kill('SIGHUP');
                });

                debug('Selenium has run...');
                deferred.resolve();
            });
        });

        return seleniumPromise
            .then(this._setup, this);
    },

    _setup: function () {
        debug('Setup client...');
        this._client = webdriverio
            .remote(this._options)
            .init();
        return this._client;
    },

    _navigate: function () {
        debug('Navigation to %s', this._url);
        return this._client.url(this._url);
    },

    _inject: function () {
        debug('.inject()-ing parser libs');
        var files = [
            'vendor/sizzle.min.js'
        ];
        return vow.all(files.map(function (file) {
            var content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
            debug('injecting file %s', file);
            return this._client.execute(new Function(content));
        }, this));
    },

    evaluateJs: function () {
        var args = Array.prototype.slice.call(arguments, 0);

        var evalFunc = args.pop();
        if (typeof evalFunc !== 'function') {
            throw new Error('You must pass function as last argument to PhantomEnvironment.evaluateJs');
        }

        args.unshift(evalFunc);
        var result = this._client
            .execute.apply(this._client, args)
            .then(function (result) {
                return result.value;
            });
        return vow.cast(result);
    },

    tearDown: function () {

    }
});

module.exports = SeleniumEnvironment;
