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
var TypeUtils = require("utils/types");
var _formatProviders = [];
/**
 * Stores the value for a "new line".
 */
exports.NewLine = "\n";
var FormatProviderContext = (function () {
    function FormatProviderContext(expr, val) {
        this.handled = false;
        this._expression = expr;
        this._value = val;
    }
    Object.defineProperty(FormatProviderContext.prototype, "expression", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormatProviderContext.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return FormatProviderContext;
}());
/**
 * Builds a string.
 */
var StringBuilder = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param any [initialVal] The initial value.
     */
    function StringBuilder(initialVal) {
        this._newLine = this.valueToString(exports.NewLine);
        this._buffer = this.valueToString(initialVal);
    }
    /**
     * Appends a value.
     *
     * @chainable
     *
     * @param any value The value to append.
     */
    StringBuilder.prototype.append = function (value) {
        this._buffer += this.valueToString(value);
        return this;
    };
    /**
     * Appends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    StringBuilder.prototype.appendFormat = function (formatStr) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.appendFormatArray(formatStr, args);
    };
    /**
     * Appends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    StringBuilder.prototype.appendFormatArray = function (formatStr, args) {
        return this.append(formatArray(formatStr, args));
    };
    /**
     * Appends a new line by appending an optional value.
     *
     * @chainable
     *
     * @param any [value] The optional value to append.
     */
    StringBuilder.prototype.appendLine = function (value) {
        return this.append(value)
            .append(this._newLine);
    };
    /**
     * Resets the string.
     *
     * @chainable
     */
    StringBuilder.prototype.clear = function () {
        this._buffer = '';
        return this;
    };
    /**
     * Checks if another string and the string of that builder are equal.
     *
     * @param any other The other string.
     *
     * @return {Boolean} Are equal or not.
     */
    StringBuilder.prototype.equals = function (other) {
        if (TypeUtils.isNullOrUndefined(other)) {
            return false;
        }
        if (other instanceof StringBuilder) {
            return other.toString() === this._buffer;
        }
        return other === this._buffer;
    };
    /**
     * Executes a search on a string using a regular expression pattern,
     * and returns an array containing the results of that search.
     *
     * @param RegExp regEx The rehular expression to use.
     *
     * @return {RegExpExecArray} The result of the search.
     */
    StringBuilder.prototype.exec = function (regEx) {
        return regEx.exec(this._buffer);
    };
    /**
     * Inserts a value.
     *
     * @chainable
     *
     * @param {Number} index The zero based index where to insert the value to.
     * @param any value The value to insert.
     */
    StringBuilder.prototype.insert = function (index, value) {
        this._buffer = this._buffer.substr(0, index) +
            this.valueToString(value) +
            this._buffer.substr(index + 1);
        return this;
    };
    /**
     * Inserts a formatted string.
     *
     * @chainable
     *
     * @param {Number} index The zero based index where to insert the formatted string to.
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    StringBuilder.prototype.insertFormat = function (index, formatStr) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return this.insertFormatArray(index, formatStr, args);
    };
    /**
     * Inserts a formatted string.
     *
     * @chainable
     *
     * @param {Number} index The zero based index where to insert the formatted string to.
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    StringBuilder.prototype.insertFormatArray = function (index, formatStr, args) {
        return this.insert(index, formatArray(formatStr, args));
    };
    Object.defineProperty(StringBuilder.prototype, "length", {
        /**
         * Gets the current length of the current string.
         */
        get: function () {
            return this._buffer.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StringBuilder.prototype, "newLine", {
        /**
         * Gets or sets the value for a "new line".
         */
        get: function () {
            return this._newLine;
        },
        set: function (value) {
            this._newLine = this.valueToString(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Prepends a value.
     *
     * @chainable
     *
     * @param any value The value to prepend.
     */
    StringBuilder.prototype.prepend = function (value) {
        this._buffer = this.valueToString(value) + this._buffer;
        return this;
    };
    /**
     * Prepends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    StringBuilder.prototype.prependFormat = function (formatStr) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.prependFormatArray(formatStr, args);
    };
    /**
     * Prepends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    StringBuilder.prototype.prependFormatArray = function (formatStr, args) {
        return this.prepend(formatArray(formatStr, args));
    };
    /**
     * Prepends a new line by prepending an optional value.
     *
     * @chainable
     *
     * @param any [value] The optional value to prepend.
     */
    StringBuilder.prototype.prependLine = function (value) {
        return this.prepend(this._newLine)
            .prepend(value);
    };
    /**
     * Removes the specified range of characters from this instance.
     *
     * @chainable
     *
     * @param {Number} startIndex The zero-based position where removal begins.
     * @param {Number} [length] The number of characters to remove.
     *                          If NOT defined: Anything behind startIndex is removed.
     */
    StringBuilder.prototype.remove = function (startIndex, length) {
        if (arguments.length > 1) {
            this._buffer = this._buffer.substr(0, startIndex) +
                this._buffer.substr(startIndex + length);
        }
        else {
            this._buffer = this._buffer
                .substr(0, startIndex);
        }
        return this;
    };
    /**
     * Replaces parts of the string.
     *
     * @chainable
     *
     * @param {String|RegExp} searchValue The string or the regular expression to search for.
     * @param {String|RegExp} replacerOrValue The value or callback that replaces the matches.
     * @param {Number} startIndex The optional start index that defines where replacements starts.
     * @param {Number} count The optional number of chars (beginning at start index) that should be replaced.
     */
    StringBuilder.prototype.replace = function (searchValue, replacerOrValue, startIndex, count) {
        if (TypeUtils.isNullOrUndefined(startIndex)) {
            startIndex = 0;
        }
        if (TypeUtils.isNullOrUndefined(count)) {
            count = this._buffer.length - startIndex;
        }
        var replacedStr = this._buffer
            .substr(startIndex, count)
            .replace(searchValue, replacerOrValue);
        this._buffer = this._buffer.substr(0, startIndex) +
            replacedStr +
            this._buffer.substr(startIndex + 1);
        return this;
    };
    /**
     * Checks if a pattern exists in a searched string.
     *
     * @param {RegExp} regEx The regular expression.
     *
     * @return {Boolean} Pattern exists or not.
     */
    StringBuilder.prototype.test = function (regEx) {
        return regEx.test(this._buffer);
    };
    /**
     * Returns that string as an char array.
     *
     * @return {Array} The array of chars.
     */
    StringBuilder.prototype.toCharArray = function () {
        var arr;
        for (var i = 0; i < this._buffer.length; i++) {
            arr.push(this._buffer[i]);
        }
        return arr;
    };
    /**
     * Creates the string representation of that builder.
     *
     * @return {String} The string representation.
     */
    StringBuilder.prototype.toString = function () {
        return this._buffer;
    };
    /**
     * Converts a value to a string.
     *
     * @param any value The input value.
     *
     * @return {String} The value as string.
     */
    StringBuilder.prototype.valueToString = function (value) {
        if (TypeUtils.isNullOrUndefined(value)) {
            return '';
        }
        return '' + value;
    };
    return StringBuilder;
}());
exports.StringBuilder = StringBuilder;
/**
 * Adds a format provider.
 *
 * @function addFormatProvider
 *
 * @param {Function} providerCallback The provider callback.
 */
function addFormatProvider(providerCallback) {
    _formatProviders.push(providerCallback);
}
exports.addFormatProvider = addFormatProvider;
/**
 * Compares two strings.
 *
 * @function compare
 *
 * @param {String} x The left string.
 * @param {String} y The right string.
 *
 * @return {Number} The compare value (0: are equal; 1: x is greater than y; 2: x is less than y)
 */
function compare(x, y) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
}
exports.compare = compare;
/**
 * Joins items to one string.
 *
 * @function concat
 *
 * @param {Array} itemList The list of items.
 *
 * @return {String} The joined string.
 */
function concat(itemList) {
    return join("", itemList);
}
exports.concat = concat;
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
    return formatArray(formatStr, args);
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
    if (!formatStr) {
        return formatStr;
    }
    if (!args) {
        args = [];
    }
    return formatStr.replace(/{(\d+)(\:)?([^}]*)}/g, function (match, index, formatSeparator, formatExpr) {
        var resultValue = args[index];
        if (resultValue === undefined) {
            return match;
        }
        var funcDepth = 0;
        while (typeof resultValue === "function") {
            resultValue = resultValue(index, args, match, formatExpr, funcDepth++);
        }
        if (formatSeparator === ':') {
            // use format providers
            for (var i = 0; i < _formatProviders.length; i++) {
                var fp = _formatProviders[i];
                var fpCtx = new FormatProviderContext(formatExpr, resultValue);
                var fpResult;
                try {
                    fpResult = fp(fpCtx);
                }
                catch (e) {
                    continue;
                }
                if (fpCtx.handled) {
                    // handled: first wins
                    resultValue = fpResult;
                    break;
                }
            }
        }
        if (resultValue !== undefined) {
            return resultValue;
        }
        // not defined => return whole match string
        return match;
    });
}
exports.formatArray = formatArray;
/**
 * Checks if a string is (null), undefined or empty.
 *
 * @function isEmpty
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined / empty or not.
 */
