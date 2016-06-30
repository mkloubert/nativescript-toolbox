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

var Application = require("application");
var TypeUtils = require("utils/types");

function getAppContext() {
    var ctx = Application.android.context;

    if (TypeUtils.isNullOrUndefined(ctx)) {
        ctx = java.lang.Class.forName("android.app.AppGlobals")
                             .getMethod("getInitialApplication", null)
                             .invoke(null, null);
    }

    if (TypeUtils.isNullOrUndefined(ctx)) {
        ctx = java.lang.Class.forName("android.app.ActivityThread")
                             .getMethod("currentApplication", null)
                             .invoke(null, null);
    }

    if (!TypeUtils.isNullOrUndefined(ctx)) {
        ctx = ctx.getApplicationContext();
    }
    else {
        ctx = undefined;
    }

    return ctx;
}
exports.getAppContext;

function isInDebugMode() {
    return BuildConfig.DEBUG;
}
exports.isInDebugMode = isInDebugMode;

// Thanks to Nathanael Anderson!
// 
// s. https://github.com/NathanaelA/nativescript-openurl
function openUri(uri) {
    var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
                                            android.net.Uri.parse(uri));
    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

    var ctx = getAppContext();
    if (TypeUtils.isNullOrUndefined(ctx)) {
        return false;
    }

    ctx.startActivity(intent);
}
exports.openUri = openUri;
