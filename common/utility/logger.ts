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
        
        console.log(this.getPrefix() + `Log level is %s.`, this.logLevel);
    }

    debug(message: string, ...params: any[]): void {
        if (this.logLevel === LogLevel.Debug)
            console.debug(this.getPrefix() + message, ...params);
    }

    info(message: string, ...params: any[]) {
        if (this.logLevel === LogLevel.Debug || this.logLevel === LogLevel.Info)
            console.info(this.getPrefix() + message, ...params);
    }

    error(message: string, ...params: any[]): void {
        console.error(this.getPrefix() + message, ...params);
    }    


    private getPrefix(): string {
        if (correlator.getId())
            return correlator.getId() + " - " + new Date().toISOString() + " - ";
        else 
            return "[server] - " + new Date().toISOString() + " - ";
    }
}

export default new Logger();