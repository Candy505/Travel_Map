const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
    {
    username: {
        type:String,
        required:true,
        
    },
    title: {
        type:String,
        required:true,
        max: 50,
        min: 5,
    },
    description: {
        type:String,
        required:true,
        min:10,
    },

    rating :{
        type:Number,
        min:0,
        max:5,
        required:true,
    },
    lat:{
        type:Number,
        required:true,
    },
    long:{
        type:Number,
        required:true,
    }, 
    
},
 {timestamps:true}
);

 module.exports = mongoose.model("Pin", PinSchema);