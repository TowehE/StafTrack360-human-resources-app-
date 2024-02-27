const express = require('express');

const router = express.Router();

const { 
    signUp,
     verify,
      logIn, 
      forgotPassword, 
      resetPasswordPage, 
      resetPassword,
       signOut,
        isAdmin,
    getAllBusiness,
    aCompany,
    deleteCompany} = require('../controller/businessController');
const { authenticate } = require('../middleware/authentication');
// const { authenticate } = require('../middleware/authentication');


//endpoint to register a new user
router.post('/signup', signUp);

//endpoint to verify a registered user
router.get('/verify/:id/:token', verify);

//endpoint to login a verified user
router.post('/login',logIn);
 
//endpoint for forget Password
router.post('/forgotPass', forgotPassword);

//endpoint for admin to log in
router.put("/isadmin/:adminId",authenticate, isAdmin)

//endpoint for reset Password Page
router.get('/reset/:userId', resetPasswordPage);

//endpoint to reset user Password
router.post('/resetUser/:userId', resetPassword);

//endpoint to sign out a user
router.post("/signout/:userId", signOut)


//endpoint to get all business 
router.get('/allBusiness', getAllBusiness);

//endpoint to get a business account
router.get('/getOneBu/:id', aCompany);

//endpoint to  delete business
router.get('/removeCompany/:id', deleteCompany);




module.exports = router;