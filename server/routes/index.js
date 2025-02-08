const express= require("express")
const {userRouter}= require("./userRoutes")
const {accountRouter}= require("./AccountRoutes")
const router = express.Router()
router.use("/user", userRouter)
router.use("/account",accountRouter)
module.exports={
    router
}