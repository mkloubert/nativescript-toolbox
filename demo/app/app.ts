import Application = require("application");
import Toolbox = require('nativescript-toolbox');

interface IObject {
    a: any;
    b: any;
}

var a = Toolbox.toYaml({ a: 100, b: 100 });
var b = Toolbox.fromYaml<IObject>(a, 'b');

console.log('a: ' + typeof a);
console.log('b: ' + typeof b);

Application.start({ moduleName: "main-page" });
