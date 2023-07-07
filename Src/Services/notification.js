const fcm = require('fcm-node');
const { fcm_serverkey } = require('../../Configuration/app');
const logger=require('../Services/logger');
const util=require('../Services/utils');

var fcmclient = new fcm(fcm_serverkey);
// To Send notification using FCM
const fcmNotification = {
    sendFCMNotification:(touser, title, body)=>
    {   
        let message;
        // if(Array.isArray(touser))
        // {
        //     // compose FCM message for multiple users
        //      message = {
        //         registration_ids: touser,
        //         notification: {
        //             title: title,
        //             body: body,
        //         },
        //     };
        // }
        // else
        {
            // compose FCM message to a single user
             message = {
                to: touser,
                notification: {
                    title: title,
                    body: body,
                },
            };
        }
        // send FCM Notificaiton
        fcmclient.send(message, (err, response) => {
            console.log('err', err);
            console.log('response', response);
            if (err) {  
                // if ERROR
                logger.error(err);        // log message
                return false;
            } 
            // on SUCCESS
            else {
            return true;
            }
        });
    }
}
module.exports=fcmNotification;