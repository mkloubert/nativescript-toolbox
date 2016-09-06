/**
 * A class that creates a value onces and when it is needed.
 */
export declare class Lazy<T> {
    protected _isValueCreated: boolean;
    protected _value: T;
    protected _valueFactory: () => T;
    /**
     * Initializes a new instance of that class.
     *
     * @param {Function} valueFactory The function that creates the value.
     */
    constructor(valueFactory: () => T);
    /**
     * Gets if the value has been created or not.
     */
    isValueCreated: boolean;
    /**
     * Resets the state of that class.
     */
    reset(): void;
    /**
     * Gets the (lazy) value.
     */
    value: T;
}
