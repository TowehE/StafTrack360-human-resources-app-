//import mongoose
const mongoose = require("mongoose");
require("dotenv").config()

//connect to the database
const DB = process.env.DB

mongoose.connect(DB).then(()=>{
    console.log("Connected to the database")
})
.catch((error)=>{
    console.log(error.message)
})


