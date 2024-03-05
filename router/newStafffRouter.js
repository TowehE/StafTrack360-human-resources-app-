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

const { authenticate, authorizeRole, checkPremiumAccess } = require('../middleware/authentication');

// //endpoint to send a staff a mail to join
router.post('/addStaff/:companyId', authenticate, authorizeRole("admin"),checkPremiumAccess, addStaff)


//endpoint to log in staff
router.post('/logInStaff', logInStaff);

//endpoint to log in staff
router.post('/changePass/:userId', changePassword);


//endpoint for forget Password
router.post('/forgetPassword', forgotPassword);

//endpoint for reset Password Page
router.get('/resetPass/:userId', resetPasswordPage);

//endpoint to reset user Password
router.post('/resetStaff/:userId', resetPassword);

//endpoint to sign out a user
router.post("/logOut/:userId", authenticate,logOut)

//endpoint o search for a staff
router.get("/search", searchStaff)

//endpoint to get all staff members
router.get('/allStaffs/:companyId',authenticate,authorizeRole('admin','hod',),getAllStaffs);

//endpoint to get a particular staff members
router.get('/getOne/:id', authenticate,aStaff);

//endpoint to get all staff members
router.get('/removeStaff/:id', authenticate, authorizeRole('admin','hod',),checkPremiumAccess,removeStaff);

//endpoint to upload a picture
router.put("/upload/:userId", authenticate,uploadImage)

//endpint to update staff data
router.put("/updateStaff/:userId",authenticate, updateProfile)
      
//endpint to update staff data  as an admin
router.put("/updateStaffAdmin/:userId", authenticate,authorizeRole("admin", "hod", ),updateProfileAdmin)

// endpoint to vuew staff based on departmwent
router.get('/department/:companyId/:department',authenticate, authorizeRole('admin','hod'),getStaffByDepartmentAndCompany);






module.exports = router;







