const mongoose= require("mongoose")
mongoose.connect("url")
const UserSchema= mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    firstName: { type: String, required: true},
    lastName: {type: String, required: false}
})
const User= mongoose.model("User", UserSchema)
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
const Account= mongoose.model("Account", AccountSchema)
module.exports={
    User,
    Account
}