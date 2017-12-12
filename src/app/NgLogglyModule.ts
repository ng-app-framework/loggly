import {ModuleWithProviders, NgModule} from '@angular/core';
import {LogglyLogger} from "./Service/LogglyLogger";
import {LogglyConfig} from "./Structure/LogglyConfig";
import {NgCoreModule} from "@ng-app-framework/core";
import {NgSessionModule} from "@ng-app-framework/session";
import {NgLoggingModule, EventLogger} from "@ng-app-framework/logging";


@NgModule({
    imports  : [
        NgCoreModule,
        NgLoggingModule,
        NgSessionModule
    ],
    exports  : [
        NgLoggingModule
    ],
    providers: [
        LogglyLogger
    ]
})
export class NgLogglyModule {


    constructor(eventLogger: EventLogger, remoteLogger: LogglyLogger) {
        if (remoteLogger.config.enabled) {
            eventLogger.remoteLoggers.push(remoteLogger);
        }
    }

    static forRoot(config: LogglyConfig): ModuleWithProviders {
        return {
            ngModule : NgLogglyModule,
            providers: [{
                provide : LogglyConfig,
                useValue: config
            }]
        };
    }

}

