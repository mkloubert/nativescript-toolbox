import Application = require("application");
import Toolbox = require('nativescript-toolbox');
import Timer = require('timer');

interface IObject {
    a: any;
    b: any;
}

var a = Toolbox.toYaml({ a: 100, b: 100 });
var b = Toolbox.fromYaml<IObject>(a, 'b');

console.log('a: ' + typeof a);
console.log('b: ' + typeof b);

Timer.setTimeout(() => {
    Toolbox.setStatusBarVisibility(false,
        (result) => {
            Timer.setTimeout(() => {
                console.log('setStatusBarVisibility.tag: ' + result.tag);

                Toolbox.setStatusBarVisibility(true);
            }, 5000);
        }, 'TM');
}, 5000);

console.log('UUID 1: ' + Toolbox.uuid());
console.log('UUID 2: ' + Toolbox.uuid('_'));

Application.start({ moduleName: "main-page" });
