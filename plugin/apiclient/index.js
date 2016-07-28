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
var HTTP = require("http");
var TypeUtils = require("utils/types");
var Xml = require("xml");
/**
 * A basic logger.
 */
var LoggerBase = (function () {
    function LoggerBase() {
    }
    /** @inheritdoc */
    LoggerBase.prototype.alert = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Alert, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.crit = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Critical, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.dbg = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Debug, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.emerg = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Emergency, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.err = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Error, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.info = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Info, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.log = function (msg, tag, category, priority) {
        if (isEmptyString(tag)) {
            tag = null;
        }
        else {
            tag = tag.toUpperCase().trim();
        }
        if (TypeUtils.isNullOrUndefined(category)) {
            category = LogCategory.Debug;
        }
        this.onLog(this.createLogMessage(msg, tag, category, priority));
        return this;
    };
    /** @inheritdoc */
    LoggerBase.prototype.note = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Notice, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.trace = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Trace, priority);
    };
    /** @inheritdoc */
    LoggerBase.prototype.warn = function (msg, tag, priority) {
        return this.log(msg, tag, LogCategory.Warning, priority);
    };
    return LoggerBase;
}());
exports.LoggerBase = LoggerBase;
/**
 * An authorizer that uses an internal list of
 * authorizers to execute.
 */
