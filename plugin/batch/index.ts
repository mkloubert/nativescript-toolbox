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

class Batch implements IBatch {
    private _firstOperation: BatchOperation;
    private _invokeFinishedCheckForAll: boolean = false;
    private _invokeStrategy: InvokeStrategy = InvokeStrategy.Automatic;
    private _items: ObservableArray<any>;
    private _name: string;
    private _object: Observable;
    private _operations: BatchOperation[];
    private _result: any;
    private _value: any;
    
    constructor(firstAction : (ctx : IBatchOperationContext) => void) {
        this._items = new ObservableArray<any>();
        this._object = new Observable();
        this._operations = [];
        
        this._firstOperation = new BatchOperation(this, firstAction);
    }
    
    public addItems(...items: any[]) : Batch {
        for (var i = 0; i < items.length; i++) {
            this._items
                .push(items[i]);
        }
        
        return this
    }
    
    public addLogger(action : (ctx : IBatchLogContext) => void) : Batch {
        this.loggers
            .push(action);
        
        return this;
    }
    
    public after(afterAction : (ctx : IBatchOperationContext) => void) : Batch {
        this.afterAction = afterAction;
        return this;
    }
    
    public afterAction : (ctx : IBatchOperationContext) => void;
    
    public before(beforeAction : (ctx : IBatchOperationContext) => void) : Batch {
        this.beforeAction = beforeAction;
        return this;
    }
    
    public beforeAction : (ctx : IBatchOperationContext) => void;

    public get firstOperation() : BatchOperation {
        return this._firstOperation;
    }
    
    public id : string;
    
    public invokeFinishedCheckForAll(flag?: boolean) : Batch {
        this._invokeFinishedCheckForAll = arguments.length < 1 ? true : flag;
        return this;
    }

    public get invokeStrategy(): InvokeStrategy {
        return this._invokeStrategy;
    }
    public set invokeStrategy(newStradegy: InvokeStrategy) {
        this._invokeStrategy = newStradegy;
    }

    public loggers = [];
    
    public get items() : ObservableArray<any> {
        return this._items;
    }
    
    public name : string;
    
    public get object() : Observable {
        return this._object;
    }

    public get operations(): BatchOperation[] {
        return this._operations;
    }

    public setInvokeStrategy(newStradegy: InvokeStrategy) : Batch {
        this._invokeStrategy = newStradegy;
        return this;
    }
    
    public setObjectProperties(properties) : Batch {
        if (!TypeUtils.isNullOrUndefined(properties)) {
            for (var p in properties) {
                this._object.set(p, properties[p]);
            }
        }
        
        return this;
    }
    
    public setResult(value : any) : Batch {
        this._result = value;
        return this;
    }
    
    public setResultAndValue(value : any) : Batch {
        return this.setResult(value)
                   .setValue(value);
    }

    public setValue(value : any) : Batch {
        this._value = value;
        return this;
    }

