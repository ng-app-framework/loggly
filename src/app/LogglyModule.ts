import {ModuleWithProviders, NgModule} from '@angular/core';
import {LogglyLogger} from "./Service/LogglyLogger";
import {LogglyConfig} from "./Structure/LogglyConfig";
import {CoreModule} from "@ng-app-framework/core";
import {SessionModule} from "@ng-app-framework/session";
import {LoggingModule, EventLogger} from "@ng-app-framework/logging";


@NgModule({
    imports  : [
        CoreModule,
        LoggingModule,
        SessionModule
    ],
    exports  : [
        LoggingModule
    ],
    providers: [
        LogglyLogger
    ]
})
export class LogglyModule {


    constructor(eventLogger: EventLogger, remoteLogger: LogglyLogger) {
        if (remoteLogger.config.enabled) {
            eventLogger.remoteLoggers.push(remoteLogger);
        }
    }

    static forRoot(config: LogglyConfig): ModuleWithProviders {
        return {
            ngModule : LogglyModule,
            providers: [{
                provide : LogglyConfig,
                useValue: config
            }]
        };
    }

}

