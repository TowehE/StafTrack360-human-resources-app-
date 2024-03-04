const mongoose = require('mongoose');

const newDepartmentSchema = new mongoose.Schema({
    Department:{
        type: 'string',
        trim: true,

    },
    departmentHead:{
        type: 'string',
        trim: true,
    }


}, {timestamps: true});

const newDepartmentModel = mongoose.model("department", newDepartmentSchema);


module.exports= newDepartmentModel