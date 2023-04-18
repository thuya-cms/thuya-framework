import correlator from "express-correlation-id";

class Logger {
    debug(message: string, ...params: any[]): void {
        console.debug(this.getPrefix() + message, params);
    }

    info(message: string, ...params: any[]) {
        console.info(this.getPrefix() + message, params);
    }

    warning(message: string, ...params: any[]): void {
        console.warn(this.getPrefix() + message, params);
    }

    error(message: string, ...params: any[]): void {
        console.error(this.getPrefix() + message, params);
    }    


    private getPrefix(): string {
        if (correlator.getId())
            return correlator.getId() + " - " + new Date().toISOString() + " - ";
        else 
            return "[server] - " + new Date().toISOString() + " - ";
    }
}

export default new Logger();