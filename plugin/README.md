[![npm](https://img.shields.io/npm/v/nativescript-toolbox.svg)](https://www.npmjs.com/package/nativescript-toolbox)
[![npm](https://img.shields.io/npm/dt/nativescript-toolbox.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-toolbox)

# NativeScript Toolbox

A [NativeScript](https://nativescript.org/) module that is a composition of useful classes, tools and helpers.

The module contains the following sub modules:

| Name | Description |
| ---- | --------- |
| [crypto-js](https://github.com/brix/crypto-js) | Library of crypto standards. |
| [JS-YAML](https://github.com/nodeca/js-yaml) | YAML 1.2 parser / writer. |
| [Moment](https://github.com/moment/moment) | A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates. |
| [nativescript-apiclient](https://github.com/mkloubert/nativescript-apiclient) | Simply call HTTP based APIs. |
| [nativescript-batch](https://github.com/mkloubert/nativescript-batch) | Implement batch operations. |
| [nativescript-bitmap-factory](https://github.com/mkloubert/nativescript-bitmap-factory) | Create and manipulate bitmap images. |
| [nativescript-enumerable](https://github.com/mkloubert/nativescript-enumerable) | Provides LINQ style extensions for handling arrays and lists. |
| [nativescript-routed-values](https://github.com/mkloubert/nativescript-routed-values) | Implement routed value graphs. |
| [nativescript-sqlite (free)](https://github.com/nathanaela/nativescript-sqlite) | Provides sqlite actions. |
| [nativescript-stringformat](https://github.com/mkloubert/nativescript-stringformat) | Helpers for handling strings. |
| [nativescript-xmlobjects](https://github.com/mkloubert/nativescript-xmlobjects) | Handles XML data as objects similar to LINQ to XML. |

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X493PDBNGKAGG)

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-toolbox/master/LICENSE)

## Platforms

* Android
* iOS

## Installation

Run

```bash
tns plugin add nativescript-toolbox
```

inside your app project to install the module.

## Usage

```typescript
import Toolbox = require('nativescript-toolbox');
```

The module provides the following function that are short hands for the included sub modules:

| Name | Description |
| ---- | --------- |
| asBitmap | Returns a value as bitmap object. |
| asEnumerable | Returns a value as sequence. |
| createBitmap | Creates a new bitmap. |
| decrypt | Decrypts a value / an object with AES. |
| encrypt | Encrypts a value / an object with AES. |
| format | Formats a string. |
| formatArray | Formats a string. |
| fromXml | Alias for 'parseXml'. |
| fromYaml | Alias for 'parseYaml'. |
| getApplicationContext | Returns the current application context. |
| getClipboard | Returns an object that handles the clipboard of the device. |
| getNativeView | Returns the native view of the app. |
| getOrientation | Gets the current orientation of the device (based on [nativescript-orientation](https://github.com/nathanaela/nativescript-orientation)). |
| getPlatform | Returns information of the current platform. |
| getValue | Tries to return a value / object that is stored in the application settings. |
| guid | Alias for 'uuid'. |
| hash | Generic hash function. |
| hasValue | Checks if a value / object is stored in the application settings. |
| invokeForOrientation | Invokes a callback for specific orientation mode. |
| invokeForPlatform | Invokes an action for a specific platform. |
| isDebug | Checks if the app is in debug mode or not. |
| isEnumerable | Checks if a value is a sequence. |
| md5 | Hashes a value with MD5. |
| newBatch | Creates a new batch. |
| newClient | Creates a new API client. |
| now | Gets the current time. |
| openDatabase | Opens a (SQLite) database (connection). |
| openUrl | Open an URL on the device. |
| parseXml | Parses a XML string to an object. |
| parseYaml | Parses YAML data to an object. |
| removeValue | Removes a value / object that is stored in the application settings. |
| setStatusBarVisibility | Changes the visibility of the device's status bar (based on [nativescript-status-bar](https://github.com/PeterStaev/NativeScript-Status-Bar)).
| setValue | Stores a value / object in the application settings. |
| sha1 | Hashes a value with SHA-1. |
| sha256 | Hashes a value with SHA-256. |
| sha3 | Hashes a value with SHA-3. |
| sha384 | Hashes a value with SHA-384. |
| sha512 | Hashes a value with SHA-512. |
| toYaml | Converts an object / a value to YAML. |
| uuid | Creates a new unique ID / GUID (s. [Create GUID / UUID in JavaScript?](http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript)). |

### Sub modules

#### crypto-js

Here are some examples of common algorithms:

##### Encrypters

```typescript
var AES = require("nativescript-toolbox/crypto-js/aes");
```

##### Hashes

```typescript
var MD5 = require('nativescript-toolbox/crypto-js/md5');
var SHA1 = require('nativescript-toolbox/crypto-js/sha1');
var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
var SHA3 = require('nativescript-toolbox/crypto-js/sha3');
var SHA384 = require('nativescript-toolbox/crypto-js/sha384');
var SHA512 = require('nativescript-toolbox/crypto-js/sha512');
```

#### JS-YAML

```typescript
var YAML = require('nativescript-toolbox/js-yaml');
```

#### Moment

```typescript
import Moment = require('nativescript-toolbox/moment');
```

#### nativescript-apiclient

```typescript
import ApiClient = require('nativescript-toolbox/apiclient');
```

#### nativescript-batch

```typescript
import Batch = require('nativescript-toolbox/batch');
```

#### nativescript-bitmap-factory

```typescript
import BitmapFactory = require('nativescript-toolbox/bitmap-factory');
```

#### nativescript-enumerable

```typescript
import Enumerable = require('nativescript-toolbox/enumerable');
```

#### nativescript-routed-values

```typescript
import RoutedValues = require('nativescript-toolbox/routed-values');
```

#### nativescript-sqlite

```typescript
var SQLite = require('nativescript-toolbox/sqlite');
```

#### nativescript-stringformat

```typescript
import StringFormat = require('nativescript-toolbox/stringformat');
```

#### nativescript-xmlobjects

```typescript
import XmlObjects = require('nativescript-toolbox/xmlobjects');
```
