import Application = require("application");
import ImageSource = require('image-source');
/**
 * Describes an object that stores ARGB color data.
 */
export interface IArgb {
    /**
     * Gets the alpha value.
     */
    a: number;
    /**
     * Gets the red value.
     */
    r: number;
    /**
     * Gets the green value.
     */
    g: number;
    /**
     * Gets the blue value.
     */
    b: number;
}
/**
 * Describes bitmap data.
 */
export interface IBitmapData {
    /**
     * Gets the data as Base64 string.
     */
    base64: string;
    /**
     * Gets the mime type.
     */
    mime: string;
}
/**
 * Describes an object that stores a font.
 */
export interface IFont {
    /**
     * Anti alias or not.
     */
    antiAlias?: boolean;
    /**
     * Gets the custom forground color.
     */
    color?: string | number | IArgb;
    /**
     * Gets the name.
     */
    name?: string;
    /**
     * Gets the size.
     */
    size?: number;
}
/**
 * Options for 'makeMutable()' functon.
 */
export interface IMakeMutableOptions {
    /**
     * Dispose current bitmap or not.
     *
     * Default: (false)
     */
    disposeCurrent?: boolean;
    /**
     * Options for handling temp data / files.
     */
    temp?: {
        /**
         * This is only used if stradegy is 'Custom' and
         * is used to define the custom temp directory.
         *
         * This can be a string or a native object that represents a file
         * like java.lang.File on Android.
         */
        directory?: any;
        /**
         * The stradegy.
         *
         * Default: Memory
         */
        stradegy?: TempFileStradegy;
    };
}
/**
 * A 2D point.
 */
export interface IPoint2D {
    /**
     * Gets the X coordinate.
     */
    x: number;
    /**
     * Gets the X coordinate.
     */
    y: number;
}
/**
 * Describes an object that stores a size.
 */
export interface ISize {
    /**
     * Gets the height.
     */
    height: number;
    /**
     * Gets the width.
     */
    width: number;
}
/**
 * List of outout formats.
 */
export declare enum OutputFormat {
    /**
     * PNG
     */
    PNG = 1,
    /**
     * JPEG
     */
    JPEG = 2,
}
/**
 * List of temp file stradegies.
 */
export declare enum TempFileStradegy {
    /**
     * Memory
     */
    Memory = 1,
    /**
     * Cache directory
     */
    CacheDir = 2,
    /**
     * External directory
     */
    ExternalCacheDir = 3,
    /**
     * Custom directory
     */
    Custom = 4,
}
/**
 * Describes a bitmap.
 */
