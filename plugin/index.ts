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

import ApiClient = require('./apiclient');
import Application = require('application');
import AppSettings = require("application-settings");
import Batch = require('./batch');
import BitmapFactory = require('./bitmap-factory');
import Connectivity = require('connectivity');
var CryptoJS = require('./crypto-js');
var Device = require('./Device');
import Enumerable = require('./enumerable');
var Markdown = require('nativescript-toolbox/markdown').markdown;
var MD5 = require('./crypto-js/md5');
import Moment = require('./moment');
import {ObservableArray} from 'data/observable-array';
var SHA1 = require('./crypto-js/sha1');
var SHA256 = require('./crypto-js/sha256');
var SHA3 = require('./crypto-js/sha3');
var SHA384 = require('./crypto-js/sha384');
var SHA512 = require('./crypto-js/sha512');
var Sqlite = require('./sqlite');
import StringFormat = require('./stringformat');
import TypeUtils = require("utils/types");
import {VirtualArray} from 'data/virtual-array';
import XmlObjects = require('./xmlobjects');
var Yaml = require('./js-yaml');

/**
 * Stores the application name.
 */
export var AppName = 'NativeScript Toolbox';

/**
 * List of device orientations.
 */
export enum DeviceOrientation {
    /**
     * Landscape
     */
    Landscape = 2,

    /**
     * Portrait
     */
    Portrait = 1,
}

/**
 * A clipboard instance.
 */
export interface IClipboard {
    /**
     * Returns an object / value that is stored as JSON string in the clipboard.
     * 
     * @param {Function} callback The callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    getObject<O>(callback: (result: IGetClipboardResult<O>, tag?: any) => void,
                 tag?: any);

    /**
     * Returns a text.
     * 
     * @param {Function} callback The callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    getText<T>(callback: (result: IGetClipboardResult<string>, tag?: T) => void, tag?: T);

    /**
     * Sets a value / object as JSON serialized string.
     * 
     * @param {O} obj The object to set.
     * @param {Function} [callback] The optional callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    setObject<O, T>(obj: O,
                    callback?: (result: ISetClipboardResult<O>, tag?: T) => void, tag?: T)

    /**
     * Sets a text.
     * 
     * @param {String} txt The text to set.
     * @param {Function} [callback] The optional callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    setText<T>(txt: string,
               callback?: (result: ISetClipboardResult<string>, tag?: T) => void, tag?: T);
}

/**
 * The result of closing 
 */
export interface ICloseDatabaseResult {
    /**
     * The error (if occured).
     */
    error?: any;
}

/**
 * A cell.
 */
export interface ICell {
    /**
     * The zero based index.
     */
    index: number;

    /**
     * The underlying row.
     */
    row?: IRow;

    /**
     * The value.
     */
    value: any;
}

/**
 * Config data for executing an SQL statement.
 */
export interface IExecuteSqlConfig {
    /**
     * The argument for the statement.
     */
    args: any[] | ObservableArray<any> | VirtualArray<any> | Enumerable.IEnumerable<any>;
    
    /**
     * The optional callback.
     */
    callback?: (result: IExecuteSqlResult) => void;
    
    /**
     * The statement to execute.
     */
    sql: string;
}

/**
 * The result of a SQL execution.
 */
export interface IExecuteSqlResult {
    /**
     * The last inserted ID (if no error).
     */
    id?: any;

    /**
     * The error (if occured).
     */
    error?: any;

    /**
     * Contains the result set (if defined).
     */
    result?: Enumerable.IEnumerable<IRow>;
}

/**
 * The result of getting a value from the clipboard.
 */
export interface IGetClipboardResult<T> extends IResult {
    /**
     * The value (if no error)
     */
    value?: T;
}

/**
 * Configuration for 'invokeForConnectivity()' function.
 */
export interface IInvokeForConnectivityConfig<T> {
    /**
     * Is invoked on 'mobile' state.
     */
    mobile?: (result: IInvokeForConnectivityResult<T>, tag?: T) => void;
    
    /**
     * Is invoked on 'mobile' state.
     */
    none?: (result: IInvokeForConnectivityResult<T>, tag?: T) => void;
   
   /**
    * Is invoked on 'mobile' state.
    */
    wifi?: (result: IInvokeForConnectivityResult<T>, tag?: T) => void;
    
