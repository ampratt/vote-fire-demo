import * as functions from 'firebase-functions';

export class Logger {

    log(message: string): void {
        functions.logger.log(message, { structuredData: true });
    }

    info(message: string): void {
        functions.logger.info(message, { structuredData: true });
    }

    warn(message: string): void {
        functions.logger.warn(message, { structuredData: true });
    }

    error(message: string): void {
        functions.logger.error(message, { structuredData: true });
    }
}
