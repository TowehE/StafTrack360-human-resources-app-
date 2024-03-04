//import express
const express = require("express");

const cors = require("cors")

//import confg
require("./dbConfig/dbConfig")

require("dotenv").config();
const fileUpload = require("express-fileupload")

const bodyParser = require('body-parser');

// import routers
const userRouter  = require("./router/userRouter");
const perfRouter  = require("./router/performanceRouter");
const newStaff = require("./router/newStafffRouter")
const department = require("./router/departmentRouter")

// create an app from express module
const app = express();

// use the express middleware
app.use(express.json());

app.use(cors("*"))


const port = process.env.port

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.send("You're welcome to the StafTrack360 API")
})

app.use(fileUpload({
    useTempFiles: true,
    limits:{ fileSize: 5 * 1024 *1024}
}))

app.use("/api/v1", userRouter)

app.use("/api/v1", perfRouter)

app.use("/api/v1", newStaff)

app.use("/api/v1", department)


//listen to  the port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})