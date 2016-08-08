"use strict";
var Application = require("application");
var Toolbox = require('nativescript-toolbox');
var Timer = require('timer');
var a = Toolbox.toYaml({ a: 100, b: 100 });
var b = Toolbox.fromYaml(a, 'b');
Application.android.onActivityCreated = function () {
    Toolbox.invokeForOrientation({
        portrait: function () {
            console.log('Device is in portrait mode.');
        },
        landscape: function () {
            console.log('Device is in landscape mode.');
        },
        unknown: function () {
            console.log('Device is in UNKNOWN mode.');
        },
    });
    var clipboard = Toolbox.getClipboard();
    clipboard.setText('https://github.com/mkloubert/nativescript-toolbox', function (result, tag) {
        switch (result.code) {
            case 0:
                clipboard.getText(function (result2, tag2) {
                    switch (result2.code) {
                        case 0:
                            console.log('Text from clipboard: ' + result2.value);
                            console.log('Clipboard tag: ' + tag2);
                            break;
                        default:
                            console.log('Could not GET text (' + result2.code + '): ' + result2.error);
                            break;
                    }
                }, tag.toLowerCase().trim());
                break;
            default:
                console.log('Could not SET text (' + result.code + '): ' + result.error);
                break;
        }
    }, 'MK');
};
console.log('a: ' + typeof a);
console.log('b: ' + typeof b);
Timer.setTimeout(function () {
    Toolbox.setStatusBarVisibility(false, function (result) {
        Timer.setTimeout(function () {
            console.log('setStatusBarVisibility.tag: ' + result.tag);
            Toolbox.setStatusBarVisibility(true);
        }, 5000);
    }, 'TM');
}, 5000);
console.log('UUID 1: ' + Toolbox.uuid());
console.log('UUID 2: ' + Toolbox.uuid('_'));
var hashAlgorithms = ['', null, undefined, 'md5', 'md-5', 'sha1', 'sha-1', 'sha3', 'sha-3', 'sha256', 'sha-256', 'sha384', 'sha-384', 'sha512', 'sha-512'];
for (var i = 0; i < hashAlgorithms.length; i++) {
    var ha = hashAlgorithms[i];
    console.log("hash('" + ha + "'): " + Toolbox.hash('MK+TM', ha));
}
Application.start({ moduleName: "main-page" });
//# sourceMappingURL=app.js.map