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

import ApiClient = require('./apiclient/index');
import Batch = require('./batch/index');
import BitmapFactory = require('./bitmap-factory/index');
import Enumerable = require('./enumerable/index');
import StringFormat = require('./stringformat/index');

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
export function asBitmap(v: any, throwException: boolean = true): BitmapFactory.IBitmap {
    return BitmapFactory.asBitmap(v, throwException);
}

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
export function asEnumerable(v: any, throwException: boolean = true): Enumerable.IEnumerable<any> {
    return Enumerable.asEnumerable(v, throwException);
}

/**
 * Creates a new bitmap.
 * 
 * @param {Number} width The width of the new image.
 * @param {Number} [height] The optional height of the new image. If not defined, the width is taken as value.
 * 
 * @return {IBitmap} The new bitmap.
 */
export function createBitmap(width: number, height?: number): BitmapFactory.IBitmap {
    return BitmapFactory.create(width, height);
}

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
export function format(formatStr: string, ...args: any[]): string {
    return StringFormat.formatArray(formatStr, args);
}

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
export function formatArray(formatStr: string, args: any[]): string {
    return StringFormat.formatArray(formatStr, args);
}

/**
 * Checks if a value is a sequence.
 * 
 * @param any v The value to check.
 * 
 * @return {Boolean} Is sequence or not.
 */
export function isEnumerable(v: any): boolean {
    return Enumerable.isEnumerable(v);
}

/**
 * Creates a new batch.
 * 
 * @return {IBatchOperation} The first operation of the created batch.
 */
export function newBatch(firstAction: (ctx : Batch.IBatchOperationContext) => void): Batch.IBatchOperation {
    return Batch.newBatch(firstAction);
}

/**
 * Creates a new client.
 * 
 * @param any config The configuration data / base URL for the client.
 * 
 * @return {IApiClient} The new client.
 */
export function newClient(config : ApiClient.IApiClientConfig | string) : ApiClient.IApiClient {
    return ApiClient.newClient(config);
}
