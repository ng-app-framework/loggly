import {LogglyTracker} from "loggly-jslogger";

let stringify = require('json-stringify-safe');
import {LogglyConfig} from "../Structure/LogglyConfig";
import {Injectable, Optional} from "@angular/core";
import {Session} from "@ng-app-framework/session";
import {RemoteLogger, EventLogEntry, ErrorFormat} from "@ng-app-framework/logging";

@Injectable()
export class LogglyLogger implements RemoteLogger {

    static environmentName = '';

    public eventHistory: any[] = [];

    public errorLoggly = new LogglyTracker();
    public debugLoggly = new LogglyTracker();

    instantiatedErrorLoggly = false;
    instantiatedDebugLoggly = false;

    constructor(public session?: Session, @Optional() public config: LogglyConfig = new LogglyConfig()) {
    }

    private instantiateDebugLoggly() {
        if (!this.instantiatedDebugLoggly) {
            this.debugLoggly.push({
                logglyKey        : this.config.token,
                sendConsoleErrors: false,
                tag              : this.config.tag + ',frontend-debug'
            });
            this.instantiatedDebugLoggly = true;
        }
    }

    private instantiateErrorLoggly() {
        if (!this.instantiatedErrorLoggly) {
            this.errorLoggly.push({
                logglyKey        : this.config.token,
                sendConsoleErrors: true,
                tag              : this.config.tag + ',frontend-error'
            });
            this.instantiatedErrorLoggly = true;
        }
    }

    public sendErrorReport = (error: ErrorFormat) => {
        this.instantiateErrorLoggly();
        this.errorLoggly.push({
            environment          : LogglyLogger.environmentName,
            route                : window.location.href,
            event                : error.event,
            userId               : this.session.state.userId,
            error                : error.error,
            additionalInformation: error.additionalInformation || null
        });
    };

    public sendEventHistory() {
        this.instantiateDebugLoggly();
        this.debugLoggly.push({
            environment: LogglyLogger.environmentName,
            userId     : this.session.state.userId,
            eventList  : this.eventHistory
        });
    }

    public handleError(error: ErrorFormat) {
        this.sendErrorReport(error);
        this.sendEventHistory();
    }

    public handleDebug(logEntry: EventLogEntry) {
        this.eventHistory.push(stringify(logEntry));
        // Keep only a trailing 50 entries in the array to prevent memory leaks
        if (this.eventHistory.length > 200) {
            this.eventHistory.splice(0, 1);
        }
    }
}
