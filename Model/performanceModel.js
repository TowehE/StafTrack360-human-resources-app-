const mongoose = require('mongoose');

const performanceratingSchema = new mongoose.Schema({
    TC:{
        type: Number,
    },
    TM: {
        type: Number,
    },
    OR: {
        type: Number,
    }, 
    CF: {
        type: Number,
    },
    DA: {
        type: Number,
    }, 
    WQ: {
        type: Number,
    }, 
    staffEmail: {
        type: String,
    },
    company: {
        type: String,
    },
    cummulativePerformance:{
        type: Number,
    },
    totalPerformance:{
        type: Number,
    },
    staffId: {
        type: String,
    },
}, {timestamps: true})

const performanceRatingModel = mongoose.model('performance', performanceratingSchema);

module.exports = performanceRatingModel;