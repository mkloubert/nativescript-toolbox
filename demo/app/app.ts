import Application = require("application");
import Toolbox = require('nativescript-toolbox');

interface IObject {
    a: any;
    b: any;
}

var a = Toolbox.encrypt({ a: 100, b: 100 }, 'b');
var b = Toolbox.decrypt<IObject>(a, 'b');

console.log('a: ' + a);
console.log('b: ' + JSON.stringify(b));

Application.start({ moduleName: "main-page" });
