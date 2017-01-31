// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var Application = require('application');
var BitmapFactoryCommons = require('./BitmapFactory.commons');
var FS = require('file-system');
var ImageSource = require('image-source');
var TypeUtils = require("utils/types");


// default options
var defaultOptions;
function getDefaultOpts() {
    return defaultOptions;
}
exports.getDefaultOpts = getDefaultOpts;
function setDefaultOpts(opts) {
    defaultOptions = opts;
}
exports.setDefaultOpts = setDefaultOpts;

function AndroidBitmap(bitmap, opts) {
    if (!(this instanceof AndroidBitmap)) {
        return new AndroidBitmap(bitmap, opts);
    }

    this._isDisposed = false;
    this._nativeObject = bitmap;
    this._options = opts;
    this._c = new android.graphics.Canvas(bitmap);
}
exports.BitmapClass = AndroidBitmap;

// [ANDROID INTERNAL] __canvas
Object.defineProperty(AndroidBitmap.prototype, '__canvas', {
    get: function() { return this._c; }
});

// [ANDROID INTERNAL] __context
Object.defineProperty(AndroidBitmap.prototype, '__context', {
    get: function() { return this.android.context; }
});

// [ANDROID INTERNAL] __createPaint()
AndroidBitmap.prototype.__createPaint = function(color) {
    var paint = new android.graphics.Paint();

    if (!TypeUtils.isNullOrUndefined(color)) {
        paint.setARGB(color.a, color.r, color.g, color.b);
    }

    return paint;
};

// [INTERNAL] _clone()
AndroidBitmap.prototype._clone = function() {
    return new AndroidBitmap(this._nativeObject
                                 .copy(this._nativeObject.getConfig(), true));
};

// [INTERNAL] _crop()
AndroidBitmap.prototype._crop = function(leftTop, size) {
    return android.graphics.Bitmap.createBitmap(this._nativeObject,
                                                leftTop.x, leftTop.y,
                                                size.width, size.height);
};

// [INTERNAL] _dispose()
AndroidBitmap.prototype._dispose = function(action, tag) {
    this._nativeObject.recycle();
};

// [INTERNAL] _drawLine()
AndroidBitmap.prototype._drawLine = function(start, end, color) {
    this.__canvas.drawLine(start.x, start.y,
                           end.x, end.y,
                           this.__createPaint(color));
};

// [INTERNAL] _drawOval()
AndroidBitmap.prototype._drawOval = function(size, leftTop, color, fillColor) {
    var me = this;

    var paintLine = this.__createPaint(color);
    paintLine.setStyle(android.graphics.Paint.Style.STROKE);
    
    var paints = [];
    paints.push(paintLine);

    if (null !== fillColor) {
        var paintFill = this.__createPaint(fillColor);
        paintFill.setStyle(android.graphics.Paint.Style.FILL);

        paints.push(paintFill);
    }

    var drawer = function(r, p) {
        me.__canvas.drawOval(r, p);
    };
    if (size.width == size.height) {
        var drawer = function(r, p) {
            var radius = (r.right - r.left) / 2.0;

            me.__canvas.drawCircle(r.left + radius, r.top + radius,
                                   radius,
                                   p);
        };
    }

    for (var i = paints.length; i > 0; i--) {
        var left = leftTop.x;
        var top = leftTop.y;
        var right = left + size.width - 1;
        var bottom = top + size.height - 1;

        var rect = new android.graphics.RectF(left, top,
                                              right, bottom);

        drawer(rect, paints[i - 1]);
    }
};