var AggregateAuthorizer = (function () {
    function AggregateAuthorizer() {
        this._authorizers = [];
    }
    /**
     * Adds one or more authorizers.
     *
     * @param {IAuthorizer} ...authorizers One or more authorizers to add.
     */
    AggregateAuthorizer.prototype.addAuthorizers = function () {
        var authorizers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            authorizers[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < authorizers.length; i++) {
            this._authorizers
                .push(authorizers[i]);
        }
    };
    /** @inheritdoc */
    AggregateAuthorizer.prototype.prepare = function (reqOpts) {
        for (var i = 0; i < this._authorizers.length; i++) {
            this._authorizers[i]
                .prepare(reqOpts);
        }
    };
    return AggregateAuthorizer;
}());
exports.AggregateAuthorizer = AggregateAuthorizer;
var ApiClient = (function (_super) {
    __extends(ApiClient, _super);
    function ApiClient(cfg) {
        _super.call(this);
        this.beforeSendActions = [];
        this.formatProviders = [];
        this.ifEntries = [];
        this.logActions = [];
        this.baseUrl = cfg.baseUrl;
        this.headers = cfg.headers;
        this.route = cfg.route;
        this.routeParams = cfg.routeParams;
        this.params = cfg.params;
        this.authorizer = cfg.authorizer;
        // beforeSend()
        if (!TypeUtils.isNullOrUndefined(cfg.beforeSend)) {
            this.beforeSend(cfg.beforeSend);
        }
        // success action
        if (!TypeUtils.isNullOrUndefined(cfg.success)) {
            this.successAction = cfg.success;
        }
        // error action
        if (!TypeUtils.isNullOrUndefined(cfg.error)) {
            this.errorAction = cfg.error;
        }
        // complete action
        if (!TypeUtils.isNullOrUndefined(cfg.complete)) {
            this.completeAction = cfg.complete;
        }
        // notFound()
        if (!TypeUtils.isNullOrUndefined(cfg.notFound)) {
            this.notFound(cfg.notFound);
        }
        // unauthorized()
        if (!TypeUtils.isNullOrUndefined(cfg.unauthorized)) {
            this.unauthorized(cfg.unauthorized);
        }
        // forbidden()
        if (!TypeUtils.isNullOrUndefined(cfg.forbidden)) {
            this.forbidden(cfg.forbidden);
        }
        // succeededRequest()
        if (!TypeUtils.isNullOrUndefined(cfg.succeededRequest)) {
            this.succeededRequest(cfg.succeededRequest);
        }
        // redirection()
        if (!TypeUtils.isNullOrUndefined(cfg.redirection)) {
            this.redirection(cfg.redirection);
        }
        // clientError()
        if (!TypeUtils.isNullOrUndefined(cfg.clientError)) {
            this.clientError(cfg.clientError);
        }
        // serverError()
        if (!TypeUtils.isNullOrUndefined(cfg.serverError)) {
            this.serverError(cfg.serverError);
        }
        // ok()
        if (!TypeUtils.isNullOrUndefined(cfg.ok)) {
            this.ok(cfg.ok);
        }
        // status code
        for (var p in cfg) {
            var statusCode = parseInt(p);
            if (!isNaN(statusCode)) {
                if (statusCode >= 200 && statusCode <= 599) {
                    this.status(statusCode, cfg[p]);
                }
            }
        }
        // ifStatus()
        if (!TypeUtils.isNullOrUndefined(cfg.ifStatus)) {
            for (var i = 0; i < cfg.ifStatus.length; i++) {
                var ise = cfg.ifStatus[i];
                if (!TypeUtils.isNullOrUndefined(ise)) {
                    this.ifStatus(ise.predicate, ise.action);
                }
            }
        }
        // if()
        if (!TypeUtils.isNullOrUndefined(cfg.if)) {
            for (var i = 0; i < cfg.if.length; i++) {
                var ie = cfg.if[i];
                if (!TypeUtils.isNullOrUndefined(ie)) {
                    this.if(ie.predicate, ie.action);
                }
            }
        }
    }
    ApiClient.prototype.addFormatProvider = function (provider) {
        if (!TypeUtils.isNullOrUndefined(provider)) {
            this.formatProviders.push(provider);
        }
        return this;
    };
    ApiClient.prototype.addLogger = function (logAction) {
        if (!TypeUtils.isNullOrUndefined(logAction)) {
            this.logActions.push(logAction);
        }
        return this;
    };
    ApiClient.prototype.badGateway = function (badGatewayAction) {
        return this.status(502, badGatewayAction);
    };
    ApiClient.prototype.badRequest = function (badRequestAction) {
        return this.status(400, badRequestAction);
    };
    ApiClient.prototype.beforeSend = function (beforeAction) {
        this.beforeSendActions.push(beforeAction);
        return this;
    };
    ApiClient.prototype.clientError = function (clientErrAction) {
        return this.ifStatus(function (code) { return code >= 400 && code <= 499; }, clientErrAction);
    };
    ApiClient.prototype.clientOrServerError = function (clientSrvErrAction) {
        this.clientError(clientSrvErrAction);
        this.serverError(clientSrvErrAction);
        return this;
    };
    ApiClient.prototype.complete = function (completeAction) {
        this.completeAction = completeAction;
        return this;
    };
    ApiClient.prototype.createLogMessage = function (msg, tag, category, priority) {
        return new LogMessage(LogSource.Client, new Date(), msg, tag, category, priority);
    };
    ApiClient.prototype.delete = function (opts) {
        this.request("DELETE", opts);
    };
    ApiClient.prototype.error = function (errAction) {
        this.errorAction = errAction;
        return this;
    };
    ApiClient.prototype.forbidden = function (forbiddenAction) {
        return this.status(403, forbiddenAction);
    };
    ApiClient.prototype.gatewayTimeout = function (timeoutAction) {
        return this.status(504, timeoutAction);
    };
    ApiClient.prototype.get = function (opts) {
        return this.request("GET", opts);
    };
    ApiClient.prototype.gone = function (goneAction) {
        return this.status(410, goneAction);
    };
    ApiClient.prototype.if = function (predicate, statusAction) {
        this.ifEntries.push({
            action: statusAction,
            predicate: predicate,
        });
        return this;
    };
    ApiClient.prototype.ifStatus = function (predicate, statusAction) {
        var ifPredicate;
        if (!TypeUtils.isNullOrUndefined(predicate)) {
            ifPredicate = function (ctx) {
                return predicate(ctx.code);
            };
        }
        else {
            ifPredicate = function () { return true; };
        }
        return this.if(ifPredicate, statusAction);
    };
    ApiClient.prototype.informational = function (infoAction) {
        return this.ifStatus(function (code) { return code >= 100 && code <= 199; }, infoAction);
    };
    ApiClient.prototype.insufficientStorage = function (insufficientAction) {
        return this.status(507, insufficientAction);
    };
    ApiClient.prototype.internalServerError = function (errAction) {
        return this.status(500, errAction);
    };
    ApiClient.prototype.locked = function (lockedAction) {
        return this.status(423, lockedAction);
    };
    ApiClient.prototype.methodNotAllowed = function (notAllowedAction) {
        return this.status(405, notAllowedAction);
    };
    ApiClient.prototype.notFound = function (notFoundAction) {
        return this.status(404, notFoundAction);
    };
    ApiClient.prototype.notImplemented = function (notImplementedAction) {
        return this.status(501, notImplementedAction);
    };
    ApiClient.prototype.ok = function (okAction) {
        this.status(200, okAction);
        this.status(204, okAction);
        this.status(205, okAction);
        return this;
    };
    ApiClient.prototype.onLog = function (msg) {
        invokeLogActions(this, msg);
    };
    ApiClient.prototype.partialContent = function (partialAction) {
        return this.status(206, partialAction);
    };
    ApiClient.prototype.patch = function (opts) {
        return this.request("PATCH", opts);
    };
    ApiClient.prototype.payloadTooLarge = function (tooLargeAction) {
        return this.status(413, tooLargeAction);
    };
    ApiClient.prototype.post = function (opts) {
        return this.request("POST", opts);
    };
    ApiClient.prototype.put = function (opts) {
        return this.request("PUT", opts);
    };
    ApiClient.prototype.redirection = function (redirectAction) {
        return this.ifStatus(function (code) { return code >= 300 && code <= 399; }, redirectAction);
    };
    ApiClient.prototype.request = function (method, opts) {
        var me = this;
        var convertToString = function (val) {
            if (TypeUtils.isNullOrUndefined(val)) {
                return null;
            }
            if (typeof val !== "string") {
                val = JSON.stringify(getOwnProperties(val));
            }
            return val;
        };
        var url = this.baseUrl;
        var route = me.route;
        if (!isEmptyString(route)) {
            if ("/" !== url.substring(url.length - 1)) {
                url += "/";
            }
            // collect route parameters
            var routeParams = {};
            if (!TypeUtils.isNullOrUndefined(opts)) {
                var allRouteParams = [getOwnProperties(me.routeParams), getOwnProperties(opts.routeParams)];
                for (var i = 0; i < allRouteParams.length; i++) {
                    var routeParamsTemp = allRouteParams[i];
                    if (TypeUtils.isNullOrUndefined(routeParamsTemp)) {
                        continue;
                    }
                    var alreadyHandledParamNames = {};
                    for (var rpt in routeParamsTemp) {
                        var routeParamName = rpt.toLowerCase().trim();
                        if (alreadyHandledParamNames[routeParamName] === true) {
                            throw "Route parameter '" + routeParamName + "' is ALREADY defined!";
                        }
                        routeParams[routeParamName] = routeParamsTemp[rpt];
                        alreadyHandledParamNames[routeParamName] = true;
                    }
                }
            }
            // parse route parameters
            route = route.replace(/{(([^\:]+))(\:)?([^}]*)}/g, function (match, paramName, formatSeparator, formatExpr) {
                paramName = paramName.toLowerCase().trim();
                var paramValue = routeParams[paramName];
                var funcDepth = -1;
                while (typeof paramValue === "function") {
                    paramValue = paramValue(paramName, routeParams, match, formatExpr, ++funcDepth);
                }
                if (formatSeparator === ':') {
                    // use format providers
                    for (var i = 0; i < me.formatProviders.length; i++) {
                        var fp = me.formatProviders[i];
                        var fpCtx = new FormatProviderContext(formatExpr, paramValue);
                        var fpResult = fp(fpCtx);
                        if (fpCtx.handled) {
                            // handled: first wins
                            paramValue = fpResult;
                            break;
                        }
                    }
                }
                if (paramValue === undefined) {
                    throw "Route parameter '" + paramName + "' is NOT defined!";
                }
                return convertToString(paramValue);
            });
            url += route;
        }
        var httpRequestOpts = {};
        // request headers
        httpRequestOpts.headers = {};
        {
            var allRequestHeaders = [getOwnProperties(me.headers)];
            if (!TypeUtils.isNullOrUndefined(opts)) {
                allRequestHeaders.push(getOwnProperties(opts.headers));
            }
            for (var i = 0; i < allRequestHeaders.length; i++) {
                var requestHeaders = allRequestHeaders[i];
                if (TypeUtils.isNullOrUndefined(requestHeaders)) {
                    continue;
                }
                for (var rqh in requestHeaders) {
                    httpRequestOpts.headers[rqh] = requestHeaders[rqh];
                }
            }
        }
        // URL parameters
        {
            var allUrlParams = [getOwnProperties(me.params)];
            if (!TypeUtils.isNullOrUndefined(opts)) {
                allUrlParams.push(getOwnProperties(opts.params));
            }
            var urlParamCount = 0;
            var urlParamSuffix = "";
            for (var i = 0; i < allUrlParams.length; i++) {
                var urlParams = allUrlParams[i];
                if (TypeUtils.isNullOrUndefined(urlParams)) {
                    continue;
                }
                for (var up in urlParams) {
                    if (urlParamCount > 0) {
                        urlParamSuffix += "&";
                    }
                    var urlParamName = up;
                    var funcDepth = 0;
                    var urlParamValue = urlParams[up];
                    while (typeof urlParamValue === "function") {
                        urlParamValue = urlParamValue(urlParamName, urlParamCount, funcDepth++);
                    }
                    urlParamSuffix += urlParamName + "=" + urlParamValue;
                    ++urlParamCount;
                }
            }
            if (urlParamCount > 0) {
                url += urlParamSuffix;
            }
        }
        if (!TypeUtils.isNullOrUndefined(opts)) {
            // timeout
            if (!TypeUtils.isNullOrUndefined(opts.timeout)) {
                httpRequestOpts.timeout = opts.timeout;
            }
        }
        var authorizer = me.authorizer;
        var content;
        var encoding = "utf-8";
        var tag;
        var contentConverter = function (c) { return c; };
        if (!TypeUtils.isNullOrUndefined(opts)) {
            content = opts.content;
            tag = opts.tag;
            // encoding
            if (!isEmptyString(opts.encoding)) {
                encoding = opts.encoding.toLowerCase().trim();
            }
            // request type
            if (!TypeUtils.isNullOrUndefined(opts.type)) {
                switch (opts.type) {
                    case HttpRequestType.Binary:
                        httpRequestOpts.headers["Content-type"] = "application/octet-stream";
                        break;
                    case HttpRequestType.JSON:
                        httpRequestOpts.headers["Content-type"] = "application/json; charset=" + encoding;
                        contentConverter = function (c) {
                            if (null !== c) {
                                c = JSON.stringify(c);
                            }
                            return c;
                        };
                        break;
                    case HttpRequestType.Text:
                        httpRequestOpts.headers["Content-type"] = "text/plain; charset=" + encoding;
                        contentConverter = function (c) {
                            return convertToString(c);
                        };
                        break;
                    case HttpRequestType.Xml:
                        httpRequestOpts.headers["Content-type"] = "text/xml; charset=" + encoding;
                        contentConverter = function (c) {
                            c = convertToString(c);
                            if (null !== c) {
                                var isValidXml = true;
                                var xmlParser = new Xml.XmlParser(function () { }, function (error) {
                                    isValidXml = false;
                                });
                                xmlParser.parse(c);
                                if (!isValidXml) {
                                    throw "XML parse error.";
                                }
                            }
                            return c;
                        };
                        break;
                }
            }
            authorizer = opts.authorizer || authorizer;
        }
        // authorization
        if (!TypeUtils.isNullOrUndefined(authorizer)) {
            authorizer.prepare(httpRequestOpts);
        }
        if (TypeUtils.isNullOrUndefined(content)) {
            content = null;
        }
        httpRequestOpts.url = encodeURI(url);
        httpRequestOpts.method = methodToString(method);
        httpRequestOpts.content = contentConverter(content);
        // before send actions
        for (var i = 0; i < me.beforeSendActions.length; i++) {
            var bsa = me.beforeSendActions[i];
            bsa(httpRequestOpts, tag);
        }
        var httpReq = new HttpRequest(me, httpRequestOpts);
        me.dbg("URL: " + httpRequestOpts.url, "HttpRequestOptions");
        me.dbg("Method: " + httpRequestOpts.method, "HttpRequestOptions");
        for (var rp in routeParams) {
            me.dbg("RouteParameter[" + rp + "]: " + routeParams[rp], "HttpRequestOptions");
        }
        if (!TypeUtils.isNullOrUndefined(urlParams)) {
            for (var up in urlParams) {
                me.dbg("UrlParameter[" + up + "]: " + urlParams[up], "HttpRequestOptions");
            }
        }
        var getLogTag = function () {
            return "HttpRequest::" + httpRequestOpts.url;
        };
        var invokeComplete = function (result, err) {
            if (!TypeUtils.isNullOrUndefined(result)) {
                result.setContext(ApiClientResultContext.Complete);
            }
            if (!TypeUtils.isNullOrUndefined(me.completeAction)) {
                me.completeAction(new ApiClientCompleteContext(me, httpReq, result, err, tag));
            }
        };
        try {
            HTTP.request(httpRequestOpts)
                .then(function (response) {
                var result = new ApiClientResult(me, httpReq, response, tag);
                result.setContext(ApiClientResultContext.Success);
                me.dbg("Status code: " + result.code, getLogTag());
                for (var h in getOwnProperties(result.headers)) {
                    me.trace("ResponseHeader['" + h + "']: " + result.headers[h], getLogTag());
                }
                // collect "conditional" actions that should be
                // invoked instead of "success" action
                var ifActions = [];
                for (var i = 0; i < me.ifEntries.length; i++) {
                    var ie = me.ifEntries[i];
                    if (!TypeUtils.isNullOrUndefined(ie.action)) {
                        var statusPredicate = ie.predicate;
                        if (TypeUtils.isNullOrUndefined(statusPredicate)) {
                            statusPredicate = function () { return true; };
                        }
                        if (statusPredicate(result)) {
                            ifActions.push(ie.action);
                        }
                    }
                }
                // process "conditional" actions
                for (var i = 0; i < ifActions.length; i++) {
                    var ia = ifActions[i];
                    ia(result);
                }
                if (ifActions.length < 1 &&
                    !TypeUtils.isNullOrUndefined(me.successAction)) {
                    me.successAction(result);
                }
                invokeComplete(result, undefined);
            }, function (err) {
                me.err("[ERROR]: " + err, getLogTag());
                var errCtx = new ApiClientError(me, httpReq, err, ApiClientErrorContext.ClientError, tag);
                if (!TypeUtils.isNullOrUndefined(me.errorAction)) {
                    errCtx.handled = true;
                    me.errorAction(errCtx);
                }
                if (!errCtx.handled) {
                    throw err;
                }
                invokeComplete(undefined, errCtx);
            });
        }
        catch (e) {
            me.crit("[FATAL ERROR]: " + e, getLogTag());
            var errCtx = new ApiClientError(me, httpReq, e, ApiClientErrorContext.Exception, tag);
            if (!TypeUtils.isNullOrUndefined(me.errorAction)) {
                errCtx.handled = true;
                me.errorAction(errCtx);
            }
            if (!errCtx.handled) {
                throw e;
            }
            invokeComplete(undefined, errCtx);
        }
    };
    ApiClient.prototype.setAuthorizer = function (newAuthorizer) {
        this.authorizer = newAuthorizer;
        return this;
    };
    ApiClient.prototype.serverError = function (serverErrAction) {
        return this.ifStatus(function (code) { return code >= 500 && code <= 599; }, serverErrAction);
    };
    ApiClient.prototype.serviceUnavailable = function (unavailableAction) {
        return this.status(503, unavailableAction);
    };
    ApiClient.prototype.setBaseUrl = function (newValue) {
        this.baseUrl = newValue;
        return this;
    };
    ApiClient.prototype.setRoute = function (newValue) {
        this.route = newValue;
        return this;
    };
    ApiClient.prototype.status = function (code, statusAction) {
        this.ifStatus(function (sc) { return code == sc; }, statusAction);
        return this;
    };
    ApiClient.prototype.succeededRequest = function (succeededAction) {
        return this.ifStatus(function (code) { return code >= 200 && code <= 299; }, succeededAction);
    };
    ApiClient.prototype.success = function (successAction) {
        this.successAction = successAction;
        return this;
    };
    ApiClient.prototype.tooManyRequests = function (tooManyAction) {
        return this.status(429, tooManyAction);
    };
    ApiClient.prototype.unauthorized = function (unauthorizedAction) {
        return this.status(401, unauthorizedAction);
    };
    ApiClient.prototype.unsupportedMediaType = function (unsupportedAction) {
        return this.status(415, unsupportedAction);
    };
    ApiClient.prototype.uriTooLong = function (tooLongAction) {
        return this.status(414, tooLongAction);
    };
    return ApiClient;
}(LoggerBase));
var ApiClientCompleteContext = (function (_super) {
    __extends(ApiClientCompleteContext, _super);
    function ApiClientCompleteContext(client, request, result, err, tag) {
        _super.call(this);
        this._client = client;
        this._request = request;
        this._result = result;
        this._error = err;
        this._tag = tag;
    }
    Object.defineProperty(ApiClientCompleteContext.prototype, "client", {
        get: function () {
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientCompleteContext.prototype.createLogMessage = function (msg, tag, category, priority) {
        return new LogMessage(LogSource.Complete, new Date(), msg, tag, category, priority);
    };
    Object.defineProperty(ApiClientCompleteContext.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientCompleteContext.prototype.onLog = function (msg) {
        invokeLogActions(this._client, msg);
    };
    Object.defineProperty(ApiClientCompleteContext.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientCompleteContext.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientCompleteContext.prototype, "tag", {
        get: function () {
            return this._tag;
        },
        enumerable: true,
        configurable: true
    });
    return ApiClientCompleteContext;
}(LoggerBase));
var ApiClientError = (function (_super) {
    __extends(ApiClientError, _super);
    function ApiClientError(client, request, error, ctx, tag) {
        _super.call(this);
        this.handled = false;
        this._client = client;
        this._request = request;
        this._error = error;
        this._context = ctx;
        this._tag = tag;
    }
    Object.defineProperty(ApiClientError.prototype, "client", {
        get: function () {
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientError.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientError.prototype.createLogMessage = function (msg, tag, category, priority) {
        return new LogMessage(LogSource.Error, new Date(), msg, tag, category, priority);
    };
    Object.defineProperty(ApiClientError.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientError.prototype.onLog = function (msg) {
        invokeLogActions(this._client, msg);
    };
    Object.defineProperty(ApiClientError.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientError.prototype, "tag", {
        get: function () {
            return this._tag;
        },
        enumerable: true,
        configurable: true
    });
    return ApiClientError;
}(LoggerBase));
/**
 * List of API client result contextes.
 */
(function (ApiClientResultContext) {
    /**
     * "success" action.
     */
    ApiClientResultContext[ApiClientResultContext["Success"] = 0] = "Success";
    /**
     * "completed" action.
     */
    ApiClientResultContext[ApiClientResultContext["Complete"] = 1] = "Complete";
})(exports.ApiClientResultContext || (exports.ApiClientResultContext = {}));
var ApiClientResultContext = exports.ApiClientResultContext;
/**
 * List of API client error contextes.
 */
(function (ApiClientErrorContext) {
    /**
     * Error in HTTP client.
     */
    ApiClientErrorContext[ApiClientErrorContext["ClientError"] = 0] = "ClientError";
    /**
     * "Unhandled" exception.
     */
    ApiClientErrorContext[ApiClientErrorContext["Exception"] = 1] = "Exception";
})(exports.ApiClientErrorContext || (exports.ApiClientErrorContext = {}));
var ApiClientErrorContext = exports.ApiClientErrorContext;
var ApiClientResult = (function (_super) {
    __extends(ApiClientResult, _super);
    function ApiClientResult(client, request, response, tag) {
        _super.call(this);
        this._client = client;
        this._request = request;
        this._reponse = response;
        this._tag = tag;
    }
    Object.defineProperty(ApiClientResult.prototype, "client", {
        get: function () {
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientResult.prototype, "code", {
        get: function () {
            return this._reponse.statusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientResult.prototype, "content", {
        get: function () {
            if (TypeUtils.isNullOrUndefined(this._reponse.content.raw)) {
                return null;
            }
            return this._reponse.content.raw;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientResult.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientResult.prototype.createLogMessage = function (msg, tag, category, priority) {
        return new LogMessage(LogSource.Result, new Date(), msg, tag, category, priority);
    };
    ApiClientResult.prototype.getAjaxResult = function () {
        return this.getJSON();
    };
    ApiClientResult.prototype.getFile = function (destFile) {
        if (arguments.length < 1) {
            return this._reponse.content.toFile();
        }
        this._reponse.headers;
        return this._reponse.content.toFile(destFile);
    };
    ApiClientResult.prototype.getImage = function () {
        return this._reponse.content.toImage();
    };
    ApiClientResult.prototype.getJSON = function () {
        var json = this._reponse.content.toString();
        if (isEmptyString(json)) {
            return null;
        }
        return JSON.parse(json);
    };
    ApiClientResult.prototype.getString = function () {
        var str = this._reponse.content.toString();
        if (TypeUtils.isNullOrUndefined(str)) {
            return null;
        }
        return str;
    };
    Object.defineProperty(ApiClientResult.prototype, "headers", {
        get: function () {
            return this._reponse.headers;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientResult.prototype.onLog = function (msg) {
        invokeLogActions(this._client, msg);
    };
    Object.defineProperty(ApiClientResult.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiClientResult.prototype, "response", {
        get: function () {
            return this._reponse;
        },
        enumerable: true,
        configurable: true
    });
    ApiClientResult.prototype.setContext = function (newValue) {
        this._context = newValue;
    };
    Object.defineProperty(ApiClientResult.prototype, "tag", {
        get: function () {
            return this._tag;
        },
        enumerable: true,
        configurable: true
    });
    return ApiClientResult;
}(LoggerBase));
/**
 * An authorizer for basic authentication.
 */
var BasicAuth = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param {String} username The username.
     * @param {String} pwd The password.
     */
    function BasicAuth(username, pwd) {
        this._username = username;
        this._password = pwd;
    }
    Object.defineProperty(BasicAuth.prototype, "password", {
        /**
         * Gets the password.
         *
         * @property
         */
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    BasicAuth.prototype.prepare = function (reqOpts) {
        reqOpts.headers["Authorization"] = "Basic " + encodeBase64(this._username + ":" + this._password);
    };
    Object.defineProperty(BasicAuth.prototype, "username", {
        /**
         * Gets the username.
         *
         * @property
         */
        get: function () {
            return this._username;
        },
        enumerable: true,
        configurable: true
    });
    return BasicAuth;
}());
exports.BasicAuth = BasicAuth;
/**
 * An authorizer for bearer authentication.
 */
var BearerAuth = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param {String} token The token.
     */
    function BearerAuth(token) {
        this._token = token;
    }
    /** @inheritdoc */
    BearerAuth.prototype.prepare = function (reqOpts) {
        reqOpts.headers["Authorization"] = "Bearer " + this._token;
    };
    Object.defineProperty(BearerAuth.prototype, "token", {
        /**
         * Gets the token.
         *
         * @property
         */
        get: function () {
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    return BearerAuth;
}());
exports.BearerAuth = BearerAuth;
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
 * List of known HTTP request methods.
 */
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 0] = "GET";
    HttpMethod[HttpMethod["POST"] = 1] = "POST";
    HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
    HttpMethod[HttpMethod["PATCH"] = 3] = "PATCH";
    HttpMethod[HttpMethod["DELETE"] = 4] = "DELETE";
    HttpMethod[HttpMethod["HEAD"] = 5] = "HEAD";
    HttpMethod[HttpMethod["TRACE"] = 6] = "TRACE";
    HttpMethod[HttpMethod["OPTIONS"] = 7] = "OPTIONS";
    HttpMethod[HttpMethod["CONNECT"] = 8] = "CONNECT";
})(exports.HttpMethod || (exports.HttpMethod = {}));
var HttpMethod = exports.HttpMethod;
var HttpRequest = (function () {
    function HttpRequest(client, reqOpts) {
        this._client = client;
        this._opts = reqOpts;
    }
    Object.defineProperty(HttpRequest.prototype, "body", {
        get: function () {
            return this._opts.content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "client", {
        get: function () {
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "headers", {
        get: function () {
            return this._opts.headers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "method", {
        get: function () {
            return this._opts.method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "url", {
        get: function () {
            return this._opts.url;
        },
        enumerable: true,
        configurable: true
    });
    return HttpRequest;
}());
/**
 * List of known HTTP request / content types.
 */
(function (HttpRequestType) {
    /**
     * Raw / binary
     */
    HttpRequestType[HttpRequestType["Binary"] = 0] = "Binary";
    /**
     * JSON
     */
    HttpRequestType[HttpRequestType["JSON"] = 1] = "JSON";
    /**
     * Xml
     */
    HttpRequestType[HttpRequestType["Xml"] = 2] = "Xml";
    /**
     * Text / string
     */
    HttpRequestType[HttpRequestType["Text"] = 3] = "Text";
})(exports.HttpRequestType || (exports.HttpRequestType = {}));
var HttpRequestType = exports.HttpRequestType;
/**
 * List of known HTTP status codes.
 */
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["Accepted"] = 202] = "Accepted";
    HttpStatusCode[HttpStatusCode["BadGateway"] = 502] = "BadGateway";
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["Conflict"] = 409] = "Conflict";
    HttpStatusCode[HttpStatusCode["Continue"] = 100] = "Continue";
    HttpStatusCode[HttpStatusCode["Created"] = 201] = "Created";
    HttpStatusCode[HttpStatusCode["ExpectationFailed"] = 417] = "ExpectationFailed";
    HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
    HttpStatusCode[HttpStatusCode["GatewayTimeout"] = 504] = "GatewayTimeout";
    HttpStatusCode[HttpStatusCode["Gone"] = 410] = "Gone";
    HttpStatusCode[HttpStatusCode["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
    HttpStatusCode[HttpStatusCode["InternalServerError"] = 500] = "InternalServerError";
    HttpStatusCode[HttpStatusCode["LengthRequired"] = 411] = "LengthRequired";
    HttpStatusCode[HttpStatusCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpStatusCode[HttpStatusCode["MovedPermanently"] = 301] = "MovedPermanently";
    HttpStatusCode[HttpStatusCode["MultipleChoices"] = 300] = "MultipleChoices";
    HttpStatusCode[HttpStatusCode["NoContent"] = 204] = "NoContent";
    HttpStatusCode[HttpStatusCode["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
    HttpStatusCode[HttpStatusCode["NotAcceptable"] = 406] = "NotAcceptable";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
    HttpStatusCode[HttpStatusCode["NotImplemented"] = 501] = "NotImplemented";
    HttpStatusCode[HttpStatusCode["NotModified"] = 304] = "NotModified";
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["PartialContent"] = 206] = "PartialContent";
    HttpStatusCode[HttpStatusCode["PaymentRequired"] = 402] = "PaymentRequired";
    HttpStatusCode[HttpStatusCode["PreconditionFailed"] = 412] = "PreconditionFailed";
    HttpStatusCode[HttpStatusCode["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpStatusCode[HttpStatusCode["Redirect"] = 302] = "Redirect";
    HttpStatusCode[HttpStatusCode["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    HttpStatusCode[HttpStatusCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    HttpStatusCode[HttpStatusCode["RequestTimeout"] = 408] = "RequestTimeout";
    HttpStatusCode[HttpStatusCode["RequestUriTooLong"] = 414] = "RequestUriTooLong";
    HttpStatusCode[HttpStatusCode["ResetContent"] = 205] = "ResetContent";
    HttpStatusCode[HttpStatusCode["SeeOther"] = 303] = "SeeOther";
    HttpStatusCode[HttpStatusCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpStatusCode[HttpStatusCode["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    HttpStatusCode[HttpStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
    HttpStatusCode[HttpStatusCode["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    HttpStatusCode[HttpStatusCode["Unused"] = 306] = "Unused";
    HttpStatusCode[HttpStatusCode["UpgradeRequired"] = 426] = "UpgradeRequired";
    HttpStatusCode[HttpStatusCode["UseProxy"] = 305] = "UseProxy";
})(exports.HttpStatusCode || (exports.HttpStatusCode = {}));
var HttpStatusCode = exports.HttpStatusCode;
/**
 * List of log categories.
 */
(function (LogCategory) {
    LogCategory[LogCategory["Emergency"] = 1] = "Emergency";
    LogCategory[LogCategory["Alert"] = 2] = "Alert";
    LogCategory[LogCategory["Critical"] = 3] = "Critical";
    LogCategory[LogCategory["Error"] = 4] = "Error";
    LogCategory[LogCategory["Warning"] = 5] = "Warning";
    LogCategory[LogCategory["Notice"] = 6] = "Notice";
    LogCategory[LogCategory["Info"] = 7] = "Info";
    LogCategory[LogCategory["Debug"] = 8] = "Debug";
    LogCategory[LogCategory["Trace"] = 9] = "Trace";
})(exports.LogCategory || (exports.LogCategory = {}));
var LogCategory = exports.LogCategory;
var LogMessage = (function () {
    function LogMessage(source, time, msg, tag, category, priority) {
        this._source = source;
        this._time = time;
        this._message = msg;
        this._tag = tag;
        this._category = category;
        this._priority = priority;
    }
    Object.defineProperty(LogMessage.prototype, "category", {
        get: function () {
            return this._category;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogMessage.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogMessage.prototype, "priority", {
        get: function () {
            return this._priority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogMessage.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogMessage.prototype, "tag", {
        get: function () {
            return this._tag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogMessage.prototype, "time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    return LogMessage;
}());
/**
 * List of log priorities.
 */
(function (LogPriority) {
    LogPriority[LogPriority["VeryHigh"] = 1] = "VeryHigh";
    LogPriority[LogPriority["High"] = 2] = "High";
    LogPriority[LogPriority["Medium"] = 3] = "Medium";
    LogPriority[LogPriority["Low"] = 4] = "Low";
    LogPriority[LogPriority["VeryLow"] = 5] = "VeryLow";
})(exports.LogPriority || (exports.LogPriority = {}));
var LogPriority = exports.LogPriority;
/**
 * List of log (message) source.
 */
(function (LogSource) {
    /**
     * From API client.
     */
    LogSource[LogSource["Client"] = 0] = "Client";
    /**
     * From "completed" action
     */
    LogSource[LogSource["Complete"] = 1] = "Complete";
    /**
     * From IApiClientError object
     */
    LogSource[LogSource["Error"] = 2] = "Error";
    /**
     * From IApiClientResult object
     */
    LogSource[LogSource["Result"] = 3] = "Result";
})(exports.LogSource || (exports.LogSource = {}));
var LogSource = exports.LogSource;
/**
 * OAuth authorizer
 */
var OAuth = (function () {
    function OAuth() {
        this._fields = {};
    }
    /** @inheritdoc */
    OAuth.prototype.prepare = function (reqOpts) {
        var i = 0;
        var fieldList = '';
        for (var f in this._fields) {
            var v = this._fields[f];
            if (i > 0) {
                fieldList += ', ';
            }
            fieldList += f + '=' + '"' + encodeURIComponent(v) + '"';
            ++i;
        }
        reqOpts.headers["Authorization"] = 'OAuth ' + fieldList;
    };
    /**
     * Sets a field.
     *
     * @chainable
     *
     * @param {String} name The name of the field.
     * @param {String} value The value of the field.
     */
    OAuth.prototype.setField = function (name, value) {
        this._fields[name] = value;
        return this;
    };
    /**
     * Sets a list of fields.
     *
     * @chainable
     *
     * @param any ...fields One or more object with fields an their values.
     */
    OAuth.prototype.setMany = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < fields.length; i++) {
            var fieldObj = getOwnProperties(fields[i]);
            if (TypeUtils.isNullOrUndefined(fieldObj)) {
                continue;
            }
            for (var f in fieldObj) {
                this.setField(f, fieldObj[f]);
            }
        }
        return this;
    };
    return OAuth;
}());
exports.OAuth = OAuth;
/**
 * Twitter OAuth authorizer.
 */
var TwitterOAuth = (function (_super) {
    __extends(TwitterOAuth, _super);
    /**
     * Initializes a new instance of that class.
     *
     * @param {String} consumerKey The consumer key.
     * @param {String} consumerSecret The consumer secret.
     * @param {String} token The token.
     * @param {String} tokenSecret The token secret.
     */
    function TwitterOAuth(consumerKey, consumerSecret, token, tokenSecret) {
        _super.call(this);
        /**
         * Gets or sets the value for "oauth_signature_method".
         */
        this.signatureMethod = 'HMAC-SHA1';
        /**
         * Gets or sets the value for "oauth_version".
         */
        this.version = '1.0';
        this._consumerKey = consumerKey;
        this._consumerSecret = consumerSecret;
        this._token = token;
        this._tokenSecret = tokenSecret;
        // initial value for 'nonce' property
        var NONCE_CHARS = '0123456789abcdef';
        this.nonce = '';
        for (var i = 0; i < 32; i++) {
            this.nonce += NONCE_CHARS[Math.floor(Math.random() * NONCE_CHARS.length) % NONCE_CHARS.length];
        }
    }
    /** @inheritdoc */
    TwitterOAuth.prototype.prepare = function (reqOpts) {
        var timestamp = this.timestamp;
        if (TypeUtils.isNullOrUndefined(timestamp)) {
            timestamp = new Date();
        }
        if (!isEmptyString(this._consumerKey)) {
            this.setField('oauth_consumer_key', this._consumerKey);
        }
        if (!TypeUtils.isNullOrUndefined(this.nonce)) {
            this.setField('oauth_nonce', this.nonce);
        }
        if (!TypeUtils.isNullOrUndefined(this.signature)) {
            this.setField('oauth_signature', this.signature);
        }
        if (!isEmptyString(this.signatureMethod)) {
            this.setField('oauth_signature_method', this.signatureMethod);
        }
        this.setField('oauth_timestamp', Math.floor(timestamp.getTime() / 1000.0));
        if (!isEmptyString(this._token)) {
            this.setField('oauth_token', this._token);
        }
        if (!isEmptyString(this.version)) {
            this.setField('oauth_version', this.version);
        }
        _super.prototype.prepare.call(this, reqOpts);
    };
    return TwitterOAuth;
}(OAuth));
exports.TwitterOAuth = TwitterOAuth;
function encodeBase64(str) {
    if (isEmptyString(str)) {
        return str;
    }
    var padChar = '=';
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var getByte = function (s, i) {
        var cc = s.charCodeAt(i);
        if (cc > 255) {
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        }
        return cc;
    };
    var b10, i;
    var b64Chars = [];
    var iMax = str.length - str.length % 3;
    for (i = 0; i < iMax; i += 3) {
        b10 = (getByte(str, i) << 16) |
            (getByte(str, i + 1) << 8) |
            getByte(str, i + 2);
        b64Chars.push(alpha.charAt(b10 >> 18));
        b64Chars.push(alpha.charAt((b10 >> 12) & 0x3F));
        b64Chars.push(alpha.charAt((b10 >> 6) & 0x3f));
        b64Chars.push(alpha.charAt(b10 & 0x3f));
    }
    switch (str.length - iMax) {
        case 1:
            b10 = getByte(str, i) << 16;
            b64Chars.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
                padChar + padChar);
            break;
        case 2:
            b10 = (getByte(str, i) << 16) | (getByte(str, i + 1) << 8);
            b64Chars.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
                alpha.charAt((b10 >> 6) & 0x3F) + padChar);
            break;
    }
    return b64Chars.join('');
}
function getOwnProperties(obj) {
    if (TypeUtils.isNullOrUndefined(obj)) {
        return undefined;
    }
    var properties = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            properties[p] = obj[p];
        }
    }
    return properties;
}
function invokeLogActions(client, msg) {
    for (var i = 0; i < client.logActions.length; i++) {
        try {
            var la = client.logActions[i];
            la(msg);
        }
        catch (e) {
            console.log("[ERROR] invokeLogActions(" + i + "): " + e);
        }
    }
}
function isEmptyString(str) {
    if (TypeUtils.isNullOrUndefined(str)) {
        return true;
    }
    return "" === str.trim();
}
function methodToString(method) {
    if (TypeUtils.isNullOrUndefined(method)) {
        return "GET";
    }
    if (typeof method !== "string") {
        method = HttpMethod[method];
    }
    return method.toUpperCase().trim();
}
/**
 * Creates a new client.
 *
 * @param any config The configuration data / base URL for the client.
 *
 * @return {IApiClient} The new client.
 */
function newClient(config) {
    var cfg = config;
    if (typeof cfg === "string") {
        cfg = {
            baseUrl: config
        };
    }
    if (TypeUtils.isNullOrUndefined(cfg)) {
        cfg = {};
    }
    return new ApiClient(cfg);
}
exports.newClient = newClient;
//# sourceMappingURL=index.js.map