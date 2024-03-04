const mongoose = require('mongoose');

const newDepartmentSchema = new mongoose.Schema({
    department:{
        type: String,
        trim: true,

    },

    departmentHead:{
        type: String,
        trim: true,
    },
    
    companyId: {
        type: String,
    },


}, {timestamps: true});

const newDepartmentModel = mongoose.model("department", newDepartmentSchema);


module.exports= newDepartmentModel