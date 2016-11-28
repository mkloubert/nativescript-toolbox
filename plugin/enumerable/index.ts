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

import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";
import TypeUtils = require("utils/types");
import {VirtualArray} from "data/virtual-array";

/**
 * Regular expression for trimming a string
 * at the beginning and the end.
 */
export const REGEX_TRIM: RegExp = /^\s+|\s+$/gm;

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
    groupJoin<U>(inner: any,
                 outerKeySelector: any, innerKeySelector: any,
                 resultSelector: any,
                 keyEqualityComparer?: any): IEnumerable<U>;

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
    join<U>(inner: any,
            outerKeySelector: any, innerKeySelector: any,
            resultSelector: any,
            keyEqualityComparer?: any);

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
    reset();
    
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
export abstract class Sequence<T> implements IEnumerable<T> {
    /**
     * The custom selector.
     */
    protected _selector: (x: T) => any;

    /** @inheritdoc */
    public aggregate(accumulator: any, defaultValue?: any) {
        var acc: (result: any, x: T, index: number, ctx: IEnumerableItemContext<T>) => any = asFunc(accumulator);
        
        var index = -1;
        var aggResult = defaultValue;
        var isFirst = true;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext<T>(this, ++index);
            
            if (!isFirst) {
                aggResult = acc(aggResult,
                                ctx.item, ctx.index, ctx);
            }
            else {
                aggResult = ctx.item;
                isFirst = false;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return aggResult;
    }

    /** @inheritdoc */
    public all(predicate: any): boolean {
        predicate = asFunc(predicate);
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext<T>(this, ++index);

            if (!predicate(ctx.item, ctx.index, ctx)) {
                return false;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return true;
    }

    /** @inheritdoc */
    public any(predicate?: any): boolean {
        predicate = toPredicateSafe(predicate);
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext<T>(this, ++index);

            if (predicate(ctx.item, ctx.index, ctx)) {
                return true;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return false;
    }

    /** @inheritdoc */
    public average(defaultValue?: any): any {
        var cnt = 0;
        var sum = 0;
        while (this.moveNext()) {
            sum += parseFloat("" + this.current);
            ++cnt;
        }
    
        return cnt > 0 ? (sum / cnt)
                       : defaultValue;
    }

    /** @inheritdoc */
    public cast(type: string): IEnumerable<any> {
        if (type !== null) {
            if (TypeUtils.isUndefined(type)) {
                type = '';
            }
            else {
                type = type.replace(REGEX_TRIM, '');
            }
        }
        
        return this.select(function(x) {        
            if (typeof x === type) {
                return x;
            }
            
            if (type === null) {
                return null;
            }
            
            switch (type) {
                case '':
                    return x;
                    
                case 'null':
                    return null;
                
                case 'undefined':
                    return undefined;
                
                case 'number':
                    if (!x) {
                        return 0.0;    
                    }
                    if (!isNaN(x)) {
                        return x;
                    }
                    return parseFloat(x);
                    
                case 'float':
                    if (!x) {
                        return 0.0;    
                    }
                    return parseFloat(x);
                
                case 'int':
                case 'integer':
                    if (!x) {
                        return 0;    
                    }
                    return parseInt(x);
                    
                case 'str':
                case 'string':
                    if (!x) {
                        return "";
                    }
                    return "" + x;
                    
                case 'enumerable':
                case 'seq':
                case 'sequence':
                    return asEnumerable(x);
                    
                case 'array':
                case 'Array':
                    return asEnumerable(x).toArray();
                
                case 'Observable':
                case 'observable':
                    return asEnumerable(x).toObservable();
                    
                case 'observablearray':
                case 'observableArray':
                case 'ObservableArray':
                    return asEnumerable(x).toObservableArray();
                    
                case 'bool':
                case 'boolean':
                    return x ? true : false;
                    
                case 'func':
                case 'function':
                    return function() { return x; };
                
                default:
                    throw "Cannot not cast '" + x + "' to '" + type + "'!";
            }
        });
    }

    /** @inheritdoc */
    public concat(second: any): IEnumerable<T> {  
        var newItems: T[] = [];
        
        var appendItems = function(seq: IEnumerable<T>) {
            while (seq.moveNext()) {
                newItems.push(seq.current);
            }
        };
        
        appendItems(this);
        appendItems(asEnumerable(second));
        
        return fromArray(newItems);
    }

    /** @inheritdoc */
    public contains(item: T, equalityComparer?: any): boolean {
        equalityComparer = toEqualityComparerSafe(equalityComparer);
        
        return this.any((x: T) => equalityComparer(x, item));
    }

    /** @inheritdoc */
    public count(predicate?: any): number {
        predicate = toPredicateSafe(predicate);

        var index = -1;
        var cnt = 0;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);

            if (predicate(ctx.item, ctx.index, ctx)) {
                ++cnt;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return cnt;
    }

    /** @inheritdoc */
    public get current(): T {
        return this.selectInner(this.getCurrent());
    }

    /** @inheritdoc */
    public defaultIfEmpty(...defaultItems: T[]): IEnumerable<T> {
        if (!this.isValid) {
            return fromArray(arguments);
        }

        return this;
    }

    /** @inheritdoc */
    public distinct(equalityComparer?: any): IEnumerable<T> {
        equalityComparer = toEqualityComparerSafe(equalityComparer);
        
        var distinctedItems: T[] = [];
        
        while (this.moveNext()) {
            var curItem = this.current;
            
            var alreadyInList = false;
            for (var i = 0; i < distinctedItems.length; i++) {
                if (equalityComparer(curItem, distinctedItems[i])) {
                    alreadyInList = true;
                    break;
                }
            }
            
            if (!alreadyInList) {
                distinctedItems.push(curItem);
            }
        }
        
        return fromArray(distinctedItems);
    }

    /** @inheritdoc */
    public each(action: any): any {
        action = asFunc(action);
    
        var index = -1;
        var result;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            result = action(ctx.item, ctx.index, ctx);

            if (ctx.cancel) {
                break;
            }
        }
        
        return result;
    }

    /** @inheritdoc */
    public elementAt(index: number): T {
        return this.first((x: T, i: number) => {
            return i == index;
        });
    }

    /** @inheritdoc */
    public elementAtOrDefault(index: number, defaultValue?: any): any {
        return this.firstOrDefault((x: T, i: number) => {
            return i == index;
        }, defaultValue);
    }

    /** @inheritdoc */
    public except(second: any, equalityComparer?: any): IEnumerable<T> {
        var ec: (x: T, y: T) => boolean = toEqualityComparerSafe(equalityComparer);
        
        second = asEnumerable(second).distinct(ec)
                                     .toArray();
            
        var newItems: T[] = [];
            
        while (this.moveNext()) {
            var curItem = this.current;
            
            var found = false;
            for (var i = 0; i < second.length; i++) {
                var secondItem = second[i];
                if (ec(curItem, secondItem)) {
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                newItems.push(curItem);
            }
        }
        
        return fromArray(newItems);
    }

    /** @inheritdoc */
    public first(predicate?: any): T {
        predicate = toPredicateSafe(predicate);
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            if (predicate(ctx.item, ctx.index, ctx)) {
                return ctx.item;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        throw "Sequence contains NO element!";
    }

    /** @inheritdoc */
    public firstOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any {
        var odObj = createObjectForOrDefaultMethod<T>(arguments);
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                return ctx.item;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return odObj.defaultValue;
    }

    /**
     * Gets the current item.
     * 
     * @return any The current item.
     */
    protected abstract getCurrent(): any;

    /** @inheritdoc */
    public groupBy<K>(keySelector: any, keyEqualityComparer?: any): IEnumerable<IGrouping<K, T>> {
        var ks: (x: T, index: number, ctx: IEnumerableItemContext<T>) => K = asFunc(keySelector);
        var kc: (x: K, y: K) => boolean = toEqualityComparerSafe(keyEqualityComparer);
        
        var index = -1;
        var groupList = [];
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            var key = ks(ctx.item, ctx.index, ctx);
            
            var grp = null;
            for (var i = 0; i < groupList.length; i++) {
                var g = groupList[i];
                
                if (kc(g.key, key)) {
                    grp = g;
                    break;
                }
            }
            
            if (null === grp) {
                grp = {
                    key: key,
                    values: []
                };
                
                groupList.push(grp);
            }
            
            grp.values.push(ctx.item);

            if (ctx.cancel) {
                break;
            }
        }
        
        return fromArray(groupList.map((x: { key: any, values: T[] }) => {
            return new Grouping<K, T>(x.key,
                                      asEnumerable(x.values));
        }));
    }

    /** @inheritdoc */
    public groupJoin<U>(inner: any,
                        outerKeySelector: any, innerKeySelector: any,
                        resultSelector: any,
                        keyEqualityComparer?: any): IEnumerable<U> {

        inner = asEnumerable(inner);
        
        var rc: (x: T, inner: IEnumerable<T>) => U = asFunc(resultSelector);
        var kc: (x: any, y: any) => boolean = toEqualityComparerSafe(keyEqualityComparer);

        var createGroupsForSequence = (seq, keySelector): { key: any, values: T[] }[] => {
            return seq.groupBy(keySelector)
                      .select((grouping: IGrouping<any, T>) => {
                                  return {
                                      key: grouping.key,
                                      values: grouping.toArray()                                   
                                  };
                              })
                      .toArray();
        };

        var outerGroups = createGroupsForSequence(this, outerKeySelector);
        var innerGroups = createGroupsForSequence(inner, innerKeySelector);
        
        var joinedItems: U[] = [];
        
        for (var i = 0; i < outerGroups.length; i++) {
            var outerGrp = outerGroups[i];
            
            for (var ii = 0; ii < innerGroups.length; ii++) {
                var innerGrp = innerGroups[ii];
                
                if (!kc(outerGrp.key, innerGrp.key)) {
                    continue;
                }
                
                for (var iii = 0; iii < outerGrp.values.length; iii++) {
                    joinedItems.push(rc(outerGrp.values[iii],
                                        fromArray<T>(innerGrp.values)));
                }
            }
        }
        
        return fromArray(joinedItems);
    }

    /** @inheritdoc */
    public intersect(second: any, equalityComparer?: any): IEnumerable<T> {
        var ec: (x: T, y: T) => boolean = toEqualityComparerSafe(equalityComparer);
        
        second = asEnumerable(second).distinct(ec)
                                     .toArray();
            
        var newItems: T[] = [];
            
        while (this.moveNext()) {
            var curItem = this.current;
            
            for (var i = 0; i < second.length; i++) {
                var secondItem = second[i];
                if (ec(curItem, secondItem)) {
                    newItems.push(curItem);
                    
                    break;
                }
            }
        }
        
        return fromArray(newItems);
    }

    /** @inheritdoc */
    public isValid: boolean;
    
    /** @inheritdoc */
    public itemKey: any;

    /** @inheritdoc */
    public join<U>(inner: any,
                   outerKeySelector: any, innerKeySelector: any,
                   resultSelector: any,
                   keyEqualityComparer?: any) {

        inner = asEnumerable(inner);

        var rc: (x: T, y: T) => U = asFunc(resultSelector);
        var kc: (x: any, y: any) => boolean = toEqualityComparerSafe(keyEqualityComparer);

        var createGroupsForSequence = function(seq, keySelector) {
            return seq.groupBy(keySelector)
                      .select((grouping: IGrouping<any, T>) => {
                                  return {
                                      key: grouping.key,
                                      values: grouping.toArray()                                   
                                  };
                              })
                      .toArray();
        };

        var outerGroups = createGroupsForSequence(this, outerKeySelector);
        var innerGroups = createGroupsForSequence(inner, innerKeySelector);
        
        var joinedItems = [];
        
        for (var i = 0; i < outerGroups.length; i++) {
            var outerGrp = outerGroups[i];
            
            for (var ii = 0; ii < innerGroups.length; ii++) {
                var innerGrp = innerGroups[ii];
                
                if (!kc(outerGrp.key, innerGrp.key)) {
                    continue;
                }
                
                for (var iii = 0; iii < outerGrp.values.length; iii++) {
                    for (var iv = 0; iv < innerGrp.values.length; iv++) {
                        joinedItems.push(rc(outerGrp.values[iii],
                                            innerGrp.values[iv]));
                    }
                }
            }
        }
        
        return fromArray(joinedItems);
    }

    /** @inheritdoc */
    public last(predicate?: any): any {
        predicate = toPredicateSafe(predicate);
        
        var index = -1;
        var lastItem;
        var found = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);

            if (predicate(ctx.item, ctx.index, ctx)) {
                lastItem = ctx.item;
                found = true;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        if (!found) {
            throw "Sequence contains NO element!";
        }

        return lastItem;
    }

    /** @inheritdoc */
    public lastOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any {
        var odObj = createObjectForOrDefaultMethod(arguments);
    
        var index = -1;
        var lastItem = odObj.defaultValue;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                lastItem = ctx.item;
            }

            if (ctx.cancel) {
                break;
            }
        }

        return lastItem;
    }

    /** @inheritdoc */
    public max(defaultValue?: any): any {
        return this.aggregate(function(result, x) {
            if (x > result) {
                result = x;
            }
            
            return result;
        }, defaultValue);
    }

    /** @inheritdoc */
    public min(defaultValue?: any): any {
        return this.aggregate(function(result, x) {
            if (x < result) {
                result = x;
            }
            
            return result;
        }, defaultValue);
    }

    /** @inheritdoc */
    public abstract moveNext(): boolean;

    /** @inheritdoc */
    public ofType(type: string) {
        type = type.replace(REGEX_TRIM, '');
        
        var checkType = function(x) {
            return typeof x === type;    
        };
        
        switch (type) {
            case 'bool':
                type = 'boolean';
                break;
                
            case 'float':
            case 'int':
            case 'integer':
                type = 'number';
                break;
                
            case 'str':
                type = 'string';
                break;
                
            case 'enumerable':
            case 'seq':
            case 'sequence':
                checkType = function(x) {
                    return isEnumerable(x);
                };
                break;
        }
        
        return this.where(checkType);
    }

    /** @inheritdoc */
    public order(comparer?: any): IOrderedEnumerable<T> {
        return this.orderBy('x => x', comparer);
    }

    /** @inheritdoc */
    public orderBy(selector: any, comparer?: any): IOrderedEnumerable<T> {
        return new OrderedSequence(this, selector, comparer);
    }

    /** @inheritdoc */
    public orderByDescending(selector: any, comparer?: any): IOrderedEnumerable<T> {
        var c: (x: T, y: T) => number = toComparerSafe(comparer);
    
        return this.orderBy(selector,
                           (x: T, y: T): number => {
                               return c(y, x);
                           });
    }

    /** @inheritdoc */
    public orderDescending(comparer?: any): IOrderedEnumerable<T> {
        return this.orderByDescending('x => x', comparer);
    }

    /** @inheritdoc */
    public pushToArray(arr: T[] | ObservableArray<T>): Sequence<T> {
        while (this.moveNext()) {
            arr.push(this.current);
        }

        return this;
    }

    /** @inheritdoc */
    public abstract reset();

    /** @inheritdoc */
    public reverse(): IEnumerable<T> {
        var reverseItems: T[] = [];
        while (this.moveNext()) {
            reverseItems.unshift(this.current);
        }
        
        return fromArray(reverseItems);
    }

    /** @inheritdoc */
    public select<U>(selector: any): IEnumerable<U> {
        this._selector = asFunc(selector);
        return <any>this;
    }

    /**
     * Projects an item to another type based on the inner selector.
     * 
     * @param {T} x The input value.
     * 
     * @return any The output value.
     */
    protected selectInner(item: T): any {
        var s = this._selector;
        if (TypeUtils.isNullOrUndefined(s)) {
            s = (x) => x;
        }

        return s(item);
    }

    /** @inheritdoc */
    public selectMany<U>(selector: any): IEnumerable<U> {
        selector = asFunc(selector);
        
        var flattenItems: U[] = [];
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);

            var items = asEnumerable(selector(ctx.item, ctx.index, ctx));
            while (items.moveNext()) {
                flattenItems.push(items.current);
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return fromArray(flattenItems);
    }

    /** @inheritdoc */
    public sequenceEqual(other: any, equalityComparer?: any): boolean {
        var o: IEnumerable<T> = asEnumerable(other);
        var ec: (x:T, y: T) => boolean = toEqualityComparerSafe(equalityComparer);
        
        while (this.moveNext()) {
            var x = this.current;
            
            if (!o.moveNext()) {
                return false;
            }
            
            var y = o.current;
            
            if (!ec(x, y)) {
                return false;
            }
        }
        
        if (o.moveNext()) {
            return false;
        }
        
        return true;
    }

    /** @inheritdoc */
    public single(predicate?: any): T {
        predicate = toPredicateSafe(predicate);

        var index = -1;
        var item;
        var found = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);

            if (predicate(ctx.item, ctx.index, ctx)) {
                if (found) {
                    throw "Sequence contains more that one matching element!";
                }
                
                item = this.current;
                found = true;
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        if (!found) {
            throw "Sequence contains NO element!";
        }

        return item;
    }

    /** @inheritdoc */
    public singleOrDefault(predicateOrDefaultValue?: any, defaultValue?: any): any {
        var odObj = createObjectForOrDefaultMethod(arguments);
        
        var item = odObj.defaultValue;
        
        var index = -1;
        var found = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);

            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                if (found) {
                    throw "Sequence contains more that one matching element!";
                }
                
                item = this.current;
                found = true;
            }