    public start() : any {
        var finishedFlags: boolean[] = [];
        for (var i = 0; i < this._operations.length; i++) {
            finishedFlags.push(false);
        }
        
        var me = this;
        var result = this._result;
        var previousValue;
        var nextInvokeStradegy: InvokeStrategy;
        var skipWhile : (ctx : IBatchOperationContext) => boolean;
        var value : any = this._value;
        
        var createCheckIfFinishedAction = function(index) {
            return function() {
                finishedFlags[index] = true;
                for (var i = 0; i < finishedFlags.length; i++) {
                    if (!finishedFlags[i]) {
                        return;
                    }
                }
                
                if (!TypeUtils.isNullOrUndefined(me.whenAllFinishedAction)) {
                    var finishedOperation = new BatchOperation(me, me.whenAllFinishedAction,
                                                               false);
                    
                    var ctx = new BatchOperationContext(previousValue);
                    ctx.result = result;
                    ctx.value = value;
                                                  
                    ctx.setExecutionContext(BatchOperationExecutionContext.finished);
                    
                    finishedOperation.action(ctx);
                }
            };
        };

        var invokeNextOperation: (previousIndex: number) => void;
        invokeNextOperation = (previousIndex: number) => {
            var i = previousIndex + 1;
            if (i >= me.operations.length) {
                return; // no more operations
            }

            var ctx = new BatchOperationContext(previousValue,
                                                me.operations, i);
            ctx.result = result;
            ctx.value = value;
            ctx.nextInvokeStradegy = null;

            // invoke stradegy
            var operationInvokeStradegy = nextInvokeStradegy;
            if (TypeUtils.isNullOrUndefined(operationInvokeStradegy)) {
                // use operation's default
                operationInvokeStradegy = ctx.operation.invokeStrategy;
            }
            if (TypeUtils.isNullOrUndefined(operationInvokeStradegy)) {
                // use batch default
                operationInvokeStradegy = me.invokeStrategy;
            }
            if (TypeUtils.isNullOrUndefined(operationInvokeStradegy)) {
                // use default
                operationInvokeStradegy = InvokeStrategy.Automatic;
            }

            var updateNextValues = () => {
                previousValue = ctx.nextValue;
                value = ctx.value;
                result = ctx.result;
                nextInvokeStradegy = ctx.nextInvokeStradegy;
            
                skipWhile = ctx.skipWhilePredicate;
            };

            var updateAndInvokeNextOperation = () => {
                updateNextValues();
                invokeNextOperation(i);
            };

            ctx.invokeNext = (): BatchOperationContext => {
                operationInvokeStradegy = InvokeStrategy.Manually;

                updateAndInvokeNextOperation();
                return ctx;
            };
            
            ctx.checkIfFinishedAction = createCheckIfFinishedAction(i);
            
            if (!TypeUtils.isNullOrUndefined(skipWhile)) {
                if (skipWhile(ctx)) {
                    ctx.checkIfFinishedAction();
                    invokeNextOperation(i);
                    return;
                }
            }
            
            skipWhile = undefined;
            
            var checkIfCancelled = function() {
                if (ctx.cancelled) {
                    ctx.setExecutionContext(BatchOperationExecutionContext.cancelled);
                    
                    if (!TypeUtils.isNullOrUndefined(me.whenCancelledAction)) {
                        me.whenCancelledAction(ctx);
                    }
                    
                    return true;
                }
                
                return false;    
            };
            
            var invokeCompletedAction = function() : boolean {
                ctx.setExecutionContext(BatchOperationExecutionContext.complete);
                
                if (ctx.invokeComplete && ctx.operation.completeAction) {
                    ctx.operation.completeAction(ctx);
                }
                
                if (me._invokeFinishedCheckForAll) {
                    ctx.checkIfFinished();
                }
                
                return !checkIfCancelled();
            };
            
            var handleErrorAction = true;
            try {
                // global "before" action
                if (ctx.invokeBefore && ctx.operation.beforeAction) {
                    ctx.setExecutionContext(BatchOperationExecutionContext.before);
                    ctx.operation.beforeAction(ctx);
                    
                    if (checkIfCancelled()) {
                        return;  // cancelled
                    }
                }
                
                // action to invoke
                if (ctx.invokeAction && ctx.operation.action) {
                    ctx.setExecutionContext(BatchOperationExecutionContext.execution);
                    ctx.operation.action(ctx);
                    
                    if (checkIfCancelled()) {
                        return;  // cancelled
                    }
                }

                // global "after" action
                if (ctx.invokeAfter && ctx.operation.batch.afterAction) {
                    ctx.setExecutionContext(BatchOperationExecutionContext.after);
                    ctx.operation.batch.afterAction(ctx);
                    
                    if (checkIfCancelled()) {
                        return;  // cancelled
                    }
                }
                
                // success action
                if (ctx.invokeSuccess && ctx.operation.successAction) {
                    handleErrorAction = false;
                    
                    ctx.setExecutionContext(BatchOperationExecutionContext.success);
                    ctx.operation.successAction(ctx);
                    
                    if (checkIfCancelled()) {
                        return;  // cancelled
                    }
                }
                
                if (!invokeCompletedAction()) {
                    return;  // cancelled
                }
            }
            catch (e) {
                ctx.setError(e);
                ctx.setExecutionContext(BatchOperationExecutionContext.error);
                
                if (handleErrorAction && ctx.operation.errorAction) {
                    if (ctx.invokeError) {
                        ctx.operation.errorAction(ctx);
                    }
                }
                else {
                    if (!ctx.operation.ignoreOperationErrors) {
                        throw e;
                    }
                }
                
                if (checkIfCancelled()) {
                    return;  // cancelled
                }
                
                if (!invokeCompletedAction()) {
                    return;  // cancelled
                }
            }

            if (operationInvokeStradegy != InvokeStrategy.Automatic) {
                return;
            }

            updateAndInvokeNextOperation();
        };

        invokeNextOperation(-1);
        return result;
    }
    
