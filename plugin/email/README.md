# NativeScript Email

An Email plugin for use in your NativeScript app.
You can use it to compose emails, edit the draft manually, and send it.

## Installation
Run the following command from the root of your project:

```
tns plugin add nativescript-email
```

## Usage

To use this plugin you must first require() it:

```js
var email = require("nativescript-email");
```

### available

```js
  email.available().then(function(avail) {
      console.log("Email available? " + avail);
  })
```

### compose
```js

  // let's first create a File object using the tns file module
  var fs = require("file-system");
  var appPath = fs.knownFolders.currentApp().path;
  var logoPath = appPath + "/res/telerik-logo.png";

  email.compose({
      subject: "Yo",
      body: "Hello <strong>dude</strong> :)",
      to: ['eddyverbruggen@gmail.com', 'to@person2.com'],
      cc: ['ccperson@somewhere.com'],
      bcc: ['eddy@combidesk.com', 'eddy@x-services.nl'],
      attachments: [
        {
            fileName: 'arrow1.png',
            path: 'base64://iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAHGlET1QAAAACAAAAAAAAABQAAAAoAAAAFAAAABQAAAB5EsHiAAAAAEVJREFUSA1iYKAimDhxYjwIU9FIBgaQgZMmTfoPwlOmTJGniuHIhlLNxaOGwiNqNEypkwlGk9RokoIUfaM5ijo5Clh9AAAAAP//ksWFvgAAAEFJREFUY5g4cWL8pEmT/oMwiM1ATTBqONbQHA2W0WDBGgJYBUdTy2iwYA0BrILDI7VMmTJFHqv3yBUEBQsIg/QDAJNpcv6v+k1ZAAAAAElFTkSuQmCC',
            mimeType: 'image/png'
        },
        {
            fileName: 'telerik-logo.png',
            path: logoPath,
            mimeType: 'image/png'
      }],
      appPickerTitle: 'Compose with..' // for Android, default: 'Open with..'
  }).then(function() {
      console.log("Email composer closed");
  });
```

Full attachment support has been added to 1.3.0 per the example above.

## Known issues
On iOS you can't use the simulator to test the plugin because of an iOS limitation.
To prevent a crash this plugin returns `false` when `available` is invoked on the iOS sim.