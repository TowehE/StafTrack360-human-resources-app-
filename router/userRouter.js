const express = require('express');

const router = express.Router();

const { 
    signUp,
     verify,
      logIn, 
      forgotPassword, 
      uploadLogo,
      resetPassword,
       signOut,
        
    getAllBusiness,
    aCompany,
    deleteCompany} = require('../controller/businessController');
const { authenticate } = require('../middleware/authentication');
// const { authenticate } = require('../middleware/authentication');


//endpoint to register a new user
router.post('/signup', signUp);

//endpoint to verify a registered user
router.get('/verify/:id', verify);

//endpoint to login a verified user
router.post('/login',logIn);
 
//endpoint for forget Password
router.post('/forgotPass', forgotPassword); 


//endpoint to reset user Password
router.post('/resetUser/:userId', resetPassword);

//endpoint to sign out a user
router.post("/signout/:userId", authenticate,signOut)

//endpoint to get all business 
router.get('/allBusiness',authenticate, getAllBusiness);

//endpoint to get a business account
router.get('/getOneBu/:id',authenticate, aCompany);

//endpoint to upload a picture
router.put("/uploadlogo/:userId", authenticate,uploadLogo)


//endpoint to  delete business
router.get('/removeCompany/:id',authenticate, deleteCompany);




module.exports = router;