    public whenAllFinished(action : (ctx : IBatchOperationContext) => void) : Batch {
        this.whenAllFinishedAction = action;
        return this;
    }
    
    public whenAllFinishedAction : (ctx : IBatchOperationContext) => void;
    
    public whenCancelled(action : (ctx : IBatchOperationContext) => void) : Batch {
        this.whenCancelledAction = action;
        return this;
    }
    
    public whenCancelledAction : (ctx : IBatchOperationContext) => void;
}

class BatchLogContext implements IBatchLogContext {
    private _context : BatchOperationContext;
    private _message : any;
    private _time : Date;
    
    constructor(ctx : BatchOperationContext,
                time : Date, msg: any) {
        
        this._context = ctx;
        this._message = msg;
    }
    
    public get batch() : Batch {
        return this.operation.batch;
    }
    
    public get context() : BatchOperationContext {
        return this._context;
    }
    
    public get message() : any {
        return this._message;
    }
    
    public get operation() : BatchOperation {
        return this.context.operation;
    }
    
    public get time() : Date {
        return this._time;
    }
}

class BatchOperation implements IBatchOperation {
    private _batch: Batch;
    private _id: string;
    private _invokeStrategy: InvokeStrategy;
    private _skipBefore: boolean = false;

    constructor(batch : Batch, action : (ctx : IBatchOperationContext) => void,
                appendOperation: boolean = true) {
                    
        this._batch = batch;
        this.action = action;

        if (appendOperation) {
            batch.operations.push(this);
        }
    }
    
    public action : (ctx : IBatchOperationContext) => void;
    
    public addItems(...items: any[]) : BatchOperation {
        for (var i = 0; i < items.length; i++) {
            this._batch.items
                       .push(items[i]);
        }
        
        return this;
    }
    
    public addLogger(action : (ctx : IBatchLogContext) => void) : BatchOperation {
        this._batch.addLogger(action);
        return this;
    }
    
    public after(afterAction : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this._batch.afterAction = afterAction;
        return this;
    }

    public get batch() : Batch {
        return this._batch;
    }
    
    public get batchId() : string {
        return this._batch.id;
    }
    public set batchId(value : string) {
        this._batch.id = value;
    }
    
    public get batchName() : string {
        return this._batch.name;
    }
    public set batchName(value : string) {
        this._batch.name = value;
    }
    
    public before(beforeAction : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this._batch.beforeAction = beforeAction;
        return this;
    }
    
    public get beforeAction() {
        return this._batch.beforeAction;
    }
    
    public complete(completedAction : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this.completeAction = completedAction;
        return this;
    }
    
    public completeAction : (ctx : IBatchOperationContext) => void;
    
    public error(errAction : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this.errorAction = errAction;
        return this;
    }
    
    public errorAction : (ctx : IBatchOperationContext) => void;

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        // check for duplicate
        for (var i = 0; i < this._batch.operations.length; i++) {
            var bo = this._batch.operations[i];
            if (bo === this) {
                continue;
            }

            if (bo.id == value) {
                throw "ID '" + value + "' has already be defined in operation #" + i + "!";
            }
        }

