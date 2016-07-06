"use strict";
var Application = require("application");
var Toolbox = require('nativescript-toolbox');
var a = Toolbox.encrypt({ a: 100, b: 100 }, 'b');
var b = Toolbox.decrypt(a, 'b');
console.log('a: ' + a);
console.log('b: ' + JSON.stringify(b));
Application.start({ moduleName: "main-page" });
//# sourceMappingURL=app.js.map