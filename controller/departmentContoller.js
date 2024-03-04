const newDepartmentModel = require("../Model/departmentModel");
const userModel = require("../Model/businessModel")



  //function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};

exports.createDepartment = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await userModel.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }
        const { department, departmentHead } = req.body;

        const departmentExists = await newDepartmentModel.findOne({ department: capitalizeFirstLetter(department), companyId });
        if (departmentExists) {
            return res.status(400).json({
                message: 'Department already exists',
            });
        }

        const departmentHeadExists = await newDepartmentModel.findOne({ departmentHead: capitalizeFirstLetter(departmentHead), companyId});
        if (departmentHeadExists) {
            return res.status(400).json({
                message: 'Head of Department already exists',
            });
        }
        const departmentA = new newDepartmentModel({
            department: capitalizeFirstLetter(department).trim(),
            departmentHead: capitalizeFirstLetter(departmentHead).trim(),
            companyId:companyId
        });

        await departmentA.save();
        company.department.push(departmentA);
        await company.save();

        return res.status(201).json({
            message: 'Department created successfully',
            data: departmentA,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
};




exports.getADepartment = async (req,res)=>{
    try{

        const companyId = req.params.companyId
         // Find the company based on the provided company ID
         const company = await userModel.findById(companyId);
         if (!company) {
             return res.status(404).json({ 
                message: 'Company not found' });
         }
 
         const departmentId = req.params.departmentId;
        const department = await newDepartmentModel.findById(departmentId)
        if(!department || department.length === 0){
        return res.status(404).json({
            message: "Department not found",
    })
}
    return res.status(200).json({
        message: `department found`,
        data: department
    })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}


exports.getAllDepartment = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const departments = await newDepartmentModel.find({ companyId: companyId }).sort({ createdAt: -1 });
        
        if (!departments || departments.length === 0) {
            return res.status(404).json({
                message: "Department not found",
            });
        }

        return res.status(200).json({
            message: `There are ${departments.length} departments in the company`,
            data: departments,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
};





 //to update department
 exports.updateDepartment = async (req, res) => {
    try {
  
        const departmentId = req.params.departmentId;
        // const companyId = req.params.companyId

        const department = await newDepartmentModel.findById(departmentId);
        
        if (!department || department.length <= 0) {
            return res.status(404).json({
                message: "department not found in our database"
            });
        }

        const data = {
            department: capitalizeFirstLetter(req.body.department) || staff.department,
            departmentHead: capitalizeFirstLetter(req.body.departmentHead)|| staff.departmentHead,

        };
       

        const updateDepartment =  await newDepartmentModel.findByIdAndUpdate(departmentId, data, {new: true});
        if (!updateDepartment) {
            return res.status(400).json({
                message: "Unable to update department data"
            });
        }
        
        
         // Save the updated staff data
         await updateDepartment.save();

        return res.status(200).json({
            message: "department data updated successfully",
            data: updateDepartment
        });

    
    }catch (error) {
        return res.status(500).json({ 
         message: 'Internal Server Error: ' + error.message });
    }
    
  };


//to remove a company from database
exports.deleteDepartment = async(req,res) =>{
    try {
        const departmentId = req.params.departmentId

        const deleteDepartment = await userModel.findByIdAndDelete(departmentId)

        if(!deleteDepartment){
            return res.status(404).json({
                message:"department not found in this database"
            })
        }
        res.status(200).json({
            message:"department has been removed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}