            if (ctx.cancel) {
                break;
            }
        }

        return item;
    }

    /** @inheritdoc */
    public skip(cnt: number): IEnumerable<T> {
        return this.skipWhile(function() {
            if (cnt > 0) {
                --cnt;
                return true;
            }    
            
            return false;
        });
    }

    /** @inheritdoc */
    public skipLast(): IEnumerable<T> {
        var hasRemainingItems;
        var isFirst = true;
        var item;

        var newItemList: T[] = [];

        do
        {
            hasRemainingItems = this.moveNext();
            if (!hasRemainingItems) {
                continue;
            }

            if (!isFirst) {
                newItemList.push(item);
            }
            else {
                isFirst = false;
            }

            item = this.current;
        }
        while (hasRemainingItems);

        return fromArray(newItemList);
    }

    /** @inheritdoc */
    public skipWhile(predicate: any): IEnumerable<T> {
        predicate = asFunc(predicate);
        
        var newItems: T[] = [];
        
        var index = -1;
        var flag = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            if (!flag && !predicate(ctx.item, ctx.index, ctx)) {
                flag = true;
            }
            
            if (flag) {
                newItems.push(ctx.item);
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return fromArray(newItems);
    }

    /** @inheritdoc */
    public sum(defaultValue?: any): any {
        return this.aggregate((result, x) => {
            return result + x;
        }, defaultValue);
    }

    /** @inheritdoc */
    public take(cnt: number): IEnumerable<T> {
        return this.takeWhile(function() {
            if (cnt > 0) {
                --cnt;
                return true;
            }    
            
            return false;
        });
    }
    
    /** @inheritdoc */
    public takeWhile(predicate: any): IEnumerable<T> {
        predicate = asFunc(predicate);
    
        var newItems: T[] = [];
    
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
        
            if (!predicate(ctx.item, ctx.index, ctx)) {
                break;
            }
        
            newItems.push(ctx.item);

            if (ctx.cancel) {
                break;
            }
        }
    
        return fromArray(newItems);
    }

    /** @inheritdoc */
    public toArray(): T[] {
        var arr = [];
        while (this.moveNext()) {
            arr.push(this.current);
        }
        
        return arr;
    }

    /** @inheritdoc */
    public toLookup(keySelector: any, keyEqualityComparer?: any): any {
        var lu = {};
        this.groupBy(keySelector, keyEqualityComparer)
            .each(function(grouping: IGrouping<any, T>) {
                      lu[grouping.key] = grouping;
                  });
    
        return lu;
    }

    /** @inheritdoc */
    public toObject(keySelector?: any): any {
        if (arguments.length < 1) {
            keySelector = function(x: T, index: number, key: any) {
                return key;
            };
        }
        
        var ks: (x: T, index: number, key: any) => any = asFunc(keySelector);

        var obj = {};
        
        this.each(function(x, index, ctx) {
            var key = ks(x, index, ctx.key);
            obj[key] = x;
        });
        
        return obj;
    }

    /** @inheritdoc */
    public toObservable(keySelector?: any): Observable {
        if (arguments.length < 1) {
            keySelector = function(x: T, index: number, key: any) {
                return key;
            };
        }
        
        var ks: (x: T, index: number, key: any) => any = asFunc(keySelector);

        var ob = new Observable();
        
        this.each(function(x, index, ctx) {
            var key = ks(x, index, ctx.key);
            ob.set(key, x);
        });
        
        return ob;
    }

    /** @inheritdoc */
    public toObservableArray(): ObservableArray<T> {
        return new ObservableArray(this.toArray());
    }

    /** @inheritdoc */
    public toVirtualArray(): VirtualArray<T> {
        var arr = this.toArray();

        var va = new VirtualArray<T>(arr.length);
        for (var i = 0; i < va.length; i++) {
            va.setItem(i, arr[i]);
        }

        return va;
    }

    /** @inheritdoc */
    public union(second: any, equalityComparer?: any): IEnumerable<T> {
        return this.concat(second)
                   .distinct(equalityComparer);
    }

    /** @inheritdoc */
    public where(predicate: any): IEnumerable<T> {
        predicate = asFunc(predicate);

        var filteredItems: T[] = [];
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            
            if (predicate(ctx.item, ctx.index, ctx)) {
                filteredItems.push(ctx.item);
            }

            if (ctx.cancel) {
                break;
            }
        }
        
        return fromArray(filteredItems);
    }

    /** @inheritdoc */
    public zip<U>(second: any, selector: any): IEnumerable<U> {
        second = asEnumerable(second);
        selector = asFunc(selector);
        
        var zippedItems: U[] = [];
        
        var index = -1;
        while (this.moveNext() && second.moveNext()) {
            ++index;
            
            var ctx1 = new EnumerableItemContext(this, index);
            var ctx2 = new EnumerableItemContext(second, index);
            
            var zipped = selector(ctx1.item, ctx2.item,
                                  index,
                                  ctx1, ctx2);
                                
            zippedItems.push(zipped);

            if (ctx1.cancel || ctx2.cancel) {
                break;
            }
        }
        
        return fromArray(zippedItems);
    }
}

