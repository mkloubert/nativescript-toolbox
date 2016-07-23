import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
/**
 * List of batch operation execution types.
 */
export declare enum BatchOperationExecutionContext {
    /**
     * Global "before" action.
     */
    before = 0,
    /**
     * Operation action is executed.
     */
    execution = 1,
    /**
     * Global "after" action.
     */
    after = 2,
    /**
     * "Success" action is executed.
     */
    success = 3,
    /**
     * "Error" action is executed.
     */
    error = 4,
    /**
     * "Completed" action is executed.
     */
    complete = 5,
    /**
     * Global "finish all" action.
     */
    finished = 6,
    /**
     * Global "cancelled" action.
     */
    cancelled = 7,
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
    addItems(...items: any[]): IBatch;
    /**
     * Adds a logger.
     *
     * @chainable
     *
     * @param {Function} action The logger action.
     */
    addLogger(action: (ctx: IBatchLogContext) => void): IBatch;
    /**
     * Defines the global action that is invoke AFTER each operation.
     *
     * @chainable
     *
     * @param {Function} action The action to invoke.
     */
    after(action: (ctx: IBatchOperationContext) => void): IBatch;
    /**
     * Defines the global action that is invoke BEFORE each operation.
     *
     * @chainable
     *
     * @param {Function} action The action to invoke.
     */
    before(action: (ctx: IBatchOperationContext) => void): IBatch;
    /**
     * Gets or sets the ID of the batch.
     *
     * @property
     */
    id: string;
    /**
     * Defines if "checkIfFinished" method should be autmatically invoked after
     * each operation.
     *
     * @chainable
     *
     * @param {Boolean} [flag] Automatically invoke "checkIfFinished" method or not. Default: (true)
     */
    invokeFinishedCheckForAll(flag?: boolean): IBatch;
    /**
     * Gets or sets the default invoke stradegy for an operation.
     */
    invokeStrategy: InvokeStrategy;
    /**
     * Gets the batch wide (observable) array of items.
     *
     * @property
     */
    items: ObservableArray<any>;
    /**
     * Gets the batch wide (observable) object.
     *
     * @property
     */
    object: Observable;
    /**
     * Gets or sets the name of the batch.
     *
     * @property
     */
    name: string;
    /**
     * Sets the invoke stradegy for an operation.
     *
     * @chainable
     *
     * @param {InvokeStrategy} stradegy The (new) value.
     */
    setInvokeStrategy(stradegy: InvokeStrategy): IBatch;
    /**
     * Sets properties for the object in 'object' property.
     *
     * @chainable
     *
     * @param {Object} properties The object that contains the properties.
     */
    setObjectProperties(properties: any): IBatch;
    /**
     * Sets the initial result value.
     *
     * @chainable
     *
     * @param any value The value.
     */
    setResult(value: any): IBatch;
    /**
     * Sets the initial result and execution value.
     *
     * @chainable
     *
     * @param any value The value.
     */
    setResultAndValue(value: any): IBatch;
    /**
     * Sets the initial execution value.
     *
     * @chainable
     *
     * @param any value The value.
     */
    setValue(value: any): IBatch;
    /**
     * Starts all operations.
     *
     * @return any The result of the last / of all operations.
     */
    start(): any;
    /**
     * Defines the logic that is invoked after all operations have been finished.
     *
     * @chainable
     *
     * @param {Function} action The action.
     */
    whenAllFinished(action: (ctx: IBatchOperationContext) => void): IBatch;
    /**
     * Defined the logic that is invoked when batch have been cancelled.
     *
     * @chainable
     *
     * @param {Function} action The action.
     */
    whenCancelled(action: (ctx: IBatchOperationContext) => void): IBatch;
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
    batch?: IBatch;
    /**
     * Gets the underlying batch operation context.
     *
     * @property
     */
    context?: IBatchOperationContext;
    /**
     * Gets the log message (value).
     */
    message: any;
    /**
     * Gets the underlying batch operation.
     *
     * @property
     */
    operation?: IBatchOperation;
    /**
     * Gets the timestamp.
     */
    time: Date;
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
    log(msg: any): IBatchLogger;
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
    addItems(...items: any[]): IBatchOperation;
    /**
     * Adds a logger.
     *
     * @chainable
     *
     * @param {Function} action The logger action.
     */
    addLogger(action: (ctx: IBatchLogContext) => void): IBatchOperation;
    /**
     * Defines the global action that is invoke AFTER each operation.
     *
     * @chainable
     *
     * @param {Function} action The action to invoke.
     */
    after(action: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Gets the underlying batch.
     *
     * @property
     */
    batch: IBatch;
    /**
     * Gets or sets the ID of the underlying batch.
     *
     * @property
     */
    batchId: string;
    /**
     * Gets or sets the name of the underlying batch.
     *
     * @property
     */
    batchName: string;
    /**
     * Defines the global action that is invoke BEFORE each operation.
     *
     * @chainable
     *
     * @param {Function} action The action to invoke.
     */
    before(action: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Defines the "completed" action.
     *
     * @chainable
     *
     * @param {Function} completedAction The "completed" action.
     */
    complete(completedAction: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Defines the "error" action.
     *
     * @chainable
     *
     * @param {Function} errorAction The "error" action.
     */
    error(errorAction: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Gets or sets the ID of the operation.
     *
     * @property
     */
    id: string;
    /**
     * Ignores error of that operation.
     *
     * @chainable
     *
     * @param {Boolean} [flag] The flag to set. Default: (true)
     */
    ignoreErrors(flag?: boolean): IBatchOperation;
    /**
     * Defines if "checkIfFinished" method should be autmatically invoked after
     * each operation.
     *
     * @chainable
     *
     * @param {Boolean} [flag] Automatically invoke "checkIfFinished" method or not. Default: (true)
     */
    invokeFinishedCheckForAll(flag?: boolean): IBatchOperation;
    /**
     * Gets or sets the invoke stradegy for that operation.
     */
    invokeStrategy: InvokeStrategy;
    /**
     * Gets the batch wide (observable) array of items.
     *
     * @property
     */
    items: ObservableArray<any>;
    /**
     * Gets the batch wide (observable) object.
     *
     * @property
     */
    object: Observable;
    /**
     * Gets or sets the name of the operation.
     *
     * @property
     */
    name: string;
    /**
     * Defines the next operation.
     *
     * @chainable
     *
     * @param {Function} action The logic of the next operation.
     */
    next(action: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Sets the ID of the underlying batch.
     *
     * @param {String} id The new ID.
     *
     * @chainable
     */
    setBatchId(id: string): IBatchOperation;
    /**
     * Sets the name of the underlying batch.
     *
     * @param {String} name The new name.
     *
     * @chainable
     */
    setBatchName(name: string): IBatchOperation;
    /**
     * Sets the ID of the operation.
     *
     * @param {String} id The new ID.
     *
     * @chainable
     */
    setId(id: string): IBatchOperation;
    /**
     * Sets the invoke stradegy for that operation.
     *
     * @chainable
     *
     * @param {InvokeStrategy} stradegy The (new) value.
     */
    setInvokeStrategy(stradegy: InvokeStrategy): IBatchOperation;
    /**
     * Sets the name of the operation.
     *
     * @param {String} name The new name.
     *
     * @chainable
     */
    setName(name: string): IBatchOperation;
    /**
     * Sets properties for the object in 'object' property.
     *
     * @chainable
     *
     * @param {Object} properties The object that contains the properties.
     */
    setObjectProperties(properties: any): IBatchOperation;
    /**
     * Sets the initial result value for all operations.
     *
     * @chainable
     *
     * @param any value The value.
     */
    setResult(value: any): IBatchOperation;
    /**
     * Sets the initial result and execution value for all operations.
     *
     * @chainable
     *
     * @param any value The value.
     */
    setResultAndValue(value: any): IBatchOperation;
    /**
     * Sets the initial execution value for all operations.
     *
     * @chainable
     *
     * @param any value The value.
     */
    setValue(value: any): IBatchOperation;
    /**
     * Starts all operations.
     *
     * @return any The result of the last / of all operations.
     */
    start(): any;
    /**
     * Defines the "success" action.
     *
     * @chainable
     *
     * @param {Function} successAction The "success" action.
     */
    success(successAction: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Alias for 'next()'.
     *
     * @chainable
     *
     * @param {Function} action The logic of the next operation.
     */
    then(action: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Defines the logic that is invoked after all operations have been finished.
     *
     * @chainable
     *
     * @param {Function} action The action.
     */
    whenAllFinished(action: (ctx: IBatchOperationContext) => void): IBatchOperation;
    /**
     * Defined the logic that is invoked when batch have been cancelled.
     *
     * @chainable
     *
     * @param {Function} action The action.
     */
    whenCancelled(action: (ctx: IBatchOperationContext) => void): IBatchOperation;
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
    batch: IBatch;
    /**
     * Gets the ID of the underlying batch.
     *
     * @property
     */
    batchId: string;
    /**
     * Gets the name of the underlying batch.
     *
     * @property
     */
    batchName: string;
    /**
     * Cancels all upcoming operations.
     *
     * @chainable
     *
     * @param {Boolean} [flag] Cancel upcoming operations or not. Default: (true)
     */
    cancel(flag?: boolean): IBatchOperationContext;
    /**
     * Marks that operation as finished.
     *
     * @chainable
     */
    checkIfFinished(): IBatchOperationContext;
    /**
     * Gets the name of the execution context.
     *
     * @property
     */
    context: string;
    /**
     * Gets the thrown error.
     *
     * @property
     */
    error?: any;
    /**
     * Gets the current execution context.
     *
     * @property
     */
    executionContext?: BatchOperationExecutionContext;
    /**
     * Gets the ID of the underlying operation.
     *
     * @property
     */
    id: string;
    /**
     * Gets the zero based index.
     *
     * @property
     */
    index: number;
    /**
     * Defines if action should be invoked or not.
     */
    invokeAction: boolean;
    /**
     * Defines if global "after" action should be invoked or not.
     */
    invokeAfter: boolean;
    /**
     * Defines if global "before" action should be invoked or not.
     */
    invokeBefore: boolean;
    /**
     * Defines if "completed" action should be invoked or not.
     */
    invokeComplete: boolean;
    /**
     * Defines if "error" action should be invoked or not.
     */
    invokeError: boolean;
    /**
     * Invokes the next operation.
     *
     * @chainable
     */
    invokeNext(): IBatchOperationContext;
    /**
     * Defines if "success" action should be invoked or not.
     */
    invokeSuccess: boolean;
    /**
     * Gets if the operation is NOT the first AND NOT the last one.
     *
     * @property
     */
    isBetween: boolean;
    /**
     * Gets if that operation is the FIRST one.
     *
     * @property
     */
    isFirst: boolean;
    /**
     * Gets if that operation is the LAST one.
     *
     * @property
     */
    isLast: boolean;
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
    name: string;
    /**
     * Gets or sets the invoke stradegy for the next operation.
     */
    nextInvokeStradegy: InvokeStrategy;
    /**
     * Gets or sets the value for the next operation.
     *
     * @property
     */
    nextValue: any;
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
    operation: IBatchOperation;
    /**
     * Gets the value from the previous operation.
     *
     * @property
     */
    prevValue: any;
    /**
     * Gets or sets the result for all operations.
     *
     * @property
     */
    result: any;
    /**
     * Sets the invoke stradegy for the next operation.
     *
     * @chainable
     *
     * @param {InvokeStrategy} stradegy The (new) value.
     */
    setNextInvokeStradegy(stradegy: InvokeStrategy): IBatchOperationContext;
    /**
     * Sets the values for 'result' any 'value' properties.
     *
     * @chainable
     *
     * @param any value The value to set.
     */
    setResultAndValue(value: any): IBatchOperationContext;
    /**
     * Sets the number of operations to skip.
     *
     * @chainable
     *
     * @param {Number} cnt The number of operations to skip. Default: 1
     */
    skip(cnt?: number): IBatchOperationContext;
    /**
     * Skips all upcoming operations.
     *
     * @chainable
     *
     * @param {Boolean} [flag] Skip all upcoming operations or not. Default: (true)
     */
    skipAll(flag?: boolean): IBatchOperationContext;
    /**
     * Defines if next operation should be skipped or not.
     *
     * @chainable
     *
     * @param {Boolean} [flag] Skip next operation or not. Default: (true)
     */
    skipNext(flag?: boolean): IBatchOperationContext;
    /**
     * Skips all upcoming operations that matches a predicate.
     *
     * @chainable
     *
     * @param {Function} predicate The predicate to use.
     */
    skipWhile(predicate: (ctx: IBatchOperationContext) => boolean): IBatchOperationContext;
    /**
     * Gets or sets the value for that and all upcoming operations.
     */
    value: any;
}
/**
 * List of invoke stradegies.
 */
export declare enum InvokeStrategy {
    /**
     * Automatic
     */
    Automatic = 0,
    /**
     * From batch operation.
     */
    Manually = 1,
}
/**
 * Creates a new batch.
 *
 * @function newBatch
 *
 * @return {IBatchOperation} The first operation of the created batch.
 */
export declare function newBatch(firstAction: (ctx: IBatchOperationContext) => void): IBatchOperation;
