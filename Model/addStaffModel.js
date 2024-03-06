const mongoose = require('mongoose');

const newStaffSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        // lowercase: true

       
    },
     email: {
        type: String,
       
    },
    phoneNumber:{
        type: String,
        
    },
    
    department:{
        type: String,
        trim: true,
   
    },
    
    role:{
        type: String,
         enum:["admin", "hod",  "employee"],
        default: "employee",
        trim: true,
       
    },
    password:{
        type: String,
    },
    

    companyId: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    token: {
        type: String,
    },

    profilePicture: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,

        }
    }],
    lastLogin: {
        type: Date,
       
    },
  
   departmentId:  {
         type: String,
      
    },
   
    lastLogout: {
        type: Date,
       
    },
    performance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'performance'
    }]
   
}, {timestamps: true});

// Create a compound text index on multiple fields
newStaffSchema.index({ fullName:'text', email: 'text', department: 'text', role: 'text' });

const newStaffModel = mongoose.model('newStaffs', newStaffSchema);

module.exports = newStaffModel;