class ArrayEnumerable<T> extends Sequence<T> implements IEnumerable<T> {
    protected _arr: T[] | ObservableArray<T> | VirtualArray<T> | IArguments | string;
    protected _getter: (index: number) => T;
    protected _index;

    constructor(arr: T[] | ObservableArray<T> | VirtualArray<T> | IArguments | string,
                getter: (index: number) => T) {

        super();

        this._arr = arr;
        this._getter = getter;

        this.reset();
    }

    protected getCurrent(): any {
        return this._getter(this._index);
    }

    public get isValid(): boolean {
        return (this._index + 1) < this._arr.length;
    }

    public get itemKey(): number {
        return this._index;
    }

    public moveNext(): boolean {
        if (this.isValid) {
            ++this._index;
            return true;
        }

        return false;
    }

    public reset() {
        this._index = -1;
    }
}

class EnumerableItemContext<T> implements IEnumerableItemContext<T> {
    private _index: number;
    private _seq: IEnumerable<T>;
    
    constructor(seq: IEnumerable<T>, index?: number) {
        this._seq = seq;
        this._index = index;
    }

    public cancel: boolean = false;

    public get index(): number {
        return this._index;
    }

    public get item(): T {
        return this._seq.current;
    }

    public get key(): any {
        return this._seq.itemKey;
    }