        this._id = value;
    }

    public ignoreErrors(flag? : boolean) : BatchOperation {
        this.ignoreOperationErrors = arguments.length < 1 ? true : flag;
        return this;
    }
    
    public ignoreOperationErrors : boolean = false;
    
    public invokeFinishedCheckForAll(flag?: boolean) : BatchOperation {
        if (arguments.length < 1) {
            this._batch.invokeFinishedCheckForAll();
        }
        else {
            this._batch.invokeFinishedCheckForAll(flag);
        }
        
        return this;
    }

    public get invokeStrategy(): InvokeStrategy {
        return this._invokeStrategy;
    }
    public set invokeStrategy(newStradegy: InvokeStrategy) {
        this._invokeStrategy = newStradegy;
    }
    
    public get items() : ObservableArray<any> {
        return this._batch.items;
    }
    
    public name : string;
        
    public next(action: (ctx : IBatchOperationContext) => void) : BatchOperation {
        return new BatchOperation(this._batch, action);
    }

    public get object() : Observable {
        return this._batch.object;
    }
    
    public setBatchId(value : string) : BatchOperation {
        this._batch.id = value;
        return this;
    }
    
    public setBatchName(value : string) : BatchOperation {
        this._batch.name = value;
        return this;
    }
    
    public setId(value : string) : BatchOperation {
        this.id = value;
        return this;
    }

    public setInvokeStrategy(newStradegy: InvokeStrategy) : BatchOperation {
        this._invokeStrategy = newStradegy;
        return this;
    }
    
    public setName(value : string) : BatchOperation {
        this.name = value;
        return this;
    }
    
    public setObjectProperties(properties) : BatchOperation {
        this._batch.setObjectProperties(properties);
        return this;
    }
    
    public setResult(value : any) : BatchOperation {
        this._batch.setResult(value);
        return this;
    }

    public setResultAndValue(value : any) : BatchOperation {
        this._batch.setResultAndValue(value);
        return this;
    }

    public setValue(value : any) : BatchOperation {
        this._batch.setValue(value);
        return this;
    }
    
    public skipBefore(value? : boolean) : BatchOperation {
        this._skipBefore = arguments.length < 1 ? true : value;
        return this;
    }
    
    public start() {
        this._batch.start();
    }
    
    public success(successAction : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this.successAction = successAction;
        return this;
    }
    
    public successAction : (ctx : IBatchOperationContext) => void;
    
    public then(action : (ctx : IBatchOperationContext) => void) : BatchOperation {
        return this.next(action);
    }
    
    public whenAllFinished(action : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this._batch.whenAllFinishedAction = action;
        return this;
    }
    
    public whenCancelled(action : (ctx : IBatchOperationContext) => void) : BatchOperation {
        this._batch.whenCancelledAction = action;
        return this;
    }
}

class BatchOperationContext implements IBatchOperationContext {
    private _error : any;
    private _index : number;
    private _isLast : boolean;
    private _operation : BatchOperation;
    private _prevValue;
    private _executionContext : BatchOperationExecutionContext;
    private _nextInvokeStradegy: InvokeStrategy;
    
    constructor(previousValue : any,
                operations? : BatchOperation[], index? : number) {
        
        this._index = index;
        
        if (arguments.length > 2) {
            this._operation = operations[index];
            this._isLast = index >= (operations.length - 1);
        }
        
        this._prevValue = previousValue;
        
        this.checkIfFinishedAction = () => { };
    }
    
    public get batch() : Batch {
        return this.operation.batch;
    }
    
    public get batchId() : string {
        return this.operation.batch.id;
    }

    public get batchName() : string {
        return this.operation.batch.name;
    }
    
    public cancel(flag?: boolean) : BatchOperationContext {
        this.cancelled = arguments.length < 1 ? true : flag;
        return this;
    }
    
    public cancelled : boolean = false;
    
    public checkIfFinished() : BatchOperationContext {
        this.checkIfFinishedAction();
        return this;
    }
    
    public checkIfFinishedAction : () => void;
    
    public get context() : string {
        var execCtx = this.executionContext;
        if (TypeUtils.isNullOrUndefined(execCtx)) {
            return undefined;
        }
        
        return BatchOperationExecutionContext[execCtx];
    }
    
    public get executionContext() : BatchOperationExecutionContext {
        return this._executionContext;
    }
    
    public get error() : any {
        return this._error;
    }
    
    public get id() : string {
        return this.operation.id;
    }
    
    public get index() : number {
        return this._index;
    }
    
    public invokeAction : boolean = true;
    
    public invokeAfter : boolean = true;
    
    public invokeBefore : boolean = true;
    
    public invokeComplete : boolean = true;
    
    public invokeError : boolean = true;

    public invokeNext: () => BatchOperationContext;
    
    public invokeSuccess : boolean = true;
    
    public get isBetween() : boolean {
        if (this._index !== undefined) {
            return 0 !== this._index &&
                   !this._isLast;
        }
        
        return undefined;
    }
    
    public get isFirst() : boolean {
        if (this._index !== undefined) {
            return 0 === this._index;
        }
        
        return undefined;
    }
    
    public get isLast() : boolean {
        return this._isLast;
    }

    public get items(): ObservableArray<any> {
        return this._operation.items;
    }
    
    public log(msg) : BatchOperationContext {
        var ctx = new BatchLogContext(this,
                                      new Date(), msg);
        
        for (var i = 0; i < this.batch.loggers.length; i++) {
            try {
                var l = this.batch.loggers[i];
                l(ctx);
            }
            catch (e) {
                // ignore
            }
        }
        
        return this;
    }

    public get name() : string {
        return this.operation.name;
    }

