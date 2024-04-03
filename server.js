// //import express
// const express = require("express");

// const cors = require("cors")

// //import confg
// require("./dbConfig/dbConfig")

// require("dotenv").config();
// const fileUpload = require("express-fileupload")

// const bodyParser = require('body-parser');

// // import routers
// const userRouter  = require("./router/userRouter");
// const perfRouter  = require("./router/performanceRouter");
// const newStaff = require("./router/newStafffRouter")
// const department = require("./router/departmentRouter")

// // create an app from express module
// const app = express();

// // use the express middleware
// app.use(express.json());

// app.use(cors("*"))


// const port = process.env.port

// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req,res)=>{
//     res.send("You're welcome to the StafTrack360 API")
// })

// app.use(fileUpload({
//     useTempFiles: true,
//     limits:{ fileSize: 5 * 1024 *1024}
// }))

// app.use("/api/v1", userRouter)

// app.use("/api/v1", perfRouter)

// app.use("/api/v1", newStaff)

// app.use("/api/v1", department)


// //listen to  the port
// app.listen(port, ()=>{
//     console.log(`Server is running on port ${port}`)
// })


// Import necessary modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const userRouter = require("./router/userRouter");
const perfRouter = require("./router/performanceRouter");
const newStaff = require("./router/newStafffRouter");
const department = require("./router/departmentRouter");
const task = require('./router/taskRouter')

//import confg
require("./dbConfig/dbConfig")

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io server
const io = require('socket.io')(server);

// Attach io object to app or pass it to relevant parts of your application
app.set('io', io);


// Middleware setup
app.use(express.json());
app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, limits: { fileSize: 5 * 1024 * 1024 } }));

// Define routes
app.get("/", (req, res) => {
    res.send("You're welcome to the StafTrack360 API");
});
app.use("/api/v1", userRouter);
app.use("/api/v1", perfRouter);
app.use("/api/v1", newStaff);
app.use("/api/v1", department);
app.use("/api/v1", task);

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("A user connected");

      // Handle taskAssigned event
    socket.on('taskAssigned', (data) => {
        console.log('Task assigned:', data.taskId);
      
    });

        // Handle taskCompleted event
        socket.on('taskCompleted', (data) => {
            console.log('Task completed:', data.taskId);
          
        });
    
            // Handle taskinProgress event
    socket.on('taskInProgress', (data) => {
        console.log('Task in progress:', data.taskId);
       
    });


    // Optionally, handle disconnection events
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });


});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