    public get sequence(): IEnumerable<T> {
        return this._seq;
    }
}

/**
 * A grouping.
 */
export class Grouping<K, T> extends Sequence<T> implements IGrouping<K, T> {
    private _key: K;
    private _seq: IEnumerable<T>;
    
    /**
     * Initializes a new instance of that class.
     * 
     * @param {K} key The key.
     * @param {IEnumerable} seq The items of the grouping.
     */
    constructor(key: K, seq: IEnumerable<T>) {
        super();

        this._key = key;
        this._seq = seq;
    }

    /** @inheritdoc */
    protected getCurrent(): T {
        return this._seq.current;
    }

    /** @inheritdoc */
    public get isValid(): boolean {
        return this._seq.isValid;
    }

    /** @inheritdoc */
    public get key(): K {
        return this._key;
    }

    /** @inheritdoc */
    public moveNext(): boolean {
        return this._seq.moveNext();
    }

    /** @inheritdoc */
    public reset() {
        return this._seq.reset();
    }
}

class ObjectEnumerable extends Sequence<any> {
    private _index: number;
    private _obj: any;
    private _properties: any[];

    constructor(obj: any) {
        super();

        this._properties = [];
        for (var p in obj) {
            this._properties.push(p);
        }

        this.reset();
    }

    protected getCurrent(): any {
        return this._obj[this.itemKey];
    }

