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

import Observable = require("data/observable");
import TypeUtils = require("utils/types");

/**
 * Name of the property for a "real" / non-routed value.
 */
export const INNER_VALUE_PROPERTY = 'innerValue';
/**
 * Name of the property for a routed value.
 */
export const VALUE_PROPERTY = 'value';

/**
 * List of router stradegies.
 */
export enum RouterStradegy {
    /**
     * Take the value from parent (if greater)
     */
    Ascending,

    /**
     * Take the value from parent (if smaller)
     */
    Descending,
}

/**
 * List of values that represent the state of a traffic light.
 */
export enum TraficLightState {
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
export class RoutedValue<T> extends Observable.Observable {
    /**
     * Stores the children.
     */
    protected _children: RoutedValue<T>[] = [];
    /**
     * Stores the comparer for the values.
     */
    protected _comparer: (x: T, y: T) => number;
    /**
     * Stores the "real" inner value of that instance.
     */
    protected _innerValue: T;
    private _name: string;
    /**
     * Stores the parents.
     */
    protected _parents: RoutedValue<T>[] = [];
    /**
     * Stores the stradegy.
     */
    protected _stradegy: RouterStradegy;
    private _tag: any;

    /**
     * Initializes a new instance of that class.
     * 
     * @param {RouterStradegy} [stradegy] The router stradegy.
     * @param {Function} [comparer] The comparer for the values. 
     */
    constructor(stradegy: RouterStradegy = RouterStradegy.Ascending,
                comparer?: (x: T, y: T) => number) {
        super();

        this._stradegy = stradegy;

        this._comparer = comparer;
        if (TypeUtils.isNullOrUndefined(this._comparer)) {
            this._comparer = (x, y): number => {
                if (x < y) {
                    return -1;
                }

                if (x > y) {
                    return 1;
                }

                return 0;
            };
        }
    }

    /**
     * Adds a list of children.
     * 
     * @chainable
     * 
     * @param {RoutedState} ...children One or more child to add.
     */
    public addChildren(...children: RoutedValue<T>[]): RoutedValue<T> {
        return this.addChildArray(children);
    }

    /**
     * Adds a list of children.
     * 
     * @chainable
     * 
     * @param {Array} children The children to add.
     * 
     * @throws A child object is already a parent.
     */
    public addChildArray(children: RoutedValue<T>[]): RoutedValue<T> {
        if (TypeUtils.isNullOrUndefined(children)) {
            return this;
        }

        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (TypeUtils.isNullOrUndefined(c)) {
                continue;
            }

            for (var ii = 0; ii < this._parents.length; ii++) {
                var p = this._children[ii];
                if (<any>p === <any>c) {
                    throw "Child object is already a parent!";
                }
            }

            this._children.push(c);
            c.addParentItem(this, false);
        }

        return this;
    }

    /**
     * Adds a parent item.
     * 
     * @param {RoutedValue} parent The parent item to add.
     * @param {Boolean} addChild Also add that instance as child item for 'parent' or not.
     * 
     * @throws Parent object is already a child.
     */
    protected addParentItem(parent: RoutedValue<T>, addChild: boolean) {
        var me = this;
        
        for (var i = 0; i < me._children.length; i++) {
            var c = me._children[i];
            if (<any>c === parent) {
                throw "Parent object is already a child!";
            }
        }

        if (addChild) {
            parent.addChildren(me);
        }

        parent.on(Observable.Observable.propertyChangeEvent,
                  (e: Observable.PropertyChangeData) => {
                      var sender = <RoutedValue<T>>e.object;
                                
                      switch (e.propertyName) {
                          case VALUE_PROPERTY:
                              if (me.shouldTakeParentValue(sender.value)) {
                                  me.raiseValueChanged();
                              }
                              break;
                      }
                  });

        var oldValue = me.value;

        me._parents.push(parent);

        if (me.shouldTakeParentValue(parent.value, oldValue)) {
            me.raiseValueChanged();
        }
    }

    /**
     * Adds a list of parents.
     * 
     * @chainable
     * 
     * @param {RoutedState} ...parents One or more parent to add.
     */
    public addParents(...parents: RoutedValue<T>[]): RoutedValue<T> {
        return this.addParentArray(parents);
    }

