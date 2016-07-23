import { Observable } from 'data/observable';
/**
 * A XML name.
 */
export declare class XName {
    private _localName;
    private _namespace;
    /**
     * Initializes a new instance of that class.
     *
     * @param {string} name The full name.
     *
     * @throws Name is invalid.
     */
    constructor(name: string);
    /**
     * Checks if a value is equal to the full name of that instance.
     *
     * @param any v The value to check.
     *
     * @return {Boolean} Is equal or not.
     */
    equals(v: any): boolean;
    /**
     * Gets the local name.
     */
    localName: string;
    /**
     * Gets the namespace.
     */
    namespace: string;
    /**
     * Returns the full name.
     *
     * @return {string} The full name.
     */
    toString(): string;
}
/**
 * A XML object.
 */
export declare abstract class XObject extends Observable {
    /**
     * Gets the underlying document.
     */
    document: XDocument;
    /**
     * Gets or sets the parent element.
     */
    parent: XElement;
    /**
     * Gets the string representation of that object.
     *
     * @return {String} The object as string.
     */
    abstract toString(): string;
}
/**
 * A XML attribute.
 */
export declare class XAttribute {
    private _name;
    /**
     * Initializes a new instance of that class.
     *
     * @param any name The name of the element.
     *
     * @throws Name is invalid.
     */
    constructor(name: XName | string);
    /**
     * Gets the name of the element.
     */
    name: XName;
    /**
     * Gets or sets the value.
     */
    value: any;
    /**
     * Gets the string representation of that object.
     *
     * @return {String} The object as string.
     */
    toString(): string;
}
/**
 * A XML node.
 */
export declare abstract class XNode extends XObject {
}
/**
 * XML text.
 */
export declare class XText extends XNode {
    /**
     * Gets or sets the value of the text.
     */
    value: any;
    /** @inheritdoc */
    toString(): string;
}
/**
 * XML CDATA
 */
export declare class XCData extends XText {
    /** @inheritdoc */
    toString(): string;
}
/**
 * A XML comment.
 */
export declare class XComment extends XNode {
    /**
     * Gets or sets the value of the comment.
     */
    value: any;
    /** @inheritdoc */
    toString(): string;
}
/**
 * A XML container.
 */
export declare abstract class XContainer extends XNode {
    private _nodes;
    /**
     * Adds content.
     *
     * @param any content The content to add.
     */
    add(content: any): void;
    /**
     * Returns the first element by name.
     *
     * @param any name The name of the attribute.
     *
     * @return {XElement} The element or (null) if not found.
     */
    element(name: string | XName): XElement;
    /**
     * Gets the element of the container.
     *
     * @param any [name] The custom name filter.
     *
     * @return {XElement[]} The elements.
     *
     * @throws Name is invalid.
     */
    elements(name?: string | XName): XElement[];
    /**
     * Returns an element validator by name.
     *
     * @param any name The XML name.
     *
     * @return {Function} The validator.
     *
     * @throws Name is invalid.
     */
    protected getElementValidator(name: string | XName): (element: XElement) => boolean;
    /**
     * Gets the nodes of the container.
     *
     * @return {XNode[]} The nodes.
     */
    nodes(): XNode[];
}
/**
 * A XML container with attributes.
 */
export declare abstract class XContainerWithAttributes extends XContainer {
    private _attributes;
    /** @inheritdoc */
    add(content: any): void;
    /**
     * Returns an attribute by name.
     *
     * @param any name The name of the attribute.
     *
     * @return {XAttribute} The attribute or (null) if not found.
     */
    attribute(name: string | XName): XAttribute;
    /**
     * Gets the list of attributes.
     *
     * @param any [name] The custom name filter.
     *
     * @return {XAttribute[]} The attributes.
     *
     * @throws Name is invalid.
     */
    attributes(name?: string | XName): XAttribute[];
    /**
     * Returns an attribute validator by name.
     *
     * @param any name The XML name.
     *
     * @return {Function} The validator.
     *
     * @throws Name is invalid.
     */
    protected getAttributeValidator(name: string | XName): (attrib: XAttribute) => boolean;
}
/**
 * A XML element.
 */
export declare class XElement extends XContainerWithAttributes {
    private _document;
    private _elements;
    private _name;
    /**
     * Initializes a new instance of that class.
     *
     * @param any name The name of the element.
     *
     * @throws Name is invalid.
     */
    constructor(name: XName | string);
    /** @inheritdoc */
    add(content: any): void;
    /** @inheritdoc */
    document: XDocument;
    /**
     * Gets the name of the element.
     */
    name: XName;
    /** @inheritdoc */
    toString(): string;
}
/**
 * A XML document.
 */
export declare class XDocument extends XContainer {
    private _root;
    /** @inheritdoc */
    add(content: any): void;
    /**
     * Gets the root element.
     */
    root: XElement;
    /** @inheritdoc */
    toString(): string;
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
export declare function parse(xml: string, processNamespaces?: boolean, angularSyntax?: boolean): XDocument;
