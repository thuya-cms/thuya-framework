import correlator from "express-correlation-id";

enum LogLevel {
    Error = "ERROR",
    Info = "INFO",
    Debug = "DEBUG"
}

class Logger {
    private static logLevel: LogLevel = LogLevel.Info;
    private location = "";
    
    
    
    private constructor(location: string) {
        this.location = location;
    }



    static for(location: string): Logger {
        return new Logger(location);
    }

    static initializeLogLevel() {
        const logLevel: string | undefined = process.env.LOG_LEVEL;

        if (logLevel) 
            this.logLevel = logLevel as LogLevel;
        else
            this.logLevel = LogLevel.Info;
    }


    debug(message: string, ...params: any[]): void {
        if (Logger.logLevel === LogLevel.Debug)
            console.debug(this.getPrefix("DEBUG") + message, ...params);
    }

    info(message: string, ...params: any[]) {
        if (Logger.logLevel === LogLevel.Debug || Logger.logLevel === LogLevel.Info)
            console.info(this.getPrefix("INFO") + message, ...params);
    }

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