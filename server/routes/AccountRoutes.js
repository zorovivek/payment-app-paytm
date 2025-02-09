const express = require("express");
const { authmiddleware } = require("../middlewares/middleware");
const { Account } = require("../db/db");
const { default: mongoose } = require("mongoose");
const accountRouter= express.Router();

// endpoint to get the balance of a user
accountRouter.get("/balance", authmiddleware, async (req, res)=>{
    const userId= req.userId;
    const amount= await Account.findOne({
        userId:userId
    })
    
    return res.json({
        balance: amount.balance
    })
})
// money  transfer from one person to another person in the database

accountRouter.put("/transfer", authmiddleware, async (req, res)=>{
    const session = await mongoose.startSession();              //creating a session
    session.startTransaction();             // starting the transaction
    const {to,amount}= req.body;
    const account= await Account.findOne({userId: req.userId}).session(session);             //getting the account from which money is to be trasnferred

    if(!account||account.balance<amount){
        await session.abortTransaction();
        return res.json({
            msg: "insufficient balance or account does not exist"
        })
    }
    const toAccount= await Account.findOne({
        userId: to
    }).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.json({
            msg:"invalid user or receiver's account not found"
        })
    }
    //performing transfer
    const deducted= await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userID: to},{$inc:{balance:+amount}}).session(session);

    // committing the transaction
    await session.commitTransaction();
    res.json({
        msg:"transaction or money transfer successfull"
    })
})

module.exports= accountRouter;