   /**
    * Is invoked on 'mobile' state.
    */
    unknown?: (result: IInvokeForConnectivityResult<T>, tag?: T) => void;
}

/**
 * Result for a callback of 'invokeForConnectivity()' function call.
 */
export interface IInvokeForConnectivityResult<T> extends IResult {
    /**
     * The custom object for the callback.
     */
    tag?: T;

    /**
     * The type
     */
    type?: number;
}

/**
 * Configuration for 'invokeForOrientation()' function.
 */
export interface IInvokeForOrientationConfig<T> {
    /**
     * The callback that is invoked if device is in landscape mode.
     */
    landscape?: (orientation: DeviceOrientation, tag?: T) => any;

    /**
     * The callback that is invoked if device is in portrait mode.
     */
    portrait?: (orientation: DeviceOrientation, tag?: T) => any;

    /**
     * The custom objects for the callbacks.
     */
    tag?: T;

    /**
     * The callback that is invoked if device is in unknown mode.
     */
    unknown?: (orientation: DeviceOrientation, tag?: T) => any;
}

/**
 * Configuration for 'invokeForPlatform()' function.
 */
export interface IInvokeForPlatformConfig<T> {
    /**
     * Callback that is invoked on Android.
     */
    android?: (platform: IPlatformData, tag?: T) => any;

    /**
     * Callback that is invoked on iOS.
     */
    ios?: (platform: IPlatformData, tag?: T) => any;

    /**
     * The custom objects for the callbacks.
     */
    tag?: T;
}

/**
 * Config data for opening a database.
 */
export interface IOpenDatabaseConfig {
    /**
     * The callback for the result.
     */
    callback: (result: IOpenDatabaseResult) => void;

    /**
     * The name of the database to open.
     */
    name: string;

    /**
     * Open readonly or not. Default: (false)
     */
    readOnly?: boolean;
}

/**
 * The result of opening a database.
 */
export interface IOpenDatabaseResult {
    /**
     * Gets the connection if succeeded.
     */
    db?: ISQLite;

    /**
     * Gets the error (if occurred.)
     */
    error?: any;

    /**
     * Gets the name of the data the tries to be open.
     */
    name: string;
}

/**
 * Stores platform data.
 */
export interface IPlatformData {
    /**
     * Gets the underlying application object.
     */
    app: Application.AndroidApplication | Application.iOSApplication;

    /**
     * Gets if the app runs on Android or not.
     */
    android: boolean;

    /**
     * The application context.
     */
    context: any;

    /**
     * Gets if the app runs on iOS or not.
     */
    ios: boolean;

    /**
     * Gets the type of the platform
     */
    type: Platform;

    /**
     * The native view.
     */
    view: any;
}

/**
 * A general callback result.
 */
export interface IResult {
    /**
     * The result code.
     */
    code: number;

    /**
     * The error information (if occurred).
     */
    error?: any;
}

/**
 * A row.
 */
export interface IRow {
    /**
     * The cells of the row.
     */
    cells?: ICell[];

    /**
     * The zero based index.
     */
    index: number;
}

/**
 * The result of setting a value in the clipboard.
 */
export interface ISetClipboardResult<T> extends IResult {
    /**
     * The value that has been tried to be stored.
     */
    value: T;
}

/**
 * Result object for the callback of 'setStatusBarVisibility()' function.
 */
export interface ISetStatusBarVisibilityResult<T> extends IResult {
    /**
     * The actual visibility (if defined)
     */
    isVisible?: boolean;

    /**
     * The custom submitted object.
     */
    tag?: T;
}

/**
 * A SQLite connection.
 */
export interface ISQLite {
    /**
     * Closes the connection.
     * 
     * @param {Function} [callback] The optional callback.
     */
    close(callback?: (result: ICloseDatabaseResult) => void);

    /**
     * Gets the underlying SQLite object.
     */
    conn: any;

    /**
     * Executes an SQL statement.
     */
    execute(cfg: IExecuteSqlConfig);

    /**
     * Gets if the connection is open or not.
     */
    isOpen: boolean;

    /**
     * Gets the name of the opened database.
     */
    name: string;

    /**
     * Executes an SQL statement with a result.
     */
    selectAll(cfg: IExecuteSqlConfig);
}

/**
 * YAML decode options.
 */
export interface IYamlDecodeOptions {
    /**
     * String to be used as a file path in error/warning messages.
     */
    filename?: string;

