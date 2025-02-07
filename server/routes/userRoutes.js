const express= require("express")
const router= express.Router()
const zod= require("zod")
const {User}= require("../db/db")
const jwt = require("jsonwebtoken")
const {JWT_SECRET}= require("../config")
const signupSchema= zod.object({
    username:zod.email().string(),
    password:zod.string(),
    firstName: zod.string(),
    lastName: Zod.string().optional()
})
router.post("/signup", async(req, res)=>{
    const data= req.body
    const {success}=signupSchema.safeparse(data)
    // typeChecking using zod
    if(!success){
       return  res.status(411).json({
            msg:"sorry the format of your data was invalid"
        })
    }
    //checking if the user already exists in our database
    else{
        const user= await User.findOne({
            username: data.username
        })
        if(user._id){
            return res.status(411).json({
                msg:"user already exists"
            })
        }
        // created a user in our database
        const db_user= await User.create({
            username:data.username,
            password:data.password,
            firstName: data.firstName,
            lastName: data.lastName
        })
    }
    //created a token using jsonwebtoken
    const userId= db_user._id
    const token= jwt.sign(userId,JWT_SECRET)  // db_user._id gives the id that has been given to that particular user in the database
    return res.status(400).json({
        msg:"signed up successfully",
        token: token
    })

})

// signin route
//signin schema
const signinSchema= zod.object({
    username: zod.string().email(),
    password: zod.string()
})
router.post("/signin", async (req, res)=>{
    const data= req.body
    const {success}=signinSchema.safeParse(data);               // typechecking the inputs given by the user.
    if(!success){
        return res.status(410).json({
            msg: "not valid type of input"
        })
    }
    const user= await User.findOne({
        username:data.username,
        password: data.password
    })
    if(!user._id){                                      // checking if the credntials given by the user are correct or not
        return res.status(411).json({
            mag:"wrong email or password"
        })
    }
    const userId= user._id
    const token = await jwt.sign(userId,JWT_SECRET);   // creating token for future purposes
    return res.status(400).json({
        msg: "signin successfull",
        token: token
    })
})

