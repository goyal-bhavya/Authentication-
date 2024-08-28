const { schema } = require("../utils/schema.js");
const userSchema  = require("../models/users.js");
const createError = require("http-errors");
const {signJWT } = require("../utils/jwtUtils.js");
const bcrypt = require("bcrypt")
module.exports = {
  Register : async (req, res, next) => {
    try {
      const { username, password } = req.body;
      // const isJoiValid = await schema.validateAsync({ username, password });
  
      const doesExist = await userSchema.findOne({ username : username});
      if (doesExist) return next(createError.Conflict("User with same username already exists !!"))
  
      const user = new userSchema({ username, password });
      const userData = await user.save();
  
      const AT = await signJWT(userData._id , 0);
      const RT = await signJWT(userData._id , 1);
      
      res.cookie("accessToken", AT, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.cookie("refreshToken", RT, {
        expires: new Date(Date.now() + 60 * 1000),
        httpOnly: true,
      });
      res.send({ user: userData });
    } catch (e) {
      if (e.isJoi) {
        e.message = "Pass or email wrong!!";
      }
      next(e);
    }
  },
  
  Login  :  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      // const isJoiValid = await schema.validateAsync({ username, password });
  
      const userData = await userSchema.findOne({ username });
      const isCorr = await bcrypt.compare(password, userData.password);
      if (!isCorr) throw createError.BadRequest("Wrong username or password !!");
      
      const AT = await signJWT(userData._id , 0);
      const RT = await signJWT(userData._id , 1);
      
      res.cookie("accessToken", AT, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.cookie("refreshToken", RT, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.send({ user: userData });
    } catch (e) {
      if (e.isJoi) {
        e.message = "Pass or email wrong!!";
      }
      next(e);
    }
  },
  Logout : (req ,res , next) => {
    try{
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.send({data : "Logged Out Successfully !!"});
    }
    catch(e){
      next(e);
    }
  }

}
