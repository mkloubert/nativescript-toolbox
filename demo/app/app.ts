import Application = require("application");
import Toolbox = require('nativescript-toolbox');

var text = "Vessel     | Captain\n-----------|-------------\nNCC-1701   | James T Kirk\nNCC-1701 A | James T Kirk\nNCC-1701 D | Picard";

// var tree = Toolbox.markdownToJson(text, Toolbox.MarkdownDialect.Maruku);
// console.log(JSON.stringify(tree, null, 2));

var html1 = Toolbox.markdownToHtml(text, 'Maruku');
var json1 = Toolbox.markdownToJson(text, Toolbox.MarkdownDialect.Maruku);
var html2 = Toolbox.markdownToHtml(text, 'Gruber');
var json2 = Toolbox.markdownToJson(text, Toolbox.MarkdownDialect.Gruber);

console.log(html1);
console.log(html2);
console.log(json1);
console.log(json2);

// console.log("vibrate: " + Toolbox.vibrate(1000));

Application.start({ moduleName: "main-page" });
