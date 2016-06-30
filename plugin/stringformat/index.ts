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

import TypeUtils = require("utils/types");

var _formatProviders = [];

/**
 * Stores the value for a "new line".
 */
export var NewLine: string = "\n";

/**
 * Describes a format provider context.
 */
export interface IFormatProviderContext {
    /**
     * The format expression.
     */
    expression: string;
    
    /**
     * Gets if the expression has been handled or not.
     */
    handled: boolean;
    
    /**
     * Gets the underlying value.
     */
    value: any;
}

class FormatProviderContext implements IFormatProviderContext {
    _expression: string;
    _value: any;
    
    constructor(expr: string, val: any) {
        this._expression = expr;
        this._value = val;
    }
    
    handled: boolean = false;
    
    public get expression(): string {
        return this._expression;
    }
    
    public get value(): any {
        return this._value;
    }
}

/**
 * Builds a string.
 */
export class StringBuilder {
    /**
     * Stores the internal buffer.
     */
    protected _buffer: string;
    /**
     * Store the value for a "new line".
     */
    protected _newLine: string;

    /**
     * Initializes a new instance of that class.
     * 
     * @param any [initialVal] The initial value.
     */
    constructor(initialVal?: any) {
        this._newLine = this.valueToString(NewLine);
        this._buffer = this.valueToString(initialVal);
    }

    /**
     * Appends a value.
     * 
     * @chainable
     * 
     * @param any value The value to append.
     */
    public append(value: any): StringBuilder {
        this._buffer += this.valueToString(value);
        return this;
    }

    /**
     * Appends a formatted string.
     * 
     * @chainable
     * 
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    public appendFormat(formatStr: string, ...args: any[]): StringBuilder {
        return this.appendFormatArray(formatStr, args);
    }

    /**
     * Appends a formatted string.
     * 
     * @chainable
     * 
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    public appendFormatArray(formatStr: string, args?: any[]): StringBuilder {
        return this.append(formatArray(formatStr, args));
    }

    /**
     * Appends a new line by appending an optional value.
     * 
     * @chainable
     * 
     * @param any [value] The optional value to append.
     */
    public appendLine(value?: any): StringBuilder {
        return this.append(value)
                   .append(this._newLine);
    }

    /**
     * Resets the string.
     * 
     * @chainable
     */
    public clear(): StringBuilder {
        this._buffer = '';
        return this;
    }

    /**
     * Checks if another string and the string of that builder are equal.
     * 
     * @param any other The other string.
     * 
     * @return {Boolean} Are equal or not.
     */
    public equals(other: string | StringBuilder): boolean {
        if (TypeUtils.isNullOrUndefined(other)) {
            return false;
        }

        if (other instanceof StringBuilder) {
            return other.toString() === this._buffer;
        }

        return other === this._buffer;
    }

    /**
     * Executes a search on a string using a regular expression pattern,
     * and returns an array containing the results of that search.
     * 
     * @param RegExp regEx The rehular expression to use.
     * 
     * @return {RegExpExecArray} The result of the search.
     */
    public exec(regEx: RegExp): RegExpExecArray {
        return regEx.exec(this._buffer);
    }
    
    /**
     * Inserts a value.
     * 
     * @chainable
     * 
     * @param {Number} index The zero based index where to insert the value to.
     * @param any value The value to insert.
     */
    public insert(index: number, value: any): StringBuilder {
        this._buffer = this._buffer.substr(0, index) + 
                       this.valueToString(value) + 
                       this._buffer.substr(index + 1);

        return this;
    }

    /**
     * Inserts a formatted string.
     * 
     * @chainable
     * 
     * @param {Number} index The zero based index where to insert the formatted string to.
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    public insertFormat(index: number, formatStr: string, ...args: any[]): StringBuilder {
        return this.insertFormatArray(index,
                                      formatStr, args);
    }

    /**
     * Inserts a formatted string.
     * 
     * @chainable
     * 
     * @param {Number} index The zero based index where to insert the formatted string to.
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    public insertFormatArray(index: number, formatStr: string, args: any[]): StringBuilder {
        return this.insert(index,
                           formatArray(formatStr, args));
    }

    /**
     * Gets the current length of the current string.
     */
    public get length(): number {
        return this._buffer.length;
    }

    /**
     * Gets or sets the value for a "new line".
     */
    public get newLine(): string {
        return this._newLine;
    }
    public set newLine(value: string) {
        this._newLine = this.valueToString(value);
    }

    /**
     * Prepends a value.
     * 
     * @chainable
     * 
     * @param any value The value to prepend.
     */
    public prepend(value: any): StringBuilder {
        this._buffer = this.valueToString(value) + this._buffer;
        return this;
    }

    /**
     * Prepends a formatted string.
     * 
     * @chainable
     * 
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    public prependFormat(formatStr: string, ...args: any[]): StringBuilder {
        return this.prependFormatArray(formatStr, args);
    }

    /**
     * Prepends a formatted string.
     * 
     * @chainable
     * 
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    public prependFormatArray(formatStr: string, args?: any[]): StringBuilder {
        return this.prepend(formatArray(formatStr, args));
    }

    /**
     * Prepends a new line by prepending an optional value.
     * 
     * @chainable
     * 
     * @param any [value] The optional value to prepend.
     */
    public prependLine(value?: any): StringBuilder {
        return this.prepend(this._newLine)
                   .prepend(value);
    }

