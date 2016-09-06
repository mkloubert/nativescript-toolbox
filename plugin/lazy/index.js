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
/**
 * A class that creates a value onces and when it is needed.
 */
var Lazy = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param {Function} valueFactory The function that creates the value.
     */
    function Lazy(valueFactory) {
        this._valueFactory = valueFactory;
        this.reset();
    }
    Object.defineProperty(Lazy.prototype, "isValueCreated", {
        /**
         * Gets if the value has been created or not.
         */
        get: function () {
            return this._isValueCreated;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the state of that class.
     */
    Lazy.prototype.reset = function () {
        this._isValueCreated = false;
    };
    Object.defineProperty(Lazy.prototype, "value", {
        /**
         * Gets the (lazy) value.
         */
        get: function () {
            if (!this._isValueCreated) {
                this._value = this._valueFactory();
                this._isValueCreated = true;
            }
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Lazy;
}());
exports.Lazy = Lazy;
//# sourceMappingURL=index.js.map