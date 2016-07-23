/**
 * Stores the value for a "new line".
 */
export declare var NewLine: string;
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
/**
 * Builds a string.
 */
export declare class StringBuilder {
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
    constructor(initialVal?: any);
    /**
     * Appends a value.
     *
     * @chainable
     *
     * @param any value The value to append.
     */
    append(value: any): StringBuilder;
    /**
     * Appends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    appendFormat(formatStr: string, ...args: any[]): StringBuilder;
    /**
     * Appends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    appendFormatArray(formatStr: string, args?: any[]): StringBuilder;
    /**
     * Appends a new line by appending an optional value.
     *
     * @chainable
     *
     * @param any [value] The optional value to append.
     */
    appendLine(value?: any): StringBuilder;
    /**
     * Resets the string.
     *
     * @chainable
     */
    clear(): StringBuilder;
    /**
     * Checks if another string and the string of that builder are equal.
     *
     * @param any other The other string.
     *
     * @return {Boolean} Are equal or not.
     */
    equals(other: string | StringBuilder): boolean;
    /**
     * Executes a search on a string using a regular expression pattern,
     * and returns an array containing the results of that search.
     *
     * @param RegExp regEx The rehular expression to use.
     *
     * @return {RegExpExecArray} The result of the search.
     */
    exec(regEx: RegExp): RegExpExecArray;
    /**
     * Inserts a value.
     *
     * @chainable
     *
     * @param {Number} index The zero based index where to insert the value to.
     * @param any value The value to insert.
     */
    insert(index: number, value: any): StringBuilder;
    /**
     * Inserts a formatted string.
     *
     * @chainable
     *
     * @param {Number} index The zero based index where to insert the formatted string to.
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    insertFormat(index: number, formatStr: string, ...args: any[]): StringBuilder;
    /**
     * Inserts a formatted string.
     *
     * @chainable
     *
     * @param {Number} index The zero based index where to insert the formatted string to.
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    insertFormatArray(index: number, formatStr: string, args: any[]): StringBuilder;
    /**
     * Gets the current length of the current string.
     */
    length: number;
    /**
     * Gets or sets the value for a "new line".
     */
    newLine: string;
    /**
     * Prepends a value.
     *
     * @chainable
     *
     * @param any value The value to prepend.
     */
    prepend(value: any): StringBuilder;
    /**
     * Prepends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param any ...args One or more argument for the format string.
     */
    prependFormat(formatStr: string, ...args: any[]): StringBuilder;
    /**
     * Prepends a formatted string.
     *
     * @chainable
     *
     * @param {String} formatStr The format string.
     * @param {Array} [args] One or more argument for the format string.
     */
    prependFormatArray(formatStr: string, args?: any[]): StringBuilder;
    /**
     * Prepends a new line by prepending an optional value.
     *
     * @chainable
     *
     * @param any [value] The optional value to prepend.
     */
    prependLine(value?: any): StringBuilder;
    /**
     * Removes the specified range of characters from this instance.
     *
     * @chainable
     *
     * @param {Number} startIndex The zero-based position where removal begins.
     * @param {Number} [length] The number of characters to remove.
     *                          If NOT defined: Anything behind startIndex is removed.
     */
    remove(startIndex: number, length?: number): StringBuilder;
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
    replace(searchValue: string | RegExp, replacerOrValue: string | ((substring: string, ...args: any[]) => string), startIndex?: number, count?: number): StringBuilder;
    /**
     * Checks if a pattern exists in a searched string.
     *
     * @param {RegExp} regEx The regular expression.
     *
     * @return {Boolean} Pattern exists or not.
     */
    test(regEx: RegExp): boolean;
    /**
     * Returns that string as an char array.
     *
     * @return {Array} The array of chars.
     */
    toCharArray(): string[];
    /**
     * Creates the string representation of that builder.
     *
     * @return {String} The string representation.
     */
    toString(): string;
    /**
     * Converts a value to a string.
     *
     * @param any value The input value.
     *
     * @return {String} The value as string.
     */
    protected valueToString(value?: any): string;
}
/**
 * Adds a format provider.
 *
 * @function addFormatProvider
 *
 * @param {Function} providerCallback The provider callback.
 */
export declare function addFormatProvider(providerCallback: (ctx: IFormatProviderContext) => any): void;
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
export declare function compare(x: string, y: string): number;
/**
 * Joins items to one string.
 *
 * @function concat
 *
 * @param {Array} itemList The list of items.
 *
 * @return {String} The joined string.
 */
export declare function concat(itemList: any[]): string;
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
export declare function format(formatStr: string, ...args: any[]): string;
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
export declare function formatArray(formatStr: string, args: any[]): string;
/**
 * Checks if a string is (null), undefined or empty.
 *
 * @function isEmpty
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined / empty or not.
 */
export declare function isEmpty(str: string): boolean;
/**
 * Checks if a string is (null), undefined, empty or contains whitespaces only.
 *
 * @function isEmptyOrWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined / empty / contains whitespaces only or not.
 */
export declare function isEmptyOrWhitespace(str: string): boolean;
/**
 * Checks if a string is (null) or empty.
 *
 * @function isNullOrEmpty
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / empty or not.
 */
export declare function isNullOrEmpty(str: string): boolean;
/**
 * Checks if a string is (null) or undefined.
 *
 * @function isNullOrUndefined
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / undefined or not.
 */
export declare function isNullOrUndefined(str: string): boolean;
/**
 * Checks if a string is (null), empty or contains whitespaces only.
 *
 * @function isNullOrWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is (null) / empty / contains whitespaces or not.
 */
export declare function isNullOrWhitespace(str: string): boolean;
/**
 * Checks if a string is empty or contains whitespaces only.
 *
 * @function isWhitespace
 *
 * @param {String} str The string to check.
 *
 * @return {Boolean} Is empty / contains whitespaces only or not.
 */
export declare function isWhitespace(str: string): boolean;
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
export declare function join(separator: string, itemList: any[]): string;
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
export declare function similarity(left: string, right: string, ignoreCase?: boolean, trim?: boolean): number;