// [INTERNAL] _drawArc()
AndroidBitmap.prototype._drawArc = function(size, leftTop, startAngle, sweepAngle, color, fillColor) {
    var me = this;

    var paintLine = this.__createPaint(color);
    paintLine.setStyle(android.graphics.Paint.Style.STROKE);

    var paints = [];
    paints.push(paintLine);

    if (null !== fillColor) {
        var paintFill = this.__createPaint(fillColor);
        paintFill.setStyle(android.graphics.Paint.Style.FILL);

        paints.push(paintFill);
    }

    var drawer = function(r, s, e, u, p) {
        me.__canvas.drawArc(r, s, e, u, p);
    };

    for (var i = paints.length; i > 0; i--) {
        var left = leftTop.x;
        var top = leftTop.y;
        var right = left + size.width - 1;
        var bottom = top + size.height - 1;

        var rect = new android.graphics.RectF(left, top,
                                              right, bottom);

        drawer(rect, startAngle, sweepAngle, true, paints[i - 1]);
    }
};

// [INTERNAL] _drawRect()
AndroidBitmap.prototype._drawRect = function(size, leftTop, color, fillColor) {
    var paintLine = this.__createPaint(color);
    paintLine.setStyle(android.graphics.Paint.Style.STROKE);
    
    var paints = [];
    paints.push(paintLine);

    if (null !== fillColor) {
        var paintFill = this.__createPaint(fillColor);
        paintFill.setStyle(android.graphics.Paint.Style.FILL);

        paints.push(paintFill);
    }

    for (var i = paints.length; i > 0; i--) {
        var left = leftTop.x;
        var top = leftTop.y;
        var right = left + size.width - 1;
        var bottom = top + size.height - 1;

        var rect = new android.graphics.RectF(left, top,
                                              right, bottom);

        this.__canvas
            .drawRect(rect, paints[i - 1]);
    }
};

// [INTERNAL] _getPoint()
AndroidBitmap.prototype._getPoint = function(coordinates) {
    return this._nativeObject
               .getPixel(coordinates.x, coordinates.y);
};

// [INTERNAL] _insert()
AndroidBitmap.prototype._insert = function(other, leftTop) {
    var bmp = asBitmapObject(other);
    if (false === bmp) {
        throw "NO valid bitmap!";
    }

    this.__canvas.drawBitmap(bmp._nativeObject,
                             leftTop.x, leftTop.y,
                             null);
};

// [INTERNAL] _rotate()
AndroidBitmap.prototype._rotate = function(degrees) {
    var matrix = new android.graphics.Matrix();
    matrix.postRotate(degrees);

    return android.graphics.Bitmap.createBitmap(
        this._nativeObject,
        0, 0,
        this.width, this.height,
        matrix,
        true
    );
};

// [INTERNAL] _resize()
AndroidBitmap.prototype._resize = function(newSize) {
    var resizedImage = android.graphics.Bitmap.createScaledBitmap(this._nativeObject,
                                                                  newSize.width, newSize.height,
                                                                  false);
    return new AndroidBitmap(resizedImage);
};

// [INTERNAL] _setPoint()
AndroidBitmap.prototype._setPoint = function(coordinates, color) {
    this._nativeObject
        .setPixel(coordinates.x, coordinates.y,
                  android.graphics.Color.argb(color.a, color.r, color.g, color.b));
};

// _toObject()
AndroidBitmap.prototype._toObject = function(format, quality) {
    var bmpFormat;
    var mime;
    switch (format) {
        case 1:
            bmpFormat = android.graphics.Bitmap.CompressFormat.PNG;
            mime = 'image/png';
            break;

        case 2:
            bmpFormat = android.graphics.Bitmap.CompressFormat.JPEG;
            mime = 'image/jpeg';
            break;
    }

    if (TypeUtils.isNullOrUndefined(bmpFormat)) {
        throw "Format '" + format + "' is NOT supported!";
    }

    var stream = new java.io.ByteArrayOutputStream();
    try {
        this._nativeObject
            .compress(bmpFormat, quality, stream);

        var bitmapData = {};

        var base64 = android.util.Base64.encodeToString(stream.toByteArray(), 
                                                        android.util.Base64.NO_WRAP);
        
        // base64
        Object.defineProperty(bitmapData, 'base64', {
            get: function() { return base64; }
        });

        // mime
        Object.defineProperty(bitmapData, 'mime', {
            get: function() { return mime; }
        });

        return bitmapData;
    }
    finally {
        stream.close();
    }
}

