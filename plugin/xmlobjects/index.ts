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

import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import TypeUtils = require('utils/types');
import Xml = require('xml');

/**
 * A XML name.
 */
export class XName {
    private _localName: string;
    private _namespace: string;

    /**
     * Initializes a new instance of that class.
     * 
     * @param {string} name The full name.
     * 
     * @throws Name is invalid.
     */
    constructor(name: string) {
        if (TypeUtils.isNullOrUndefined(name)) {
            throw "Name cannot be (null) or (undefined)!";
        }

        name = ('' + name).trim();

        var ns: string = null;
        var ln: string = name;

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
    public equals(v: any): boolean {
        if (TypeUtils.isNullOrUndefined(v)) {
            return false;
        }

        if (v instanceof XName) {
            v = v.toString();
        }

        return this.toString() === ('' + v);
    }

    /**
     * Gets the local name.
     */
    public get localName(): string {
        return this._localName;
    }

    /**
     * Gets the namespace.
     */
    public get namespace(): string {
        return this._namespace;
    }

    /**
     * Returns the full name.
     * 
     * @return {string} The full name.
     */
    public toString(): string {
        var str = this._localName;
        if (null !== this._namespace) {
            str = this._namespace + ":" + str;
        }

        return str;
    }
}

/**
 * A XML object.
 */
export abstract class XObject extends Observable {
    /**
     * Gets the underlying document.
     */
    public get document(): XDocument {
        return !TypeUtils.isNullOrUndefined(this.parent) ? this.parent.document : null;
    } 

    /**
     * Gets or sets the parent element.
     */
    public parent: XElement;

    /**
     * Gets the string representation of that object.
     * 
     * @return {String} The object as string.
     */
    public abstract toString(): string;
}

/**
 * A XML attribute.
 */
export class XAttribute {
    private _name: XName;

    /**
     * Initializes a new instance of that class.
     * 
     * @param any name The name of the element.
     * 
     * @throws Name is invalid.
     */
    constructor(name: XName | string) {
        if (!(name instanceof XName)) {
            name = new XName(<any>name);
        }

        this._name = <any>name;
    }

    /**
     * Gets the name of the element.
     */
    public get name(): XName {
        return this._name;
    }

    /**
     * Gets or sets the value.
     */
    public value: any;

    /**
     * Gets the string representation of that object.
     * 
     * @return {String} The object as string.
     */
    public toString(): string {
        var str = this.name.toString();

        var v = this.value;
        if (!TypeUtils.isNullOrUndefined(v)) {
            str += '="' + parseXmlEntities(v) + '"'; 
        }

        return str;
    }
}

/**
 * A XML node.
 */
export abstract class XNode extends XObject {
}

/**
 * XML text.
 */
export class XText extends XNode {
    /**
     * Gets or sets the value of the text.
     */
    public value: any;

    /** @inheritdoc */
    public toString(): string {
        return parseXmlEntities(this.value);
    }
}

/**
 * XML CDATA
 */
export class XCData extends XText {
    /** @inheritdoc */
    public toString(): string {
        return '<![CDATA[' + parseXmlEntities(this.value) + ']]>';
    }
}

/**
 * A XML comment.
 */
export class XComment extends XNode {
    /**
     * Gets or sets the value of the comment.
     */
    public value: any;

    /** @inheritdoc */
    public toString(): string {
        return '<!--' + parseXmlEntities(this.value) + '-->';
    }
}

/**
 * A XML container.
 */
export abstract class XContainer extends XNode {
    private _nodes = new ObservableArray<XNode>();

    /**
     * Adds content.
     * 
     * @param any content The content to add.
     */
    public add(content: any) {
        if (TypeUtils.isNullOrUndefined(content)) {
            return;
        }

        if (!(content instanceof XNode)) {
            var txt = new XText();
            txt.value = '' + content;

            content = txt;
        }

        this._nodes.push(content);
    }

    /**
     * Returns the first element by name.
     * 
     * @param any name The name of the attribute.
     * 
     * @return {XElement} The element or (null) if not found.
     */
    public element(name: string | XName): XElement {
        var elementList = this.elements(name);
        return elementList.length > 0 ? elementList[0] : null;
    }

    /**
     * Gets the element of the container.
     * 
     * @param any [name] The custom name filter.
     * 
     * @return {XElement[]} The elements.
     * 
     * @throws Name is invalid.
     */
    public elements(name?: string | XName): XElement[] {
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
    }

    /**
     * Returns an element validator by name.
     * 
     * @param any name The XML name.
     * 
     * @return {Function} The validator.
     * 
     * @throws Name is invalid.
     */
    protected getElementValidator(name: string | XName): (element: XElement) => boolean {
        if (TypeUtils.isNullOrUndefined(name)) {
            return () => true;
        }

        if (!(name instanceof XName)) {
            name = new XName(<any>name);
        }

        return (e) => e.name.equals(name);
    }

