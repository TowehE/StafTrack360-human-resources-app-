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
             enum:["admin", "hod", "employee"],
            default: "admin",
            trim: true,
           
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    
        token: {
            type: String,
        },

        isPremium: {
             type: Boolean, 
             default: false
             },

        profilePicture: [{
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
        
                }
            }],

        performanceRating: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'performance'
        }],

        staff:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "newStaffs"
        }],
        department:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "department"
        }]
    }, {timestamps: true});

    const userModel = mongoose.model('Users', userSchema);

    module.exports = userModel;