const express = require('express');

const router = express.Router();

const {
    assignTaskToDepartment,
    startTask,
    completeTask
}= require('../controller/taskController')

//to assign tas
router.post('/assigntask/:companyId/:departmentId', assignTaskToDepartment);

// to start a task
router.put('/taskprogress/:companyId/:taskId', startTask);

//to complete a task
router.put('/taskdone/:companyId/:taskId', completeTask);

module.exports = router;