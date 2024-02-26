const express = require('express');

const router = express.Router();

const { addStaff, 
    logInStaff, 
    changePassword,
    forgotPassword,
    resetPassword,
    resetPasswordPage,
    logOut,
    getAllStaffs,
    aStaff,
    searchStaff,
    removeStaff,
    uploadImage,
    updateProfile,
    updateProfileAdmin,
    getStaffByDepartmentAndCompany
    // getTeamLeadRoute
} = require('../controller/staffController');

const { authenticate, authorizeRole } = require('../middleware/authentication');

// //endpoint to send a staff a mail to join
router.post('/addStaff/:companyId', authenticate, authorizeRole('admin'), addStaff)


//endpoint to log in staff
router.post('/logInStaff', logInStaff);

//endpoint to log in staff
router.post('/changePass/:userId', changePassword);


//endpoint for forget Password
router.post('/forgetPassword', forgotPassword);

//endpoint for reset Password Page
router.get('/reset/:userId', resetPasswordPage);

//endpoint to reset user Password
router.post('/resetUser/:userId', resetPassword);

//endpoint to sign out a user
router.post("/logOut/:userId", logOut)

// // Route that requires a team lead role and access to the same department
// router.get('/team-lead-route/:department', authorizeRole('team-lead', true), getTeamLeadRoute)

//endpoint o search for a staff
router.get("/search", searchStaff)

//endpoint to get all staff members
router.get('/allStaffs/:companyId', authenticate,authorizeRole('admin','hod', 'cto', 'manager'), getAllStaffs);

//endpoint to get a particular staff members
router.get('/getOne/:id', aStaff);

//endpoint to get all staff members
router.get('/removeStaff/:id',authenticate, authorizeRole('admin'), removeStaff);

//endpoint to upload a picture
router.put("/upload/:userId", uploadImage)

//endpint to update staff da ta
router.put("/updateStaff/:userId", updateProfile)

//endpint to update staff data  as an admin
router.put("/updateStaffAdmin/:userId", authenticate, authorizeRole('admin'), updateProfileAdmin)

// endpoint to vuew staff based on departmwent
router.get('/department/:companyId/:department', getStaffByDepartmentAndCompany);






module.exports = router;







