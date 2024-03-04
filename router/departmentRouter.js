const express = require('express');

const router = express.Router();

const { createDepartment, 
    getADepartment, 
    getAllDepartment,
    updateDepartment,
    deleteDepartment

} = require("../controller/departmentContoller");

const { authenticate, authorizeRole, checkPremiumAccess } = require('../middleware/authentication');

//endpoint to create new department 
router.post('/addDepar/:companyId', authenticate,authorizeRole("hod" , "admin"), checkPremiumAccess, createDepartment);

//endpoint to get a departmrnt
router.get('/getdepartment/:companyId/:departmentId', authenticate,authorizeRole("hod" , "admin"),  getADepartment);


//endpoint for get all department
router.get('/alldepartment/:companyId', authenticate,authorizeRole("hod" , "admin"),getAllDepartment);


//endpoint for get update a department
router.put('/editDepartment/:departmentId', authenticate,authorizeRole("hod" , "admin"),updateDepartment);

//endpoint for get delete a department
router.delete('/deleteDepartment', authenticate,authorizeRole("hod" , "admin"),deleteDepartment);




module.exports = router;







