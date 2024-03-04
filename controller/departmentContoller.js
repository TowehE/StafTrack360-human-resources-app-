const newDepartmentModel = require("../Model/departmentModel");
const userModel = require("../Model/businessModel")



  //function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};


exports.createDepartement = async(req,res) =>{
    try{
        const companyId = req.params.companyId;
        const company = await  userModel.findById(companyId);
        if(!company){
            return res.status(200)({
                message:"company not found"
            })
        }
        const {department , departmentHead} = req.body


        const departmentExists = await userModel.findOne({ department: department.toLowerCase() });
        if (departmentExists) {
            return res.status(200).json({
                message: 'Department already exists',
            })
        }

        const departmentHeadExists = await userModel.findOne({ departmentHead: departmentHead.toLowerCase() });
        if (departmentHeadExists) {
            return res.status(200).json({
                message: 'Head of Department already exists',
            })
        }
        const departmentA = await new newDepartmentModel({
            department : capitalizeFirstLetter(department).trim(),
            departmentHead: capitalizeFirstLetter(department).trim(),
        })

        await departmentA.save()
        company.department.push(departmentA);
        await company.save();

        return res.status(200).json({
            message: 'Department created successfully',
            data: departmentA,
        })
    
} catch (error) {
    return res.status(500).json({
        message: "Internal Server Error: " + error.message,
    });
}
}



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
    res.status(200).json({
        message: `department found`,
        data: department
    })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}


exports.getAllDepartment = async (req,res)=>{
    try{
        // const departmentId = req.params.departmentId;
        const companyId = req.params.companyId
        
        const department = await newDepartmentModel.find(companyId)
        if(!department || department.length === 0){
        return res.status(404).json({
            message: "Department not found",
    })
}
    res.status(200).json({
        message: `There are ${department.length} in the department`,
        data: department
    })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}

