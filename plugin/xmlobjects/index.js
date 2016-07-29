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
"use strict";
var observable_1 = require('data/observable');
var observable_array_1 = require('data/observable-array');
var TypeUtils = require('utils/types');
var Xml = require('xml');
/**
 * A XML name.
 */
var XName = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param {string} name The full name.
     *
     * @throws Name is invalid.
     */
    function XName(name) {
        if (TypeUtils.isNullOrUndefined(name)) {
            throw "Name cannot be (null) or (undefined)!";
        }
        name = ('' + name).trim();
        var ns = null;
        var ln = name;
        if (ln.indexOf(':') > -1) {
            var parts = ln.split(':');
            if (2 !== parts.length) {
                throw "Cannot have more than one separator!";
            }
            ns = parts[0].trim();
            ln = parts[1].trim();
        }
        if ('' === ln) {
            throw "Local name cannot be empty!";
        }
        if (null !== ns) {
            ns = ns.trim();
            if ('' === ns) {
                ns = null;
            }
        }
        this._namespace = ns;
        this._localName = ln;
    }
    /**
     * Checks if a value is equal to the full name of that instance.
     *
     * @param any v The value to check.
     *
     * @return {Boolean} Is equal or not.
     */
    XName.prototype.equals = function (v) {
        if (TypeUtils.isNullOrUndefined(v)) {
            return false;
        }
        if (v instanceof XName) {
            v = v.toString();
        }
        return this.toString() === ('' + v);
    };
    Object.defineProperty(XName.prototype, "localName", {
        /**
         * Gets the local name.
         */
        get: function () {
            return this._localName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XName.prototype, "namespace", {
        /**
         * Gets the namespace.
         */
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the full name.
     *
     * @return {string} The full name.
     */
    XName.prototype.toString = function () {
        var str = this._localName;
        if (null !== this._namespace) {
            str = this._namespace + ":" + str;
        }
        return str;
    };
    return XName;
}());
exports.XName = XName;
/**
 * A XML object.
 */
var XObject = (function (_super) {
    __extends(XObject, _super);
    function XObject() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(XObject.prototype, "document", {
        /**
         * Gets the underlying document.
         */
        get: function () {
            return !TypeUtils.isNullOrUndefined(this.parent) ? this.parent.document : null;
        },
        enumerable: true,
        configurable: true
    });
    return XObject;
}(observable_1.Observable));
exports.XObject = XObject;
/**
 * A XML attribute.
 */
var XAttribute = (function () {
    /**
     * Initializes a new instance of that class.
     *
     * @param any name The name of the element.
     *
     * @throws Name is invalid.
     */
    function XAttribute(name) {
        if (!(name instanceof XName)) {
            name = new XName(name);
        }
        this._name = name;
    }
    Object.defineProperty(XAttribute.prototype, "name", {
        /**
         * Gets the name of the element.
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the string representation of that object.
     *
     * @return {String} The object as string.
     */
    XAttribute.prototype.toString = function () {
        var str = this.name.toString();
        var v = this.value;
        if (!TypeUtils.isNullOrUndefined(v)) {
            str += '="' + parseXmlEntities(v) + '"';
        }
        return str;
    };
    return XAttribute;
}());
exports.XAttribute = XAttribute;
/**
 * A XML node.
 */
var XNode = (function (_super) {
    __extends(XNode, _super);
    function XNode() {
        _super.apply(this, arguments);
    }
    return XNode;
}(XObject));
exports.XNode = XNode;
/**
 * XML text.
 */
var XText = (function (_super) {
    __extends(XText, _super);
    function XText() {
        _super.apply(this, arguments);
    }
    /** @inheritdoc */
    XText.prototype.toString = function () {
        return parseXmlEntities(this.value);
    };
    return XText;
}(XNode));
exports.XText = XText;
/**
 * XML CDATA
 */
var XCData = (function (_super) {
    __extends(XCData, _super);
    function XCData() {
        _super.apply(this, arguments);
    }
    /** @inheritdoc */
    XCData.prototype.toString = function () {
        return '<![CDATA[' + parseXmlEntities(this.value) + ']]>';
    };
    return XCData;
}(XText));
exports.XCData = XCData;
/**
 * A XML comment.
 */
var XComment = (function (_super) {
    __extends(XComment, _super);
    function XComment() {
        _super.apply(this, arguments);
    }
    /** @inheritdoc */
    XComment.prototype.toString = function () {
        return '<!--' + parseXmlEntities(this.value) + '-->';
    };
    return XComment;
}(XNode));
exports.XComment = XComment;
/**
 * A XML container.
 */
var XContainer = (function (_super) {
    __extends(XContainer, _super);
    function XContainer() {
        _super.apply(this, arguments);
        this._nodes = new observable_array_1.ObservableArray();
    }
    /**
     * Adds content.
     *
     * @param any content The content to add.
     */
    XContainer.prototype.add = function (content) {
        if (TypeUtils.isNullOrUndefined(content)) {
            return;
        }
        if (!(content instanceof XNode)) {
            var txt = new XText();
            txt.value = '' + content;
            content = txt;
        }
        this._nodes.push(content);
    };
    /**
     * Returns the first element by name.
     *
     * @param any name The name of the attribute.
     *
     * @return {XElement} The element or (null) if not found.
     */
    XContainer.prototype.element = function (name) {
        var elementList = this.elements(name);
        return elementList.length > 0 ? elementList[0] : null;
    };
    /**
     * Gets the element of the container.
     *
     * @param any [name] The custom name filter.
     *
     * @return {XElement[]} The elements.
     *
     * @throws Name is invalid.
     */
    XContainer.prototype.elements = function (name) {
        var validator = this.getElementValidator(name);
        var elementList = [];
        for (var i = 0; i < this._nodes.length; i++) {
            var n = this._nodes.getItem(i);
            if (n instanceof XElement) {
                if (validator(n)) {
                    elementList.push(n);
                }
            }
        }
        return elementList;
    };
    /**
     * Returns an element validator by name.
     *
     * @param any name The XML name.
     *
     * @return {Function} The validator.
     *
     * @throws Name is invalid.
     */
    XContainer.prototype.getElementValidator = function (name) {
        if (TypeUtils.isNullOrUndefined(name)) {
            return function () { return true; };
        }
        if (!(name instanceof XName)) {
            name = new XName(name);
        }
        return function (e) { return e.name.equals(name); };
    };
    /**
     * Gets the nodes of the container.
     *
     * @return {XNode[]} The nodes.
     */
    XContainer.prototype.nodes = function () {
        var nodeList = [];
        for (var i = 0; i < this._nodes.length; i++) {
            nodeList.push(this._nodes.getItem(i));
        }
        return nodeList;
    };
    return XContainer;
}(XNode));
exports.XContainer = XContainer;
/**
 * A XML container with attributes.
 */
var XContainerWithAttributes = (function (_super) {
    __extends(XContainerWithAttributes, _super);
    function XContainerWithAttributes() {
        _super.apply(this, arguments);
        this._attributes = [];
    }
    /** @inheritdoc */
    XContainerWithAttributes.prototype.add = function (content) {
        if (content instanceof XAttribute) {
            this._attributes.push(content);
        }
        else {
            _super.prototype.add.call(this, content);
        }
    };
    /**
     * Returns an attribute by name.
     *
     * @param any name The name of the attribute.
     *
     * @return {XAttribute} The attribute or (null) if not found.
     */
    XContainerWithAttributes.prototype.attribute = function (name) {
        var attribList = this.attributes(name);
        return attribList.length > 0 ? attribList[0] : null;
    };
    /**
     * Gets the list of attributes.
     *
     * @param any [name] The custom name filter.
     *
     * @return {XAttribute[]} The attributes.
     *
     * @throws Name is invalid.
     */
    XContainerWithAttributes.prototype.attributes = function (name) {
        var validator = this.getAttributeValidator(name);
        var attributeList = [];
        for (var i = 0; i < this._attributes.length; i++) {
            var a = this._attributes[i];
            if (validator(a)) {
                attributeList.push(a);
            }
        }
        return attributeList;
    };
    /**
     * Returns an attribute validator by name.
     *
     * @param any name The XML name.
     *
     * @return {Function} The validator.
     *
     * @throws Name is invalid.
     */
    XContainerWithAttributes.prototype.getAttributeValidator = function (name) {
        if (TypeUtils.isNullOrUndefined(name)) {
            return function () { return true; };
        }
        if (!(name instanceof XName)) {
            name = new XName(name);
        }
        return function (a) { return a.name.equals(name); };
    };
    return XContainerWithAttributes;
}(XContainer));
exports.XContainerWithAttributes = XContainerWithAttributes;
/**
 * A XML element.
 */
var XElement = (function (_super) {
    __extends(XElement, _super);
    /**
     * Initializes a new instance of that class.
     *
     * @param any name The name of the element.
     *
     * @throws Name is invalid.
     */
    function XElement(name) {
        _super.call(this);
        this._elements = new observable_array_1.ObservableArray();
        if (!(name instanceof XName)) {
            name = new XName(name);
        }
        this._name = name;
    }
    /** @inheritdoc */
    XElement.prototype.add = function (content) {
        if (content instanceof XContainer) {
            if (!TypeUtils.isNullOrUndefined(content.parent)) {
                throw "Parent is already set.";
            }
            content.parent = this;
        }
        _super.prototype.add.call(this, content);
    };
    Object.defineProperty(XElement.prototype, "document", {
        /** @inheritdoc */
        get: function () {
            var p = this.parent;
            return !TypeUtils.isNullOrUndefined(p) ? p.document : this._document;
        },
        set: function (doc) {
            if (!TypeUtils.isNullOrUndefined(this.parent)) {
                throw "Cannot set document here!";
            }
            if (!TypeUtils.isNullOrUndefined(this._document)) {
                throw "Document already set!";
            }
            this._document = doc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XElement.prototype, "name", {
        /**
         * Gets the name of the element.
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    XElement.prototype.toString = function () {
        var str = '<' + this.name.toString();
        var attribs = this.attributes();
        if (attribs.length > 0) {
            for (var i = 0; i < attribs.length; i++) {
                var a = attribs[i];
                str += " " + a.toString();
            }
        }
        var nodes = this.nodes();
        if (nodes.length > 0) {
            str += '>';
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                str += n.toString();
            }
            str += '</' + this.name.toString() + '>';
        }
        else {
            str += ' />';
        }
        return str;
    };
    Object.defineProperty(XElement.prototype, "value", {
        /**
         * Gets the value of that element.
         *
         * @return {any} The value.
         */
        get: function () {
            var childNodes = this.nodes();
            if (childNodes.length < 1) {
                return null;
            }
            var elementValue = '';
            for (var i = 0; i < childNodes.length; i++) {
                var node = childNodes[i];
                var valueToAdd;
                if (hasProperty(node, 'value')) {
                    valueToAdd = node.value;
                }
                else {
                    valueToAdd = node.toString();
                }
                if (!TypeUtils.isNullOrUndefined(valueToAdd)) {
                    elementValue += valueToAdd;
                }
            }
            return elementValue;
        },
        enumerable: true,
        configurable: true
    });
    return XElement;
}(XContainerWithAttributes));
exports.XElement = XElement;
/**
 * A XML document.
 */
var XDocument = (function (_super) {
    __extends(XDocument, _super);
    function XDocument() {
        _super.apply(this, arguments);
        this._root = null;
    }
    /** @inheritdoc */
    XDocument.prototype.add = function (content) {
        var invokeParent = true;
        if (content instanceof XElement) {
            if (TypeUtils.isNullOrUndefined(this._root)) {
                content.document = this;
                this._root = content;
            }
            else {
                throw "A root element is already defined!";
            }
        }
        if (invokeParent) {
            _super.prototype.add.call(this, content);
        }
    };
    Object.defineProperty(XDocument.prototype, "root", {
        /**
         * Gets the root element.
         */
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    XDocument.prototype.toString = function () {
        var str = '';
        var nodes = this.nodes();
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            str += n.toString();
        }
        return str;
    };
    return XDocument;
}(XContainer));
exports.XDocument = XDocument;
function getOwnProperties(obj) {
    if (TypeUtils.isNullOrUndefined(obj)) {
        return obj;
    }
    var properties = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            properties[p] = obj[p];
        }
    }
    return properties;
}
function hasProperty(obj, propertyName) {
    if (TypeUtils.isNullOrUndefined(obj)) {
        return obj;
    }
    obj.hasProperty();
    for (var p in obj) {
        if (propertyName === p) {
            return true;
        }
    }
    return false;
}
/**
 * Parses an XML string.
 *
 * @param {String} xml The string to parse.
 * @param {Boolean} [processNamespaces] Process namespaces or not.
 * @param {Boolean} [angularSyntax] Handle Angular syntax or not.
 *
 * @return {XDocument} The new document.
 *
 * @throws Parse error.
 */
function parse(xml, processNamespaces, angularSyntax) {
    var doc = new XDocument();
    var errors = [];
    var elementStack = [];
    var currentContainer = function () { return elementStack.length > 0 ? elementStack[elementStack.length - 1] : doc; };
    var xParser = new Xml.XmlParser(function (e) {
        var c = currentContainer();
        if (e.eventType === Xml.ParserEventType.StartElement) {
            var newElement = new XElement(e.elementName);
            newElement.add(e.data);
            var attribs = getOwnProperties(e.attributes);
            if (!TypeUtils.isNullOrUndefined(attribs)) {
                for (var p in attribs) {
                    var a = new XAttribute(p);
                    a.value = attribs[p];
                    newElement.add(a);
                }
            }
            currentContainer().add(newElement);
            elementStack.push(newElement);
        }
        else if (e.eventType === Xml.ParserEventType.Text) {
            var newText = new XText();
            newText.value = e.data;
            currentContainer().add(newText);
        }
        else if (e.eventType === Xml.ParserEventType.CDATA) {
            var newCData = new XCData();
            newCData.value = e.data;
            currentContainer().add(newCData);
        }
        else if (e.eventType === Xml.ParserEventType.Comment) {
            var newComment = new XComment();
            newComment.value = e.data;
            currentContainer().add(newComment);
        }
        else if (e.eventType === Xml.ParserEventType.EndElement) {
            elementStack.pop();
        }
    }, function (error, position) {
        errors.push([error, position]);
    }, processNamespaces, angularSyntax);
    xParser.parse(xml);
    if (errors.length > 0) {
        // collect errors and throw
        var exceptionMsg = 'XML parse error:';
        for (var i = 0; i < errors.length; i++) {
            var err = errors[i][0];
            var pos = errors[i][1];
            exceptionMsg += "\n(" + pos.column + "," + pos.line + "): [" + err.name + "] " + err.message;
        }
        throw exceptionMsg;
    }
    return doc;
}
exports.parse = parse;
function parseXmlEntities(v) {
    if (TypeUtils.isNullOrUndefined(v)) {
        v = '';
    }
    v = '' + v;
    v = v.replace('&', '&amp;');
    v = v.replace('"', '&quot;');
    v = v.replace("'", '&apos;');
    v = v.replace('<', '&lt;');
    v = v.replace('>', '&gt;');
    return v;
}
//# sourceMappingURL=index.js.map