    public get nextInvokeStradegy() : InvokeStrategy {
        return this._nextInvokeStradegy;
    }
    public set nextInvokeStradegy(newValue: InvokeStrategy) {
        this._nextInvokeStradegy = newValue;
    }

    public nextValue : any;

    public get object(): Observable {
        return this._operation.object;
    }    

    public get operation() : BatchOperation {
        return this._operation;
    }

    public get prevValue() : any {
        return this._prevValue;
    }
    
    public result : any;
    
    public setExecutionContext(value : BatchOperationExecutionContext) : BatchOperationContext {
        this._executionContext = value;
        return this;
    }
    
    public setError(error : any) : BatchOperationContext {
        this._error = error;
        return this;
    }

    public setNextInvokeStradegy(newValue: InvokeStrategy) : BatchOperationContext {
        this._nextInvokeStradegy = newValue;
        return this;
    }
    
    public setResultAndValue(value : any) : BatchOperationContext {
        this.result = value;
        this.value = value;
        
        return this;
    }
    
    public skip(cnt? : number) : BatchOperationContext {    
        if (arguments.length < 1) {
            cnt = 1;
        }
            
        return this.skipWhile((ctx) => cnt-- > 0);
    }
    
    public skipAll(flag? : boolean) : BatchOperationContext {
        if (arguments.length < 1) {
            flag = true;
        }
        
        return this.skipWhile(() => flag);
    }

    public skipNext(flag? : boolean) : BatchOperationContext {
        this.skip(arguments.length < 1 ? 1
                                       : (flag ? 1 : 0));
        return this;
    }
    
    public skipWhile(predicate : (ctx : IBatchOperationContext) => boolean) : BatchOperationContext {
        this.skipWhilePredicate = predicate;
        return this;
    }
    
    public skipWhilePredicate : (ctx : IBatchOperationContext) => boolean;
    
    public value : any;
}

/**
 * List of batch operation execution types. 
 */
export enum BatchOperationExecutionContext {
    /**
     * Global "before" action.
     */
    before,
    
    /**
     * Operation action is executed.
     */
    execution,
    
    /**
     * Global "after" action.
     */
    after,
    
    /**
     * "Success" action is executed.
     */
    success,
    
    /**
     * "Error" action is executed.
     */
    error,
    
    /**
     * "Completed" action is executed.
     */
    complete,
    
    /**
     * Global "finish all" action.
     */
    finished,
    
    /**
     * Global "cancelled" action.
     */
    cancelled
}


/**
 * Describes a batch.
 */
export interface IBatch {
    /**
     * Adds one or more items for the object in 'items' property.
     * 
     * @chainable
     * 
     * @param any ...items One or more item to add.
     */
    addItems(...items: any[]) : IBatch;
    
    /**
     * Adds a logger.
     * 
     * @chainable
     * 
     * @param {Function} action The logger action.
     */
    addLogger(action : (ctx : IBatchLogContext) => void) : IBatch;

    /**
     * Defines the global action that is invoke AFTER each operation.
     * 
     * @chainable
     * 
     * @param {Function} action The action to invoke.
     */
    after(action : (ctx : IBatchOperationContext) => void) : IBatch;
    
    /**
     * Defines the global action that is invoke BEFORE each operation.
     * 
     * @chainable
     * 
     * @param {Function} action The action to invoke.
     */
    before(action : (ctx : IBatchOperationContext) => void) : IBatch;

    /**
     * Gets or sets the ID of the batch.
     * 
     * @property
     */
    id : string;
    
    /**
     * Defines if "checkIfFinished" method should be autmatically invoked after
     * each operation.
     * 
     * @chainable
     * 
     * @param {Boolean} [flag] Automatically invoke "checkIfFinished" method or not. Default: (true) 
     */
    invokeFinishedCheckForAll(flag?: boolean) : IBatch;

    /**
     * Gets or sets the default invoke stradegy for an operation.
     */
    invokeStrategy: InvokeStrategy;
    
    /**
     * Gets the batch wide (observable) array of items.
     * 
     * @property
     */
    items : ObservableArray<any>;
    
    /**
     * Gets the batch wide (observable) object.
     * 
     * @property
     */
    object : Observable;
    
    /**
     * Gets or sets the name of the batch.
     * 
     * @property
     */
    name : string;

    /**
     * Sets the invoke stradegy for an operation.
     * 
     * @chainable
     * 
     * @param {InvokeStrategy} stradegy The (new) value.
     */
    setInvokeStrategy(stradegy: InvokeStrategy) : IBatch;

