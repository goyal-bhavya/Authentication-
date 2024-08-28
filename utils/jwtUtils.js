const jwt = require("jsonwebtoken");
const createError = require("http-errors");
module.exports = {
    verifyJWT  : async(token , type) => {
        try {
            const publicKey = (type == 1) ? process.env.RTS : process.env.ATS;
            const decoded = await jwt.verify(token, publicKey);
            return { payload: decoded, expired: false };
          } catch (error) {
            return { payload: null, expired: true };
          }
    },
    signJWT : async function(userId , type){
        try{
            const secret = (type == 1) ? process.env.RTS : process.env.ATS; 
            const expiry = (type == 1) ? '60s' : '10s'; 
            const payload = {
                _id : userId ,
                login : Date.now()
            }
            const options = {
                expiresIn : expiry
            }
            const token = jwt.sign(payload , secret , options)
            return token;
        }
        catch(e){
            return next(e);
        }
    }
}