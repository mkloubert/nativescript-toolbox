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

var actionRunnable = java.lang.Runnable.extend({
    action: undefined,
    
    run: function() {
        this.action();
    }
});

// Based on the code by Peter Staev
// 
// https://github.com/PeterStaev/NativeScript-Status-Bar
function changeStatusBarVisibility(showBar, callback, tag) {
    var activity = getAppView();

    var isVisible;
    var error;
    var code = 1;

    if (!TypeUtils.isNullOrUndefined(activity)) {
        var window = activity.getWindow();
        if (!TypeUtils.isNullOrUndefined(window)) {
            var view = window.getDecorView();
            if (!TypeUtils.isNullOrUndefined(view)) {
                var flag = showBar ? android.view.View.SYSTEM_UI_FLAG_VISIBLE
                                   : android.view.View.SYSTEM_UI_FLAG_FULLSCREEN;

                view.setSystemUiVisibility(flag);

                isVisible = showBar;
                code = 0;
            }
            else {
                code = 4;
            }
        }
        else {
            code = 3;
        }
    }
    else {
        code = 2;
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        callback({
            code: code,
            error: error,
            isVisible: isVisible,
            tag: tag
        });
    }
}
exports.changeStatusBarVisibility = changeStatusBarVisibility;

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
exports.getAppContext = getAppContext;

function getAppView() {
    return Application.android.foregroundActivity || Application.android.startActivity;
}
exports.getAppView = getAppView;

function getPlatformData() {
    var pd = {};

    // app
    Object.defineProperty(pd, 'app', {
        get: function() { return Application.android; }
    });

    // type
    Object.defineProperty(pd, 'type', {
        get: function() { return 1; }
    });

    return pd;
}
exports.getPlatformData = getPlatformData;

function isInDebugMode() {
    var ctx = getAppContext();
    if (TypeUtils.isNullOrUndefined(ctx)) {
        return null;
    }

    return (0 != (ctx.getApplicationInfo().flags &= android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE));
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

function runOnUIThread(uiAction, state, onError) {
    var activity = getAppView();
    if (!TypeUtils.isNullOrUndefined(activity)) {
        var r = new actionRunnable();
        r.action = () => {
            try {
                uiAction(state);
            }
            catch (e) {
                if (TypeUtils.isNullOrUndefined(onError)) {
                    throw e;
                }

                console.log('[ERROR] (nativescript-toolbox).android.runOnUI(2): ' + e);
                onError(e, state);
            }
        };

        activity.runOnUiThread(r);
    }

    return false;
}
exports.runOnUIThread = runOnUIThread;
