// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
"use strict";
var ApiClient = require('./apiclient');
var Batch = require('./batch');
var BitmapFactory = require('./bitmap-factory');
var CryptoJS = require('./crypto-js');
var Device = require('./Device');
var Enumerable = require('./enumerable');
var MD5 = require('./crypto-js/md5');
var Moment = require('./moment');
var observable_array_1 = require('data/observable-array');
var SHA1 = require('./crypto-js/sha1');
var SHA256 = require('./crypto-js/sha256');
var SHA3 = require('./crypto-js/sha3');
var SHA384 = require('./crypto-js/sha384');
var SHA512 = require('./crypto-js/sha512');
var Sqlite = require('./sqlite');
var StringFormat = require('./stringformat');
var TypeUtils = require("utils/types");
var virtual_array_1 = require('data/virtual-array');
var XmlObjects = require('./xmlobjects');
var Yaml = require('./js-yaml');
/**
 * List of known platforms.
 */
(function (Platform) {
    /**
     * Android
     */
    Platform[Platform["Android"] = 1] = "Android";
    /**
     * iOS
     */
    Platform[Platform["iOS"] = 2] = "iOS";
})(exports.Platform || (exports.Platform = {}));
var Platform = exports.Platform;
var SQLiteConnection = (function () {
    function SQLiteConnection(conn, name) {
        this._conn = conn;
        this._name = name;
    }
    SQLiteConnection.prototype.asArray = function (v) {
        if (v instanceof Array) {
            return v;
        }
        if (TypeUtils.isNullOrUndefined(v)) {
            return [];
        }
        if (isEnumerable(v)) {
            return v.toArray();
        }
        var wrapper;
        if ((v instanceof observable_array_1.ObservableArray) ||
            (v instanceof virtual_array_1.VirtualArray)) {
            wrapper = {
                getItem: function (i) { return v.getItem(i); },
                length: function () { return v.length; },
            };
        }
        else {
            wrapper = {
                getItem: function (i) { return v[i]; },
                length: function () { return v.length; },
            };
        }
        var arr = [];
        for (var i = 0; i < wrapper.length(); i++) {
            arr.push(wrapper.getItem(i));
        }
        return arr;
    };
    SQLiteConnection.prototype.close = function (callback) {
        this._conn.close(function (err) {
            if (TypeUtils.isNullOrUndefined(callback)) {
                return;
            }
            var resultCtx = {};
            if (!TypeUtils.isNullOrUndefined(err)) {
                // error
                Object.defineProperty(resultCtx, 'error', {
                    get: function () { return err; }
                });
            }
            callback(resultCtx);
        });
    };
    Object.defineProperty(SQLiteConnection.prototype, "conn", {
        get: function () {
            return this._conn;
        },
        enumerable: true,
        configurable: true
    });
    SQLiteConnection.prototype.createCell = function (parent, cells, i) {
        var newCell = {};
        var val = cells[i];
        Object.defineProperty(newCell, 'index', {
            get: function () { return i; }
        });
        Object.defineProperty(newCell, 'row', {
            get: function () { return parent; }
        });
        Object.defineProperty(newCell, 'value', {
            get: function () { return val; }
        });
        return newCell;
    };
    SQLiteConnection.prototype.createRow = function (resultSet, i) {
        var newRow = {};
        var cellList = [];
        var r = resultSet[i];
        for (var i = 0; i < r.length; i++) {
            var c = this.createCell(newRow, r, i);
            cellList.push(c);
        }
        Object.defineProperty(newRow, 'cells', {
            get: function () { return cellList; }
        });
        Object.defineProperty(newRow, 'index', {
            get: function () { return i; }
        });
        return newRow;
    };
    SQLiteConnection.prototype.execute = function (cfg) {
        this._conn
            .execSQL(cfg.sql, this.asArray(cfg.args), function (err, insertId) {
            if (TypeUtils.isNullOrUndefined(cfg.callback)) {
                return;
            }
            var resultCtx = {};
            if (TypeUtils.isNullOrUndefined(err)) {
                // id
                Object.defineProperty(resultCtx, 'id', {
                    get: function () { return insertId; }
                });
            }
            else {
                // error
                Object.defineProperty(resultCtx, 'error', {
                    get: function () { return err; }
                });
            }
            cfg.callback(resultCtx);
        });
    };
    Object.defineProperty(SQLiteConnection.prototype, "isOpen", {
        get: function () {
            return this._conn.isOpen();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SQLiteConnection.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    SQLiteConnection.prototype.selectAll = function (cfg) {
        var me = this;
        this._conn
            .all(cfg.sql, this.asArray(cfg.args), function (err, resultSet) {
            var resultCtx = {};
            if (TypeUtils.isNullOrUndefined(err)) {
                var result = [];
                if (!TypeUtils.isNullOrUndefined(resultSet)) {
                    for (var i = 0; i < resultSet.length; i++) {
                        var newRow = me.createRow(resultSet, i);
                        if (!TypeUtils.isNullOrUndefined(newRow)) {
                            result.push(newRow);
                        }
                    }
                }
                result = asEnumerable(result);
                // result
                Object.defineProperty(resultCtx, 'result', {
                    get: function () { return result; }
                });
            }
            else {
                // error
                Object.defineProperty(resultCtx, 'error', {
                    get: function () { return err; }
                });
            }
            cfg.callback(resultCtx);
        });
    };
    return SQLiteConnection;
}());
/**
 * Returns a value as bitmap object.
 *
 * @param any v The input value.
 * @param {Boolean} [throwException] Throw exception if 'v' is invalid or return (false).
 *
 * @throws Input value is invalid.
 *
 * @return {IBitmap} The output value or (false) if input value is invalid.
 */
function asBitmap(v, throwException) {
    if (throwException === void 0) { throwException = true; }
    return BitmapFactory.asBitmap(v, throwException);
}
exports.asBitmap = asBitmap;
/**
 * Returns a value as sequence.
 *
 * @param any v The input value.
 * @param {Boolean} [throwException] Throws an exception if input value is no valid value.
 *
 * @throws Invalid value.
 *
 * @return any The value as sequence or (false) if input value is no valid object.
 */
function asEnumerable(v, throwException) {
    if (throwException === void 0) { throwException = true; }
    return Enumerable.asEnumerable(v, throwException);
}
exports.asEnumerable = asEnumerable;
/**
 * Creates a new bitmap.
 *
 * @param {Number} width The width of the new image.
 * @param {Number} [height] The optional height of the new image. If not defined, the width is taken as value.
 *
 * @return {IBitmap} The new bitmap.
 */
function createBitmap(width, height) {
    return BitmapFactory.create(width, height);
}
exports.createBitmap = createBitmap;
/**
 * Decrypts a value / an object with AES.
 *
 * @param {String} v The value to decrypt.
 *
 * @return {T} The decrypted value.
 */
function decrypt(v, key) {
    var bytes = CryptoJS.AES.decrypt(v, key);
    var json = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(json);
}
exports.decrypt = decrypt;
/**
 * Encrypts a value / an object with AES.
 *
 * @param any v The value to encrypt.
 *
 * @return {String} The encrypted value.
 */
function encrypt(v, key) {
    return CryptoJS.AES
        .encrypt(JSON.stringify(v), key)
        .toString();
}
exports.encrypt = encrypt;
/**
 * Formats a string.
 *
 * @function format
 *
 * @param {String} formatStr The format string.
 * @param ...any args One or more argument for the format string.
 *
 * @return {String} The formatted string.
 */
function format(formatStr) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return StringFormat.formatArray(formatStr, args);
}
exports.format = format;
/**
 * Formats a string.
 *
 * @function formatArray
 *
 * @param {String} formatStr The format string.
 * @param {Array} args The list of arguments for the format string.
 *
 * @return {String} The formatted string.
 */
function formatArray(formatStr, args) {
    return StringFormat.formatArray(formatStr, args);
}
exports.formatArray = formatArray;
/**
 * Alias for 'parseXml()'
 */
function fromXml(xml, processNamespaces, angularSyntax) {
    return parseXml(xml, processNamespaces, angularSyntax);
}
exports.fromXml = fromXml;
/**
 * Alias for 'parseYaml()'
 */
function fromYaml(y, opts) {
    return parseYaml(y, opts);
}
exports.fromYaml = fromYaml;
/**
 * Tries to return the application context of the current app.
 * For Android this is an 'android.content.Context' object.
 * In iOS this is the app delegate.
 *
 * @return any The application context (if available.)
 */
function getApplicationContext() {
    return Device.getAppContext();
}
exports.getApplicationContext = getApplicationContext;
/**
 * Returns the native view of the app.
 * For Android this is an activity.
 * For iOS this the the root view controller.
 *
 * @return any The view object.
 */
function getNativeView() {
    var view = Device.getAppView();
    if (!view) {
        view = undefined;
    }
    return view;
}
exports.getNativeView = getNativeView;
/**
 * Returns information of the current platform.
 *
 * @return {IPlatformData} The platform information.
 */
function getPlatform() {
    var pd = Device.getPlatformData();
    var nativeView = getNativeView();
    // android
    Object.defineProperty(pd, 'android', {
        get: function () { return 1 === this.type; }
    });
    // ios
    Object.defineProperty(pd, 'ios', {
        get: function () { return 2 === this.type; }
    });
    // view
    Object.defineProperty(pd, 'view', {
        get: function () { return nativeView; }
    });
    return pd;
}
exports.getPlatform = getPlatform;
/**
 * Alias for 'uuid()' function.
 */
function guid(separator) {
    if (separator === void 0) { separator = '-'; }
    return uuid(separator);
}
exports.guid = guid;
/**
 * Invokes an action for a specific platform.
 *
 * @param {IInvokeForPlatformContext} cfg The config data.
 *
 * @return any The result of the invoked callback.
 */
function invokeForPlatform(cfg) {
    var platform = getPlatform();
    var callback;
    if (platform.android) {
        callback = cfg.android;
    }
    else if (platform.ios) {
        callback = cfg.ios;
    }
    if (!TypeUtils.isNullOrUndefined(callback)) {
        return callback(platform);
    }
}
exports.invokeForPlatform = invokeForPlatform;
/**
 * Checks if the device is in debug mode or not.
 *
 * @return {Boolean} Device runs in debug mode or not.
 */
function isDebug() {
    return Device.isInDebugMode();
}
exports.isDebug = isDebug;
/**
 * Checks if a value is a sequence.
 *
 * @param any v The value to check.
 *
 * @return {Boolean} Is sequence or not.
 */
function isEnumerable(v) {
    return Enumerable.isEnumerable(v);
}
exports.isEnumerable = isEnumerable;
/**
 * Returns the MD5 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
function md5(v) {
    return MD5(v).toString();
}
exports.md5 = md5;
/**
 * Creates a new batch.
 *
 * @return {IBatchOperation} The first operation of the created batch.
 */
function newBatch(firstAction) {
    return Batch.newBatch(firstAction);
}
exports.newBatch = newBatch;
/**
 * Creates a new client.
 *
 * @param any config The configuration data / base URL for the client.
 *
 * @return {IApiClient} The new client.
 */
function newClient(config) {
    return ApiClient.newClient(config);
}
exports.newClient = newClient;
/**
 * Gets the current time.
 *
 * @return {Moment} The current time.
 */
function now() {
    return Moment();
}
exports.now = now;
/**
 * Opens a database connection.
 *
 * @param {String} dbName The name of the database to open.
 * @param {Function} callback The callback with the result data.
 */
function openDatabase(cfg) {
    var openReadOnly = false;
    if (!TypeUtils.isNullOrUndefined(cfg.readOnly)) {
        openReadOnly = cfg.readOnly;
    }
    var r = {};
    // name
    Object.defineProperty(r, 'name', {
        get: function () { return cfg.name; }
    });
    var p = new Sqlite(cfg.name, {
        readOnly: openReadOnly
    }).then(function (db) {
        var conn = new SQLiteConnection(db, cfg.name);
        // db
        Object.defineProperty(r, 'db', {
            get: function () { return conn; }
        });
        cfg.callback(r);
    }, function (err) {
        // error
        Object.defineProperty(r, 'error', {
            get: function () { return err; }
        });
        cfg.callback(r);
    });
}
exports.openDatabase = openDatabase;
/**
 * Opens a URL on the device.
 *
 * @param {String} url The URL to open.
 *
 * @return {Boolean} Operation was successful or not.
 */
function openUrl(url) {
    try {
        return Device.openUri(url.trim());
    }
    catch (e) {
        console.log('[ERROR] (nativescript-toolbox).openUrl(): ' + e);
        return false;
    }
}
exports.openUrl = openUrl;
/**
 * Parses a XML string.
 *
 * @param {String} xml The string to parse.
 * @param {Boolean} [processNamespaces] Process namespaces or not.
 * @param {Boolean} [angularSyntax] Handle Angular syntax or not.
 *
 * @return {XDocument} The new document.
 *
 * @throws Parse error.
 */
function parseXml(xml, processNamespaces, angularSyntax) {
    return XmlObjects.parse(xml, processNamespaces, angularSyntax);
}
exports.parseXml = parseXml;
/**
 * Parses YAML data to an object.
 *
 * @param any y The YAML data.
 * @param {IYamlDecodeOptions} [opts] The custom options to use.
 *
 * @return {T} The YAML data as object.
 *
 * @throws Parse error.
 */
function parseYaml(y, opts) {
    return Yaml.safeLoad(y, opts);
}
exports.parseYaml = parseYaml;
/**
 * Runs an action on the UI thread.
 *
 * @param {Function} action The action to invoke.
 * @param {T} [state] The optional state object for the action.
 * @param {Function} onError The custom action that is invoked on error.
 *
 * @return {Boolean} Operation was successful or not.
 */
function runOnUI(action, state, onError) {
    try {
        if (!TypeUtils.isNullOrUndefined(action)) {
            try {
                Device.runOnUIThread(action, state, onError);
            }
            catch (e) {
                if (TypeUtils.isNullOrUndefined(onError)) {
                    throw e;
                }
                console.log('[ERROR] (nativescript-toolbox).runOnUI(1): ' + e);
                onError(e, state);
            }
        }
    }
    catch (e) {
        console.log('[ERROR] (nativescript-toolbox).runOnUI(0): ' + e);
        return false;
    }
}
exports.runOnUI = runOnUI;
/**
 * Changes the visibility of the device's status bar.
 *
 * @param {Boolean} isVisible Status bar should be visible (true) or not (false)
 * @param {Function} [callback] The optional callback to call.
 * @param {T} [tag] The custom object for the callback.
 */
function setStatusBarVisibility(isVisible, callback, tag) {
    try {
        Device.changeStatusBarVisibility(isVisible ? true : false, callback, tag);
    }
    catch (e) {
        console.log('[ERROR] (nativescript-toolbox).setStatusBarVisibility(): ' + e);
        if (!TypeUtils.isNullOrUndefined(callback)) {
            callback({
                code: -1,
                error: e,
                tag: tag,
            });
        }
    }
}
exports.setStatusBarVisibility = setStatusBarVisibility;
/**
 * Returns the SHA-1 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
function sha1(v) {
    return SHA1(v).toString();
}
exports.sha1 = sha1;
/**
 * Returns the SHA-256 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
function sha256(v) {
    return SHA256(v).toString();
}
exports.sha256 = sha256;
/**
 * Returns the SHA-3 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
function sha3(v) {
    return SHA3(v).toString();
}
exports.sha3 = sha3;
/**
 * Returns the SHA-384 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
function sha384(v) {
    return SHA384(v).toString();
}
exports.sha384 = sha384;
/**
 * Returns the SHA-512 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
function sha512(v) {
    return SHA512(v).toString();
}
exports.sha512 = sha512;
/**
 * Converts an object / a value to YAML.
 *
 * @param any v The value to convert.
 * @param {IYamlEncodeOptions} [opts] The custom options to use.
 *
 * @return {String} The YAML data.
 */
function toYaml(v, opts) {
    return Yaml.safeDump(v, opts);
}
exports.toYaml = toYaml;
/**
 * Creates a new unique ID / GUID.
 *
 * @param {string} [separator] The custom separator to use.
 *
 * s. http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
function uuid(separator) {
    if (separator === void 0) { separator = '-'; }
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    if (TypeUtils.isNullOrUndefined(separator)) {
        separator = '';
    }
    return s4() + s4() + separator + s4() + separator + s4() + separator +
        s4() + separator + s4() + s4() + s4();
}
exports.uuid = uuid;
//# sourceMappingURL=index.js.map