    /**
     * Compatibility with JSON.parse behaviour.
     * If true, then duplicate keys in a mapping will override values rather than throwing an error.
     */
    json?: boolean;

    /**
     * Function to call on warning messages.
     * Loader will throw on warnings if this function is not provided.
     */
    onWarning?: (error: any) => void;

    /**
     * Specifies a schema to use.
     */
    schema?: string;
}

/**
 * YAML encode options.
 */
export interface IYamlEncodeOptions {
    /**
     * Specifies level of nesting, when to switch from block to flow style for collections.
     * -1 means block style everwhere
     */
    flowLevel?: number;

    /**
     * Indentation width to use (in spaces).
     */
    indent?: number;

    /**
     * Set max line width.
     */
    lineWidth?: number;

    /**
     * If true don't try to be compatible with older yaml versions.
     * Currently: don't quote "yes", "no" and so on, as required for YAML 1.1
     */
    noCompatMode?: boolean;

    /**
     * If true, don't convert duplicate objects into references.
     */
    noRefs?: boolean;

    /**
     * Specifies a schema to use.
     */
    schema?: string;
    
    /**
     * Do not throw on invalid types (like function in the safe schema) and skip pairs and single values with such types.
     */
    skipInvalid?: boolean;

    /**
     * If true, sort keys when dumping YAML. If a function, use the function to sort the keys.
     */
    sortKeys?: boolean;

    /**
     * "tag" => "style" map. Each tag may have own set of styles.
     */
    styles?: any;
}

/**
 * List of known Markdown dialects
 */
export enum MarkdownDialect {
    /**
     * s. http://daringfireball.net/projects/markdown/syntax
     */
    Gruber = 1,

    /**
     * s. http://maruku.rubyforge.org/maruku.html
     */
    Maruku = 2,
}

/**
 * List of known platforms.
 */
export enum Platform {
    /**
     * Android
     */
    Android = 1,

    /**
     * iOS
     */
    iOS = 2,
}

class SQLiteConnection implements ISQLite {
    private _conn: any;
    private _name: string;
    
    constructor(conn: any, name: string) {
        this._conn = conn;
        this._name = name;
    }

    private asArray(v: any): any[] {
        if (v instanceof Array) {
            return v;
        }

        if (TypeUtils.isNullOrUndefined(v)) {
            return [];
        }

        if (isEnumerable(v)) {
            return v.toArray();
        }

        var wrapper: { length: () => number; getItem: (index: number) => any };

        if ((v instanceof ObservableArray) ||
            (v instanceof VirtualArray)) {
            
            wrapper = {
                getItem: (i) => v.getItem(i),
                length: () => v.length,
            };    
        }
        else {
            wrapper = {
                getItem: (i) => v[i],
                length: () => v.length,
            };
        }

        var arr = [];
        for (var i = 0; i < wrapper.length(); i++) {
            arr.push(wrapper.getItem(i));
        }

        return arr;
    }

    public close(callback?: (result: ICloseDatabaseResult) => void) {
        this._conn.close((err) => {
            if (TypeUtils.isNullOrUndefined(callback)) {
                return;
            }

            var resultCtx: any = {};
            if (!TypeUtils.isNullOrUndefined(err)) {
                // error
                Object.defineProperty(resultCtx, 'error', {
                    get: function() { return err; }
                });
            }

            callback(resultCtx);
        });
    }

    public get conn(): any {
        return this._conn;
    }

    private createCell(parent: IRow, cells: any[], i: number): ICell {
        var newCell: any = {};

        var val: any = cells[i];

        Object.defineProperty(newCell, 'index', {
            get: function() { return i; }
        });

        Object.defineProperty(newCell, 'row', {
            get: function() { return parent; }
        });

        Object.defineProperty(newCell, 'value', {
            get: function() { return val; }
        });

        return newCell;
    }

    private createRow(resultSet: any[], i: number): IRow {
        var newRow: any = {};

        var cellList: ICell[] = [];

        var r: any[] = resultSet[i];
        for (var i = 0; i < r.length; i++) {
            var c = this.createCell(newRow, r, i);

            cellList.push(c);
        }

        Object.defineProperty(newRow, 'cells', {
            get: function() { return cellList; }
        });

        Object.defineProperty(newRow, 'index', {
            get: function() { return i; }
        });

        return newRow;
    }

