import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { VirtualArray } from "data/virtual-array";
/**
 * Regular expression for trimming a string
 * at the beginning and the end.
 */
export declare const REGEX_TRIM: RegExp;
/**
 * Describes a grouping.
 */
export interface IGrouping<K, T> extends IEnumerable<T> {
    /**
     * Gets the key.
     */
    key: K;
}
/**
 * Describes a sequence.
 */
export interface IEnumerable<T> {
    /**
     * Applies an accumulator function over the sequence.
     *
     * @param {Function} accumulator The accumulator.
     * @param any [defaultValue] The value to return if sequence is empty.
     *
     * @return any The final accumulator value or the default value.
     */
    aggregate(accumulator: any, defaultValue?: any): any;
    /**
     * Checks if all elements of the sequence match a condition.
     *
     * @param {Function} predicate The condition.
     *
     * @return {Boolean} All items match condition or not. If sequence is empty (true) is returned.
     */
    all(predicate: any): boolean;
    /**
     * Checks if at least one element of the sequence matches a condition.
     *
     * @param {Function} [predicate] The condition.
     *
     * @return {Boolean} At least one element was found that matches the condition.
     *                   If condition is not defined, the method checks if sequence contains at least one element.
     */
    any(predicate?: any): boolean;
    /**
     * Computes the average of that sequence.
     *
     * @param any [defaultValue] The (default) value to return if sequence is empty.
     *
     * @return any The average of the sequence or the default value.
     */
    average(defaultValue?: any): any;
    /**
     * Casts all items to a specific type.
     *
     * @param {String} type The target type.
     *
     * @return any The new sequence with the casted items.
     */
    cast(type: string): IEnumerable<any>;
    /**
     * Concats the items of that sequence with the items of another one.
     *
     * @param any second The other sequence.
     *
     * @throws Value for other sequence is invalid.
     *
     * @return {IEnumerable} The new sequence.
     */
    concat(second: any): IEnumerable<T>;
    /**
     * Checks if that sequence contains an item.
     *
     * @param any item The item to search for.
     * @param {Function} [equalityComparer] The custom equality comparer to use.
     *
     * @return {Boolean} Contains item or not.
     */
    contains(item: T, equalityComparer?: any): boolean;
    /**
     * Returns the number of elements.
     *
     * @param {Function} [predicate] The custom condition to use.
     *
     * @return {Number} The number of (matching) elements.
     */
    count(predicate?: any): number;
    /**
     * Gets the current element.
     */
    current: T;
    /**
     * Returns a default sequence if that sequence is empty.
     *
     * @param ...any [defaultItem] One or more items for the default sequence.
     *
     * @return {IEnumerable} A default sequence or that sequence if it is not empty.
     */
    defaultIfEmpty(...defaultItems: T[]): IEnumerable<T>;
    /**
     * Removes the duplicates from that sequence.
     *
     * @param {Function} [equalityComparer] The custom equality comparer to use.
     *
     * @throws No valid equality comparer.
     *
     * @return {IEnumerable} The new sequence.
     */
    distinct(equalityComparer?: any): IEnumerable<T>;
    /**
     * Iterates over the elements of that sequence.
     *
     * @param {Function} action The callback that is executed for an item.
     *
     * @return any The result of the last execution.
     */
    each(action: any): any;
    /**
     * Return an element of the sequence at a specific index.
     *
     * @param {Number} index The zero based index.
     *
     * @throws Element was not found.
     *
     * @return any The element.
     */
    elementAt(index: number): T;
    /**
     * Tries to return an element of the sequence at a specific index.
     *
     * @param {Number} index The zero based index.
     * @param any [defaultValue] The (default) value to return if no matching element was found.
     *
     * @return any The element or the default value.
     */
    elementAtOrDefault(index: number, defaultValue?: any): any;
    /**
     * Returns the items of that sequence except a list of specific ones.
     *
     * @param any second The sequence with the items to remove.
     * @param any [equalityComparer] The custom equality comparer to use.
     *
     * @throws The second sequence and/or the equality comparer is invalid.
     *
     * @return {IEnumerable} The new sequence.
     */
    except(second: any, equalityComparer?: any): IEnumerable<T>;
    /**
     * Returns the first element of the sequence.
     *
     * @param {Function} [predicate] The custom condition to use.
     *
     * @throws Sequence contains no (matching) element.
     *
     * @return any The first (matching) element.
     */
    first(predciate?: any): T;
    /**
     * Tries to return the first element of the sequence.
     *
     * @param {Function} [predicateOrDefaultValue] The custom condition to use.
     *                                             If only one argument is defined and that value is NO function it will be handled as default value.
     * @param any [defaultValue] The (default) value to return if no matching element was found.
     *
     * @return any The first (matching) element or the default value.
     */
    firstOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any;
    /**
     * Groups the elements of the sequence.
     *
     * @param any keySelector The group key selector.
     * @param any [keyEqualityComparer] The custom equality comparer for the keys to use.
     *
     * @throw At least one argument is invalid.
     *
     * @return {IEnumerable} The new sequence.
     */
    groupBy<K>(keySelector: any, keyEqualityComparer?: any): IEnumerable<IGrouping<K, T>>;
    /**
     * Correlates the elements of that sequence and another based on matching keys and groups them.
     *
     * @param any inner The other sequence.
     * @param any outerKeySelector The key selector for the items of that sequence.
     * @param any innerKeySelector The key selector for the items of the other sequence.
     * @param any resultSelector The function that provides the result value for two matching elements.
     * @param any [keyEqualityComparer] The custom equality comparer for the keys to use.
     *
     * @throw At least one argument is invalid.
     *
     * @return {IEnumerable} The new sequence.
     */
    groupJoin<U>(inner: any, outerKeySelector: any, innerKeySelector: any, resultSelector: any, keyEqualityComparer?: any): IEnumerable<U>;
    /**
     * Returns the intersection between this and a second sequence.
     *
     * @param any second The second sequence.
     * @param any [equalityComparer] The custom equality comparer to use.
     *
     * @throws The second sequence and/or the equality comparer is invalid.
     *
     * @return {IEnumerable} The new sequence.
     */
    intersect(second: any, equalityComparer?: any): IEnumerable<T>;
    /**
     * Gets the item key.
     */
    itemKey: any;
    /**
     * Gets if the current state of that sequence is valid or not.
     */
    isValid: boolean;
    /**
     * Correlates the elements of that sequence and another based on matching keys.
     *
     * @param any inner The other sequence.
     * @param any outerKeySelector The key selector for the items of that sequence.
     * @param any innerKeySelector The key selector for the items of the other sequence.
     * @param any resultSelector The function that provides the result value for two matching elements.
     * @param any [keyEqualityComparer] The custom equality comparer for the keys to use.
     *
     * @throw At least one argument is invalid.
     *
     * @return {IEnumerable} The new sequence.
     */
    join<U>(inner: any, outerKeySelector: any, innerKeySelector: any, resultSelector: any, keyEqualityComparer?: any): any;
    /**
     * Returns the last element of the sequence.
     *
     * @param {Function} [predicate] The custom condition to use.
     *
     * @throws Sequence contains no (matching) element.
     *
     * @return any The last (matching) element.
     */
    last(predicate?: any): any;
    /**
     * Tries to return the last element of the sequence.
     *
     * @param {Function} [predicateOrDefaultValue] The custom condition to use.
     *                                             If only one argument is defined and that value is NO function it will be handled as default value.
     * @param any [defaultValue] The (default) value to return if no matching element was found.
     *
     * @return any The last (matching) element or the default value.
     */
    lastOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any;
    /**
     * Tries to return the maximum value of the sequence.
     *
     * @param any [defaultValue] The (default) value to return if sequence is empty.
     *
     * @return any The maximum or the default value.
     */
    max(defaultValue?: any): any;
    /**
     * Tries to return the minimum value of the sequence.
     *
     * @param any [defaultValue] The (default) value to return if sequence is empty.
     *
     * @return any The minimum or the default value.
     */
    min(defaultValue?: any): any;
    /**
     * Tries to move to the next item.
     *
     * @return {Boolean} Operation was successful or not.
     */
    moveNext(): boolean;
    /**
     * Returns elements of a specific type.
     *
     * @param {String} type The type.
     *
     * @return {IEnumerable} The new sequence.
     */
    ofType(type: string): IEnumerable<any>;
    /**
     * Sorts the elements of that sequence in ascending order by using the values itself as keys.
     *
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws The comparer is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    order(comparer?: any): IOrderedEnumerable<T>;
    /**
     * Sorts the elements of that sequence in ascending order.
     *
     * @param any selector The key selector.
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws At least one argument is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    orderBy(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /**
     * Sorts the elements of that sequence in descending order.
     *
     * @param any selector The key selector.
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws At least one argument is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    orderByDescending(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /**
     * Sorts the elements of that sequence in descending order by using the values as keys.
     *
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws The comparer is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    orderDescending(comparer?: any): IOrderedEnumerable<T>;
    /**
     * Pushes the items of that sequence to an array.
     *
     * @param {any} arr The target array.
     *
     * @chainable
     */
    pushToArray(arr: T[] | ObservableArray<T>): IEnumerable<T>;
    /**
     * Resets the sequence.
     *
     * @throws Reset is not possible.
     */
    reset(): any;
    /**
     * Reverses the order of the elements.
     *
     * @method reverse
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    reverse(): IEnumerable<T>;
    /**
     * Projects the elements of that sequence to new values.
     *
     * @param {Function} selector The selector.
     *
     * @throws Selector is no valid value for use as function.
     *
     * @return {IEnumerable} The new sequence.
     */
    select<U>(selector: any): IEnumerable<U>;
    /**
     * Projects the elements of that sequence to new sequences that converted to one flatten sequence.
     *
     * @param {Function} selector The selector.
     *
     * @throws Selector is no valid value for use as function.
     *
     * @return {IEnumerable} The new sequence.
     */
    selectMany<U>(selector: any): IEnumerable<U>;
    /**
     * Checks if that sequence has the same elements as another one.
     *
     * @param any other The other sequence.
     * @param any [equalityComparer] The custom equality comparer to use.
     *
     * @throws Other sequence and/or equality comparer are invalid values.
     *
     * @return {IEnumerable} Both sequences are the same or not
     */
    sequenceEqual(other: any, equalityComparer?: any): boolean;
    /**
     * Returns the one and only element of the sequence.
     *
     * @param {Function} [predicate] The custom condition to use.
     *
     * @throws Sequence contains more than one matching element or no element.
     *
     * @return T The only (matching) element or the default value.
     */
    single(predicate?: any): T;
    /**
     * Tries to return the one and only element of the sequence.
     *
     * @param {Function} [predicateOrDefaultValue] The custom condition to use.
     *                                             If only one argument is defined and that value is NO function it will be handled as default value.
     * @param any [defaultValue] The (default) value to return if no matching element was found.
     *
     * @throws Sequence contains more than one matching element.
     *
     * @return any The only (matching) element or the default value.
     */
    singleOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any;
    /**
     * Skips a number of elements.
     *
     * @param {Number} cnt The number of elements to skip.
     *
     * @return {IEnumerable} The new sequence.
     */
    skip(cnt: number): IEnumerable<T>;
    /**
     * Takes all elements but the last one.
     *
     * @return {IEnumerable} The new sequence.
     */
    skipLast(): IEnumerable<T>;
    /**
     * Skips elements of that sequence while a condition matches.
     *
     * @method skipWhile
     *
     * @param {Function} predicate The condition to use.
     *
     * @throws Predicate is no valid value.
     *
     * @return {IEnumerable} The new sequence.
     */
    skipWhile(predicate: any): IEnumerable<T>;
    /**
     * Calculates the sum of the elements.
     *
     * @param any defaultValue The value to return if sequence is empty.
     *
     * @return any The sum or the default value.
     */
    sum(defaultValue?: any): any;
    /**
     * Takes a number of elements.
     *
     * @param {Number} cnt The number of elements to take.
     *
     * @return {IEnumerable} The new sequence.
     */
    take(cnt: number): IEnumerable<T>;
    /**
     * Takes elements while a condition matches.
     *
     * @param {Function} predicate The condition to use.
     *
     * @throws Predicate is no valid value.
     *
     * @return {IEnumerable} The new sequence.
     */
    takeWhile(predicate: any): IEnumerable<T>;
    /**
     * Returns the elements of that sequence as array.
     *
     * @return {Array} The sequence as new array.
     */
    toArray(): T[];
    /**
     * Creates a lookup object from the sequence.
     *
     * @param any keySelector The group key selector.
     * @param any [keyEqualityComparer] The custom equality comparer for the keys to use.
     *
     * @throw At least one argument is invalid.
     *
     * @return {Object} The lookup array.
     */
    toLookup(keySelector: any, keyEqualityComparer?: any): any;
    /**
     * Creates a new object from the items of that sequence.
     *
     * @param any [keySelector] The custom key selector to use.
     *
     * @throws Key selector is invalid.
     *
     * @return {Object} The new object.
     */
    toObject(keySelector?: any): any;
    /**
     * Creates a new observable object from the items of that sequence.
     *
     * @param any [keySelector] The custom key selector to use.
     *
     * @throws Key selector is invalid.
     *
     * @return {Observable} The new object.
     */
    toObservable(keySelector?: any): Observable;
    /**
     * Creates a new observable array from the items of that sequence.
     *
     * @return {ObservableArray} The new array.
     */
    toObservableArray(): ObservableArray<T>;
    /**
     * Creates a new virtual array from the items of that sequence.
     *
     * @return {VirtualArray} The new array.
     */
    toVirtualArray(): VirtualArray<T>;
    /**
     * Produces the set union of that sequence and another.
     *
     * @param any second The second sequence.
     * @param {Function} [equalityComparer] The custom equality comparer to use.
     *
     * @throws Sequence or equality comparer are no valid values.
     *
     * @return {IEnumerable} The new sequence.
     */
    union(second: any, equalityComparer?: any): IEnumerable<T>;
    /**
     * Filters the elements of that sequence.
     *
     * @param {Function} predicate The predicate to use.
     *
     * @throws Predicate is no valid function / lambda expression.
     *
     * @return {IEnumerable} The new sequence.
     */
    where(predicate: any): IEnumerable<T>;
    /**
     * Applies a specified function to the corresponding elements of that sequence
     * and another, producing a sequence of the results.
     *
     * @param any second The second sequence.
     * @param {Function} selector The selector for the combined result items of the elements of the two sequences.
     *
     * @throws Sequence or selector are no valid values.
     *
     * @return {IEnumerable} The new sequence.
     */
    zip<U>(second: any, selector: any): IEnumerable<U>;
}
/**
 * Describes the context of a current sequence item.
 */
