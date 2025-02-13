const express= require("express")
const userRouter= express.Router()
const zod= require("zod")
const {User, Account}= require("../db/db")
const jwt = require("jsonwebtoken")
const {JWT_SECRET}= require("../config")
const { authmiddleware } = require("../middlewares/middleware")

const signupSchema= zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName: zod.string(),
    lastName: zod.string().optional()
})
userRouter.post("/signup", async(req, res)=>{
    const data= req.body
    const {success}=signupSchema.safeParse(data)
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
        if(user){
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
    
    // gave a random balance to any user during signup process
    const userId= db_user._id
    await Account.create({
        userId: userId,
        balance: 1+Math.random()*10000
    })

    
    //created a token using jsonwebtoken
    const token= jwt.sign({userId},JWT_SECRET)  // db_user._id gives the id that has been given to that particular user in the database
    return res.status(400).json({
        msg:"signed up successfully",
        token: token
    })
    }
})

// signin route
//signin schema
const signinSchema= zod.object({
    username: zod.string().email(),
    password: zod.string()
})
userRouter.post("/signin", async (req, res)=>{
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
    const token =jwt.sign({userId},JWT_SECRET);   // creating token for future purposes
    return res.status(400).json({
        msg: "signin successfull",
        token: token
    })
})

// updating the user data in the database
// updationSchema
const updationSchema= zod.object({
    username: zod.string().email().optional(),
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})
userRouter.put("/update",authmiddleware, async (req, res)=>{
    const body= req.body;
    const {success}=updationSchema.safeParse(body);
    if(!success){
         return res.status(411).json({
            msg:"invalid format of input"
        })
    }
   
    const user= await User.find({_id:req.userId})
        await User.updateOne({_id:req.userId},body)
        return res.status(400).json({
            msg: "data updation successful",
            user:user
        })
    

})

// searching for other users present in the database so that you can send them money
// note that this wilkl return a bunch of users whose names will match with the substring
// we will be giving a query as "/aoi/v1/user/bulk?filter"  which will be used as a substring for searching the users

userRouter.get("/bulk", authmiddleware, async (req, res)=>{
    const filter= req.query.filter||"";
    const users= await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    return res.json({
        users: users.map(user=>({
            username: user.username,
            firstName:user.firstName,
            lastName: user.lastName,
            id: user._id

        }))
    })
})

module.exports= userRouter;