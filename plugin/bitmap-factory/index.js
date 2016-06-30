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
var BitmapFactory = require("./BitmapFactory");
var TypeUtils = require("utils/types");
/**
 * List of outout formats.
 */
(function (OutputFormat) {
    /**
     * PNG
     */
    OutputFormat[OutputFormat["PNG"] = 1] = "PNG";
    /**
     * JPEG
     */
    OutputFormat[OutputFormat["JPEG"] = 2] = "JPEG";
})(exports.OutputFormat || (exports.OutputFormat = {}));
var OutputFormat = exports.OutputFormat;
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
    var result = BitmapFactory.asBitmapObject(v);
    if (throwException && (false === result)) {
        throw "No valid value for a bitmap!";
    }
    return result;
}
exports.asBitmap = asBitmap;
/**
 * Creates a new bitmap.
 *
 * @param {Number} width The width of the new image.
 * @param {Number} [height] The optional height of the new image. If not defined, the width is taken as value.
 *
 * @return {IBitmap} The new bitmap.
 */
function create(width, height) {
    if (TypeUtils.isNullOrUndefined(height)) {
        height = width;
    }
    return BitmapFactory.createBitmap(width, height);
}
exports.create = create;
//# sourceMappingURL=index.js.map