export interface IEnumerableItemContext<T> {
    /**
     * Gets or sets if operation should be cancelled or not.
     */
    cancel?: boolean;
    /**
     * Gets the zero based index.
     */
    index?: number;
    /**
     * Gets the underlying item.
     */
    item: T;
    /**
     * Gets the underlying key.
     */
    key: any;
    /**
     * Gets the underlying sequence.
     */
    sequence: IEnumerable<T>;
}
/**
 * Describes an ordered sequence.
 */
export interface IOrderedEnumerable<T> extends IEnumerable<T> {
    /**
     * Performs a subsequent ordering of the elements in that sequence in ascending order,
     * using the values itself as keys.
     *
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws The comparer is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    then(comparer?: any): IOrderedEnumerable<T>;
    /**
     * Performs a subsequent ordering of the elements in that sequence in ascending order, according to a key.
     *
     * @param any selector The key selector.
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws At least one argument is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    thenBy(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /**
     * Performs a subsequent ordering of the elements in that sequence in descending order, according to a key.
     *
     * @param any selector The key selector.
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws At least one argument is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    thenByDescending(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /**
     * Performs a subsequent ordering of the elements in that sequence in descending order,
     * using the values as keys.
     *
     * @param any [comparer] The custom key comparer to use.
     *
     * @throws The comparer is invalid.
     *
     * @return {IOrderedEnumerable} The new sequence.
     */
    thenDescending(comparer?: any): IOrderedEnumerable<T>;
}
/**
 * A basic sequence.
 */
