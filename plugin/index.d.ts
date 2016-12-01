import ApiClient = require('./apiclient');
import Application = require('application');
import Batch = require('./batch');
import BitmapFactory = require('./bitmap-factory');
import Enumerable = require('./enumerable');
import Moment = require('./moment');
import { ObservableArray } from 'data/observable-array';
import { VirtualArray } from 'data/virtual-array';
import XmlObjects = require('./xmlobjects');
/**
 * Stores the application name.
 */
export declare var AppName: string;
/**
 * List of device orientations.
 */
export declare enum DeviceOrientation {
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
    getObject<O>(callback: (result: IGetClipboardResult<O>, tag?: any) => void, tag?: any): any;
    /**
     * Returns a text.
     *
     * @param {Function} callback The callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    getText<T>(callback: (result: IGetClipboardResult<string>, tag?: T) => void, tag?: T): any;
    /**
     * Sets a value / object as JSON serialized string.
     *
     * @param {O} obj The object to set.
     * @param {Function} [callback] The optional callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    setObject<O, T>(obj: O, callback?: (result: ISetClipboardResult<O>, tag?: T) => void, tag?: T): any;
    /**
     * Sets a text.
     *
     * @param {String} txt The text to set.
     * @param {Function} [callback] The optional callback with the result.
     * @param {T} [tag] The custom object / value for the callback.
     */
    setText<T>(txt: string, callback?: (result: ISetClipboardResult<string>, tag?: T) => void, tag?: T): any;
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
    close(callback?: (result: ICloseDatabaseResult) => void): any;
    /**
     * Gets the underlying SQLite object.
     */
    conn: any;
    /**
     * Executes an SQL statement.
     */
    execute(cfg: IExecuteSqlConfig): any;
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
    selectAll(cfg: IExecuteSqlConfig): any;
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
export declare enum MarkdownDialect {
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
export declare enum Platform {
    /**
     * Android
     */
    Android = 1,
    /**
     * iOS
     */
    iOS = 2,
}
/**
 * List of known target formats.
 */
export declare enum TargetFormat {
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
export declare function allowToSleep<T>(callback?: (result: IResult, tag?: T) => void, tag?: T): void;
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
export declare function asBitmap(v: any, throwException?: boolean): BitmapFactory.IBitmap;
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
export declare function asEnumerable(v: any, throwException?: boolean): Enumerable.IEnumerable<any>;
/**
 * Creates a new bitmap.
 *
 * @param {Number} width The width of the new image.
 * @param {Number} [height] The optional height of the new image. If not defined, the width is taken as value.
 * @param {ICreateBitmapOptions} [opts] Additional options for creating the bitmap.
 *
 * @return {IBitmap} The new bitmap.
 */
export declare function createBitmap(width: number, height?: number, opts?: BitmapFactory.ICreateBitmapOptions): BitmapFactory.IBitmap;
/**
 * Decrypts a value / an object with AES.
 *
 * @param {String} v The value to decrypt.
 *
 * @return {T} The decrypted value.
 */
export declare function decrypt<T>(v: string, key: string): T;
/**
 * Encrypts a value / an object with AES.
 *
 * @param any v The value to encrypt.
 *
 * @return {String} The encrypted value.
 */
export declare function encrypt(v: any, key: string): string;
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
 * Converts Markdown code.
 *
 * @param {String} md The Markdown.
 * @param {TargetFormat} [format] The custom output format.
 * @param {MarkdownDialect} [dialect] The dialect to use.
 *
 * @return {any} The converted data.
 */
export declare function fromMarkdown(md: string, format?: string | TargetFormat, dialect?: string | MarkdownDialect): any;
/**
 * Alias for 'parseXml()'
 */
export declare function fromXml(xml: string, processNamespaces?: boolean, angularSyntax?: boolean): XmlObjects.XDocument;
/**
 * Alias for 'parseYaml()'
 */
export declare function fromYaml<T>(y: any, opts?: IYamlDecodeOptions): T;
/**
 * Tries to return the application context of the current app.
 * For Android this is an 'android.content.Context' object.
 * In iOS this is the app delegate.
 *
 * @return any The application context (if available.)
 */
export declare function getApplicationContext(): any;
/**
 * Returns an object that handles the clipboard of the device.
 *
 * @return {IClipboard} The clipboard.
 */
export declare function getClipboard(): IClipboard;
/**
 * Returns the native view of the app.
 * For Android this is an activity.
 * For iOS this the the root view controller.
 *
 * @return any The view object.
 */
export declare function getNativeView(): any;
/**
 * Gets the current orientation of the device.
 *
 * @return {UIEnums.DeviceOrientation} The orientation (if defined).
 */
export declare function getOrientation(): DeviceOrientation;
/**
 * Returns information of the current platform.
 *
 * @return {IPlatformData} The platform information.
 */
export declare function getPlatform(): IPlatformData;
/**
 * Tries to return a value / object that is stored in the application settings.
 *
 * @param {string} key The name of the key (case insensitive).
 * @param {T} defValue The default value.
 *
 * @return {T} The value or the default value if not found.
 */
export declare function getValue<T>(key: string, defValue?: T): T;
/**
 * Alias for 'uuid()' function.
 */
export declare function guid(separator?: string): string;
/**
 * Generic hash function.
 *
 * @param {any} v The value to hash.
 * @param {string} [algo] The name of the algorithm to use (default: 'sha256').
 *
 * @return {string} The hash.
 */
export declare function hash(v: any, algo?: string): string;
/**
 * Checks if a value / object is stored in the application settings.
 *
 * @param {string} key The name of the key (case insensitive).
 *
 * @return {Boolean} Is stored or not.
 */
export declare function hasValue(key: string): boolean;
/**
 * Short hand function for 'setStatusBarVisibility()'.
 *
 * @param {Function} [callback] The custom result callback to invoke.
 * @param {T} [tag] The custom value for the result callback.
 */
export declare function hideStatusBar<T>(callback?: (result: ISetStatusBarVisibilityResult<T>, tag?: T) => void, tag?: T): void;
/**
 * Invokes logic for a specific connectivity type.
 *
 * @param {IInvokeForConnectivityConfig} cfg The configuration.
 * @param {T} [tag] The custom value for callback to invoke.
 *
 * @return {any} The result of the invoked callback.
 */
export declare function invokeForConnectivity<T>(cfg: IInvokeForConnectivityConfig<T>, tag?: T): void;
/**
 * Invokes a callback for specific orientation mode.
 *
 * @param {IInvokeForOrientationConfig} cfg The configuration.
 *
 * @return {any} The result of a callback.
 */
export declare function invokeForOrientation<T>(cfg: IInvokeForOrientationConfig<T>): any;
/**
 * Invokes an action for a specific platform.
 *
 * @param {IInvokeForPlatformContext} cfg The config data.
 *
 * @return any The result of the invoked callback.
 */
export declare function invokeForPlatform<T>(cfg: IInvokeForPlatformConfig<T>): any;
/**
 * Checks if the device is in debug mode or not.
 *
 * @return {Boolean} Device runs in debug mode or not.
 */
export declare function isDebug(): boolean;
/**
 * Checks if a value is a sequence.
 *
 * @param any v The value to check.
 *
 * @return {Boolean} Is sequence or not.
 */
export declare function isEnumerable(v: any): boolean;
/**
 * Keeps the device awake.
 *
 * @param {Function} [callback] The custom result callback.
 * @param {T} [tag] The custom object for the callback.
 */
export declare function keepAwake<T>(callback?: (result: IResult, tag?: T) => void, tag?: T): void;
/**
 * Converts Markdown code to parsable JSON object.
 *
 * @oaram {String} md The Markdown code.
 * @param {MarkdownDialect} [dialect] The custom dialect to use.
 *
 * @return {Object} The Markdown as object.
 */
export declare function markdownToJson(md: string, dialect?: string | MarkdownDialect): any;
/**
 * Converts Markdown code to simple HTML.
 *
 * @oaram {String} md The Markdown code.
 * @param {MarkdownDialect} [dialect] The custom dialect to use.
 *
 * @return {String} The Markdown as HTML code.
 */
export declare function markdownToHtml(md: string, dialect?: string | MarkdownDialect): string;
/**
 * Returns the MD5 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
export declare function md5(v: any): string;
/**
 * Creates a new batch.
 *
 * @return {IBatchOperation} The first operation of the created batch.
 */
export declare function newBatch(firstAction: (ctx: Batch.IBatchOperationContext) => void): Batch.IBatchOperation;
/**
 * Creates a new client.
 *
 * @param any config The configuration data / base URL for the client.
 *
 * @return {IApiClient} The new client.
 */
export declare function newClient(config: ApiClient.IApiClientConfig | string): ApiClient.IApiClient;
/**
 * Gets the current time.
 *
 * @return {Moment} The current time.
 */
export declare function now(): Moment.Moment;
/**
 * Opens a database connection.
 *
 * @param {String} dbName The name of the database to open.
 * @param {Function} callback The callback with the result data.
 */
export declare function openDatabase(cfg: IOpenDatabaseConfig): void;
/**
 * Opens a URL on the device.
 *
 * @param {String} url The URL to open.
 *
 * @return {Boolean} Operation was successful or not.
 */
export declare function openUrl(url: string): boolean;
/**
 * Opens the WiFi settings on the device.
 *
 * @return {Boolean} Operation was successful or not.
 */
export declare function openWifiSettings(): boolean;
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
export declare function parseXml(xml: string, processNamespaces?: boolean, angularSyntax?: boolean): XmlObjects.XDocument;
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
export declare function parseYaml<T>(y: any, opts?: IYamlDecodeOptions): T;
/**
 * Removes a value.
 *
 * @param {string} key The name of the key (case insensitive).
 *
 * @return {Boolean} Value was removed or not.
 */
export declare function removeValue(key: string): boolean;
/**
 * Runs an action on the UI thread.
 *
 * @param {Function} action The action to invoke.
 * @param {T} [state] The optional state object for the action.
 * @param {Function} onError The custom action that is invoked on error.
 *
 * @return {Boolean} Operation was successful or not.
 */
export declare function runOnUI<T>(action: (state: T) => void, state?: T, onError?: (err: any, state: T) => void): boolean;
/**
 * Changes the visibility of the device's status bar.
 *
 * @param {Boolean} isVisible Status bar should be visible (true) or not (false)
 * @param {Function} [callback] The optional callback to call.
 * @param {T} [tag] The custom object for the callback.
 */
export declare function setStatusBarVisibility<T>(isVisible: boolean, callback?: (result: ISetStatusBarVisibilityResult<T>) => void, tag?: T): void;
/**
 * Stores a value / object in the application settings.
 *
 * @param {T} v The value / object to store.
 * @param {string} key The name of the key (case insensitive).
 *
 * @return {Boolean} Operation was successfull or not.
 */
export declare function setValue<T>(v: T, key: string): boolean;
/**
 * Returns the SHA-1 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
export declare function sha1(v: any): string;
/**
 * Returns the SHA-256 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
export declare function sha256(v: any): string;
/**
 * Returns the SHA-3 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
export declare function sha3(v: any): string;
/**
 * Returns the SHA-384 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
export declare function sha384(v: any): string;
/**
 * Returns the SHA-512 hash of a value.
 *
 * @param any v The value to hash.
 *
 * @return {String} The hash.
 */
export declare function sha512(v: any): string;
/**
 * Short hand function for 'setStatusBarVisibility()'.
 *
 * @param {Function} [callback] The custom result callback to invoke.
 * @param {T} [tag] The custom value for the result callback.
 */
export declare function showStatusBar<T>(callback?: (result: ISetStatusBarVisibilityResult<T>, tag?: T) => void, tag?: T): void;
/**
 * Starts monitoring for connectivity (changes).
 *
 * @param {IInvokeForConnectivityConfig} cfg The configuration.
 * @param {T} [tag] The custom value for callback to invoke.
 */
export declare function startMonitoringForConnectivity<T>(cfg: IInvokeForConnectivityConfig<T>, tag?: T): void;
/**
 * Stops monitoring for connectivity.
 */
export declare function stopMonitoringForConnectivity(): void;
/**
 * Converts an object / a value to YAML.
 *
 * @param any v The value to convert.
 * @param {IYamlEncodeOptions} [opts] The custom options to use.
 *
 * @return {String} The YAML data.
 */
export declare function toYaml(v: any, opts?: IYamlEncodeOptions): string;
/**
 * Creates a new unique ID / GUID.
 *
 * @param {string} [separator] The custom separator to use.
 *
 * s. http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
export declare function uuid(separator?: string): string;
/**
 * Prefix for value keys.
 */
export declare var ValueKeyPrefix: string;
/**
 * Vibrates the device.
 *
 * @param {number} [msec] The custom number of milliseconds. Default: 500
 */
export declare function vibrate(msec?: number): any;