    /**
     * Sets properties for the object in 'object' property.
     * 
     * @chainable
     * 
     * @param {Object} properties The object that contains the properties.
     */
    setObjectProperties(properties) : IBatch;

    /**
     * Sets the initial result value.
     * 
     * @chainable
     * 
     * @param any value The value.
     */
    setResult(value : any) : IBatch;

    /**
     * Sets the initial result and execution value.
     * 
     * @chainable
     * 
     * @param any value The value.
     */
    setResultAndValue(value : any) : IBatch;

    /**
     * Sets the initial execution value.
     * 
     * @chainable
     * 
     * @param any value The value.
     */
    setValue(value : any) : IBatch;

    /**
     * Starts all operations.
     * 
     * @return any The result of the last / of all operations.
     */
    start() : any;
    
    /**
     * Defines the logic that is invoked after all operations have been finished.
     * 
     * @chainable
     * 
     * @param {Function} action The action.
     */
    whenAllFinished(action : (ctx : IBatchOperationContext) => void) : IBatch;
    
    /**
     * Defined the logic that is invoked when batch have been cancelled.
     * 
     * @chainable
     * 
     * @param {Function} action The action.
     */
    whenCancelled(action : (ctx : IBatchOperationContext) => void) : IBatch;
}

/**
 * Describes a batch log context.
 */
export interface IBatchLogContext {
    /**
     * Gets the underlying batch.
     * 
     * @property
     */
    batch? : IBatch;
    
    /**
     * Gets the underlying batch operation context.
     * 
     * @property
     */
    context? : IBatchOperationContext;
    
    /**
     * Gets the log message (value).
     */
    message : any;
    
    /**
     * Gets the underlying batch operation.
     * 
     * @property
     */
    operation? : IBatchOperation;
    
    /**
     * Gets the timestamp.
     */
    time : Date;
}

/**
 * Describes a logger.
 */
export interface IBatchLogger {
    /**
     * Logs a message.
     * 
     * @chainable
     * 
     * @param any msg The message to log.
     */
    log(msg) : IBatchLogger;
}

/**
 * Describes a batch operation.
 */
export interface IBatchOperation {
    /**
     * Adds one or more items for the object in 'items' property.
     * 
     * @chainable
     * 
     * @param any ...items One or more item to add.
     */
    addItems(...items: any[]) : IBatchOperation;
    
    /**
     * Adds a logger.
     * 
     * @chainable
     * 
     * @param {Function} action The logger action.
     */
    addLogger(action : (ctx : IBatchLogContext) => void) : IBatchOperation;
    
    /**
     * Defines the global action that is invoke AFTER each operation.
     * 
     * @chainable
     * 
     * @param {Function} action The action to invoke.
     */
    after(action : (ctx : IBatchOperationContext) => void) : IBatchOperation;

    /**
     * Gets the underlying batch.
     * 
     * @property
     */
    batch : IBatch;

    /**
     * Gets or sets the ID of the underlying batch.
     * 
     * @property
     */
    batchId : string;
    
    /**
     * Gets or sets the name of the underlying batch.
     * 
     * @property
     */
    batchName : string;

    /**
     * Defines the global action that is invoke BEFORE each operation.
     * 
     * @chainable
     * 
     * @param {Function} action The action to invoke.
     */
    before(action : (ctx : IBatchOperationContext) => void) : IBatchOperation;
    
    /**
     * Defines the "completed" action.
     * 
     * @chainable
     * 
     * @param {Function} completedAction The "completed" action.
     */
    complete(completedAction : (ctx : IBatchOperationContext) => void) : IBatchOperation;
    
    /**
     * Defines the "error" action.
     * 
     * @chainable
     * 
     * @param {Function} errorAction The "error" action.
     */
    error(errorAction : (ctx : IBatchOperationContext) => void) : IBatchOperation;
    
    /**
     * Gets or sets the ID of the operation.
     * 
     * @property
     */
    id : string;

    /**
     * Ignores error of that operation.
     * 
     * @chainable
     * 
     * @param {Boolean} [flag] The flag to set. Default: (true)
     */
    ignoreErrors(flag? : boolean) : IBatchOperation;

    /**
     * Defines if "checkIfFinished" method should be autmatically invoked after
     * each operation.
     * 
     * @chainable
     * 
     * @param {Boolean} [flag] Automatically invoke "checkIfFinished" method or not. Default: (true) 
     */
    invokeFinishedCheckForAll(flag?: boolean) : IBatchOperation;