    /**
     * Removes the specified range of characters from this instance.
     * 
     * @chainable
     * 
     * @param {Number} startIndex The zero-based position where removal begins.
     * @param {Number} [length] The number of characters to remove.
     *                          If NOT defined: Anything behind startIndex is removed.
     */
    public remove(startIndex: number, length?: number): StringBuilder {
        if (arguments.length > 1) {
            this._buffer = this._buffer.substr(0, startIndex) + 
                           this._buffer.substr(startIndex + length);
        }
        else {
            this._buffer = this._buffer
                               .substr(0, startIndex);
        }

        return this;
    }

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
    public replace(searchValue: string | RegExp,
                   replacerOrValue: string | ((substring: string, ...args: any[]) => string),
                   startIndex?: number, count?: number): StringBuilder {
        
        if (TypeUtils.isNullOrUndefined(startIndex)) {
            startIndex = 0;
        }

        if (TypeUtils.isNullOrUndefined(count)) {
            count = this._buffer.length - startIndex;
        }

        var replacedStr = this._buffer
                              .substr(startIndex, count)
                              .replace(<any>searchValue, <any>replacerOrValue);
        
        this._buffer = this._buffer.substr(0, startIndex) + 
                       replacedStr + 
                       this._buffer.substr(startIndex + 1);
        
        return this;
    }

    /**
     * Checks if a pattern exists in a searched string.
     * 
     * @param {RegExp} regEx The regular expression.
     * 
     * @return {Boolean} Pattern exists or not.
     */
    public test(regEx: RegExp): boolean {
        return regEx.test(this._buffer);
    }

    /**
     * Returns that string as an char array.
     * 
     * @return {Array} The array of chars.
     */
    public toCharArray(): string[] {
        var arr: string[];
        for (var i = 0; i < this._buffer.length; i++) {
            arr.push(this._buffer[i]);
        }

        return arr;
    }

    /**
     * Creates the string representation of that builder.
     * 
     * @return {String} The string representation.
     */
    public toString(): string {
        return this._buffer;
    }

    /**
     * Converts a value to a string.
     * 
     * @param any value The input value.
     * 
     * @return {String} The value as string.
     */
    protected valueToString(value?: any): string {
        if (TypeUtils.isNullOrUndefined(value)) {
            return '';
        }

        return '' + value;
    }
}


/**
 * Adds a format provider.
 * 
 * @function addFormatProvider
 * 
 * @param {Function} providerCallback The provider callback.
 */
export function addFormatProvider(providerCallback: (ctx: IFormatProviderContext) => any) {
    _formatProviders.push(providerCallback);
}

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
export function compare(x: string, y: string) : number {
    if (x < y) {
        return -1;
    }
    
    if (x > y) {
        return 1;
    }
    
    return 0;
}

/**
 * Joins items to one string.
 * 
 * @function concat
 * 
 * @param {Array} itemList The list of items.
 * 
 * @return {String} The joined string.
 */
export function concat(itemList: any[]) : string {
    return join("", itemList);
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
export function format(formatStr: string, ...args: any[]) : string {
    return formatArray(formatStr, args);
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
export function formatArray(formatStr: string, args: any[]) : string {
    if (!formatStr) {
        return formatStr;
    }

    if (!args) {
        args = [];
    }
    
    return formatStr.replace(/{(\d+)(\:)?([^}]*)}/g, function(match, index, formatSeparator, formatExpr) {
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

/**
 * Checks if a string is (null), undefined or empty.
 * 
 * @function isEmpty
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / undefined / empty or not.
 */
export function isEmpty(str: string) {
    return null === str ||
           undefined === str ||
           "" === str;
}

/**
 * Checks if a string is (null), undefined, empty or contains whitespaces only.
 * 
 * @function isEmptyOrWhitespace
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / undefined / empty / contains whitespaces only or not.
 */
export function isEmptyOrWhitespace(str: string) {
    return isEmpty(str) ||
           isWhitespace(str);
}

/**
 * Checks if a string is (null) or empty.
 * 
 * @function isNullOrEmpty
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / empty or not.
 */
export function isNullOrEmpty(str: string) : boolean {
    return null === str ||
           "" === str;
}

/**
 * Checks if a string is (null) or undefined.
 * 
 * @function isNullOrUndefined
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / undefined or not.
 */
export function isNullOrUndefined(str: string) : boolean {
    return null === str ||
           undefined === str;
}

/**
 * Checks if a string is (null), empty or contains whitespaces only.
 * 
 * @function isNullOrWhitespace
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is (null) / empty / contains whitespaces or not.
 */
export function isNullOrWhitespace(str: string) : boolean {
    if (null === str) {
        return true;
    }
    
    return isWhitespace(str);
}

/**
 * Checks if a string is empty or contains whitespaces only.
 * 
 * @function isWhitespace
 * 
 * @param {String} str The string to check.
 * 
 * @return {Boolean} Is empty / contains whitespaces only or not.
 */
export function isWhitespace(str: string) : boolean {
    return !isNullOrUndefined(str) &&
           "" === str.trim();
}

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
export function join(separator: string, itemList: any[]) : string {    
    var result = "";
    
    for (var i = 0; i < itemList.length; i++) {
        if (i > 0) {
            result += separator;
        }

        result += itemList[i];
    }
    
    return result;
}

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
export function similarity(left : string, right : string, ignoreCase? : boolean, trim? : boolean) : number {
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
                    matrix[i + 1][j + 1] = Math.min(matrix[i][j + 1] + 1,
                                                    matrix[i + 1][j] + 1);

                    // substitution
                    matrix[i + 1][j + 1] = Math.min(matrix[i + 1][j + 1],
                                                    matrix[i][j] + 1);
                }
            }
            
            distance = matrix[left.length][right.length];
        }
    }
    
    return 1.0 - distance / Math.max(left.length,
                                     right.length);
}
