const {JWT_SECRET}= require("../config")
const jwt= require("jsonwebtoken")
const authmiddleware= async(req, res, next)=>{
    const header= req.headers.authorization
    if(!header||!header.startsWith("Bearer ")) {
        return res.status(410).json({
            msg: "cannot access due to authorization issues"
        })
    }
    const token =await  header.split(" ")[1];
    const decoded= jwt.verify(token, JWT_SECRET);
    if(decoded){
        req.userId= decoded.userId
        next()
    }
    else{
        return res.status(411).json({
            msg:"unable to access due to wrong token"
        })
    }
}