    /**
     * Gets or sets the invoke stradegy for that operation.
     */
    invokeStrategy: InvokeStrategy;

    /**
     * Gets the batch wide (observable) array of items.
     * 
     * @property
     */
    items : ObservableArray<any>;
    
    /**
     * Gets the batch wide (observable) object.
     * 
     * @property
     */
    object : Observable;
    
    /**
     * Gets or sets the name of the operation.
     * 
     * @property
     */
    name : string;
    
    /**
     * Defines the next operation.
     * 
     * @chainable
     * 
     * @param {Function} action The logic of the next operation.
     */
    next(action: (ctx : IBatchOperationContext) => void) : IBatchOperation;

    /**
     * Sets the ID of the underlying batch.
     * 
     * @param {String} id The new ID.
     * 
     * @chainable
     */
    setBatchId(id : string) : IBatchOperation;
    
    /**
     * Sets the name of the underlying batch.
     * 
     * @param {String} name The new name.
     * 
     * @chainable
     */
    setBatchName(name : string) : IBatchOperation;
    
    /**
     * Sets the ID of the operation.
     * 
     * @param {String} id The new ID.
     * 
     * @chainable
     */
    setId(id : string) : IBatchOperation;

    /**
     * Sets the invoke stradegy for that operation.
     * 
     * @chainable
     * 
     * @param {InvokeStrategy} stradegy The (new) value.
     */
    setInvokeStrategy(stradegy: InvokeStrategy) : IBatchOperation;
    
    /**
     * Sets the name of the operation.
     * 
     * @param {String} name The new name.
     * 
     * @chainable
     */
    setName(name : string) : IBatchOperation;
    
    /**
     * Sets properties for the object in 'object' property.
     * 
     * @chainable
     * 
     * @param {Object} properties The object that contains the properties.
     */
    setObjectProperties(properties) : IBatchOperation;
    
    /**
     * Sets the initial result value for all operations.
     * 
     * @chainable
     * 
     * @param any value The value.
     */
    setResult(value : any) : IBatchOperation;

    /**
     * Sets the initial result and execution value for all operations.
     * 
     * @chainable
     * 
     * @param any value The value.
     */
    setResultAndValue(value : any) : IBatchOperation;

    /**
     * Sets the initial execution value for all operations.
     * 
     * @chainable
     * 
     * @param any value The value.
     */
    setValue(value : any) : IBatchOperation;
    
    /**
     * Starts all operations.
     * 
     * @return any The result of the last / of all operations.
     */
    start() : any;
    
    /**
     * Defines the "success" action.
     * 
     * @chainable
     * 
     * @param {Function} successAction The "success" action.
     */
    success(successAction : (ctx : IBatchOperationContext) => void) : IBatchOperation;
    
    /**
     * Alias for 'next()'.
     * 
     * @chainable
     * 
     * @param {Function} action The logic of the next operation.
     */
    then(action: (ctx : IBatchOperationContext) => void) : IBatchOperation;
    
    /**
     * Defines the logic that is invoked after all operations have been finished.
     * 
     * @chainable
     * 
     * @param {Function} action The action.
     */
    whenAllFinished(action : (ctx : IBatchOperationContext) => void) : IBatchOperation;
    
    /**
     * Defined the logic that is invoked when batch have been cancelled.
     * 
     * @chainable
     * 
     * @param {Function} action The action.
     */
    whenCancelled(action : (ctx : IBatchOperationContext) => void) : IBatchOperation;
}

/**
 * Describes a context of a batch operation.
 */
export interface IBatchOperationContext extends IBatchLogger {
    /**
     * Gets the underlying batch.
     * 
     * @property
     */
    batch : IBatch;
    
    /**
     * Gets the ID of the underlying batch.
     * 
     * @property
     */
    batchId : string;
    
    /**
     * Gets the name of the underlying batch.
     * 
     * @property
     */
    batchName : string;
    
    /**
     * Cancels all upcoming operations.
     * 
     * @chainable
     * 
     * @param {Boolean} [flag] Cancel upcoming operations or not. Default: (true)
     */
    cancel(flag?: boolean) : IBatchOperationContext;
    
    /**
     * Marks that operation as finished.
     * 
     * @chainable
     */
    checkIfFinished() : IBatchOperationContext;
    
    /**
     * Gets the name of the execution context.
     * 
     * @property
     */
    context : string;

