const db = require('./dbcommon_layerfunction');
const fcm = require('fcm-node');
const nodemailer = require("nodemailer");

const secret_id = process.env.DB_SECRET_ID;

// To Send notification using FCM
// To Send Email
const fcmNotification = {
sendFCMNotification: (touser, title, body,userid)=>
{
    const secret_mannager = new AWS.SecretsManager();
    const secret = secret_mannager.getSecretValue({ SecretId: secret_id }).promise();
    const dbCredentials = JSON.parse(secret.SecretString);
    var fcmclient = new fcm(dbCredentials.fcm_serverkey);

    if(Array.isArray(touser))
    {
        // compose FCM message for multiple user
            messages = {
            registration_ids: touser,
            notification: {
                title: title,
                body: body,
            },
        };
    }
    else
    {
        // compose FCM message to a single user
            message = {
            to:touser,
            notification: {
                title: title,
                body: body,
            },
        };
    }

    // send FCM Notificaiton
    db.getDataRows('func_insert_push_notification',[Number(userid),title,body])

    fcmclient.send(message, (err, response) => {
        if (err) {  
            return false;
        } 
        // on SUCCESS
        else {
            return true;
        }
    }) 
},

sendEmail: async (maildata) => {
    const { email_cc: cc, email_bcc: bcc } = maildata;
    const emailcc = (JSON.parse(cc));
    const emailbcc = (JSON.parse(bcc));
    const userDetail = {
        emailto:  db.decryptId(maildata.email_to),
        subject: maildata.email_subject,
        text: maildata.email_body,
        emailcc: emailcc?.map((i) => db.decryptId(i)),
        emailbcc: emailbcc?.map((i) => db.decryptId(i)),
    };
  
    let mailTransporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "noreply@myiq.ai",
            pass: "Pub72383",  
        },
    });
  
    let mailDetails = {
        from: "noreply@myiq.ai",
        to: userDetail?.emailto,
        subject: userDetail.subject,
        text: userDetail.text,
        cc: userDetail?.emailcc?.map((i) => i),
        bcc: userDetail?.emailbcc?.map((i) => i)
    };

    await mailTransporter.sendMail(mailDetails, function (err, data) 
    {
        // if (err) { 
        //   res.status(400);
        // } else {
        //   res.status(200);
        // }
    }
    );
}
}

module.exports=fcmNotification;