    public get isValid(): boolean {
        return (this._index + 1) < this._properties.length;
    }

    public get itemKey(): number {
        return this._properties[this._index];
    }

    public moveNext(): boolean {
        if (this.isValid) {
            ++this._index;
            return true;
        }

        return false;
    }

    public reset() {
        this._index = -1;
    }
}

/**
 * An ordered sequence.
 */
export class OrderedSequence<T> extends Sequence<T> implements IOrderedEnumerable<T> {
    private _items: IEnumerable<T>;
    private _originalItems: T[];
    private _orderComparer: (x: any, y: any) => number;
    private _orderSelector: (x: T) => any;

    /**
     * Initializes a new instance of that class.
     * 
     * @param {IEnumerable} seq The source sequence.
     * @param {Function} selector The selector for the sort values.
     * @param {Function} comparer The comparer to use.
     */
    constructor(seq: IEnumerable<T>, selector: any, comparer: any) {
        super();

        var me = this;

        this._orderComparer = toComparerSafe(comparer);

        if (true === selector) {
            selector = x => x;
        }

        this._orderSelector = asFunc(selector);

        this._originalItems = seq.toArray();

        this._items = fromArray(this._originalItems.map(function(x: T) {
            return {
                sortBy: me.selector(x),
                value: x
            };
        }).sort(function(x: { sortBy: any, value: T },
                         y: { sortBy: any, value: T }) {
            
            return me.comparer(x.sortBy, y.sortBy);
        }).map(function(x: { sortBy: any, value: T }) {
            return x.value;
        }));
    }