    /**
     * Gets the thrown error.
     * 
     * @property
     */
    error? : any;
    
    /**
     * Gets the current execution context.
     * 
     * @property
     */
    executionContext? : BatchOperationExecutionContext;
    
    /**
     * Gets the ID of the underlying operation.
     * 
     * @property
     */
    id : string;
    
    /**
     * Gets the zero based index.
     * 
     * @property
     */
    index : number;
    
    /**
     * Defines if action should be invoked or not.
     */
    invokeAction : boolean;
    
    /**
     * Defines if global "after" action should be invoked or not.
     */
    invokeAfter : boolean;
    
    /**
     * Defines if global "before" action should be invoked or not.
     */
    invokeBefore : boolean;
    
    /**
     * Defines if "completed" action should be invoked or not.
     */
    invokeComplete : boolean;
    
    /**
     * Defines if "error" action should be invoked or not.
     */
    invokeError : boolean;

    /**
     * Invokes the next operation.
     * 
     * @chainable
     */
    invokeNext() : IBatchOperationContext;
    
    /**
     * Defines if "success" action should be invoked or not.
     */
    invokeSuccess : boolean;
    
    /**
     * Gets if the operation is NOT the first AND NOT the last one.
     * 
     * @property
     */
    isBetween : boolean;
    
    /**
     * Gets if that operation is the FIRST one.
     * 
     * @property
     */
    isFirst : boolean;
    
    /**
     * Gets if that operation is the LAST one.
     * 
     * @property
     */
    isLast : boolean;

    /**
     * Gets the batch wide (observable) array of items.
     * 
     * @property
     */
    items: ObservableArray<any>;

    /**
     * Gets the name of the underlying operation.
     * 
     * @property
     */
    name : string;

    /**
     * Gets or sets the invoke stradegy for the next operation.
     */
    nextInvokeStradegy : InvokeStrategy;
        
    /**
     * Gets or sets the value for the next operation.
     * 
     * @property
     */
    nextValue : any;
    
    /**
     * Gets the batch wide (observable) object.
     * 
     * @property
     */
    object: Observable;

    /**
     * Gets the underlying operation.
     * 
     * @property
     */
    operation : IBatchOperation;    
    
    /**
     * Gets the value from the previous operation.
     * 
     * @property
     */
    prevValue : any;
    
    /**
     * Gets or sets the result for all operations.
     * 
     * @property
     */
    result : any;

    /**
     * Sets the invoke stradegy for the next operation.
     * 
     * @chainable
     * 
     * @param {InvokeStrategy} stradegy The (new) value.
     */
    setNextInvokeStradegy(stradegy: InvokeStrategy) : IBatchOperationContext;
    
    /**
     * Sets the values for 'result' any 'value' properties.
     * 
     * @chainable
     * 
     * @param any value The value to set.
     */
    setResultAndValue(value : any) : IBatchOperationContext;
    
    /**
     * Sets the number of operations to skip.
     * 
     * @chainable
     * 
     * @param {Number} cnt The number of operations to skip. Default: 1
     */
    skip(cnt? : number) : IBatchOperationContext;
    
    /**
     * Skips all upcoming operations.
     * 
     * @chainable
     * 
     * @param {Boolean} [flag] Skip all upcoming operations or not. Default: (true)
     */
    skipAll(flag? : boolean) : IBatchOperationContext;
    
    /**
     * Defines if next operation should be skipped or not.
     * 
     * @chainable
     * 
     * @param {Boolean} [flag] Skip next operation or not. Default: (true)
     */
    skipNext(flag? : boolean) : IBatchOperationContext;
    
    /**
     * Skips all upcoming operations that matches a predicate.
     * 
     * @chainable
     * 
     * @param {Function} predicate The predicate to use.
     */
    skipWhile(predicate : (ctx : IBatchOperationContext) => boolean) : IBatchOperationContext;
    
    /**
     * Gets or sets the value for that and all upcoming operations.
     */
    value : any;
}

/**
 * List of invoke stradegies.
 */
export enum InvokeStrategy {
    /**
     * Automatic
     */
    Automatic,

    /**
     * From batch operation.
     */
    Manually,
}

/**
 * Creates a new batch.
 * 
 * @function newBatch
 * 
 * @return {IBatchOperation} The first operation of the created batch.
 */
export function newBatch(firstAction : (ctx : IBatchOperationContext) => void) : IBatchOperation {
    return new Batch(firstAction).firstOperation;
}
