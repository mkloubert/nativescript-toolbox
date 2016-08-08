import Application = require("application");
import Toolbox = require('nativescript-toolbox');
import Timer = require('timer');

interface IObject {
    a: any;
    b: any;
}

var a = Toolbox.toYaml({ a: 100, b: 100 });
var b = Toolbox.fromYaml<IObject>(a, 'b');

Application.android.onActivityCreated = () => {
    Toolbox.invokeForOrientation({
        portrait: () => {
            console.log('Device is in portrait mode.');
        },

        landscape: () => {
            console.log('Device is in landscape mode.');
        },

        unknown: () => {
            console.log('Device is in UNKNOWN mode.');
        },
    });

    var clipboard = Toolbox.getClipboard();
    clipboard.setText('https://github.com/mkloubert/nativescript-toolbox', (result, tag) => {
        switch (result.code) {
            case 0:
                clipboard.getText((result2, tag2) => {
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

var hashAlgorithms = ['', null, undefined, 'md5', 'md-5', 'sha1', 'sha-1', 'sha3', 'sha-3', 'sha256', 'sha-256', 'sha384', 'sha-384', 'sha512', 'sha-512'];
for (var i = 0; i < hashAlgorithms.length; i++) {
    var ha = hashAlgorithms[i];

    console.log("hash('" + ha + "'): " + Toolbox.hash('MK+TM', ha));
}

Application.start({ moduleName: "main-page" });
