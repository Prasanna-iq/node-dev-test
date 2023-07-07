const callBackUrl="https://api.dev.myiq.ai:4000"; 
const oAuthConig= {
    MSConfig:{
        clientId : "11f3f317-c500-4cc9-88c1-4da591df06ce",
        callbackURL: `${callBackUrl}/mslogin`,
        clientSecret: "yJy8Q~QQC0k1f0oFzjBMJbL9Tg1KNwdu52a2JbAe"
    },
    GoogleConfig:{
        clientId : "624414269495-mnucbbcpv9ll1nh6ppalgag6dihh2kmo.apps.googleusercontent.com",
        callbackURL: `${callBackUrl}/googleLogin`,
        clientSecret:"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"
    }
}

module.exports = oAuthConig;