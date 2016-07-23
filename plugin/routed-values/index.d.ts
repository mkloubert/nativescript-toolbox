import Observable = require("data/observable");
/**
 * Name of the property for a "real" / non-routed value.
 */
export declare const INNER_VALUE_PROPERTY: string;
/**
 * Name of the property for a routed value.
 */
export declare const VALUE_PROPERTY: string;
/**
 * List of router stradegies.
 */
export declare enum RouterStradegy {
    /**
     * Take the value from parent (if greater)
     */
    Ascending = 0,
    /**
     * Take the value from parent (if smaller)
     */
    Descending = 1,
}
/**
 * List of values that represent the state of a traffic light.
 */
export declare enum TraficLightState {
    /**
     * None (gray)
     **/
    None = 0,
    /**
     * OK (green)
     **/
    OK = 1,
    /**
     * Warning (yellow)
     **/
    Warning = 2,
    /**
     * Error (red)
     **/
    Error = 3,
    /**
     * Fatal error (yellow / red)
     **/
    FatalError = 4,
}
/**
 * A routed value.
 */
export declare class RoutedValue<T> extends Observable.Observable {
    /**
     * Stores the children.
     */
    protected _children: RoutedValue<T>[];
    /**
     * Stores the comparer for the values.
     */
    protected _comparer: (x: T, y: T) => number;
    /**
     * Stores the "real" inner value of that instance.
     */
    protected _innerValue: T;
    private _name;
    /**
     * Stores the parents.
     */
    protected _parents: RoutedValue<T>[];
    /**
     * Stores the stradegy.
     */
    protected _stradegy: RouterStradegy;
    private _tag;
    /**
     * Initializes a new instance of that class.
     *
     * @param {RouterStradegy} [stradegy] The router stradegy.
     * @param {Function} [comparer] The comparer for the values.
     */
    constructor(stradegy?: RouterStradegy, comparer?: (x: T, y: T) => number);
    /**
     * Adds a list of children.
     *
     * @chainable
     *
     * @param {RoutedState} ...children One or more child to add.
     */
    addChildren(...children: RoutedValue<T>[]): RoutedValue<T>;
    /**
     * Adds a list of children.
     *
     * @chainable
     *
     * @param {Array} children The children to add.
     *
     * @throws A child object is already a parent.
     */
    addChildArray(children: RoutedValue<T>[]): RoutedValue<T>;
    /**
     * Adds a parent item.
     *
     * @param {RoutedValue} parent The parent item to add.
     * @param {Boolean} addChild Also add that instance as child item for 'parent' or not.
     *
     * @throws Parent object is already a child.
     */
    protected addParentItem(parent: RoutedValue<T>, addChild: boolean): void;
    /**
     * Adds a list of parents.
     *
     * @chainable
     *
     * @param {RoutedState} ...parents One or more parent to add.
     */
    addParents(...parents: RoutedValue<T>[]): RoutedValue<T>;
    /**
     * Adds a list of parents.
     *
     * @chainable
     *
     * @param {Array} parents The parents to add.
     */
    addParentArray(parents: RoutedValue<T>[]): RoutedValue<T>;
    /**
     * Gets or sets the "real" (not routed) value of that instance.
     */
    innerValue: T;
    /**
     * Gets or sets the name of that instance.
     */
    name: string;
    /**
     * Hooks a changed event listener for 'value' property.
     *
     * @param {Function} listener The listener to register.
     *
     * @return {Function} The underlying 'hook' function that has been used for 'on' method.
     */
    onValueChanged(listener: (newValue: T, object: RoutedValue<T>) => void): (e: Observable.PropertyChangeData) => void;
    /**
     * Raises the property change event for the value property.
     */
    raiseValueChanged(): void;
    /**
     * Checks if a parent value should be taken instead of the own one.
     * This depends on the value comparer function that is used by that instance.
     *
     * @param {T} parentValue The "parent" value.
     * @param {T} [thisValue] The custom value to take that is handled as "own" value.
     *
     * @return {Boolean} 'parentValue' should be taken or now.
     */
    shouldTakeParentValue(parentValue: T, thisValue?: T): boolean;
    /**
     * Gets the router stradegy.
     */
    stradegy: RouterStradegy;
    /**
     * Gets or sets an object / value that should be linked with that instance.
     */
    tag: any;
    /**
     * Gets the routed value.
     */
    value: T;
}
/**
 * A routed number.
 */
export declare class RoutedNumber extends RoutedValue<number> {
    constructor();
}
/**
 * A routed traffic light.
 */
export declare class TrafficLight extends RoutedValue<TraficLightState> {
}