    public execute(cfg: IExecuteSqlConfig) {
        this._conn
            .execSQL(cfg.sql, this.asArray(cfg.args), function(err, insertId) {
                if (TypeUtils.isNullOrUndefined(cfg.callback)) {
                    return;
                }

                var resultCtx: any = {};

                if (TypeUtils.isNullOrUndefined(err)) {
                    // id
                    Object.defineProperty(resultCtx, 'id', {
                        get: function() { return insertId; }
                    });
                }
                else {
                    // error
                    Object.defineProperty(resultCtx, 'error', {
                        get: function() { return err; }
                    });
                }

                cfg.callback(resultCtx);
            });
    }

    public get isOpen(): boolean {
        return this._conn.isOpen();
    }

    public get name(): string {
        return this._name;
    }

    public selectAll(cfg: IExecuteSqlConfig) {
        var me = this;

        this._conn
            .all(cfg.sql, this.asArray(cfg.args), function(err, resultSet) {
                var resultCtx: any = {};

                if (TypeUtils.isNullOrUndefined(err)) {
                    var result: any = [];

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
                        get: function() { return result; }
                    });
                }
                else {
                    // error
                    Object.defineProperty(resultCtx, 'error', {
                        get: function() { return err; }
                    });
                }

                cfg.callback(resultCtx);
            });
    }
}

/**
 * List of known target formats.
 */
export enum TargetFormat {
    /**
     * HTML
     */
    Html = 1,

    /**
     * JSON
     */
    Json = 2,
}

/**
 * Allows the device to go to sleep mode.
 * 
 * @param {Function} [callback] The custom result callback.
 * @param {T} [tag] The custom object for the callback to use.
 */
export function allowToSleep<T>(callback?: (result: IResult, tag?: T) => void, tag?: T) {
    var cbResult: IResult;

    try {
        cbResult = Device.allowDeviceToSleep();
    }
    catch (e) {
        cbResult = {
            code: -1,
            error: e,
        };
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        callback(cbResult, tag);
    }
}

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
 * @param {ICreateBitmapOptions} [opts] Additional options for creating the bitmap.
 * 
 * @return {IBitmap} The new bitmap.
 */
export function createBitmap(width: number, height?: number, opts?: BitmapFactory.ICreateBitmapOptions): BitmapFactory.IBitmap {
    return BitmapFactory.create(width, height, opts);
}

/**
 * Decrypts a value / an object with AES.
 * 
 * @param {String} v The value to decrypt.
 * 
 * @return {T} The decrypted value.
 */
export function decrypt<T>(v: string, key: string): T {
    var bytes = CryptoJS.AES.decrypt(v, key);
    var json = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(json);
}

/**
 * Encrypts a value / an object with AES.
 * 
 * @param any v The value to encrypt.
 * 
 * @return {String} The encrypted value.
 */
