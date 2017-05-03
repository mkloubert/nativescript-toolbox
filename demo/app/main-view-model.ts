import { Observable } from "data/observable";
import * as Toolbox from 'nativescript-toolbox';
import * as Moment from 'nativescript-toolbox/moment';


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

    viewModel.onTap = function () {
        this.counter--;
        this.set("message", getMessage(this.counter));

        // isDebug seems to be broken, commenting it out 
        // console.log('isDebug(): ' + Toolbox.isDebug());
    }

    viewModel.onOpenWifiTap = function () {
        console.log('openWifiSettings: ' + Toolbox.openWifiSettings());
    }

    return viewModel;
}

exports.createViewModel = createViewModel;