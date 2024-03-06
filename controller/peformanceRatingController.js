const performanceRatingModel = require('../Model/performanceModel');
const userModel = require('../Model/businessModel');
const moment = require('moment');

const newStaffModel = require('../Model/addStaffModel');
const{validateperformanceRating, validateInputSchema} = require('../validator/validator')


//Function to add employee performance rating
exports.AddperformanceRating = async (req, res) => {
    try {
        const { error } = validateperformanceRating(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            })
        } else {
        const staffId = req.params.staffId;
        const companyId = req.params.companyId;

        const { TC, TM, OR, CF, DA, WQ } = req.body;

      const today = new Date()
    
        const staff = await newStaffModel.findById(staffId);
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found",
            })
        }
          
        const checkPerformance = await performanceRatingModel.findOne({staffEmail: staff.email})
   
        if(checkPerformance && checkPerformance.createdAt && checkPerformance.createdAt.getMonth() === today.getMonth() ) {
            if (checkPerformance) {
                return res.status(404).json({
                    message: "This staff performance already exists for this month",
                })
              }
        }
    

        const company = await userModel.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
            });
        }

        const totalPerformance = (TC+TM+CF+OR+DA+WQ)
        const cummulativePerformance = totalPerformance / 6;

        const performance = new performanceRatingModel({ 
            TC, TM, OR, CF, DA, WQ, 
            staffEmail: staff.email, 
            totalPerformance: totalPerformance, 
            cummulativePerformance: cummulativePerformance, 
            staffId: staffId, 
            company: company.id
        });
        if (!performance) {
            return res.status(404).json({
                message: 'performance rating not found',
            })
        } 

        await performance.save();
        company.performanceRating.push(performance);
        await company.save();
        staff.performance.push(performance);
        await staff.save();

        return res.status(200).json({
            message: 'performance rating added successfully',
            data: performance
        });
    } 
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error" + error.message,
        })
    }
}

//Function to view all employees performance
exports.viewAll = async (req, res) => {
    try {
        const businessId = req.params.businessId
        const performance = await performanceRatingModel.find({company: businessId});
        if (!performance || performance.length === 0) {
            return res.status(404).json({
                message: "No performance found",
            })
        }
      
        
        const performanceData = performance.map(performance => ({
            staffEmail: performance.staffEmail,
            staffId: performance.staffId,
            commulativePerformance: performance.cummulativePerformance,
            totalPerformance: performance.totalPerformance
        }));

        return res.status(200).json({
            message:"Performance found",
            data:performance,
            performance: performanceData,
            //data: performance
        })
      
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error" + error.message,
        })
    }
}


//Function to view a particular employee performance
exports.viewOne = async (req, res) => {
    try {
        const performanceID = req.params.performanceID;
        const performance = await performanceRatingModel.findById(performanceID);
        if (!performance) {
            return res.status(404).json({
                message: "No performance found",
            })
        }

        return res.status(200).json({
            message:"Performance found",
            data: performance,
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error" + error.message,
        })
    }
}



//to update an employee's performance rating
exports.updatePerformance = async(req ,res) =>{
    try {
        const { error } = validateInputSchema(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            })
        } else {
        const staffId = req.params.staffId
        const performanceId = req.params.performanceId
      

        const employee = await newStaffModel.findById(staffId)

        if(!employee || employee.length <= 0) {
            return  res.status(404).json({
                 message:"Couldn't find employee"
            })
        }

        const performance = await performanceRatingModel.findById(performanceId)
        if(!performance){
            return  res.status(404).json({
                 message:"Couldn't find performance"
            })
        }

        const employeeData = {
            TC : req.body.TC || employee.TC,
            TM : req.body.TM || employee.TM,
            OR : req.body.OR || employee.OR,
            CF : req.body.CF || employee.CF,
            DA : req.body.DA || employee.DA,
            WQ : req.body.WQ || employee.WQ,
        }

        const totalPerformance = (employeeData.TC+employeeData.TM+employeeData.CF+employeeData.OR+employeeData.DA+employeeData.WQ)
        const cummulativePerformance = totalPerformance / 6;

        employeeData.totalPerformance = totalPerformance;
        employeeData.cummulativePerformance = cummulativePerformance;

        const updatedEmployees = await performanceRatingModel.findByIdAndUpdate(
            performanceId,
            employeeData, 
            {new:true}
        )

        if(!updatedEmployees) {
            return res.status(404).json({
                message: `Employee not found`
            })
        } else {
            return res.status(200).json({
                message: `Employee performance rating has been updated`,
                updatedEmployees
            })
        }
    }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error" + error.message,
        })
    }
}