export interface IBitmap {
    /**
     * Get the android specific object provided by 'application' module.
     */
    android: Application.AndroidApplication;
    /**
     * Clones that bitmap.
     *
     * @return {IBitmap} Cloned bitmap.
     */
    clone(): IBitmap;
    /**
     * Crops that bitmap and returns its copy.
     *
     * @param {IPoint2D} [leftTop] The coordinates of the left/top corner.
     * @param {ISize} [size] The size.
     *
     * @return {IBitmap} The cropped bitmap.
     *
     * @throws At least one input value is invalid.
     */
    crop(leftTop?: IPoint2D | string, size?: ISize | string): IBitmap;
    /**
     * Gets or sets the default color.
     */
    defaultColor: IPoint2D | string | number;
    /**
     * Disposes the bitmap. Similar to the IDisposable pattern of .NET Framework.
     *
     * @param {Function} [action] The action to invoke BEFORE bitmap is disposed.
     * @param {T} [tag] An optional value for the action.
     *
     * @return {TResult} The result of the action (if defined).
     */
    dispose<T, TResult>(action?: (bmp: IBitmap, tag?: T) => TResult, tag?: T): TResult;
    /**
     * Draws a circle.
     *
     * @chainable
     *
     * @param {number} [radius] The radius.
     * @param any [center] The center coordinates.
     * @param any [color] The line color.
     * @param any [fillColor] The fill color.
     *
     * @throws At least one input value is invalid.
     */
    drawCircle(radius?: number, center?: IPoint2D | string, color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;
    /**
     * Draws an arc.
     *
     * @chainable
     *
     * @param {ISize} [size] The size.
     * @param {IPoint2D} [leftTop] The coordinates of the left/top corner.
     * @param {number} [startAngle] The starting angle (in degrees) where the arc begins.
     * @param {number} [sweepAngle] The sweep angle (in degrees) measured clockwise.
     * @param any [color] The line color.
     * @param any [fillColor] The fill color.
     *
     * @throws At least one input value is invalid.
     */
    drawArc(size?: ISize | string, leftTop?: IPoint2D | string, startAngle?: number, sweepAngle?: number, color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;
    /**
     * Draws a line.
     *
     * @chainable
     *
     * @param {IPoint2D} start The coordinates of the start point.
     * @param {IPoint2D} end The coordinates of the end point.
     * @param {IArgb} [color] The color to use. Default is black.
     *
     * @throws At least one input value is invalid.
     */
    drawLine(start: IPoint2D | string, end: IPoint2D | string, color?: string | number | IArgb): IBitmap;
    /**
     * Draws an oval circle.
     *
     * @chainable
     *
     * @param {ISize} [size] The size.
     * @param {IPoint2D} [leftTop] The coordinates of the left/top corner.
     * @param {IArgb} [color] The line color.
     * @param {IArgb} [fillColor] The fill color.
     *
     * @throws At least one input value is invalid.
     */
    drawOval(size?: ISize | string, leftTop?: IPoint2D | string, color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;
    /**
     * Draws a rectangle.
     *
     * @chainable
     *
     * @param {ISize} [size] The size.
     * @param {IPoint2D} [leftTop] The coordinates of the left/top corner.
     * @param {IArgb} [color] The line color.
     * @param {IArgb} [fillColor] The fill color.
     *
     * @throws At least one input value is invalid.
     */
    drawRect(size?: ISize | string, leftTop?: IPoint2D | string, color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;
    /**
     * Gets the color of a point.
     *
     * @param {IPoint2D} [coordinates] The coordinates of the point.
     *
     * @return {IArgb} The color.
     *
     * @throws At least one input value is invalid.
     */
    getPoint(coordinates?: IPoint2D | string): IArgb;
    /**
     * Gets the height of the bitmap.
     */
    height: number;
    /**
     * Get the iOS specific object provided by 'application' module.
     */
    ios: Application.iOSApplication;
    /**
     * Inserts another image into that bitmap.
     *
     * @chainable
     *
     * @param {IBitmap} other The other image.
     * @param {IPoint2D} [leftTop] The coordinates of the left/top corner.
     *
     * @throws At least one input value is invalid.
     */
    insert(other: any, leftTop?: IPoint2D | string): IBitmap;
    /**
     * Gets if the object has been disposed or not.
     */
    isDisposed: boolean;
    /**
     * Gets the native platform specific object that represents that bitmap.
     */
    nativeObject: any;
    /**
     * Normalizes a color value.
     *
     * @param any value The input value.
     *
     * @return {IArgb} The output value.
     *
     * @throws At least one input value is invalid.
     */
    normalizeColor(value: string | number | IArgb): IArgb;
    /**
     * Creates a copy of that bitmap with a new size.
     *
     * @param {ISize} newSize The new size.
     *
     * @return {IBitmap] The new bitmap.
     */
    resize(newSize: ISize | string): IBitmap;
    /**
     * Resizes that image by defining a new height by keeping ratio.
     *
     * @param {Number} newHeight The new height.
     *
     * @return {IBitmap} The resized image.
     */
    resizeHeight(newHeight: number): IBitmap;
    /**
     * Resizes that image by defining a new (maximum) size by keeping ratio.
     *
     * @param {Number} maxSize The maximum width or height.
     *
     * @return {IBitmap} The resized image.
     */
    resizeMax(maxSize: number): IBitmap;
    /**
     * Resizes that image by defining a new width by keeping ratio.
     *
     * @param {Number} newWidth The new width.
     *
     * @return {IBitmap} The resized image.
     */
    resizeWidth(newWidth: number): IBitmap;
    /**
     * Rotates the image.
     *
     * @param {number} [degrees] The number of degrees to rotate. Default: 90.
     *
     * @return {IBitmap} The rotated image.
     */
    rotate(degrees?: number): IBitmap;
    /**
     * Sets a pixel / point.
     *
     * @chainable
     *
     * @param {IPoint2D} [coordinates] The coordinate where to draw the point.
     * @param {IArgb} [color] The color of the point.
     *
     * @throws At least one input value is invalid.
     */
    setPoint(coordinates?: IPoint2D | string, color?: string | number | IArgb): IBitmap;
    /**
     * Gets the size.
     */
    size: ISize;
    /**
     * Converts that image to a Base64 string.
     *
     * @param {OutputFormat} format The output format. Default is: PNG
     * @param {Number} quality A value between 0 (0%) and 100 (100%) for the output quality.
     *
     * @return {String} The bitmap a Base64 string.
     *
     * @throws At least one input value is invalid.
     */
    toBase64(format?: OutputFormat, quality?: number): string;
    /**
     * Converts that image to a data URL.
     *
     * @param {OutputFormat} format The output format. Default is: PNG
     * @param {Number} quality A value between 0 (0%) and 100 (100%) for the output quality.
     *
     * @return {String} The bitmap as data url.
     *
     * @throws At least one input value is invalid.
     */
    toDataUrl(format?: OutputFormat, quality?: number): string;
    /**
     * Returns that image as ImageSource.
     *
     * @return {ImageSource} The bitmap as ImageSource.
     */
    toImageSource(): ImageSource.ImageSource;
    /**
     * Converts that image to an object.
     *
     * @param {OutputFormat} format The output format. Default is: PNG
     * @param {Number} quality A value between 0 (0%) and 100 (100%) for the output quality.
     *
     * @return {IBitmapData} The bitmap as object.
     *
     * @throws At least one input value is invalid.
     */
    toObject(format?: OutputFormat, quality?: number): IBitmapData;
    /**
     * Writes a text.
     *
     * @chainable
     *
     * @param {any} txt The text /value to write.
     * @param {IPoint2D} [leftTop] The left/top corner.
     * @param {IFont} [font] The custom font to use.
     *
     * @throws At least one input value is invalid.
     */
    writeText(txt: any, leftTop?: IPoint2D | string, font?: IFont | string): IBitmap;
    /**
     * Gets the width of the bitmap.
     */
    width: number;
}
/**
 * Additional options for creating a bitmap.
 */
export interface ICreateBitmapOptions {
    /**
     * iOS specific options.
     */
    ios?: {
        /**
         * Let iOS auto release the underlying CGImage (true) or let
         * the object call CGImageRelease() manually (false).
         *
         * Default: (true)
         */
        autoRelease?: boolean;
    };
}
/**
 * Returns a value as bitmap object.
 *
 * @param any v The input value.
 * @param {Boolean} [throwException] Throw exception if 'v' is invalid or return (false).
 *
 * @throws Input value is invalid.
 *
 * @return {IBitmap} The output value or (false) if input value is invalid.
 */
export declare function asBitmap(v: any, throwException?: boolean): IBitmap;
/**
 * Creates a new bitmap.
 *
 * @param {Number} width The width of the new image.
 * @param {Number} [height] The optional height of the new image. If not defined, the width is taken as value.
 * @param {ICreateBitmapOptions} [opts] Additional options for creating the bitmap.
 *
 * @return {IBitmap} The new bitmap.
 */
export declare function create(width: number, height?: number, opts?: ICreateBitmapOptions): IBitmap;
/**
 * Returns the default options for creating a new bitmap.
 *
 * @return {ICreateBitmapOptions} The options.
 */
export declare function getDefaultOptions(): ICreateBitmapOptions;
/**
 * Makes a (native) image / bitmap mutable.
 *
 * @param {any} v The (native) object.
 * @param {IMakeMutableOptions} [opts] The custom options.
 *
 * @return {any} The mutable object.
 *
 * @throws Native object is invalid.
 */
export declare function makeMutable(v: any, opts?: IMakeMutableOptions): any;
/**
 * Sets the default options for creating a new bitmap.
 *
 * @param {ICreateBitmapOptions} The new options.
 */
export declare function setDefaultOptions(opts: ICreateBitmapOptions): void;
