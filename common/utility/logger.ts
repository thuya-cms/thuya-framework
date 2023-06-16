import correlator from "express-correlation-id";

/**
 * Log level order: `DEBUG`, `INFO`, `ERROR`.
 */
enum LogLevel {
    Debug = "DEBUG",
    Info = "INFO",
    Error = "ERROR"
}

/**
 * Custom logger implementation.
 */
class Logger {
    private static logLevel: LogLevel = LogLevel.Info;
    private location = "";
    
    
    
    private constructor(location: string) {
        this.location = location;
    }



    /**
     * Create a new Logger instance for an object.
     * 
     * @param location the location the {@link Logger} is used in, for example a class name
     * @returns a new {@link Logger} instance
     */
    static for(location: string): Logger {
        return new Logger(location);
    }

    /**
     * Initialize the log level of a {@link Logger}. Defaults to {@link LogLevel.Info}.
     * Can be controlled by the `LOG_LEVEL` environment variable.
     */
    static initializeLogLevel(): void {
        const logLevel: string | undefined = process.env.LOG_LEVEL;

        if (logLevel) 
            this.logLevel = logLevel as LogLevel;
        else
            this.logLevel = LogLevel.Info;
    }


    /**
     * Log a debug message.
     * 
     * @param message the message
     * @param params parameters of the message
     */
    debug(message: string, ...params: any[]): void {
        if (Logger.logLevel === LogLevel.Debug)
            console.debug(this.getPrefix("DEBUG") + message, ...params);
    }

    /**
     * Log an info message.
     * 
     * @param message the message
     * @param params parameters of the message
     */
    info(message: string, ...params: any[]): void {
        if (Logger.logLevel === LogLevel.Debug || Logger.logLevel === LogLevel.Info)
            console.info(this.getPrefix("INFO") + message, ...params);
    }

    /**
     * Log an error message.
     * 
     * @param message the message
     * @param params parameters of the message
     */
    error(message: string, ...params: any[]): void {
        console.error(this.getPrefix("ERROR") + message, ...params);
    }    


    private getPrefix(logLevel: string): string {
        if (correlator.getId())
            return correlator.getId() + " - " + this.location + " - " + new Date().toISOString() + " - " + logLevel + " - ";
        else 
            return "[server] - " + this.location + " - " + new Date().toISOString() + " - " + logLevel + " - ";
    }
}

export default Logger;