export declare abstract class Sequence<T> implements IEnumerable<T> {
    /**
     * The custom selector.
     */
    protected _selector: (x: T) => any;
    /** @inheritdoc */
    aggregate(accumulator: any, defaultValue?: any): any;
    /** @inheritdoc */
    all(predicate: any): boolean;
    /** @inheritdoc */
    any(predicate?: any): boolean;
    /** @inheritdoc */
    average(defaultValue?: any): any;
    /** @inheritdoc */
    cast(type: string): IEnumerable<any>;
    /** @inheritdoc */
    concat(second: any): IEnumerable<T>;
    /** @inheritdoc */
    contains(item: T, equalityComparer?: any): boolean;
    /** @inheritdoc */
    count(predicate?: any): number;
    /** @inheritdoc */
    current: T;
    /** @inheritdoc */
    defaultIfEmpty(...defaultItems: T[]): IEnumerable<T>;
    /** @inheritdoc */
    distinct(equalityComparer?: any): IEnumerable<T>;
    /** @inheritdoc */
    each(action: any): any;
    /** @inheritdoc */
    elementAt(index: number): T;
    /** @inheritdoc */
    elementAtOrDefault(index: number, defaultValue?: any): any;
    /** @inheritdoc */
    except(second: any, equalityComparer?: any): IEnumerable<T>;
    /** @inheritdoc */
    first(predicate?: any): T;
    /** @inheritdoc */
    firstOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any;
    /**
     * Gets the current item.
     *
     * @return any The current item.
     */
    protected abstract getCurrent(): any;
    /** @inheritdoc */
    groupBy<K>(keySelector: any, keyEqualityComparer?: any): IEnumerable<IGrouping<K, T>>;
    /** @inheritdoc */
    groupJoin<U>(inner: any, outerKeySelector: any, innerKeySelector: any, resultSelector: any, keyEqualityComparer?: any): IEnumerable<U>;
    /** @inheritdoc */
    intersect(second: any, equalityComparer?: any): IEnumerable<T>;
    /** @inheritdoc */
    isValid: boolean;
    /** @inheritdoc */
    itemKey: any;
    /** @inheritdoc */
    join<U>(inner: any, outerKeySelector: any, innerKeySelector: any, resultSelector: any, keyEqualityComparer?: any): IEnumerable<any>;
    /** @inheritdoc */
    last(predicate?: any): any;
    /** @inheritdoc */
    lastOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any;
    /** @inheritdoc */
    max(defaultValue?: any): any;
    /** @inheritdoc */
    min(defaultValue?: any): any;
    /** @inheritdoc */
    abstract moveNext(): boolean;
    /** @inheritdoc */
    ofType(type: string): IEnumerable<T>;
    /** @inheritdoc */
    order(comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    orderBy(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    orderByDescending(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    orderDescending(comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    pushToArray(arr: T[] | ObservableArray<T>): Sequence<T>;
    /** @inheritdoc */
    abstract reset(): any;
    /** @inheritdoc */
    reverse(): IEnumerable<T>;
    /** @inheritdoc */
    select<U>(selector: any): IEnumerable<U>;
    /**
     * Projects an item to another type based on the inner selector.
     *
     * @param {T} x The input value.
     *
     * @return any The output value.
     */
    protected selectInner(item: T): any;
    /** @inheritdoc */
    selectMany<U>(selector: any): IEnumerable<U>;
    /** @inheritdoc */
    sequenceEqual(other: any, equalityComparer?: any): boolean;
    /** @inheritdoc */
    single(predicate?: any): T;
    /** @inheritdoc */
    singleOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any;
    /** @inheritdoc */
    skip(cnt: number): IEnumerable<T>;
    /** @inheritdoc */
    skipLast(): IEnumerable<T>;
    /** @inheritdoc */
    skipWhile(predicate: any): IEnumerable<T>;
    /** @inheritdoc */
    sum(defaultValue?: any): any;
    /** @inheritdoc */
    take(cnt: number): IEnumerable<T>;
    /** @inheritdoc */
    takeWhile(predicate: any): IEnumerable<T>;
    /** @inheritdoc */
    toArray(): T[];
    /** @inheritdoc */
    toLookup(keySelector: any, keyEqualityComparer?: any): any;
    /** @inheritdoc */
    toObject(keySelector?: any): any;
    /** @inheritdoc */
    toObservable(keySelector?: any): Observable;
    /** @inheritdoc */
    toObservableArray(): ObservableArray<T>;
    /** @inheritdoc */
    toVirtualArray(): VirtualArray<T>;
    /** @inheritdoc */
    union(second: any, equalityComparer?: any): IEnumerable<T>;
    /** @inheritdoc */
    where(predicate: any): IEnumerable<T>;
    /** @inheritdoc */
    zip<U>(second: any, selector: any): IEnumerable<U>;
}
/**
 * A grouping.
 */
export declare class Grouping<K, T> extends Sequence<T> implements IGrouping<K, T> {
    private _key;
    private _seq;
    /**
     * Initializes a new instance of that class.
     *
     * @param {K} key The key.
     * @param {IEnumerable} seq The items of the grouping.
     */
    constructor(key: K, seq: IEnumerable<T>);
    /** @inheritdoc */
    protected getCurrent(): T;
    /** @inheritdoc */
    isValid: boolean;
    /** @inheritdoc */
    key: K;
    /** @inheritdoc */
    moveNext(): boolean;
    /** @inheritdoc */
    reset(): any;
}
/**
 * An ordered sequence.
 */
export declare class OrderedSequence<T> extends Sequence<T> implements IOrderedEnumerable<T> {
    private _items;
    private _originalItems;
    private _orderComparer;
    private _orderSelector;
    /**
     * Initializes a new instance of that class.
     *
     * @param {IEnumerable} seq The source sequence.
     * @param {Function} selector The selector for the sort values.
     * @param {Function} comparer The comparer to use.
     */
    constructor(seq: IEnumerable<T>, selector: any, comparer: any);
    /**
     * Gets the comparer.
     */
    comparer: (x: any, y: any) => number;
    /** @inheritdoc */
    protected getCurrent(): T;
    /** @inheritdoc */
    moveNext(): boolean;
    /** @inheritdoc */
    reset(): any;
    /**
     * Gets the selector.
     */
    selector: (x: T) => any;
    /** @inheritdoc */
    then(comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    thenBy(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    thenByDescending(selector: any, comparer?: any): IOrderedEnumerable<T>;
    /** @inheritdoc */
    thenDescending(comparer?: any): IOrderedEnumerable<T>;
}
/**
 * Returns a value as sequence.
 *
 * @param any v The input value.
 * @param {Boolean} [throwException] Throws an exception if input value is no valid value.
 *
 * @throws Invalid value.
 *
 * @return any The value as sequence or (false) if input value is no valid object.
 */
export declare function asEnumerable(v: any, throwException?: boolean): IEnumerable<any>;
/**
 * Returns a value as function.
 *
 * @param any v The value to convert. Can be a function or a string that is handled as lambda expression.
 * @param {Boolean} [throwException] Throw an exception if value is no valid function or not.
 *
 * @throws Value is no valid function / lambda expression.
 *
 * @return {Function} Value as function or (false) if value is invalid.
 */
export declare function asFunc(v: any, throwException?: boolean): any;
/**
 * Creates a new sequence from a list of values.
 *
 * @param any ...items One or more item to add.
 *
 * @return {IEnumerable} The new sequence.
 */
export declare function create<T>(...items: any[]): IEnumerable<T>;
/**
 * Short hand version for 'each' method of a sequence.
 *
 * @param items any The sequence of items to iterate.
 * @param action any The action to invoke for each item.
 *
 * @throws At least one argument is invalid.
 *
 * @return any The result of the last invocation.
 */
export declare function each(items: any, action: any): any;
/**
 * Creates a new sequence from an array.
 *
 * @param {Array} arr The array.
 *
 * @return {IEnumerable} The new sequence.
 */
export declare function fromArray<T>(arr?: T[] | ObservableArray<T> | VirtualArray<T> | IArguments | string): IEnumerable<T>;
/**
 * Creates a new sequence from an object.
 *
 * @param {Object} obj The object.
 *
 * @return {Sequence} The new sequence.
 */
export declare function fromObject(obj?: any): IEnumerable<any>;
/**
 * Checks if a value is a sequence.
 *
 * @param any v The value to check.
 *
 * @return {Boolean} Is sequence or not.
 */
export declare function isEnumerable(v: any): boolean;
/**
 * Short hand version for 'order(By)' methods of a sequence.
 *
 * @param items any The sequence of items to iterate.
 * @param [comparer] any The custom comparer to use.
 * @param [selector] any The custom key selector to use.
 *
 * @throws At least one argument is invalid.
 *
 * @return {IOrderedEnumerable} The sequences with the sorted items.
 */
export declare function sort<T>(items: any, comparer?: any, selector?: any): IOrderedEnumerable<T>;
/**
 * Short hand version for 'order(By)Descending' methods of a sequence.
 *
 * @param items any The sequence of items to iterate.
 * @param [comparer] any The custom comparer to use.
 * @param [selector] any The custom key selector to use.
 *
 * @throws At least one argument is invalid.
 *
 * @return {IOrderedEnumerable} The sequences with the sorted items.
 */
export declare function sortDesc<T>(items: any, comparer?: any, selector?: any): IOrderedEnumerable<T>;
/**
 * Returns a value as comparer.
 *
 * @param any predicate The input value.
 *
 * @throws Input value is no valid function / lambda expression.
 *
 * @return {Function} Input value as comparer.
 */
export declare function toComparerSafe(comparer: any): any;
/**
 * Returns a value as equality comparer.
 *
 * @param any equalityComparer The input value.
 *
 * @throws Input value is no valid function / lambda expression.
 *
 * @return {Function} Input value as equality comparer.
 */
export declare function toEqualityComparerSafe(equalityComparer: any): any;
/**
 * Returns a value as predicate.
 *
 * @param any predicate The input value.
 *
 * @throws Input value is no valid function / lambda expression.
 *
 * @return {Function} Input value as predicate.
 */
export declare function toPredicateSafe(predicate: any): any;