    /**
     * Gets the comparer.
     */
    public get comparer(): (x: any, y: any) => number {
        return this._orderComparer;
    }

    /** @inheritdoc */
    protected getCurrent(): T {
        return this._items.current;
    }

    /** @inheritdoc */
    public moveNext(): boolean {
        return this._items
                   .moveNext();
    }

    /** @inheritdoc */
    public reset() {
        return this._items.reset();
    }

    /**
     * Gets the selector.
     */
    public get selector(): (x: T) => any {
        return this._orderSelector;
    }

    /** @inheritdoc */
    public then(comparer?: any): IOrderedEnumerable<T> {
        return this.thenBy('x => x', comparer);
    }

    /** @inheritdoc */
    public thenBy(selector: any, comparer?: any): IOrderedEnumerable<T> {
        var c: (x: any, y: any) => number = toComparerSafe(comparer);
    
        if (true === selector) {
            selector = x => x;
        }

        selector = asFunc(selector);

        var thisSelector = this._orderSelector;
        var thisComparer = this._orderComparer;
    
        return fromArray(this._originalItems)
            .orderBy((x: T): { level_0: any, level_1: any } => {
                        return {
                            level_0: thisSelector(x),
                            level_1: selector(x),
                        };
                    },
                    function(x: { level_0: any, level_1: any }, 
                             y: { level_0: any, level_1: any }): number {
                        
                        var comp0 = thisComparer(x.level_0, y.level_0);
                        if (0 != comp0) {
                            return comp0;
                        }
                        
                        var comp1 = c(x.level_1, y.level_1);
                        if (0 != comp1) {
                            return comp1;
                        }
                        
                        return 0;
                    });
    }

