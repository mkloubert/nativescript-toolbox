[![npm](https://img.shields.io/npm/v/nativescript-toolbox.svg)](https://www.npmjs.com/package/nativescript-toolbox)
[![npm](https://img.shields.io/npm/dt/nativescript-toolbox.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-toolbox)

# NativeScript Toolbox

A [NativeScript](https://nativescript.org/) module that is a composition of useful classes, tools and helpers.

The module contains the following sub modules:

| Name | Description |
| ---- | --------- |
| [nativescript-apiclient](https://github.com/mkloubert/nativescript-apiclient) | Simply call HTTP based APIs. |
| [nativescript-batch](https://github.com/mkloubert/nativescript-batch) | Implement batch operations. |
| [nativescript-bitmap-factory](https://github.com/mkloubert/nativescript-bitmap-factory) | Create and manipulate bitmap images. |
| [nativescript-enumerable](https://github.com/mkloubert/nativescript-enumerable) | Provides LINQ style extensions for handling arrays and lists. |
| [nativescript-routed-values](https://github.com/mkloubert/nativescript-routed-values) | Implement routed value graphs. |
| [nativescript-sqlite (free)](https://github.com/nathanaela/nativescript-sqlite) | Provides sqlite actions. |
| [nativescript-stringformat](https://github.com/mkloubert/nativescript-stringformat) | Helpers for handling strings. |

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
| format | Formats a string. |
| formatArray | Formats a string. |
| getApplicationContext | Returns the current application context. |
| getNativeView | Returns the native view of the app. |
| getPlatform | Returns information of the current platform. |
| invokeForPlatform | Invokes an action for a specific platform. |
| isDebug | Checks if the device is in debug mode or not. |
| isEnumerable | Checks if a value is a sequence. |
| newBatch | Creates a new batch. |
| newClient | Creates a new API client. |
| openDatabase | Opens a (SQLite) database (connection). |
| openUrl | Open an URL on the device. |

### Sub modules

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
