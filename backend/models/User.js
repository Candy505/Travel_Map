const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        require:true,
        min:4,
        max:12,
        unique:true,
    },
    email: {
        type:String,
        require:true,
        max: 50,
        unique:true,
    },
    password: {
        type:String,
        min:8,
        require:true,
    },

},
 {timestamps:true})

 module.exports = mongoose.model("User", UserSchema);