// _writeText()
AndroidBitmap.prototype._writeText = function(txt, leftTop, font) {
    var resources = this.__context.getResources();
    var scale = resources.getDisplayMetrics().density;

    var antiAlias;
    var fontColor;
    var fontSize = 10;
    var fontName;
    if (null !== font) {
        fontColor = font.color;
        fontSize = font.size;
        fontName = font.name;
    }

    if (TypeUtils.isNullOrUndefined(antiAlias)) {
        antiAlias = true;
    }

    var paint;
    if (antiAlias) {
        paint = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
    }
    else {
        paint = new android.graphics.Paint();
    }

    fontColor = this.normalizeColor(fontColor);
    if (!TypeUtils.isNullOrUndefined(fontColor)) {
        paint.setARGB(fontColor.a, fontColor.r, fontColor.g, fontColor.b);
    }

    if (!TypeUtils.isNullOrUndefined(fontSize)) {
        paint.setTextSize(fontSize * scale);
    }

    if (!TypeUtils.isNullOrUndefined(fontName)) {
        fontName = ('' + fontName).trim();

        var typeFace;

        if ('' !== fontName) {
            // based on code by Nick Iliev (https://github.com/NickIliev)
            // s. https://github.com/mkloubert/nativescript-bitmap-factory/issues/7#issuecomment-275691248

            try {
                var fontAssetPath;
                var basePath = FS.path.join(FS.knownFolders.currentApp().path, "fonts", fontName);
                if (FS.File.exists(basePath + ".ttf")) {
                    fontAssetPath = "/fonts/" + fontName + ".ttf";
                }

                if (fontAssetPath) {
                    fontAssetPath = FS.path.join(FS.knownFolders.currentApp().path, fontAssetPath);

                    typeFace = android.graphics.Typeface.createFromFile(fontAssetPath);
                }
            }
            catch (e) {
                console.log('[nativescript-bitmap-factory] AndroidBitmap._writeText(): ' + e);
            }
            
            if (!typeFace) {
                // fallback
                typeFace = android.graphics.Typeface.create(fontName, android.graphics.Typeface.NORMAL);
            }
        }

        if (typeFace) {
            paint.setTypeface(typeFace);
        }
    }
    
    paint.setXfermode(new android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_OVER));

    this.__canvas.drawText(txt,
                           leftTop.x, leftTop.y,
                           paint);
};

// height
Object.defineProperty(AndroidBitmap.prototype, 'height', {
    get: function() { return this._nativeObject.getHeight(); }
});

// isDisposed
Object.defineProperty(AndroidBitmap.prototype, 'isDisposed', {
    get: function() { return this._isDisposed; }
});

// nativeObject
Object.defineProperty(AndroidBitmap.prototype, 'nativeObject', {
    get: function() { return this._nativeObject; }
});

// width
Object.defineProperty(AndroidBitmap.prototype, 'width', {
    get: function() { return this._nativeObject.getWidth(); }
});

// setup common methods and properties
BitmapFactoryCommons.setupBitmapClass(AndroidBitmap);


function asBitmapObject(v) {
    var bmp = BitmapFactoryCommons.tryGetBitmapObject(AndroidBitmap, v);
    if (false !== bmp) {
        return bmp;
    }

    var opts = defaultOptions;
    if (!opts) {
        opts = {};
    }

    if (typeof v === "string") {
        var decodedBytes = android.util.Base64.decode(v, 0);
        try {
            var options = new android.graphics.BitmapFactory.Options();
            options.inMutable = true;

            var bmp = android.graphics.BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length,
                                                                     options);
            try {
                return new AndroidBitmap(bmp, opts);
            }
            catch (e) {
                bmp.recycle();
                bmp = null;

                throw e;
            }
        }
        finally {
            decodedBytes = null;
        }
    }
    else if (v instanceof android.graphics.Bitmap) {
        return new AndroidBitmap(v, opts);
    }
    else if (v instanceof ImageSource.ImageSource) {
        return new AndroidBitmap(v.android, opts);
    }

    return false;
}
exports.asBitmapObject = asBitmapObject;
AndroidBitmap.asBitmap = asBitmapObject;

