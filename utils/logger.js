const COLOR = {
    red: '\x1B[31m',
    green: '\x1B[32m',
    yellow: '\x1B[33m',
    blue: '\x1B[34m',
    gray: '\x1B[90m',
    default: '\x1b[37m'
};

class Logger {
    constructor() {};

    debug(message) {
        this.timestamp = (new Date()).toLocaleTimeString();
        console.log(`${COLOR.gray}[SERVER][${this.timestamp}] DEBUG: ${message}${COLOR.default}`);
    };
    info(message) {
        this.timestamp = (new Date()).toLocaleTimeString();
        console.log(`${COLOR.blue}[SERVER][${this.timestamp}] INFO: ${message}${COLOR.default}`);
    };
    warn(message) {
        this.timestamp = (new Date()).toLocaleTimeString();
        console.log(`${COLOR.yellow}[SERVER][${this.timestamp}] WARNING: ${message}${COLOR.default}`);
    };
    error(message) {
        this.timestamp = (new Date()).toLocaleTimeString();
        console.log(`${COLOR.red}[SERVER][${this.timestamp}] ERROR: ${message}${COLOR.default}`);
    };
    success(message) {
        this.timestamp = (new Date()).toLocaleTimeString();
        console.log(`${COLOR.green}[SERVER][${this.timestamp}] SUCCESS: ${message}${COLOR.default}`);
    };
};

export const logger = new Logger();