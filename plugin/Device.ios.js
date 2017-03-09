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

// Based on code by Eddy Verbruggen
// 
// s. https://github.com/EddyVerbruggen/nativescript-insomnia
function allowDeviceToSleep() {
    var cbResult = {
        code: 1
    };

    var app = UIApplication.sharedApplication();
    if (!TypeUtils.isNullOrUndefined(app)) {
        if (app.idleTimerDisabled) {
            app.idleTimerDisabled = false;
        }

        cbResult.code = 0;
    }
    else {
        cbResult.code = 2;
    }

    return cbResult;
}
exports.allowDeviceToSleep = allowDeviceToSleep;

// Based on the code by Peter Staev
// 
// https://github.com/PeterStaev/NativeScript-Status-Bar
function changeStatusBarVisibility(showBar, callback, tag) {
    var activity = getAppView();

    var isVisible;
    var code = 1;

    var app = UIApplication.sharedApplication();
    if (!TypeUtils.isNullOrUndefined(app)) {
        app.setStatusBarHiddenWithAnimation(!showBar, UIStatusBarAnimation.UIStatusBarAnimationSlide);

        isVisible = showBar;
        code = 0;
    }
    else {
        code = 2;
    }

    if (!TypeUtils.isNullOrUndefined(callback)) {
        callback({
            code: code,
            isVisible: isVisible,
            tag: tag
        });
    }
}
exports.changeStatusBarVisibility = changeStatusBarVisibility;

function getAppContext() {
    return Application.ios.delegate;
}
exports.getAppContext = getAppContext;

function getAppView() {
    return Application.ios.rootController;
}
exports.getAppView = getAppView;

// Based on the code by Eddy Verbruggen
// 
// https://github.com/EddyVerbruggen/nativescript-clipboard
function getDeviceClipboard(appName) {
    var clipboard = {};

    clipboard.getText = function(callback, tag) {
        var cbResult = {
            code: 1
        };

        try {
            var pasteBoard = UIPasteboard.generalPasteboard();
            if (!TypeUtils.isNullOrUndefined(pasteBoard)) {
                cbResult.value = pasteBoard.valueForPasteboardType(kUTTypePlainText);
                cbResult.code = 0;
            }
            else {
                cbResult.code = 2;
            }
        }
        catch (e) {
            console.log('[ERROR] (nativescript-toolbox).ios.getDeviceClipboard().getText(): ' + e);

            cbResult.code = -1;
            cbResult.error = e;
        }
        
        if (!TypeUtils.isNullOrUndefined(callback)) {
            callback(cbResult, tag);
        }
    };

    clipboard.setText = function(txt,
                                 callback, tag) {

        var cbResult = {
            code: 1,
            value: txt
        };

        try {
            var pasteBoard = UIPasteboard.generalPasteboard();
            if (!TypeUtils.isNullOrUndefined(pasteBoard)) {
                pasteBoard.setValueForPasteboardType(txt, kUTTypePlainText);

                cbResult.code = 0;
            }
            else {
                cbResult.code = 2;
            }
        }
        catch (e) {
            console.log('[ERROR] (nativescript-toolbox).ios.getDeviceClipboard().setText(): ' + e);

            cbResult.code = -1;
            cbResult.error = e;
        }

        if (!TypeUtils.isNullOrUndefined(callback)) {
            callback(cbResult, tag);
        }
    };

    return clipboard;
}
exports.getDeviceClipboard = getDeviceClipboard;

// based on code by Nathanael Anderson
// 
// https://github.com/NathanaelA/nativescript-orientation
function getDeviceOrientation() {
    switch (UIDevice.currentDevice().orientation) {
        case UIDeviceOrientation.UIDeviceOrientationLandscapeRight:
        case UIDeviceOrientation.UIDeviceOrientationLandscapeLeft:
            return 2;

        case UIDeviceOrientation.UIDeviceOrientationPortraitUpsideDown:
        case UIDeviceOrientation.UIDeviceOrientationPortrait:
            return 1;
    }
}
exports.getDeviceOrientation = getDeviceOrientation;

function getPlatformData() {
    var pd = {};

    // app
    Object.defineProperty(pd, 'app', {
        get: function() { return Application.ios; }
    });

    // type
    Object.defineProperty(pd, 'type', {
        get: function() { return 2; }
    });

    return pd;
}
exports.getPlatformData = getPlatformData;

function isInDebugMode() {
    if (!TypeUtils.isNullOrUndefined(DEBUG_BUILD)) {
        return 1 == DEBUG_BUILD;
    }

    return false;
}
exports.isInDebugMode = isInDebugMode;

// Based on code by Eddy Verbruggen
// 
// s. https://github.com/EddyVerbruggen/nativescript-insomnia
function keepDeviceAwake() {
    var cbResult = {
        code: 1
    };

    var app = UIApplication.sharedApplication();
    if (!TypeUtils.isNullOrUndefined(app)) {
        if (!app.idleTimerDisabled) {
            app.idleTimerDisabled = true;
        }

        cbResult.code = 0;
    }
    else {
        cbResult.code = 2;
    }

    return cbResult;
}
exports.keepDeviceAwake = keepDeviceAwake;

// Thanks to Nathanael Anderson!
// 
// s. https://github.com/NathanaelA/nativescript-openurl
function openUri(uri) {
    var u = NSURL.URLWithString(uri);

    if (UIApplication.sharedApplication.canOpenURL(u)) {
        return UIApplication.sharedApplication.openURL(u);
    }

    return false;
}
exports.openUri = openUri;

function openWifiSettingsOnDevice() {
    var uris = [ 'prefs:root=WIFI', 'App-Prefs:root=WIFI' ];
    for (var i = 0; i < uris.length; i++) {
        if (openUri(uris[i])) {
            return true;
        }
    }

    return false;
}
exports.openWifiSettingsOnDevice = openWifiSettingsOnDevice;

function runOnUIThread(uiAction, state, onError) {
    dispatch_async(dispatch_get_main_queue(), function() {
        try {
            uiAction(state);
        }
        catch (e) {
            if (TypeUtils.isNullOrUndefined(onError)) {
                throw e;
            }

            console.log('[ERROR] (nativescript-toolbox).ios.runOnUI(2): ' + e);
            onError(e, state);
        }
    });

    return true;
}
exports.runOnUIThread = runOnUIThread;

// Based on code by anarchicknight
// 
// s. https://github.com/anarchicknight/nativescript-vibrate
function vibrateDevice(msec) {
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}
exports.vibrateDevice = vibrateDevice;
