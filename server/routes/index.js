const express= require("express")
const userRouter= require("./userRoutes")
const accountRouter= require("./AccountRoutes")
const mainRouter = express.Router()
// .log("first one here", userRouter)
mainRouter.use("/user",userRouter )
// console.log(userRouter)
mainRouter.use("/account",accountRouter)
// console.log(accountRouter)
module.exports=
    mainRouter
