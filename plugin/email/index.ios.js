var frame = require("ui/frame");
var fs = require("file-system");

exports.available = function () {
  return new Promise(function (resolve, reject) {
    try {
      var device = UIDevice.currentDevice().name;
      resolve(device.toLowerCase().indexOf("simulator") === -1 && MFMailComposeViewController.canSendMail());
    } catch (ex) {
      console.log("Error in email.available: " + ex);
      reject(ex);
    }
  });
};

exports.compose = function (arg) {
  var that = this;
  return new Promise(function (resolve, reject) {
    try {

      if (!that.available()) {
        reject("No mail available");
      }

      var mail = MFMailComposeViewController.alloc().init();

      var message = arg.body;
      if (message) {
        var messageAsNSString = NSString.stringWithString(message);
        var isHTML = messageAsNSString.rangeOfStringOptions("<[^>]+>", NSRegularExpressionSearch).location != NSNotFound;
        mail.setMessageBodyIsHTML(arg.body, isHTML);
      }
      mail.setSubject(arg.subject);
      mail.setToRecipients(arg.to);
      mail.setCcRecipients(arg.cc);
      mail.setBccRecipients(arg.bcc);

      if (arg.attachments) {
        for (var a in arg.attachments) {
          var attachment = arg.attachments[a];
          var path = attachment.path;
          var data = _getDataForAttachmentPath(path);
          if (data === null) {
            console.log("File not found for path: " + path);
          } else if (!attachment.fileName) {
            console.log("attachment.fileName is mandatory");
          } else if (!attachment.mimeType) {
            console.log("attachment.mimeType is mandatory");
          } else {
            mail.addAttachmentDataMimeTypeFileName(
                data, attachment.mimeType, attachment.fileName);
          }
        }
      }

      // Assign first to local variable, otherwise it will be garbage collected since delegate is weak reference.
      var delegate = MFMailComposeViewControllerDelegateImpl.new().initWithCallback(function (result, error) {
        // invoke the callback / promise
        resolve(result == MFMailComposeResultSent);
        // close the mail
        UIApplication.sharedApplication().keyWindow.rootViewController.dismissViewControllerAnimatedCompletion(true, null);
        // Remove the local variable for the delegate.
        delegate = undefined;
      });

      mail.mailComposeDelegate = delegate;

      UIApplication.sharedApplication().keyWindow.rootViewController.presentViewControllerAnimatedCompletion(mail, true, null);

    } catch (ex) {
      console.log("Error in email.compose: " + ex);
      reject(ex);
    }
  });
};

function _getDataForAttachmentPath(path) {
  var data = null;
  if (path.indexOf("file:///") === 0) {
    data = _dataForAbsolutePath(path);
  } else if (path.indexOf("file://") === 0) {
    data = _dataForAsset(path);
  } else if (path.indexOf("base64:") === 0) {
    data = _dataFromBase64(path);
  } else {
    var fileManager = NSFileManager.defaultManager();
    if (fileManager.fileExistsAtPath(path)) {
      data = fileManager.contentsAtPath(path);
    }
  }
  return data;
}

function _dataFromBase64(base64String) {
  base64String = base64String.substring(base64String.indexOf("://")+3);
  return NSData.alloc().initWithBase64EncodedStringOptions(base64String, 0);
}

function _dataForAsset(path) {
  path = path.replace("file://", "/");

  if (!fs.File.exists(path)) {
    console.log("File does not exist: " + path);
    return null;
  }

  var localFile = fs.File.fromPath(path);
  return localFile.readSync(function(e) { error = e; });
}

function _dataForAbsolutePath(path) {
  var fileManager = NSFileManager.defaultManager();
  var absPath = path.replace("file://", "");

  if (!fileManager.fileExistsAtPath(absPath)) {
    console.log("File not found: " + absPath);
    return null;
  }

  return fileManager.contentsAtPath(absPath);
}

var MFMailComposeViewControllerDelegateImpl = (function (_super) {
  __extends(MFMailComposeViewControllerDelegateImpl, _super);
  function MFMailComposeViewControllerDelegateImpl() {
    _super.apply(this, arguments);
  }

  MFMailComposeViewControllerDelegateImpl.new = function () {
    return _super.new.call(this);
  };
  MFMailComposeViewControllerDelegateImpl.prototype.initWithCallback = function (callback) {
    this._callback = callback;
    return this;
  };
  MFMailComposeViewControllerDelegateImpl.prototype.mailComposeControllerDidFinishWithResultError = function (controller, result, error) {
    this._callback(result, error);
  };
  MFMailComposeViewControllerDelegateImpl.ObjCProtocols = [MFMailComposeViewControllerDelegate];
  return MFMailComposeViewControllerDelegateImpl;
})(NSObject);