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