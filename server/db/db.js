const mongoose= require("mongoose")
mongoose.connect(process.env.mongodb_url)
const UserSchema= mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    firstName: { type: String, required: true},
    lastName: {type: String, required: false}
})
const AccountSchema= mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
})
const User= mongoose.model("User", UserSchema)
const Account= mongoose.model("Account", AccountSchema)
module.exports={
    User,
    Account
}