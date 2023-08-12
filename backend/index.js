const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express();
const pinRoute = require("./routes/pins")
const usersRoute = require("./routes/users") 

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
}).then(() => {
    console.log("Mongodb Running")
}).catch((error) => console.log(error));

  mongoose.connection.on('error', (err) => {
    console.error('Connection error:', err);
  });

app.get('/', (req,res) => {
  //serve my react app
})

app.use("/api/pins",pinRoute);
app.use("/api/users",usersRoute);


app.listen(8800, () => {
    console.log("backend server running")
});


