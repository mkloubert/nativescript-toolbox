var application = require("application");
var fs = require("file-system");

(function() {
  _cleanAttachmentFolder();
})();

exports.available = function () {
  return new Promise(function (resolve, reject) {
    try {
      var uri = android.net.Uri.fromParts("mailto", "eddyverbruggen@gmail.com", null);
      var intent = new android.content.Intent(android.content.Intent.ACTION_SENDTO, uri);
      var packageManager = application.android.context.getPackageManager();
      var nrOfMailApps = packageManager.queryIntentActivities(intent, 0).size();
      resolve(nrOfMailApps > 0);
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

      var mail = new android.content.Intent(android.content.Intent.ACTION_SENDTO);
      if (arg.body) {
        var htmlPattern = java.util.regex.Pattern.compile(".*\\<[^>]+>.*", java.util.regex.Pattern.DOTALL);
        if (htmlPattern.matcher(arg.body).matches()) {
          mail.putExtra(android.content.Intent.EXTRA_TEXT, android.text.Html.fromHtml(arg.body));
          mail.setType("text/html");
        } else {
          mail.putExtra(android.content.Intent.EXTRA_TEXT, arg.body);
          mail.setType("text/plain");
        }
      }

      if (arg.subject) {
        mail.putExtra(android.content.Intent.EXTRA_SUBJECT, arg.subject);
      }
      if (arg.to) {
        mail.putExtra(android.content.Intent.EXTRA_EMAIL, toStringArray(arg.to));
      }
      if (arg.cc) {
        mail.putExtra(android.content.Intent.EXTRA_CC, toStringArray(arg.cc));
      }
      if (arg.bcc) {
        mail.putExtra(android.content.Intent.EXTRA_BCC, toStringArray(arg.bcc));
      }

      mail.setType("application/octet-stream");

      if (arg.attachments) {
        var uris = new java.util.ArrayList();
        for (var a in arg.attachments) {
          var attachment = arg.attachments[a];
          var path = attachment.path;
          var fileName = attachment.fileName;
          var uri = _getUriForPath(path, fileName, application.android.context);

          if (!uri) {
            console.log("File not found for path: " + path);
            continue;
          }
          uris.add(uri);
        }

        if (!uris.isEmpty()) {
          mail.setAction(android.content.Intent.ACTION_SEND_MULTIPLE);
          mail.setType("message/rfc822");
          mail.putParcelableArrayListExtra(android.content.Intent.EXTRA_STREAM, uris);
        }
      } else {
      }

      var mailIntent = android.content.Intent.createChooser(mail, arg.appPickerTitle || "Open with..");
      mailIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
      application.android.context.startActivity(mailIntent);

      // we can wire up an intent receiver but it's always the same resultCode anyway so that's useless.. thanks Android!
      resolve(true);
    } catch (ex) {
      console.log("Error in email.compose: " + ex);
      reject(ex);
    }
  });
};

function _getUriForPath(path, fileName, ctx) {
  if (path.indexOf("file:///") === 0) {
    return _getUriForAbsolutePath(path);
  } else if (path.indexOf("file://") === 0) {
    return _getUriForAssetPath(path, fileName, ctx);
  } else if (path.indexOf("base64:") === 0) {
    return _getUriForBase64Content(path, fileName, ctx);
  } else {
    if (path.indexOf(ctx.getPackageName()) > -1) {
      return _getUriForAssetPath(path, fileName, ctx);
    } else {
      return _getUriForAbsolutePath(path);
    }
  }
}

function _getUriForAbsolutePath(path) {
  var absPath = path.replace("file://", "");
  var file = new java.io.File(absPath);
  if (!file.exists()) {
    console.log("File not found: " + file.getAbsolutePath());
    return null;
  } else {
    return android.net.Uri.fromFile(file);
  }
}

function _getUriForAssetPath(path, fileName, ctx) {
  path = path.replace("file://", "/");
  if (!fs.File.exists(path)) {
    console.log("File does not exist: " + path);
    return null;
  }

  var localFile = fs.File.fromPath(path);
  var localFileContents = localFile.readSync(function(e) { error = e; });

  var cacheFileName = _writeBytesToFile(ctx, fileName, localFileContents);
  if (cacheFileName.indexOf("file://") == -1) {
    cacheFileName = "file://" + cacheFileName;
  }
  return android.net.Uri.parse(cacheFileName);
}

function _getUriForBase64Content(path, fileName, ctx) {
  var resData = path.substring(path.indexOf("://") + 3);
  var bytes;
  try {
    bytes = android.util.Base64.decode(resData, 0);
  } catch (ex) {
    console.log("Invalid Base64 string: " + resData);
    return android.net.Uri.EMPTY;
  }
  var cacheFileName = _writeBytesToFile(ctx, fileName, bytes);

  return android.net.Uri.parse(cacheFileName);
}

function _writeBytesToFile(ctx, fileName, contents) {
  var dir = ctx.getExternalCacheDir();

  if (dir === null) {
    console.log("Missing external cache dir");
    return null;
  }

  var storage = dir.toString() + "/emailcomposer";
  var cacheFileName = storage + "/" + fileName;

  var toFile = fs.File.fromPath(cacheFileName);
  toFile.writeSync(contents, function(e) { error = e; });

  if (cacheFileName.indexOf("file://") == -1) {
    cacheFileName = "file://" + cacheFileName;
  }
  return cacheFileName;
}

function _cleanAttachmentFolder() {
  if (application.android.context) {
    var dir = application.android.context.getExternalCacheDir();
    var storage = dir.toString() + "/emailcomposer";
    var cacheFolder = fs.Folder.fromPath(storage);
    cacheFolder.clear();
  }
}

var toStringArray = function (arg) {
  var arr = java.lang.reflect.Array.newInstance(java.lang.String.class, arg.length);
  for (var i = 0; i < arg.length; i++) {
    arr[i] = arg[i];
  }
  return arr;
};