export function encrypt(v: any, key: string): string {
    return CryptoJS.AES
                   .encrypt(JSON.stringify(v), key)
                   .toString();
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
 * Converts Markdown code.
 * 
 * @param {String} md The Markdown.
 * @param {TargetFormat} [format] The custom output format.
 * @param {MarkdownDialect} [dialect] The dialect to use.
 * 
 * @return {any} The converted data.
 */
export function fromMarkdown(md: string,
                             format: string | TargetFormat = TargetFormat.Json,
                             dialect: string | MarkdownDialect = MarkdownDialect.Gruber): any {

    if (TypeUtils.isNullOrUndefined(format)) {
        format = TargetFormat.Json;
    }

    dialect = toMarkdownDialectString(dialect);

    var parser: () => any;

    switch (toTargetFormatString(format)) {
        case 'json':
            parser = () => Markdown.parse(md, dialect);
            break;
            
        case 'html':
            parser = () => Markdown.toHTML(md, dialect);
            break;
    }

    if (TypeUtils.isNullOrUndefined(parser)) {
        throw "Format '" + format + "' is NOT supported!";
    }

    if (TypeUtils.isNullOrUndefined(md)) {
        return md;
    }

    return parser();
}

/**
 * Alias for 'parseXml()'
 */
export function fromXml(xml: string,
                        processNamespaces?: boolean, angularSyntax?: boolean): XmlObjects.XDocument {
    return parseXml(xml,
                    processNamespaces, angularSyntax);
}

/**
 * Alias for 'parseYaml()'
 */
export function fromYaml<T>(y: any, opts?: IYamlDecodeOptions): T {
    return parseYaml<T>(y, opts);
}

/**
 * Tries to return the application context of the current app.
 * For Android this is an 'android.content.Context' object.
 * In iOS this is the app delegate.
 * 
 * @return any The application context (if available.)
 */
export function getApplicationContext(): any {
    return Device.getAppContext();
}

/**
 * Returns an object that handles the clipboard of the device.
 * 
 * @return {IClipboard} The clipboard.
 */
export function getClipboard(): IClipboard {
    var appName = AppName;
    if (TypeUtils.isNullOrUndefined(appName)) {
        appName = '';
    }
    
    var cb = Device.getDeviceClipboard(appName);

    // getObject()
    cb.getObject = function(callback: (result: IGetClipboardResult<any>, tag?: any) => void,
                            tag?: any) {

        this.getText((result: any, tag?: any) => {
            if (StringFormat.isEmptyOrWhitespace(result.value)) {
                result.value = undefined;
            }
            
            if (!TypeUtils.isNullOrUndefined(result.value)) {
                result.value = JSON.parse(result.value);
            }

            if (!TypeUtils.isNullOrUndefined(callback)) {
                callback(result, tag);
            }
        }, tag);
    };

    // setObject()
    cb.setObject = function(obj: any,
                            callback?: (result: ISetClipboardResult<any>, tag?: any) => void,
                            tag?: any) {
        
        var json = obj;
        if (!TypeUtils.isNullOrUndefined(json)) {
            json = JSON.stringify(json);
        }

        this.setText((result: any, tag?: any) => {
            result.value = obj;
            
            if (!TypeUtils.isNullOrUndefined(callback)) {
                callback(result, tag);
            }
        }, tag);
    };

    return cb;
}

/**
 * Returns the native view of the app.
 * For Android this is an activity.
 * For iOS this the the root view controller.
 * 
 * @return any The view object.
 */
export function getNativeView(): any {
    var view = Device.getAppView();
    if (!view) {
        view = undefined;
    }

    return view;
}

/**
 * Gets the current orientation of the device.
 * 
 * @return {UIEnums.DeviceOrientation} The orientation (if defined).
 */
export function getOrientation(): DeviceOrientation {
    return Device.getDeviceOrientation();
}

/**
 * Returns information of the current platform.
 * 
 * @return {IPlatformData} The platform information.
 */
export function getPlatform(): IPlatformData {
    var pd = Device.getPlatformData();

    var nativeView = getNativeView();
    
    // android
    Object.defineProperty(pd, 'android', {
        get: function() { return 1 === this.type; }
    });

    // ios
    Object.defineProperty(pd, 'ios', {
        get: function() { return 2 === this.type; }
    });

    // view
    Object.defineProperty(pd, 'view', {
        get: function() { return nativeView; }
    });

    return pd;
}

/**
 * Tries to return a value / object that is stored in the application settings.
 * 
 * @param {string} key The name of the key (case insensitive).
 * @param {T} defValue The default value.
 * 
 * @return {T} The value or the default value if not found.
 */
export function getValue<T>(key: string, defValue?: T): T {
    if (!hasValue(key)) {
        return defValue;
    }

    var json = AppSettings.getString(toValueKey(key));
    if (StringFormat.isEmptyOrWhitespace(json)) {
        json = undefined;   
    }
    
    if (!TypeUtils.isNullOrUndefined(json)) {
        return JSON.parse(json);
    }

    return <any>json;
}

/**
 * Alias for 'uuid()' function.
 */
export function guid(separator: string = '-'): string {
    return uuid(separator);
}

/**
 * Generic hash function.
 * 
 * @param {any} v The value to hash.
 * @param {string} [algo] The name of the algorithm to use (default: 'sha256').
 * 
 * @return {string} The hash.
 */
export function hash(v: any, algo?: string): string {
    if (StringFormat.isEmptyOrWhitespace(algo)) {
        algo = 'sha256';
    }

    var hasher;
    switch (algo.toLowerCase().trim()) {
        case 'sha256':
        case 'sha-256':
            hasher = sha256;
            break;

        case 'sha1':
        case 'sha-1':
            hasher = sha1;
            break;

        case 'md5':
        case 'md-5':
            hasher = md5;
            break;

        case 'sha384':
        case 'sha-384':
            hasher = sha384;
            break;

        case 'sha512':
        case 'sha-512':
            hasher = sha512;
            break;

        case 'sha3':
        case 'sha-3':
            hasher = sha3;
            break;
    }

    if (TypeUtils.isNullOrUndefined(hasher)) {
        throw "Algorithm '" + algo + "' is NOT supported!";
    }
    
    return hasher(v);
}

/**
 * Checks if a value / object is stored in the application settings.
 * 
 * @param {string} key The name of the key (case insensitive).
 * 
 * @return {Boolean} Is stored or not.
 */
export function hasValue(key: string): boolean {
    return AppSettings.hasKey(toValueKey(key));
}

/**
 * Short hand function for 'setStatusBarVisibility()'.
 * 
 * @param {Function} [callback] The custom result callback to invoke.
 * @param {T} [tag] The custom value for the result callback.
 */
export function hideStatusBar<T>(callback?: (result: ISetStatusBarVisibilityResult<T>, tag?: T) => void,
                                 tag?: T) {
    setStatusBarVisibility(false,
                           callback, tag);
}

/**
 * Invokes logic for a specific connectivity type.
 * 
 * @param {IInvokeForConnectivityConfig} cfg The configuration.
 * @param {T} [tag] The custom value for callback to invoke.
 * 
 * @return {any} The result of the invoked callback.
 */
export function invokeForConnectivity<T>(cfg: IInvokeForConnectivityConfig<T>,
                                         tag?: T) {
    
    var code = 0;
    var callback = cfg.unknown;
    var error;
    var type: number;

    try {
        type = Connectivity.getConnectionType();
        switch (type) {
            case Connectivity.connectionType.mobile:
                callback = cfg.mobile;
                break;

            case Connectivity.connectionType.wifi:
                callback = cfg.wifi;
                break;

            case Connectivity.connectionType.none:
                callback = cfg.none;
                break;

            default:
                code = 1;
                break;
        }
    }
    catch (e) {
        code = -1;
        error = e;
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        return callback({
            code: code,
            error: error,
            tag: tag,
            type: type,
        });
    }
}

/**
 * Invokes a callback for specific orientation mode.
 * 
 * @param {IInvokeForOrientationConfig} cfg The configuration.
 * 
 * @return {any} The result of a callback.
 */
export function invokeForOrientation<T>(cfg: IInvokeForOrientationConfig<T>): any {
    var orientation = getOrientation();

    var callback: (orientation: DeviceOrientation, tag?: T) => any;
    switch (orientation) {
        case DeviceOrientation.Portrait:
            callback = cfg.portrait;
            break;

        case DeviceOrientation.Landscape:
            callback = cfg.landscape;
            break;

        default:
            callback = cfg.unknown;
            break;
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        return callback(orientation, cfg.tag);
    }
}

/**
 * Invokes an action for a specific platform.
 * 
 * @param {IInvokeForPlatformContext} cfg The config data.
 * 
 * @return any The result of the invoked callback.
 */
export function invokeForPlatform<T>(cfg: IInvokeForPlatformConfig<T>): any {
    var platform = getPlatform();

    var callback: (platform: IPlatformData, tag?: T) => any;
    if (platform.android) {
        callback = cfg.android;
    }
    else if (platform.ios) {
        callback = cfg.ios;
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        return callback(platform, cfg.tag);
    }
}

/**
 * Checks if the device is in debug mode or not.
 * 
 * @return {Boolean} Device runs in debug mode or not.
 */
export function isDebug(): boolean {
    return Device.isInDebugMode();
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
 * Keeps the device awake.
 * 
 * @param {Function} [callback] The custom result callback.
 * @param {T} [tag] The custom object for the callback.
 */
export function keepAwake<T>(callback?: (result: IResult, tag?: T) => void, tag?: T) {
    var cbResult: IResult;
    
    try {
        cbResult = Device.keepDeviceAwake();
    }
    catch (e) {
        cbResult = {
            code: -1,
            error: e,
        };
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        callback(cbResult, tag);
    }
}

/**
 * Converts Markdown code to parsable JSON object.
 * 
 * @oaram {String} md The Markdown code.
 * @param {MarkdownDialect} [dialect] The custom dialect to use.
 * 
 * @return {Object} The Markdown as object.
 */
export function markdownToJson(md: string, dialect: string | MarkdownDialect = MarkdownDialect.Gruber): any {
    return fromMarkdown(md, TargetFormat.Json, dialect);
}

/**
 * Converts Markdown code to simple HTML.
 * 
 * @oaram {String} md The Markdown code.
 * @param {MarkdownDialect} [dialect] The custom dialect to use.
 * 
 * @return {String} The Markdown as HTML code.
 */
export function markdownToHtml(md: string, dialect: string | MarkdownDialect = MarkdownDialect.Gruber): string {
    return fromMarkdown(md, TargetFormat.Html, dialect);
}

/**
 * Returns the MD5 hash of a value.
 * 
 * @param any v The value to hash.
 * 
 * @return {String} The hash.
 */
export function md5(v: any): string {
    return MD5(v).toString();
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

/**
 * Gets the current time.
 * 
 * @return {Moment} The current time.
 */
export function now(): Moment.Moment {
    return Moment();
}

/**
 * Opens a database connection.
 * 
 * @param {String} dbName The name of the database to open.
 * @param {Function} callback The callback with the result data.
 */
export function openDatabase(cfg: IOpenDatabaseConfig) {
    var openReadOnly = false;
    if (!TypeUtils.isNullOrUndefined(cfg.readOnly)) {
        openReadOnly = cfg.readOnly;
    }

    var r: any = {};

    // name
    Object.defineProperty(r, 'name', {
        get: function() { return cfg.name; }
    });

    var p = new Sqlite(cfg.name, {
        readOnly: openReadOnly
    }).then((db) => {
        var conn = new SQLiteConnection(db, cfg.name);

        // db
        Object.defineProperty(r, 'db', {
            get: function() { return conn; }
        });

        cfg.callback(r);
    }, (err) => {
        // error
        Object.defineProperty(r, 'error', {
            get: function() { return err; }
        });
        
        cfg.callback(r);
    });
}

/**
 * Opens a URL on the device.
 * 
 * @param {String} url The URL to open.
 * 
 * @return {Boolean} Operation was successful or not.
 */
export function openUrl(url: string): boolean {
    try {
        return Device.openUri(url.trim());
    }
    catch (e) {
        console.log('[ERROR] (nativescript-toolbox).openUrl(): ' + e);
        return false;
    }
}

/**
 * Opens the WiFi settings on the device.
 * 
 * @return {Boolean} Operation was successful or not.
 */
export function openWifiSettings(): boolean {
    try {
        return Device.openWifiSettingsOnDevice();
    }
    catch (e) {
        console.log('[ERROR] (nativescript-toolbox).openWifiSettings(): ' + e);
        return false;
    }
}

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
export function parseXml(xml: string,
                         processNamespaces?: boolean, angularSyntax?: boolean): XmlObjects.XDocument {

    return XmlObjects.parse(xml,
                            processNamespaces, angularSyntax);
}

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
export function parseYaml<T>(y: any, opts?: IYamlDecodeOptions): T {
    return Yaml.safeLoad(y, opts);
}

/**
 * Removes a value.
 * 
 * @param {string} key The name of the key (case insensitive).
 * 
 * @return {Boolean} Value was removed or not.
 */
export function removeValue(key: string): boolean {
    if (hasValue(key)) {
        AppSettings.remove(toValueKey(key));
        return true;
    }

    return false;
}

/**
 * Runs an action on the UI thread.
 * 
 * @param {Function} action The action to invoke.
 * @param {T} [state] The optional state object for the action.
 * @param {Function} onError The custom action that is invoked on error.
 * 
 * @return {Boolean} Operation was successful or not.
 */
export function runOnUI<T>(action: (state: T) => void, state?: T,
                           onError?: (err: any, state: T) => void): boolean {
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

/**
 * Changes the visibility of the device's status bar.
 * 
 * @param {Boolean} isVisible Status bar should be visible (true) or not (false)
 * @param {Function} [callback] The optional callback to call.
 * @param {T} [tag] The custom object for the callback.
 */
export function setStatusBarVisibility<T>(isVisible: boolean,
                                          callback?: (result: ISetStatusBarVisibilityResult<T>) => void, tag?: T) {
    try {
        Device.changeStatusBarVisibility(isVisible ? true : false,
                                         callback, tag);
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

/**
 * Stores a value / object in the application settings.
 * 
 * @param {T} v The value / object to store.
 * @param {string} key The name of the key (case insensitive).
 * 
 * @return {Boolean} Operation was successfull or not.
 */
export function setValue<T>(v: T, key: string): boolean {
    var json: any = v;
    if (!TypeUtils.isNullOrUndefined(json)) {
        json = JSON.stringify(json);
    }

    AppSettings.setString(toValueKey(key), json);
    return true;
}

/**
 * Returns the SHA-1 hash of a value.
 * 
 * @param any v The value to hash.
 * 
 * @return {String} The hash.
 */
export function sha1(v: any): string {
    return SHA1(v).toString();
}

/**
 * Returns the SHA-256 hash of a value.
 * 
 * @param any v The value to hash.
 * 
 * @return {String} The hash.
 */
export function sha256(v: any): string {
    return SHA256(v).toString();
}

/**
 * Returns the SHA-3 hash of a value.
 * 
 * @param any v The value to hash.
 * 
 * @return {String} The hash.
 */
export function sha3(v: any): string {
    return SHA3(v).toString();
}

/**
 * Returns the SHA-384 hash of a value.
 * 
 * @param any v The value to hash.
 * 
 * @return {String} The hash.
 */
export function sha384(v: any): string {
    return SHA384(v).toString();
}

/**
 * Returns the SHA-512 hash of a value.
 * 
 * @param any v The value to hash.
 * 
 * @return {String} The hash.
 */
export function sha512(v: any): string {
    return SHA512(v).toString();
}

/**
 * Short hand function for 'setStatusBarVisibility()'.
 * 
 * @param {Function} [callback] The custom result callback to invoke.
 * @param {T} [tag] The custom value for the result callback.
 */
export function showStatusBar<T>(callback?: (result: ISetStatusBarVisibilityResult<T>, tag?: T) => void,
                                 tag?: T) {
    setStatusBarVisibility(true,
                           callback, tag);
}

/**
 * Starts monitoring for connectivity (changes).
 * 
 * @param {IInvokeForConnectivityConfig} cfg The configuration.
 * @param {T} [tag] The custom value for callback to invoke.
 */
export function startMonitoringForConnectivity<T>(cfg: IInvokeForConnectivityConfig<T>,
                                                  tag?: T) {

    Connectivity.startMonitoring(() => {
        invokeForConnectivity(cfg, tag);
    });
}

/**
 * Stops monitoring for connectivity.
 */
export function stopMonitoringForConnectivity() {
    Connectivity.stopMonitoring();
}

function toMarkdownDialectString(v: any) {
    if (TypeUtils.isNullOrUndefined(v)) {
        v = MarkdownDialect.Gruber;
    }

    if (!TypeUtils.isString(v)) {
        v = MarkdownDialect[v];
    }

    return v;
}

function toTargetFormatString(v: any) {
    if (TypeUtils.isNullOrUndefined(v)) {
        return v;
    }

    if (!TypeUtils.isString(v)) {
        v = TargetFormat[v];
    }

    return ('' + v).toLowerCase().trim();
}

function toValueKey(key: string) {
    var prefix = ValueKeyPrefix;
    if (TypeUtils.isNullOrUndefined(prefix)) {
        prefix = '';
    }

    if (TypeUtils.isNullOrUndefined(key)) {
        key = '';
    }

    return ('' + prefix) + ('' + key).toLowerCase().trim();
}

/**
 * Converts an object / a value to YAML.
 * 
 * @param any v The value to convert.
 * @param {IYamlEncodeOptions} [opts] The custom options to use.
 * 
 * @return {String} The YAML data.
 */
export function toYaml(v: any, opts?: IYamlEncodeOptions): string {
    return Yaml.safeDump(v, opts);
}

/**
 * Creates a new unique ID / GUID.
 * 
 * @param {string} [separator] The custom separator to use.
 * 
 * s. http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
export function uuid(separator: string = '-'): string {
    var s4 = () => {
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

/**
 * Prefix for value keys.
 */
export var ValueKeyPrefix = '';

/**
 * Vibrates the device.
 * 
 * @param {number} [msec] The custom number of milliseconds. Default: 500
 */
export function vibrate(msec?: number) {
    if (TypeUtils.isNullOrUndefined(msec)) {
        msec = 500;
    }

    if (msec < 0) {
        msec = 0;
    }

    try {
        return Device.vibrateDevice(msec);
    }
    catch (e) {
        console.log('[ERROR] (nativescript-toolbox).vibrate(): ' + e);

        return false;
    }
}
