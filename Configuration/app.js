const encodedPassword = encodeURIComponent(`SAAS!RDS#sql$12345`);

const appConfig = {
    localSite : "https://dev.myiq.ai",
    apiUrl: "https://api.dev.myiq.ai/",
    MlApiUrl:"http://3.11.64.25:5000/",
    //dbConnectionStr:"postgres://master_iqai:SAAS!RDS#sql$12345@iqairds.cpg6rnseaedw.eu-west-2.rds.amazonaws.com:5432/IQAI_SAAS"
    dbConnectionStr:`postgres://master_iqai:${encodedPassword}@iqairds.cpg6rnseaedw.eu-west-2.rds.amazonaws.com:5432/IQAI_SAAS`
}
const dbConfig = {
    host: 'iqairds.cpg6rnseaedw.eu-west-2.rds.amazonaws.com',
    port: 5432,
    database: 'IQAI_SAAS',
    user: 'master_iqai',
    password: 'SAAS!RDS#sql$12345'
    //max: 30 // use up to 30 connections
    // "types" - in case you want to set custom type parsers on the pool level
};

const jwtTokenKey = {
    key: "986ghgrgtru989ASdsaerew13434545435"
};

const fcm_serverkey = 'AAAAkWH9oDc:APA91bG2LhZhDLDcDLkm8Vjj1VD2krahBUyKE7fSyr5zduipVgBCQB7ImxmyMoHsUwKgY-MGgG-xHIcaX4FOZl5vuvaYYxr7ncnYTD2xABBIt4tvuGZTCL6Edr4bwuvYO43WkuGQpg95';

module.exports={
    appConfig, 
    dbConfig,
    jwtTokenKey,
    fcm_serverkey
};
