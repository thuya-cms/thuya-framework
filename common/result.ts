/**
 * Results can be used to report the execution result of methods. 
 * It should be used to report business errors.
 */
class Result<T = void> {
    private constructor(private isSuccessful: boolean, private message?: string, private result?: T) {
        this.message = message || "";
    }



    /**
     * Create a new successful {@link Result} instance.
     * 
     * @param result the actual value of the method processing
     * @returns a successful {@link Result} instance
     */
    static success<T>(result?: T): Result<T> {
        return new Result(true, "", result);
    }

    /**
     * Create a new failing {@link Result} instance.
     * 
     * @param message the message describing the error
     * @returns a failing {@link Result} instance
     */
    static error<T>(message?: string): Result<T> {
        return new Result(false, message);
    }
    
    
    /**
     * Get the success state of a {@link Result}.
     * Negates the {@link getIsFailing} method. 
     * 
     * @returns `true` if processing was successful
     */
    getIsSuccessful(): boolean {
       return this.isSuccessful;
    }

    /**
     * Get the failure state of a {@link Result}. 
     * Negates the {@link getIsSuccessful} method.
     * 
     * @returns `true` if processing failed
     */
    getIsFailing(): boolean {
        return !this.isSuccessful;
    }

    /**
     * Get the message of the {@link Result}. 
     * Only available for failed results.
     * 
     * @returns the message describing the error
     */
    getMessage(): string {
        return this.message || "";
    }

    /**
     * Get the actual result of a method processing.
     * Only available for successful results.
     * 
     * @returns the actual result of a method processing
     */
    getResult(): T | undefined {
        return this.result;
    }
}

export default Result;