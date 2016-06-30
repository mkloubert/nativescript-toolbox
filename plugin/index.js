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
var ApiClient = require('./apiclient/index');
var Batch = require('./batch/index');
var BitmapFactory = require('./bitmap-factory/index');
var Device = require('./Device');
var Enumerable = require('./enumerable/index');
var StringFormat = require('./stringformat/index');
var TypeUtils = require("utils/types");
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
 * Returns data of the current platform.
 */
function getPlatform() {
    var pd = Device.getPlatformData();
    // android
    Object.defineProperty(pd, 'android', {
        get: function () { return 1 === this.type; }
    });
    // ios
    Object.defineProperty(pd, 'ios', {
        get: function () { return 2 === this.type; }
    });
    return pd;
}
exports.getPlatform = getPlatform;
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
 * Opens a URL on the device.
 *
 * @param {String} url The URL to open.
 */
function openUrl(url) {
    try {
        return Device.openUri(url.trim());
    }
    catch (e) {
        return false;
    }
}
exports.openUrl = openUrl;
//# sourceMappingURL=index.js.map