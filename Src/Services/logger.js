const appConfig =require("../../Configuration/app");

// using `winston` for LOGGING messages of application
const { createLogger, transports, format } = require('winston');
const {PostgresTransport} = require('@innova2/winston-pg');

var getLabel = function (callingModule) {
    var parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
};

const logger = createLogger({
        transports:[
            // // file loggin in web server, this can be used for debugging purpose
            // new transports.File({
            //         filename:'info.log',
            //         level:'info',
            //         format: format.combine(format.timestamp(),format.json())
            // }),
            // database logging, store in 'app_logs' table, to capture all ERRORS
            new PostgresTransport({
                connectionString: appConfig.appConfig.dbConnectionStr,
                maxPool: 10,
                level: 'error',
                //format: format.combine(getLabel(callingModule),format.json()),
                tableName: 'app_logs'
              })
        ]
    });
module.exports=logger;