    /**
     * Gets the nodes of the container.
     * 
     * @return {XNode[]} The nodes.
     */
    public nodes(): XNode[] {
        var nodeList = [];
        for (var i = 0; i < this._nodes.length; i++) {
            nodeList.push(this._nodes.getItem(i));
        }

        return nodeList;
    }
}

/**
 * A XML container with attributes.
 */
export abstract class XContainerWithAttributes extends XContainer {
    private _attributes: XAttribute[] = [];
    
    /** @inheritdoc */
    public add(content: any) {
        if (content instanceof XAttribute) {
            this._attributes.push(content);
        }   
        else {
            super.add(content);
        } 
    }

    /**
     * Returns an attribute by name.
     * 
     * @param any name The name of the attribute.
     * 
     * @return {XAttribute} The attribute or (null) if not found.
     */
    public attribute(name: string | XName): XAttribute {
        var attribList = this.attributes(name);
        return attribList.length > 0 ? attribList[0] : null;
    }

    /**
     * Gets the list of attributes.
     * 
     * @param any [name] The custom name filter.
     * 
     * @return {XAttribute[]} The attributes.
     * 
     * @throws Name is invalid.
     */
    public attributes(name?: string | XName): XAttribute[] {
        var validator = this.getAttributeValidator(name);

        var attributeList = [];

        for (var i = 0; i < this._attributes.length; i++) {
            var a = this._attributes[i];
            if (validator(a)) {
                attributeList.push(a);
            }
        }

        return attributeList;
    }

    /**
     * Returns an attribute validator by name.
     * 
     * @param any name The XML name.
     * 
     * @return {Function} The validator.
     * 
     * @throws Name is invalid.
     */
    protected getAttributeValidator(name: string | XName): (attrib: XAttribute) => boolean {
        if (TypeUtils.isNullOrUndefined(name)) {
            return () => true;
        }

        if (!(name instanceof XName)) {
            name = new XName(<any>name);
        }

        return (a) => a.name.equals(name);
    }
}

/**
 * A XML element.
 */
export class XElement extends XContainerWithAttributes {
    private _document: XDocument;
    private _elements = new ObservableArray<XElement>();
    private _name: XName;

    /**
     * Initializes a new instance of that class.
     * 
     * @param any name The name of the element.
     * 
     * @throws Name is invalid.
     */
    constructor(name: XName | string) {
        super();

        if (!(name instanceof XName)) {
            name = new XName(<any>name);
        }

        this._name = <any>name;
    }

    /** @inheritdoc */
    public add(content: any) {
        if (content instanceof XContainer) {
            if (!TypeUtils.isNullOrUndefined(content.parent)) {
                throw "Parent is already set.";
            }

            content.parent = this;
        }   
        
        super.add(content);
    }

    /** @inheritdoc */
    public get document(): XDocument {
        var p = this.parent;
        return !TypeUtils.isNullOrUndefined(p) ? p.document : this._document;
    }
    public set document(doc: XDocument) {
        if (!TypeUtils.isNullOrUndefined(this.parent)) {
            throw "Cannot set document here!";
        }

        if (!TypeUtils.isNullOrUndefined(this._document)) {
            throw "Document already set!";
        }

        this._document = doc;
    }

    /**
     * Gets the name of the element.
     */
    public get name(): XName {
        return this._name;
    }

    /** @inheritdoc */
    public toString(): string {
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
            str += ' />'
        }

        return str;
    }
}

/**
 * A XML document.
 */
export class XDocument extends XContainer {
    private _root: XElement = null;

    /** @inheritdoc */
    public add(content: any) {
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
            super.add(content);
        }
    }

    /**
     * Gets the root element.
     */
    public get root(): XElement {
        return this._root;
    }

    /** @inheritdoc */
    public toString(): string {
        var str = '';
    
        var nodes = this.nodes();
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];

            str += n.toString();
        }

        return str;
    }
}

function getOwnProperties(obj) {
    if (TypeUtils.isNullOrUndefined(obj)) {
        return obj;
    }
    
    var properties: any = {};
    
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            properties[p] = obj[p];
        }
    }
    
    return properties;
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
export function parse(xml: string,
                      processNamespaces?: boolean, angularSyntax?: boolean): XDocument {
    var doc = new XDocument();

    var errors = [];
    var elementStack: XElement[] = [];
    var currentContainer: () => XContainer = () => elementStack.length > 0 ? elementStack[elementStack.length - 1] : doc;
    var xParser = new Xml.XmlParser((e) => {
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
    }, (error, position) => {
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

function parseXmlEntities(v: any): string {
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