    /**
     * Adds a list of parents.
     * 
     * @chainable
     * 
     * @param {Array} parents The parents to add.
     */
    public addParentArray(parents: RoutedValue<T>[]): RoutedValue<T> {
        if (TypeUtils.isNullOrUndefined(parents)) {
            return this;
        }

        for (var i = 0; i < parents.length; i++) {
            var p = parents[i];
            if (TypeUtils.isNullOrUndefined(p)) {
                continue;
            }

            this.addParentItem(p, true);
        }

        return this;
    }

    /**
     * Gets or sets the "real" (not routed) value of that instance.
     */
    public get innerValue(): T {
        return this._innerValue;
    }
    public set innerValue(newValue: T) {
        var oldInnerValue = this._innerValue;
        var oldValue = this.value;
        
        this._innerValue = newValue;

        if (oldInnerValue !== newValue) {
            this.notifyPropertyChange(INNER_VALUE_PROPERTY, newValue);
        }

        if (oldValue !== this.value) {
            this.raiseValueChanged();
        }
    }

    /**
     * Gets or sets the name of that instance.
     */
    public get name(): string {
        return this._name;
    }
    public set name(newValue: string) {
        var oldValue = this._name;
        this._name = newValue;

        if (newValue !== oldValue) {
            this.notifyPropertyChange('name', newValue);
        }
    }

    /**
     * Hooks a changed event listener for 'value' property.
     * 
     * @param {Function} listener The listener to register.
     * 
     * @return {Function} The underlying 'hook' function that has been used for 'on' method.
     */
    public onValueChanged(listener: (newValue: T, object: RoutedValue<T>) => void): (e: Observable.PropertyChangeData) => void {
        if (TypeUtils.isNullOrUndefined(listener)) {
            return;
        }

        var propertyChange = (e: Observable.PropertyChangeData) => { 
            switch (e.propertyName) {
                case VALUE_PROPERTY:
                    listener(e.value, <RoutedValue<T>>e.object);
                    break;
            }
        };

        this.on(Observable.Observable.propertyChangeEvent,
                propertyChange);

        return propertyChange;
    }

    /**
     * Raises the property change event for the value property.
     */
    public raiseValueChanged() {
        var thisValue = this.value;

        this.notifyPropertyChange(VALUE_PROPERTY, thisValue);

        for (var i = 0; i < this._children.length; i++) {
            var c = this._children[i];

            c.raiseValueChanged();
        }
    }

    /**
     * Checks if a parent value should be taken instead of the own one.
     * This depends on the value comparer function that is used by that instance.
     * 
     * @param {T} parentValue The "parent" value.
     * @param {T} [thisValue] The custom value to take that is handled as "own" value.
     * 
     * @return {Boolean} 'parentValue' should be taken or now.
     */
    public shouldTakeParentValue(parentValue: T, thisValue?: T): boolean {
        if (arguments.length < 2) {
            thisValue = this._innerValue;
        }

        var compVal = this._comparer(thisValue, parentValue);
        switch (this.stradegy) {
            case RouterStradegy.Ascending:
                return compVal < 0;  // parent is greater

            case RouterStradegy.Descending:
                return compVal > 0;  // "own" value is greater
        }
    }

    /**
     * Gets the router stradegy.
     */
    public get stradegy(): RouterStradegy {
        return this._stradegy;
    }

    /**
     * Gets or sets an object / value that should be linked with that instance.
     */
    public get tag(): any {
        return this._tag;
    }
    public set tag(newValue: any) {
        var oldValue = this._tag;
        this._tag = newValue;

        if (newValue !== oldValue) {
            this.notifyPropertyChange('tag', newValue);
        }
    }

    /**
     * Gets the routed value.
     */
    public get value(): T {
        var result: T = this._innerValue;

        // check parents
        for (var i = 0; i < this._parents.length; i++) {
            var p = this._parents[i];
            var pVal = p.value;

            if (this.shouldTakeParentValue(pVal, result)) {
                result = pVal;
            }
        }

        return result;
    }
}

/**
 * A routed number.
 */
export class RoutedNumber extends RoutedValue<number> {
    constructor() {
        super();

        this._innerValue = 0;
    }
}

/**
 * A routed traffic light.
 */
export class TrafficLight extends RoutedValue<TraficLightState> {
}
