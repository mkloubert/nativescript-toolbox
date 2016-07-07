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

import Application = require('application');
import ApiClient = require('./apiclient');
import Batch = require('./batch');
import BitmapFactory = require('./bitmap-factory');
var CryptoJS = require('./crypto-js');
var Device = require('./Device');
import Enumerable = require('./enumerable');
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
 * Configuration for 'invokeForPlatform()' function.
 */
export interface IInvokeForPlatformConfig {
    /**
     * Callback that is invoked on Android.
     */
    android?: (platform: IPlatformData) => any;

    /**
     * Callback that is invoked on iOS.
     */
    ios?: (platform: IPlatformData) => any;
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
 * Invokes an action for a specific platform.
 * 
 * @param {IInvokeForPlatformContext} cfg The config data.
 * 
 * @return any The result of the invoked callback.
 */
export function invokeForPlatform(cfg: IInvokeForPlatformConfig): any {
    var platform = getPlatform();

    var callback: (platform: IPlatformData) => any;
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