    /** @inheritdoc */
    public thenByDescending(selector: any, comparer?: any): IOrderedEnumerable<T> {
        var c: (x: T, y: T) => number = toComparerSafe(comparer);
    
        return this.thenBy(selector,
                           (x: T, y: T): number => {
                               return comparer(y, x);
                           });
    }

    /** @inheritdoc */
    public thenDescending(comparer?: any): IOrderedEnumerable<T> {
        return this.thenByDescending('x => x', comparer);
    }
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
export function asEnumerable(v: any, throwException: boolean = true): IEnumerable<any> {
    if (isEnumerable(v)) {
        return v;
    }
    
    if ((v instanceof Array) || 
        (v instanceof ObservableArray) ||
        (v instanceof VirtualArray) ||
        (typeof v === 'string') ||
        !v) {
        
        return fromArray(v);
    }

    if (typeof v === 'object') {
        return fromObject(v);
    }
    
    // at this point we have no valid value to use as sequence

    if (throwException) {
        throw "'" + v + "' is no valid value to use as sequence!";    
    }
    
    return <any>false;
}

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
export function asFunc(v: any, throwException: boolean = true): any {
    if (typeof v === "function") {
        return v;
    }

    if (!v) {
        return v;
    }
    
    // now handle as lambda...

    var lambda = "" + v;
    
    var matches = lambda.match(/^(\s*)([\(]?)([^\)]*)([\)]?)(\s*)(=>)/m);
    if (matches) {
        if ((("" === matches[2]) && ("" !== matches[4])) ||
            (("" !== matches[2]) && ("" === matches[4]))) {
            
            if (throwException) {
                throw "Syntax error in '" + lambda + "' expression!";
            }
            
            return null;
        }
        
        var lambdaBody = lambda.substr(matches[0].length)
                               .replace(/^[\s|{|}]+|[\s|{|}]+$/g, '');  // trim
        
        if ("" !== lambdaBody) {
            if (';' !== lambdaBody.substr(-1)) {
                lambdaBody = 'return ' + lambdaBody + ';';
            }
        }
        
        var func;
        eval('func = function(' + matches[3] + ') { ' + lambdaBody + ' };');

        return func;
    }
    
    if (throwException) {
        throw "'" + v + "' is NO valid lambda expression!";
    }

    return false;
}


/**
 * Creates a new sequence from a list of values.
 * 
 * @param any ...items One or more item to add.
 * 
 * @return {IEnumerable} The new sequence.
 */
export function create<T>(...items: any[]): IEnumerable<T> {
    return fromArray<T>(items);
}

function createObjectForOrDefaultMethod<T>(args: IArguments): { defaultValue?: any,
                                                                predicate?: (x: T, index: number, ctx: IEnumerableItemContext<T>) => boolean } {
    var odObj: any = {
        predicate: () => true,
    };
    
    if (args.length > 0) {
        if (args.length < 2) {
            var func = asFunc(args[0], false);
            
            if (typeof func !== "function") {
                odObj.defaultValue = args[0];
            }
            else {
                odObj.predicate = func;
            }
        }
        else {
            odObj.predicate = asFunc(args[0]);
            odObj.defaultValue = args[1];
        }
    }
    
    return odObj;
}

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
export function each(items: any, action: any): any {
    return asEnumerable(items).each(action);
}

