    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        businessEmail: {
            type: String,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        }, 
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },  
        role:{
            type: String,
            enum:["admin", "hod", "cto", "manager", "team-lead", "hr", "employee"],
            default: "admin",
            trim: true,
           
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        // newCode: {
        //     type: String,
        //     required: true,
        // },
        token: {
            type: String,
        },
        performanceRating: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'performance'
        }],
        staff:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "newStaffs"
        }]
    
    }, {timestamps: true});

    const userModel = mongoose.model('Users', userSchema);

    module.exports = userModel;