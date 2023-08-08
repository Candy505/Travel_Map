const mongoose = require("mongoose");

const PinSchema = new mongoose,schema({
    username: {
        type:String,
        require:true,
        unique:true,
    },
    title: {
        type:String,
        require:true,
        max: 50,
    },
    description: {
        type:String,
        require:true,
        min:10,
    },

    rating :{
        type:Number,
        min:0,
        max:5,
        require:true,
    }

},
 {timestamps:true})

 module.exports = mongoose.model("Pin", PinSchema);