function createBitmap(width, height, opts) {
    var newBitmap = android.graphics.Bitmap.createBitmap(width, height,
                                                         android.graphics.Bitmap.Config.ARGB_8888);

    return new AndroidBitmap(newBitmap, opts);
}
exports.createBitmap = createBitmap;

function makeBitmapMutable(bitmap, opts) {
    if (bitmap instanceof ImageSource.ImageSource) {
        return new makeBitmapMutable(bitmap.android, opts);
    }

    if (bitmap instanceof AndroidBitmap) {
        return new makeBitmapMutable(bitmap.nativeObject, opts);
    }

    if (!(bitmap instanceof android.graphics.Bitmap)) {
        throw "No valid bitmap object!";
    }

    var ctx = Application.android.context;

    var disposeCurrent = false;
    if (!TypeUtils.isNullOrUndefined(opts.disposeCurrent)) {
        disposeCurrent = opts.disposeCurrent;
    }

    var customCacheDir;
    var stradegy = 1;
    if (!TypeUtils.isNullOrUndefined(opts.temp)) {
        if (!TypeUtils.isNullOrUndefined(opts.temp.directory)) {
            customCacheDir = opts.temp.directory;
        }

        if (!TypeUtils.isNullOrUndefined(opts.temp.stradegy)) {
            stradegy = parseInt(('' + opts.temp.stradegy).trim());
        }
    }

    var mutable;

    var disposeOldBitmap = function() {
        if (!disposeCurrent) {
            return;
        }

        try {
            bitmap.recycle();
            bitmap = null;

            java.lang.System.gc();
        }
        catch (e) { /* ignore */ }
    };

    var createFromTempFile = function(dir) {
        if (!dir.exists()) {
            throw "'" + dir.getAbsolutePath() + "' does NOT exist!";
        }

        if (!dir.isDirectory()) {
            throw "'" + dir.getAbsolutePath() + "' is no valid directory!";
        }

        var tempFile = java.io.File.createTempFile("nsbmpfac", "dat", dir);
        try {
            var randomAccessFile = new java.io.RandomAccessFile(tempFile, "rw");
            try {
                var width = bitmap.getWidth();
                var height = bitmap.getHeight();
                var cfg = bitmap.getConfig();

                var channel = randomAccessFile.getChannel();
                try {
                    var map = channel.map(java.nio.channels.FileChannel.MapMode.READ_WRITE, 0, bitmap.getRowBytes() * height);

                    bitmap.copyPixelsToBuffer(map);
                    disposeOldBitmap();

                    mutable = android.graphics.Bitmap.createBitmap(width, height, cfg);

                    map.position(0);
                    mutable.copyPixelsFromBuffer(map);
                }
                finally {
                    channel.close();
                }
            }
            finally {
                randomAccessFile.close();
            }
        }
        finally {
            try {
                tempFile.delete();
            }
            catch (e) {
                try {
                    tempFile.deleteOnExit();
                }
                catch (e) { /* ignore */ };
            }
        }
    };

    switch (stradegy) {
        case 2:
            // cache directory
            var cacheDir = ctx.getCacheDir();
            createFromTempFile(cacheDir);
            break;

        case 3:
            // external cache directory
            var extCacheDir = ctx.getExternalCacheDir();
            createFromTempFile(extCacheDir);
            break;

        case 4:
            // custom cache directory
            var customDir = customCacheDir;
            if (TypeUtils.isNullOrUndefined(customDir)) {
                customDir = ctx.getCacheDir();
            }

            if (!(customDir instanceof java.io.File)) {
                customDir = new java.io.File('' + customDir);
            }

            createFromTempFile(customDir);
            break;

        default:
            // memory
            mutable = bitmap.copy(bitmap.getConfig(), true);
            disposeOldBitmap();
            break;
    }

    return mutable;
}
exports.makeBitmapMutable = makeBitmapMutable;
