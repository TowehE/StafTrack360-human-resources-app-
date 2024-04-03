// task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    trim: true
},

  description: {
    type:String,
    trim:true
},

  status: {
    type: String,
     enum: ['todo', 'in progress', 'closed'] 
    },


  assignedTo: [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'newStaffs' }]
});

const newTaskModel = mongoose.model('task', taskSchema);


module.exports = {newTaskModel}