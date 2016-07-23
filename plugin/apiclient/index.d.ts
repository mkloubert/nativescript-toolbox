import FileSystem = require("file-system");
import HTTP = require("http");
import Image = require("image-source");
/**
 * A basic logger.
 */
export declare abstract class LoggerBase implements ILogger {
    /** @inheritdoc */
    alert(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /**
     * Creates a ILogMessage object.
     *
     * @param any msg The message value.
     * @param {String} tag The tag value.
     * @param LogCategory category The log category.
     * @param {LogPriority} priority The log priority.
     */
    protected abstract createLogMessage(msg: any, tag: string, category: LogCategory, priority: LogPriority): ILogMessage;
    /** @inheritdoc */
    crit(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    dbg(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    emerg(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    err(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    info(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    log(msg: any, tag?: string, category?: LogCategory, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    note(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /**
     * The logic for the 'log' method.
     */
    protected abstract onLog(msg: ILogMessage): any;
    /** @inheritdoc */
    trace(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
    /** @inheritdoc */
    warn(msg: any, tag?: string, priority?: LogPriority): LoggerBase;
}
/**
 * An authorizer that uses an internal list of
 * authorizers to execute.
 */
export declare class AggregateAuthorizer implements IAuthorizer {
    private _authorizers;
    /**
     * Adds one or more authorizers.
     *
     * @param {IAuthorizer} ...authorizers One or more authorizers to add.
     */
    addAuthorizers(...authorizers: IAuthorizer[]): void;
    /** @inheritdoc */
    prepare(reqOpts: HTTP.HttpRequestOptions): void;
}
/**
 * List of API client result contextes.
 */
export declare enum ApiClientResultContext {
    /**
     * "success" action.
     */
    Success = 0,
    /**
     * "completed" action.
     */
    Complete = 1,
}
/**
 * List of API client error contextes.
 */
export declare enum ApiClientErrorContext {
    /**
     * Error in HTTP client.
     */
    ClientError = 0,
    /**
     * "Unhandled" exception.
     */
    Exception = 1,
}
/**
 * An authorizer for basic authentication.
 */
export declare class BasicAuth implements IAuthorizer {
    private _password;
    private _username;
    /**
     * Initializes a new instance of that class.
     *
     * @param {String} username The username.
     * @param {String} pwd The password.
     */
    constructor(username: string, pwd: string);
    /**
     * Gets the password.
     *
     * @property
     */
    password: string;
    /** @inheritdoc */
    prepare(reqOpts: HTTP.HttpRequestOptions): void;
    /**
     * Gets the username.
     *
     * @property
     */
    username: string;
}
/**
 * An authorizer for bearer authentication.
 */
export declare class BearerAuth implements IAuthorizer {
    private _token;
    /**
     * Initializes a new instance of that class.
     *
     * @param {String} token The token.
     */
    constructor(token: string);
    /** @inheritdoc */
    prepare(reqOpts: HTTP.HttpRequestOptions): void;
    /**
     * Gets the token.
     *
     * @property
     */
    token: string;
}
/**
 * List of known HTTP request methods.
 */
export declare enum HttpMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    PATCH = 3,
    DELETE = 4,
    HEAD = 5,
    TRACE = 6,
    OPTIONS = 7,
    CONNECT = 8,
}
/**
 * List of known HTTP request / content types.
 */
export declare enum HttpRequestType {
    /**
     * Raw / binary
     */
    Binary = 0,
    /**
     * JSON
     */
    JSON = 1,
    /**
     * Xml
     */
    Xml = 2,
    /**
     * Text / string
     */
    Text = 3,
}
/**
 * List of known HTTP status codes.
 */
export declare enum HttpStatusCode {
    Accepted = 202,
    BadGateway = 502,
    BadRequest = 400,
    Conflict = 409,
    Continue = 100,
    Created = 201,
    ExpectationFailed = 417,
    Forbidden = 403,
    GatewayTimeout = 504,
    Gone = 410,
    HttpVersionNotSupported = 505,
    InternalServerError = 500,
    LengthRequired = 411,
    MethodNotAllowed = 405,
    MovedPermanently = 301,
    MultipleChoices = 300,
    NoContent = 204,
    NonAuthoritativeInformation = 203,
    NotAcceptable = 406,
    NotFound = 404,
    NotImplemented = 501,
    NotModified = 304,
    OK = 200,
    PartialContent = 206,
    PaymentRequired = 402,
    PreconditionFailed = 412,
    ProxyAuthenticationRequired = 407,
    Redirect = 302,
    RequestedRangeNotSatisfiable = 416,
    RequestEntityTooLarge = 413,
    RequestTimeout = 408,
    RequestUriTooLong = 414,
    ResetContent = 205,
    SeeOther = 303,
    ServiceUnavailable = 503,
    SwitchingProtocols = 101,
    TemporaryRedirect = 307,
    Unauthorized = 401,
    UnsupportedMediaType = 415,
    Unused = 306,
    UpgradeRequired = 426,
    UseProxy = 305,
}
/**
 * A helper object for wrapping API results.
 */
export interface IAjaxResult<TData> {
    /**
     * Gets the code (if defined).
     *
     * @property
     */
    code?: number;
    /**
     * Gets the message (if defined).
     *
     * @property
     */
    msg?: string;
    /**
     * The result data (if defined).
     *
     * @property
     */
    data?: TData;
}
/**
 * Describes an API client.
 */
export interface IApiClient {
    /**
     * Adds a callback that can be used to format values of route parameters, e.g.
     *
     * @chainable
     *
     * @param {Function} provider The callback that formats values.
     */
    addFormatProvider(provider: (ctx: IFormatProviderContext) => any): IApiClient;
    /**
     * Adds a log action.
     *
     * @chainable
     *
     * @param {Function} logAction The log action.
     */
    addLogger(logAction: (ctx: ILogMessage) => void): IApiClient;
    /**
     * Gets or sets the deault authorizer.
     */
    authorizer: IAuthorizer;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 502 (bad gateway).
     *
     * @chainable
     *
     * @param {Function} badGatewayAction The action to invoke.
     */
    badGateway(badGatewayAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 400 (bad request).
     *
     * @chainable
     *
     * @param {Function} notFoundAction The action to invoke.
     */
    badRequest(badRequestAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Gets or sets the base URL.
     */
    baseUrl: string;
    /**
     * Defines an action that is invoked BEFORE a request starts.
     *
     * @chainable
     *
     * @param {Function} beforeAction The action to invoke.
     */
    beforeSend(beforeAction: (opts: HTTP.HttpRequestOptions, tag: any) => void): IApiClient;
    /**
     * Defines an action that is invoked on a status code between 400 and 499.
     *
     * @chainable
     *
     * @param {Function} clientErrAction The action to invoke.
     */
    clientError(clientErrAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Defines an action that is invoked on a status code between 400 and 599.
     *
     * @chainable
     *
     * @param {Function} clientSrvErrAction The action to invoke.
     */
    clientOrServerError(clientSrvErrAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Defines the "complete" action.
     *
     * @chainable
     *
     * @param {Function} completeAction The action to invoke.
     */
    complete(completeAction: (ctx: IApiClientCompleteContext) => void): IApiClient;
    /**
     * Starts a DELETE request.
     *
     * @param {IRequestOptions} [opts] The (additional) options.
     */
    delete(opts?: IRequestOptions): any;
    /**
     * Defines the "error" action.
     *
     * @chainable
     *
     * @param {Function} errAction The action to invoke.
     */
    error(errAction: (ctx: IApiClientError) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 403 (forbidden).
     *
     * @chainable
     *
     * @param {Function} forbiddenAction The action to invoke.
     */
    forbidden(forbiddenAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 504 (gateway timeout).
     *
     * @chainable
     *
     * @param {Function} timeoutAction The action to invoke.
     */
    gatewayTimeout(timeoutAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Starts a GET request.
     *
     * @param {IRequestOptions} [opts] The (additional) options.
     */
    get(opts?: IRequestOptions): any;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 410 (gone).
     *
     * @chainable
     *
     * @param {Function} goneAction The action to invoke.
     */
    gone(goneAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Gets or sets the global request headers.
     *
     * @property
     */
    headers: any;
    /**
     * Invokes an action if a predicate matches.
     *
     * @chainable
     *
     * @param {Function} predicate The predicate to use.
     * @param {Function} statusAction The action to invoke.
     */
    if(predicate: (ctx: IApiClientResult) => boolean, statusAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Invokes an action if a status matches.
     *
     * @chainable
     *
     * @param {Function} predicate The predicate to use.
     * @param {Function} statusAction The action to invoke.
     */
    ifStatus(predicate: (code: number) => boolean, statusAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Defines an action that is invoked on a status code between 100 and 199.
     *
     * @chainable
     *
     * @param {Function} infoAction The action to invoke.
     */
    informational(infoAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 507 (insufficient storage).
     *
     * @chainable
     *
     * @param {Function} insufficientAction The action to invoke.
     */
    insufficientStorage(insufficientAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 500 (internal server error).
     *
     * @chainable
     *
     * @param {Function} errAction The action to invoke.
     */
    internalServerError(errAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 423 (document not found).
     *
     * @chainable
     *
     * @param {Function} lockedAction The action to invoke.
     */
    locked(lockedAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 405 (method not allowed).
     *
     * @chainable
     *
     * @param {Function} notAllowedAction The action to invoke.
     */
    methodNotAllowed(notAllowedAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 404 (document not found).
     *
     * @chainable
     *
     * @param {Function} notFoundAction The action to invoke.
     */
    notFound(notFoundAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 501 (not implemented).
     *
     * @chainable
     *
     * @param {Function} notImplementedAction The action to invoke.
     */
    notImplemented(notImplementedAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 200, 204 or 205 (OK; no content; reset content).
     *
     * @chainable
     *
     * @param {Function} okAction The action to invoke.
     */
    ok(okAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 413 (payload too large).
     *
     * @chainable
     *
     * @param {Function} tooLargeAction The action to invoke.
     */
    payloadTooLarge(tooLargeAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Gets or sets the global list of URL parameters.
     *
     * @property
     */
    params: any;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 206 (partial content).
     *
     * @chainable
     *
     * @param {Function} partialAction The action to invoke.
     */
    partialContent(partialAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Starts a PATCH request.
     *
     * @param {IRequestOptions} [opts] The (additional) options.
     */
    patch(opts?: IRequestOptions): any;
    /**
     * Starts a POST request.
     *
     * @param {IRequestOptions} [opts] The (additional) options.
     */
    post(opts?: IRequestOptions): any;
    /**
     * Starts a PUT request.
     *
     * @param {IRequestOptions} [opts] The (additional) options.
     */
    put(opts?: IRequestOptions): any;
    /**
     * Defines an action that is invoked on a status code between 300 and 399.
     *
     * @chainable
     *
     * @param {Function} redirectAction The action to invoke.
     */
    redirection(redirectAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Starts a request.
     *
     * @param any method The HTTP method.
     * @param {IRequestOptions} [opts] The (additional) options.
     */
    request(method: any, opts?: IRequestOptions): any;
    /**
     * Gets or sets the route.
     */
    route: string;
    /**
     * Gets or sets the global list of route parameters.
     *
     * @property
     */
    routeParams: any;
    /**
     * Defines an action that is invoked on a status code between 500 and 599.
     *
     * @chainable
     *
     * @param {Function} serverErrAction The action to invoke.
     */
    serverError(serverErrAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 503 (service unavailable).
     *
     * @chainable
     *
     * @param {Function} unavailableAction The action to invoke.
     */
    serviceUnavailable(unavailableAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Sets the default authorizer.
     *
     * @chainable
     *
     * @param {IAuthorizer} authorizer The default authorizer.
     */
    setAuthorizer(authorizer: IAuthorizer): IApiClient;
    /**
     * Sets the base URL.
     *
     * @chainable
     *
     * @param {String} newValue The new URL.
     */
    setBaseUrl(newValue: string): IApiClient;
    /**
     * Sets the route.
     *
     * @chainable
     *
     * @param {String} newValue The new route.
     */
    setRoute(newValue: string): IApiClient;
    /**
     * Defines an action that is invoked for a specific status code.
     *
     * @chainable
     *
     * @param {Number} code The status code.
     * @param {Function} statusAction The action to invoke.
     */
    status(code: number, statusAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Defines an action that is invoked on a status code between 200 and 299.
     *
     * @chainable
     *
     * @param {Function} succeededAction The action to invoke.
     */
    succeededRequest(succeededAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Defines the "success" action.
     *
     * @chainable
     *
     * @param {Function} successAction The action to invoke.
     */
    success(successAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 429 (too many requests).
     *
     * @chainable
     *
     * @param {Function} tooManyAction The action to invoke.
     */
    tooManyRequests(tooManyAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 401 (unauthorized).
     *
     * @chainable
     *
     * @param {Function} unauthorizedAction The action to invoke.
     */
    unauthorized(unauthorizedAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 415 (unsupported media type).
     *
     * @chainable
     *
     * @param {Function} unsupportedAction The action to invoke.
     */
    unsupportedMediaType(unsupportedAction: (result: IApiClientResult) => void): IApiClient;
    /**
     * Short hand method to define an action that is invoked
     * for a status code 414 (URI too long).
     *
     * @chainable
     *
     * @param {Function} tooLongAction The action to invoke.
     */
    uriTooLong(tooLongAction: (result: IApiClientResult) => void): IApiClient;
}
/**
 * Describes a context of a "complete" action.
 */
export interface IApiClientCompleteContext extends ILogger, ITagProvider {
    /**
     * Gets the underlying API client.
     *
     * @property
     */
    client: IApiClient;
    /**
     * Gets the error context (if defined).
     *
     * @property
     */
    error?: IApiClientError;
    /**
     * Gets the underlying HTTP request.
     *
     * @property
     */
    request: IHttpRequest;
    /**
     * Gets the API result (if defined).
     *
     * @property
     */
    result?: IApiClientResult;
}
/**
 * Describes an object that stores configuration data for an API client.
 */
export interface IApiClientConfig {
    /**
     * Gets the default authorizer.
     *
     * @property
     */
    authorizer?: IAuthorizer;
    /**
     * Gets the base URL to use.
     *
     * @property
     */
    baseUrl: string;
    /**
     * Defines an action that is invoked BEFORE a request starts.
     *
     * @property
     */
    beforeSend?: (opts: HTTP.HttpRequestOptions) => void;
    /**
     * Defines the action to handle a status code between 400 and 499.
     *
     * @property
     */
    clientError?: (ctx: IApiClientResult) => void;
    /**
     * Defines the "complete" action.
     *
     * @property
     */
    complete?: (ctx: IApiClientCompleteContext) => void;
    /**
     * Defines the "error" action.
     *
     * @property
     */
    error?: (ctx: IApiClientError) => void;
    /**
     * Defines the action to handle a 403 status code.
     *
     * @property
     */
    forbidden?: (ctx: IApiClientResult) => void;
    /**
     * Gets the global request headers to use.
     *
     * @property
     */
    headers?: any;
    /**
     * Defines that actions to invoke if a reponse matches.
     */
    if?: IIfResponse[];
    /**
     * Defines that actions to invoke if a status code matches.
     */
    ifStatus?: IIfStatus[];
    /**
     * Defines the action to handle a status code between 300 and 399.
     *
     * @property
     */
    redirection?: (ctx: IApiClientResult) => void;
    /**
     * Defines the action to handle a 404 status code.
     *
     * @property
     */
    notFound?: (ctx: IApiClientResult) => void;
    /**
     * Defines the action to handle a 200, 204 or 205 status code.
     *
     * @property
     */
    ok?: (ctx: IApiClientResult) => void;
    /**
     * Gets the global URL parameters to use.
     *
     * @property
     */
    params?: any;
    /**
     * Gets the optional route.
     *
     * @property
     */
    route?: string;
    /**
     * Gets the global route parameters to use.
     *
     * @property
     */
    routeParams?: any;
    /**
     * Defines the action to handle a status code between 500 and 599.
     *
     * @property
     */
    serverError?: (ctx: IApiClientResult) => void;
    /**
     * Defines the action to handle a status code between 200 and 299.
     *
     * @property
     */
    succeededRequest?: (ctx: IApiClientResult) => void;
    /**
     * Defines the "success" action.
     *
     * @property
     */
    success?: (ctx: IApiClientResult) => void;
    /**
     * Defines the action to handle a 401 status code.
     *
     * @property
     */
    unauthorized?: (ctx: IApiClientResult) => void;
}
/**
 * Describes an error context of an API call.
 */
export interface IApiClientError extends ILogger, ITagProvider {
    /**
     * Gets the underlying client.
     *
     * @property
     */
    client: IApiClient;
    /**
     * Gets the context.
     *
     * @property
     */
    context: ApiClientErrorContext;
    /**
     * Gets the error data.
     *
     * @property
     */
    error: any;
    /**
     * Gets or sets if error has been handled or not.
     *
     * @property
     */
    handled: boolean;
    /**
     * Gets the underlying HTTP request.
     *
     * @property
     */
    request: IHttpRequest;
}
/**
 * Describes an API result.
 */
export interface IApiClientResult extends ILogger, ITagProvider {
    /**
     * Gets the underlying API client.
     *
     * @property
     */
    client: IApiClient;
    /**
     * Gets the HTTP response code.
     *
     * @property
     */
    code: number;
    /**
     * Gets the raw content.
     *
     * @property
     */
    content: any;
    /**
     * Gets the underlying (execution) context.
     *
     * @property
     */
    context: ApiClientResultContext;
    /**
     * Gets the response headers.
     *
     * @property
     */
    headers: HTTP.Headers;
    /**
     * Returns the content as wrapped AJAX result object.
     *
     * @return {IAjaxResult<TData>} The ajax result object.
     */
    getAjaxResult<TData>(): IAjaxResult<TData>;
    /**
     * Returns the content as file.
     *
     * @param {String} [destFile] The custom path of the destination file.
     *
     * @return {FileSystem.File} The file.
     */
    getFile(destFile?: string): FileSystem.File;
    /**
     * Tries result the content as image source.
     *
     * @return {Promise<Image.ImageSource>} The result.
     */
    getImage(): Promise<Image.ImageSource>;
    /**
     * Returns the content as JSON object.
     *
     * @return {T} The JSON object.
     */
    getJSON<T>(): T;
    /**
     * Returns the content as string.
     *
     * @return {String} The string.
     */
    getString(): string;
    /**
     * Gets the information about the request.
     *
     * @property
     */
    request: IHttpRequest;
    /**
     * Gets the raw response.
     *
     * @property
     */
    response: HTTP.HttpResponse;
}
/**
 * Describes an object that prepares a HTTP for authorization.
 */
export interface IAuthorizer {
    /**
     * Prepares a HTTP request for authorization.
     *
     * @param {HTTP.HttpRequestOptions} reqOpts The request options.
     */
    prepare(reqOpts: HTTP.HttpRequestOptions): any;
}
/**
 * Describes a format provider context.
 */
export interface IFormatProviderContext {
    /**
     * Gets the format expression.
     *
     * @property
     */
    expression: string;
    /**
     * Gets if the expression has been handled or not.
     *
     * @property
     */
    handled: boolean;
    /**
     * Gets the underlying (unhandled) value.
     *
     * @property
     */
    value: any;
}
/**
 * Describes an object that stores information about a HTTP request.
 */
export interface IHttpRequest {
    /**
     * Gets the raw content that is send to the API.
     */
    body: any;
    /**
     * Gets the underlying client.
     *
     * @property
     */
    client: IApiClient;
    /**
     * Gets the list of request headers.
     */
    headers: any;
    /**
     * Gets the HTTP method.
     */
    method: string;
    /**
     * Gets the URL.
     */
    url: string;
}
/**
 * Describes an entry that stores data for
 * invoke a response action if a predicate matches.
 */
export interface IIfResponse {
    /**
     * The action to invoke.
     *
     * @property
     */
    action: (result: IApiClientResult) => void;
    /**
     * The predicate.
     *
     * @property
     */
    predicate?: (ctx: IApiClientResult) => boolean;
}
/**
 * Describes an entry that stores data for
 * invoke a response action if a status code matches.
 */
export interface IIfStatus {
    /**
     * The action to invoke.
     *
     * @property
     */
    action: (result: IApiClientResult) => void;
    /**
     * The predicate.
     *
     * @property
     */
    predicate?: (code: number) => boolean;
}
/**
 * Describes an object that stores log information.
 */
export interface ILogMessage {
    /**
     * Gets the category.
     *
     * @property
     */
    category: LogCategory;
    /**
     * Gets the message value.
     *
     * @property
     */
    message: any;
    /**
     * Gets the priority.
     *
     * @property
     */
    priority: LogPriority;
    /**
     * Gets the source.
     */
    source: LogSource;
    /**
     * Gets the tag.
     *
     * @property
     */
    tag: string;
    /**
     * Gets the timestamp.
     */
    time: Date;
}
/**
 * Describes a logger.
 */
export interface ILogger {
    /**
     * Logs an alert message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    alert(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs a critical message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    crit(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs a debug message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    dbg(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs an emergency message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    emerg(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs an error message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    err(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs an info message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    info(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs a message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogCategory} [category] The optional log category. Default: LogCategory.Debug
     * @param {LogPriority} [priority] The optional log priority.
     */
    log(msg: any, tag?: string, category?: LogCategory, priority?: LogPriority): ILogger;
    /**
     * Logs a notice message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    note(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs a trace message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    trace(msg: any, tag?: string, priority?: LogPriority): ILogger;
    /**
     * Logs a warning message.
     *
     * @chainable
     *
     * @param any msg The message value.
     * @param {String} [tag] The optional tag value.
     * @param {LogPriority} [priority] The optional log priority.
     */
    warn(msg: any, tag?: string, priority?: LogPriority): ILogger;
}
/**
 * Describes an object that stores (additional) options for a request.
 */
export interface IRequestOptions {
    /**
     * Gets the authorizer.
     *
     * @property
     */
    authorizer?: IAuthorizer;
    /**
     * Gets the content.
     *
     * @property
     */
    content?: any;
    /**
     * Gets the name of the encoding.
     *
     * @property
     */
    encoding?: string;
    /**
     * Gets the list of request headers.
     *
     * @property
     */
    headers?: any;
    /**
     * Gets the URL params to set.
     *
     * @property
     */
    params?: any;
    /**
     * Gets the params for the route to set.
     *
     * @property
     */
    routeParams?: any;
    /**
     * Gets the global object that should be used in any callback.
     *
     * @property
     */
    tag?: any;
    /**
     * Gets the timeout in millisecons.
     *
     * @property
     */
    timeout?: number;
    /**
     * Gets request type.
     *
     * @property
     */
    type?: HttpRequestType;
}
/**
 * Describes an object that stores a global value.
 */
export interface ITagProvider {
    /**
     * Gets the value that should be linked with that instance.
     *
     * @property
     */
    tag: any;
}
/**
 * List of log categories.
 */
export declare enum LogCategory {
    Emergency = 1,
    Alert = 2,
    Critical = 3,
    Error = 4,
    Warning = 5,
    Notice = 6,
    Info = 7,
    Debug = 8,
    Trace = 9,
}
/**
 * List of log priorities.
 */
export declare enum LogPriority {
    VeryHigh = 1,
    High = 2,
    Medium = 3,
    Low = 4,
    VeryLow = 5,
}
/**
 * List of log (message) source.
 */
export declare enum LogSource {
    /**
     * From API client.
     */
    Client = 0,
    /**
     * From "completed" action
     */
    Complete = 1,
    /**
     * From IApiClientError object
     */
    Error = 2,
    /**
     * From IApiClientResult object
     */
    Result = 3,
}
/**
 * OAuth authorizer
 */
export declare class OAuth implements IAuthorizer {
    private _fields;
    /** @inheritdoc */
    prepare(reqOpts: HTTP.HttpRequestOptions): void;
    /**
     * Sets a field.
     *
     * @chainable
     *
     * @param {String} name The name of the field.
     * @param {String} value The value of the field.
     */
    setField(name: string, value: any): OAuth;
    /**
     * Sets a list of fields.
     *
     * @chainable
     *
     * @param any ...fields One or more object with fields an their values.
     */
    setMany(...fields: any[]): OAuth;
}
/**
 * Twitter OAuth authorizer.
 */
export declare class TwitterOAuth extends OAuth {
    private _consumerKey;
    private _consumerSecret;
    private _token;
    private _tokenSecret;
    /**
     * Initializes a new instance of that class.
     *
     * @param {String} consumerKey The consumer key.
     * @param {String} consumerSecret The consumer secret.
     * @param {String} token The token.
     * @param {String} tokenSecret The token secret.
     */
    constructor(consumerKey: string, consumerSecret: string, token: string, tokenSecret: string);
    /** @inheritdoc */
    prepare(reqOpts: HTTP.HttpRequestOptions): void;
    /**
     * Gets or sets the value for "oauth_nonce" (custom random crypto key).
     */
    nonce: string;
    /**
     * Gets or sets the value for "oauth_signature".
     */
    signature: string;
    /**
     * Gets or sets the value for "oauth_signature_method".
     */
    signatureMethod: string;
    /**
     * Gets or sets the value for "oauth_timestamp".
     */
    timestamp: Date;
    /**
     * Gets or sets the value for "oauth_version".
     */
    version: string;
}
/**
 * Creates a new client.
 *
 * @param any config The configuration data / base URL for the client.
 *
 * @return {IApiClient} The new client.
 */
export declare function newClient(config: IApiClientConfig | string): IApiClient;
