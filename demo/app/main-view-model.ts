import {Observable} from "data/observable";
import Toolbox = require('nativescript-toolbox');

function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

function createViewModel() {
    var viewModel: any = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    viewModel.onTap = function() {
        this.counter--;
        this.set("message", getMessage(this.counter));

        console.log('isDebug(): ' + Toolbox.isDebug());
    }

    return viewModel;
}

exports.createViewModel = createViewModel;