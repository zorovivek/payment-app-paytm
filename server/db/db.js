const mongoose= require("mongoose")
mongoose.connect("mongodb+srv://zorovivek:m0nster1king@coursesellingwebistebac.8amyp.mongodb.net/Paytm")
const UserSchema= mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    firstName: { type: String, required: true},
    lastName: {type: String, required: false}
})
const User= mongoose.model("User", UserSchema)
module.exports={
    User
}