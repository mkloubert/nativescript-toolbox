"use strict";
var Application = require("application");
var Toolbox = require('nativescript-toolbox');
var a = Toolbox.toYaml({ a: 100, b: 100 });
var b = Toolbox.fromYaml(a, 'b');
console.log('a: ' + typeof a);
console.log('b: ' + typeof b);
Application.start({ moduleName: "main-page" });
//# sourceMappingURL=app.js.map