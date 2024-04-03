const newStaffModel = require('../Model/addStaffModel');
const userModel = require('../Model/businessModel');
const newDepartmentModel = require('../Model/departmentModel');
const {newTaskModel} = require('../Model/taskModel');

exports.assignTaskToDepartment = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await userModel.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        const departmentId = req.params.departmentId;
        const department = await newDepartmentModel.findById(departmentId);
        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }
        console.log("Department ID:", departmentId);
        console.log("Company ID:", companyId);
        const { title, description, status } = req.body;


        let departmentUsers;
        const { assignedTo } = req.body;

        if (assignedTo) {
            // assign the task to a particular user
            departmentUsers = [{ _id: assignedTo }];
        } else {
            // else find all users in the specified department
            departmentUsers = await newDepartmentModel.find({ department: departmentId, companyId });
        }

        // Log departmentUsers array
        console.log("Query Results:", departmentUsers);

        // Create a new task and assign it to each user in the department
        const taskPromises = departmentUsers.map(async (user) => {
            const newTask = new newTaskModel({
                title,
                description,
                status,
                 assignedTo: [user._id] // Assign the task to the current user
            });
            await newTask.save();

            // Emit taskAssigned event to each assigned user's socket
            req.app.get('io').to(user._id.toString()).emit('taskAssigned', { taskId: newTask._id });

            console.log("Task assigned to user:", user._id);
            return newTask; 
        });

        // Wait for all tasks to be created and saved
        const tasks = await Promise.all(taskPromises);

        res.status(200).json({
            message: "Task assigned to all staff in the department successfully",
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



exports.startTask = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await userModel.findById(companyId);
        if(!company) {
            return res.status(404).json({
                message: 'Company not found' 
            })
        }
        
        const taskId = req.params.taskId;
        if (!taskId) {
            return res.status(404).json({
                message: 'Task ID is required'
            });
        }
        
        const task = await newTaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }
    const updatedTask = await newTaskModel.findByIdAndUpdate(taskId, { status: 'in progress' }, { new: true });
        if(!updatedTask){
            return res.status(400).json({
                message: "Unable to update task"
            })
        }
        console.log("updatedTask")
        
         // Emit taskCompleted event to notify the hod dashboard
         req.app.get('io').emit('taskInProgress', { taskId: updatedTask._id });

        await updatedTask.save()



        res.status(200).json({
             message: 'Task in progress', 
             task: updatedTask
             });

            } catch (error) {
                return res.status(500).json({
                    message: "Internal Server Error: " + error.message,
                });
            }
        }
        

exports.completeTask = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await userModel.findById(companyId);
        if(!company) {
            return res.status(404).json({
                message: 'Company not found' 
            })
        }
        
        const taskId = req.params.taskId;
        if (!taskId) {
            return res.status(404).json({
                message: 'Task ID is required'
            });
        }
        
        const task = await newTaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }
        const taskUpdated = await newTaskModel.findByIdAndUpdate(taskId, { status: 'closed', companyId: companyId }, { new: true });

         // Emit taskCompleted event to notify the hod dashboard
         req.app.get('io').emit('taskCompleted', { taskId: taskUpdated._id });

         await taskUpdated.save();
        res.status(200).json({ 
            message: 'Task completed',
             task: taskUpdated 
            });

        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    }
    

