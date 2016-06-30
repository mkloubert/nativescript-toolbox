"use strict";
var observable_1 = require("data/observable");
var Toolbox = require('nativescript-toolbox');
function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    }
    else {
        return counter + " taps left";
    }
}
function createViewModel() {
    var viewModel = new observable_1.Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);
    viewModel.onTap = function () {
        this.counter--;
        this.set("message", getMessage(this.counter));
        console.log('isDebug(): ' + Toolbox.isDebug());
    };
    return viewModel;
}
exports.createViewModel = createViewModel;
//# sourceMappingURL=main-view-model.js.map