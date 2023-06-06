class Result<T = void> {
    private constructor(private isSuccessful: boolean, private message?: string, private result?: T) {
        this.message = message || "";
    }



    static success<T>(result?: T): Result<T> {
        return new Result(true, "", result);
    }

    static error<T>(message?: string): Result<T> {
        return new Result(false, message);
    }


    getIsSuccessful(): boolean {
        return this.isSuccessful;
    }

    getIsFailing(): boolean {
        return !this.isSuccessful;
    }

    getMessage(): string {
        return this.message || "";
    }

    getResult(): T | undefined {
        return this.result;
    }
}

export default Result;