function isEmpty(str) {
    return null === str ||
        undefined === str ||
        "" === str;
}
exports.isEmpty = isEmpty;
/**
 * Checks if a string is (null), undefined, empty or contains whitespaces only.
 *
 * @function isEmptyOrWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined / empty / contains whitespaces only or not.
 */
function isEmptyOrWhitespace(str) {
    return isEmpty(str) ||
        isWhitespace(str);
}
exports.isEmptyOrWhitespace = isEmptyOrWhitespace;
/**
 * Checks if a string is (null) or empty.
 *
 * @function isNullOrEmpty
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / empty or not.
 */
function isNullOrEmpty(str) {
    return null === str ||
        "" === str;
}
exports.isNullOrEmpty = isNullOrEmpty;
/**
 * Checks if a string is (null) or undefined.
 *
 * @function isNullOrUndefined
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined or not.
 */
function isNullOrUndefined(str) {
    return null === str ||
        undefined === str;
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Checks if a string is (null), empty or contains whitespaces only.
 *
 * @function isNullOrWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / empty / contains whitespaces or not.
 */
function isNullOrWhitespace(str) {
    if (null === str) {
        return true;
    }
    return isWhitespace(str);
}
exports.isNullOrWhitespace = isNullOrWhitespace;
/**
 * Checks if a string is empty or contains whitespaces only.
 *
 * @function isWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is empty / contains whitespaces only or not.
 */
function isWhitespace(str) {
    return !isNullOrUndefined(str) &&
        "" === str.trim();
}
exports.isWhitespace = isWhitespace;
/**
 * Joins items to one string.
 *
 * @function join
 *
 * @param {String} separator The separator.
 * @param {Array} itemList The list of items.
 *
 * @return {String} The joined string.
 */
function join(separator, itemList) {
    var result = "";
    for (var i = 0; i < itemList.length; i++) {
        if (i > 0) {
            result += separator;
        }
        result += itemList[i];
    }
    return result;
}
exports.join = join;
/**
 * Returns the similarity of strings.
 *
 * @function similarity
 *
 * @param {string} left The "left" string.
 * @param {string} right The "right" string.
 * @param {boolean} [ignoreCase] Compare case insensitive or not.
 * @param {boolean} [trim] Trim both strings before comparison or not.
 *
 * @return {Number} The similarity between 0 (0 %) and 1 (100 %).
 */
function similarity(left, right, ignoreCase, trim) {
    if (left === right) {
        return 1;
    }
    if (TypeUtils.isNullOrUndefined(left) ||
        TypeUtils.isNullOrUndefined(right)) {
        return 0;
    }
    if (arguments.length < 4) {
        if (arguments.length < 3) {
            ignoreCase = false;
        }
        trim = false;
    }
    if (ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
    }
    if (trim) {
        left = left.trim();
        right = right.trim();
    }
    var distance = 0;
    if (left !== right) {
        var matrix = new Array(left.length + 1);
        for (var i = 0; i < matrix.length; i++) {
            matrix[i] = new Array(right.length + 1);
            for (var ii = 0; ii < matrix[i].length; ii++) {
                matrix[i][ii] = 0;
            }
        }
        for (var i = 0; i <= left.length; i++) {
            // delete
            matrix[i][0] = i;
        }
        for (var j = 0; j <= right.length; j++) {
            // insert
            matrix[0][j] = j;
        }
        for (var i = 0; i < left.length; i++) {
            for (var j = 0; j < right.length; j++) {
                if (left[i] === right[j]) {
                    matrix[i + 1][j + 1] = matrix[i][j];
                }
                else {
                    // delete or insert
                    matrix[i + 1][j + 1] = Math.min(matrix[i][j + 1] + 1, matrix[i + 1][j] + 1);
                    // substitution
                    matrix[i + 1][j + 1] = Math.min(matrix[i + 1][j + 1], matrix[i][j] + 1);
                }
            }
            distance = matrix[left.length][right.length];
        }
    }
    return 1.0 - distance / Math.max(left.length, right.length);
}
exports.similarity = similarity;
//# sourceMappingURL=index.js.map