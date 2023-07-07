const axios =require("axios");
// import appconfig from "../Configuration/app";
const MLHandler = {
   CropImageUpload: async(imgdata)=>{
        try {
            const userResponse = await axios.post(
                `${"https://0scrx8rsk8.execute-api.eu-west-2.amazonaws.com/"}dev`,
                {'image':imgdata},
                {
                  headers: {
                    "Content-Type": "application/json",
                  }
                }
              );
              return {status:true, res:userResponse}
            } catch (error) {
              return {status:false, res:error.message}
            }
    }
}
module.exports= MLHandler;