const userModel = require('../Model/businessModel');
const newStaffModel = require('../Model/addStaffModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateUser, validateUserLogin,validateForgotPassword, validateresetPassword } = require('../validator/validator');
 const { sendEmail } = require('../email');
const { generateDynamicEmail } = require('../emailHTML');
const { resetFunc } = require('../forgotPassword');
const resetHTML = require('../resetHTML');
const {welcomeEmail} = require('../welcome')
require('dotenv').config();


//function to capitalize the first letter
const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};



//Function to register a new user
exports.signUp = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            })
        } else {
            const {businessEmail, firstName, lastName,businessName, phoneNumber, password} = req.body;


                  // List of popular domain names
                  const popularDomains = ["gmail.com", "yahoo.com", "outlook.com","hotmail.com", "aol.com","icloud.com","mail.com","protonmail.com","zoho.com","yandex.com" ]; 
                  // Check if the email belongs to a popular domain
                  const domain = businessEmail.split("@")[1];
                  if (popularDomains.includes(domain.toLowerCase())) {
                      return res.status(400).json({
                          message: "Please use a business email address.",
                      });
                  }
            // check if business email already exists
            const emailExists = await userModel.findOne({ businessEmail: businessEmail.toLowerCase() });
            if (emailExists) {
                return res.status(200).json({
                    message: 'Business Email already exists',
                })
            }

            //check if business name already exists
            const nameExists = await userModel.findOne({ businessName: businessName});
            if (nameExists) {
                return res.status(403).json({
                    message: 'Business name already exists',
                })
            }


            // to hash password
            const salt = bcrypt.genSaltSync(12)
            const hashpassword = bcrypt.hashSync(password, salt);

         
            const business = await new userModel({
                businessEmail: businessEmail.toLowerCase(),
                firstName: capitalizeFirstLetter(firstName).trim(),
                lastName: capitalizeFirstLetter(lastName).trim(),
                businessName: capitalizeFirstLetter(businessName.toLowerCase()),
                phoneNumber: phoneNumber,
               password: hashpassword,
              
            });

            // check if buiness exists
            if (!business) {
                return res.status(404).json({
                    message: 'business not found',
                })
            }


            const token = jwt.sign({
                businessEmail: business.businessEmail,
                firstName: business.firstName,
                lastName: business.lastName,
                businessName: business.businessName
            }, process.env.secret, { expiresIn: "600s" });
            business.token = token;
            const subject = 'Email Verification'

                    
            const link = `${req.protocol}://${req.get('host')}/api/v1/verify/${business.id}/${business.token}`
                    const html = generateDynamicEmail(businessName, link)
                     sendEmail({
                        email: business.businessEmail,
                        html,
                        subject
                    })

                    await business.save()
                
                    return res.status(200).json({
                        message: 'Business Account created successfully',
                        data: business,
                          
                    })
                  
                }
               
            } catch (error) {
                return res.status(500).json({
                    message: "Internal Server Error: " + error.message,
                });
            }
        }

///Function to verify a new user with a link
exports.verify = async (req, res) => {
    try {
      const id = req.params.id;
      const token = req.params.token;
      const user = await userModel.findById(id);
  
      // Verify the token
      jwt.verify(token, process.env.secret);
  
      // Update the user if verification is successful
      const updatedUser = await userModel.findByIdAndUpdate(id, { isVerified: true }, { new: true });
  
      if (updatedUser.isVerified === true) {
        return res.status(200).send("<h1>You have been successfully verified. Kindly visit the login page.</h1>");
      }res.redirect(`https://${req.get('host')}/api/v1/login`);

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // Handle token expiration
        const id = req.params.id;
        const updatedUser = await userModel.findById(id);
        if(!updatedUser){
            return res.status(404).json({
                message: "user not found",
            })
        }

        const newtoken = jwt.sign({ 
            businessEmail: updatedUser.businessEmail,
            firstName: updatedUser.firstName, 
            lastName: updatedUser.lastName,
            businessName: updatedUser.businessName}, process.env.secret, {expiresIn: "600s"});
        updatedUser.token = newtoken;
        updatedUser.save();
  
        const link = `${req.protocol}://${req.get('host')}/api/v1/verify/${id}/${updatedUser.token}`;
        sendEmail({
          email: updatedUser.businessEmail,
          html: generateDynamicEmail(updatedUser.businessName, link),
          subject: "RE-VERIFY YOUR ACCOUNT"
        });
        return res.status(401).send("<h1>This link is expired. Kindly check your email for another email to verify.</h1>");
      } else {
        return res.status(500).json({
          message: "Internal Server Error: " + error.message,
        });
      }
    }

  };





