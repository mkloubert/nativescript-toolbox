"use strict";
var Application = require("application");
var Toolbox = require('nativescript-toolbox');
var Timer = require('timer');
var a = Toolbox.toYaml({ a: 100, b: 100 });
var b = Toolbox.fromYaml(a, 'b');
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
Application.start({ moduleName: "main-page" });
//# sourceMappingURL=app.js.map