import correlator from "express-correlation-id";

enum LogLevel {
    Error = "ERROR",
    Info = "INFO",
    Debug = "DEBUG"
}

class Logger {
    private logLevel: LogLevel = LogLevel.Info;
    
    
    
    initializeLogLevel() {
        const logLevel: string | undefined = process.env.LOG_LEVEL;

        if (logLevel) 
            this.logLevel = logLevel as LogLevel;
        else
            this.logLevel = LogLevel.Info;
        
        console.debug(this.getPrefix("DEBUG") + `Log level is %s.`, this.logLevel);
    }

    debug(message: string, ...params: any[]): void {
        if (this.logLevel === LogLevel.Debug)
            console.debug(this.getPrefix("DEBUG") + message, ...params);
    }

    info(message: string, ...params: any[]) {
        if (this.logLevel === LogLevel.Debug || this.logLevel === LogLevel.Info)
            console.info(this.getPrefix("INFO") + message, ...params);
    }

    error(message: string, ...params: any[]): void {
        console.error(this.getPrefix("ERROR") + message, ...params);
    }    


    private getPrefix(logLevel: string): string {
        if (correlator.getId())
            return correlator.getId() + " - " + new Date().toISOString() + " - " + logLevel + " - ";
        else 
            return "[server] - " + new Date().toISOString() + " - " + logLevel + " - ";
    }
}

export default new Logger();