//Function to login a verified business email address
exports.logIn = async (req, res) => {
    try {
        const { error } = validateUserLogin(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            }) 
        } else {
            const { businessEmail, password } = req.body;
            const checkbusinessEmail = await userModel.findOne({ businessEmail: businessEmail.toLowerCase() });
            if (!checkbusinessEmail) {
                return res.status(404).json({
                    message: 'Business not registered'
                });
            }
            const checkPassword = bcrypt.compareSync(password, checkbusinessEmail.password);
            if (!checkPassword) {
                return res.status(404).json({
                    message: "Password is incorrect"
                })
            }
            const token = jwt.sign({
                userId: checkbusinessEmail._id,
                email: checkbusinessEmail.email,
                role: checkbusinessEmail.role

            }, process.env.secret, { expiresIn: "15h" });

            if (checkbusinessEmail.isVerified === true) {
                res.status(200).json({
                    message: "Welcome, " + checkbusinessEmail.businessName,
                    token: token
                })
                checkbusinessEmail.token = token;
                await checkbusinessEmail.save();
            } else {
                res.status(400).json({
                    message: "Sorry user not verified yet."
                })
            }
        }

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}





// //Function for the user incase password is forgotten
exports.forgotPassword = async (req, res) => {

    try {
        const { error } = validateForgotPassword(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            }) 
        } else {
            
        const checkBusiness = await userModel.findOne({ businessEmail: req.body.businessEmail });
        if (!checkBusiness) {
            return res.status(404).json({
                message: 'Email does not exist'
            });
        }
        else {
            const subject = 'Kindly reset your password'
            const link = `${req.protocol}://${req.get('host')}/api/v1/reset/${checkBusiness.id}`
            const html = resetFunc(checkBusiness.businessName, link)
            sendEmail({
                email: checkBusiness.businessEmail,
                html,
                subject
            })
            return res.status(200).json({
                message: "Kindly check your email to reset your password",
            })
        }
    }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}

//Funtion to send the reset Password page to the server
exports.resetPasswordPage = async (req, res) => {
    try {
        const userId = req.params.userId;
        const resetPage = resetHTML(userId);

        // Send the HTML page as a response to the user
        res.send(resetPage);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}


//Function to reset the user password
exports.resetPassword = async (req, res) => {
    try {
        const { error } = validateresetPassword(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            }) 
        } else {
            
        const userId = req.params.userId;
        const password = req.body.password;

        if (!password) {
            return res.status(400).json({
                message: "Password cannot be empty",
            });
        }

        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt);

        const reset = await userModel.findByIdAndUpdate(userId, { password: hashPassword }, { new: true });
        return res.status(200).json({
            message: "Password reset successfully",
        });
    }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}

// Function to signOut a user
exports.signOut = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await userModel.findById(userId)

// invalidate the token by  setting it to null
        user.token = null;
        await user.save();
        return res.status(201).json({
            message: `user has been signed out successfully`
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}

//function for admin
exports.isAdmin = async(req,res)=>{
    try{
        //track the user id
    const adminId = req.params.adminId;
    
    // track admin with the id gotten
    const admin = await userModel.findById(adminId);
    
    // check for error
    if (!admin) {
      res.status(404).json({
        message: `Oops, you're not allowed to be an admin`,
      });
      return;
    }

  const updatedAdmin = await userModel.findByIdAndUpdate(
    adminId, 
   { isAdmin:true},
    {new:true}
  )
   
        res.status(200).json({
            message: `${admin.businessName} has been made an Admin`
        })
    
    
    
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



//to get all registered business
exports.getAllBusiness = async(req,res)=>{
    try {    
        const business = await userModel.find()     
        if(business.length == 0){
            return res.status(404).json({
                message:"No business members"
            })
        } 
        res.status(200).json({
            message:`There are ${business.length} business  in this database`,
            data:business
        })                                 
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



//to get a business member
exports.aCompany = async(req,res)=>{
    try {
        const id = req.params.id;

        const business = await userModel.findById(id)
        if(!business){
            return res.status(404).json({
                message:"No business account found in this data"
            })
        }
        res.status(200).json({
            message:"business account found in this data",
            data: business
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



//to remove a company from database
exports.deleteCompany = async(req,res) =>{
    try {
        const id = req.params.id
        
      

        const deleteCompany = await userModel.findByIdAndDelete(id)

        if(!deleteCompany){
            return res.status(404).json({
                message:"company not found in this database"
            })
        }
        res.status(200).json({
            message:"company has been removed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}