/**
 * Creates a new sequence from an array.
 * 
 * @param {Array} arr The array.
 * 
 * @return {IEnumerable} The new sequence.
 */
export function fromArray<T>(arr?: T[] | ObservableArray<T> | VirtualArray<T> | IArguments | string): IEnumerable<T> {
    if (arguments.length < 1) {
        arr = [];
    }

    var getter: (index: number) => T;
    if ((arr instanceof ObservableArray) ||
        (arr instanceof VirtualArray)) {

        getter = (i) => (<any>arr).getItem(i);
    }
    else {
        getter = (i) => arr[i];
    }

    return new ArrayEnumerable<T>(arr, getter);
}

/**
 * Creates a new sequence from an object.
 * 
 * @param {Object} obj The object.
 * 
 * @return {Sequence} The new sequence.
 */
export function fromObject(obj?: any): IEnumerable<any> {
    if (arguments.length < 1) {
        obj = {};
    }

    return new ObjectEnumerable(obj);
}

/**
 * Checks if a value is a sequence.
 * 
 * @param any v The value to check.
 * 
 * @return {Boolean} Is sequence or not.
 */
export function isEnumerable(v: any): boolean {
    return v instanceof Sequence;
}

/**
 * Creates a sequence with a range of items.
 * 
 * @param any start The start value.
 * @param {Number} cnt The number of items to return.
 * @param any [incrementor] The custom function (or value) that increments the current value.
 * 
 * @return {Object} The new sequence.
 */
function range(start: number, cnt: number, incrementor?: any): IEnumerable<number> {
    if (arguments.length < 3) {
        incrementor = (x): number => {
            return x + 1;
        };
    }
    else {
        var funcOrValue = asFunc(incrementor, false);
        if (false === funcOrValue) {
            var incrementBy = incrementor;
        
            incrementor = (x): number => {
                return x + incrementBy;
            };
        }
        else {
            incrementor = funcOrValue;
        }
    }

    var numbers: number[] = [];
    
    var remainingCnt = cnt;
    var val: number = start;
    while (remainingCnt > 0) {
        numbers.push(val);
        
        val = incrementor(val, {
            remainingCount: remainingCnt,
            startValue: start,
            totalCount: cnt
        });
        
        --remainingCnt;
    }
    
    return fromArray(numbers);
}

/**
 * Creates a sequence with a number of specific values.
 * 
 * @param any v The value.
 * @param {Number} cnt The number of items to return.
 * 
 * @return {Object} The new sequence.
 */
function repeat<T>(v: T, cnt: number): IEnumerable<T> {
    var items: T[] = [];

    while (cnt > 0) {
        items.push(v);
        --cnt;
    }
    
    return fromArray(items);
}

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
export function sort<T>(items, comparer?: any, selector?: any): IOrderedEnumerable<T> {
    return asEnumerable(items).orderBy(selector, comparer);
}

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
export function sortDesc<T>(items: any, comparer?: any, selector?: any): IOrderedEnumerable<T> {
    return asEnumerable(items).orderByDescending(selector, comparer);
}

/**
 * Returns a value as comparer.
 * 
 * @param any predicate The input value.
 * 
 * @throws Input value is no valid function / lambda expression.
 * 
 * @return {Function} Input value as comparer.
 */
export function toComparerSafe(comparer: any) {
    comparer = asFunc(comparer);

    if (TypeUtils.isNullOrUndefined(comparer)) {
        return function(x, y) {
            if (x < y) {
                return -1;
            }
            
            if (x > y) {
                return 1;
            }
            
            return 0;
        };
    }
    
    return comparer;
};

/**
 * Returns a value as equality comparer.
 * 
 * @param any equalityComparer The input value.
 * 
 * @throws Input value is no valid function / lambda expression.
 * 
 * @return {Function} Input value as equality comparer.
 */
export function toEqualityComparerSafe(equalityComparer: any) {
    if (true === equalityComparer) {
        return function(x, y) {
            return x === y;    
        };
    }
    
    equalityComparer = asFunc(equalityComparer);

    if (TypeUtils.isNullOrUndefined(equalityComparer)) {
        return function(x, y) {
            return x == y;
        };
    }
    
    return equalityComparer;
}

/**
 * Returns a value as predicate.
 * 
 * @param any predicate The input value.
 * 
 * @throws Input value is no valid function / lambda expression.
 * 
 * @return {Function} Input value as predicate.
 */
export function toPredicateSafe(predicate: any) {
    if (TypeUtils.isNullOrUndefined(predicate)) {
        predicate = () => true;
    }
    
    return asFunc(predicate);
}