//    //delete the employee
//    exports.deleteScore = async(req,res)=>{
//     try{
//      //track the user id
//         const staffId = req.params.staffId;

//     //track the employee with the ID gotten
//     const employee = await userModel.findById(staffId);
// //check for errors
// if(!employee){
//     res.staus(404).json({
//         message: `Employee with id ${staffId} has not been found`
//     })
// }
// //delete the employee
// await userModel.findByIdAndDelete(staffId);
// return res.status(200).json({
//     message:`employee with id ${staffId} has been deleted`,
//     data: employee,
// })
// } catch (error) {
//     return res.status(500).json({
//         message: "Internal Server Error" + error.message,
//     })
// }
// }


//delete the employee
// Delete an employee's score
exports.deleteScore = async (req, res) => {
    try {
        // Extract the employee ID and company ID from the request parameters
        const staffId = req.params.staffId;
        const companyId = req.params.companyId;

        // Find the employee with the given ID and company ID
        const employee = await newStaffModel.findOne({ _id: staffId, companyId: companyId });

        // Check if the employee exists
        if (!employee || employee.length <= 0) {
            return res.status(404).json({
                message: `Employee with id ${staffId} and company id ${companyId} score has not been found`
            });
        }

        // Reset the employee's score fields to their default values or remove them entirely based on your schema design
        // For example, if you have separate fields for each score component (TC, TM, OR, CF, DA, WQ), you can set them to 0
        employee.TC = 0;
        employee.TM = 0;
        employee.OR = 0;
        employee.CF = 0;
        employee.DA = 0;
        employee.WQ = 0;

        // Save the updated employee
        await employee.save();

        return res.status(200).json({
            message: `Employee with id ${staffId} and company id ${companyId} score has been deleted`,
            
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}






//funtion to rate staff monthly, yearly and quarterly 

exports.getPerformanceByCreatedAt = async (req, res) => {
    try {
        const staffId = req.params.staffId
        const staffMember = await newStaffModel.findById(staffId);
        if (!staffMember) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        const companyId = staffMember.companyId;


        const today = moment()
        const intervals = ["monthly", "quarterly", "yearly"]
        const responseData = {};

        for (const interval of intervals) {
            let startDate, endDate;

            if (interval === 'monthly') {
                startDate = today.clone().startOf('month');
                endDate = today.clone().endOf('month');
            } else if (interval === 'quarterly') {
                startDate = today.clone().startOf('quarter');
                endDate = today.clone().endOf('quarter');
            } else if (interval === 'yearly') {
            startDate = today.clone().startOf('year');
            endDate = today.clone().endOf('year');
        }

            const performanceRatings = await performanceRatingModel.find({staffId, companyId,
                createdAt: { $gte: startDate, $lte: endDate }
            });

            responseData[interval] = performanceRatings

        }
        
        return res.status(200).json({
            message: 'Performance ratings found by interval',
            data: responseData
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message
        });
    }
}


exports.getPerformanceByCompanyId = async (req, res) => {
    try {
        const companyId = req.params.companyId; // Assuming companyId is passed as a parameter
        
        // Fetch all staff members belonging to the specified company
        const staffMembers = await newStaffModel.find({ companyId: companyId });

        const responseData = {};
        const intervals = ["monthly", "quarterly", "yearly"];

        for (const staff of staffMembers) {
            const staffId = staff._id;
            const staffPerformance = {};

            for (const interval of intervals) {
                let startDate, endDate;

                if (interval === 'monthly') {
                    startDate = moment().startOf('month');
                    endDate = moment().endOf('month');
                } else if (interval === 'quarterly') {
                    startDate = moment().startOf('quarter');
                    endDate = moment().endOf('quarter');
                } else if (interval === 'yearly') {
                    startDate = moment().startOf('year');
                    endDate = moment().endOf('year');
                }

                const performanceRatings = await performanceRatingModel.find({
                    staffId,
                    createdAt: { $gte: startDate, $lte: endDate }
                });

                staffPerformance[interval] = performanceRatings;
            }

            responseData[staffId] = staffPerformance;
        }

        return res.status(200).json({
            message: 'Performance ratings found for all staff members of the specified company',
            data: responseData
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message
        });
    }
};



