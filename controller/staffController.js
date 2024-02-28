const userModel = require('../Model/businessModel');
const newStaffModel = require('../Model/addStaffModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 const {validateStaffLogin, validateChangePassword, validateUpdateStaff, validateUpdateStaffAdmin} = require('../validator/validator');
 const { sendEmail } = require('../email');
const { resetFunc } = require('../forgotPassword');
const resetHTML = require('../resetHTML');
const {welcomeEmail} = require('../welcome')
const cloudinary = require('../middleware/cloudinary')
const fs = require("fs");
const path = require("path");
require('dotenv').config();


//function to capitalize the first letter
// Function to capitalize the first letter
const capitalizeFirstLetter = (str) => {
    // Check if str is undefined or empty
    if (!str || typeof str !== 'string' || str.length === 0) {
        return ''; // Return an empty string or handle the error as per your requirement
    }
    
    // Capitalize the first letter and return the modified string
    return str[0].toUpperCase() + str.slice(1);
};

// Function to capitalize each word in a string
const capitalizeEachWord = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};



//function to send staff email
exports.addStaff = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const { fullName, email, phoneNumber, department, role } = req.body;
  // Check if the email already exists in the database
    const existingStaff = await newStaffModel.findOne({ email:email.toLowerCase(), companyId});
  if (existingStaff) {
      return res.status(400).json({ 
        message: 'A staff member with this email address already exists. Please use a different email address.' });
  }

    const business = await userModel.findById(companyId);
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }
        // Generate a random password
        const generatePassword = () => {
            let upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let specials = '@#$%^&*()_+[]{}|;:\',./<>?`~!-'
        
            let code = Math.random().toString(36).slice(-6);
            let index = Math.floor(Math.random()*25)+1
            let index2 = Math.floor(Math.random()*9)+1
        
        
            return code+upperCase[index]+specials[index2]
            
        }
        
        const password = generatePassword()
        const salt = bcrypt.genSaltSync(12)
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create a new staff member
        const newStaff = new newStaffModel({ 
            fullName:fullName, 
            email:email.toLowerCase(), 
            phoneNumber:phoneNumber,
            department:department.toLowerCase(), 
            role:role,
            password: hashedPassword,
            companyId: companyId
        });

        
        // Generate JWT token
        const token = jwt.sign({
           fullName,
            email,
            userId: newStaff._id,
        }, process.env.secret, { expiresIn: "1d" });
        newStaff.token = token;

        // Assuming businessName is retrieved from the business object
            const businessName = business.businessName;

        // Send welcome email
        const subject = 'Welcome to our team!';
        const link = `${req.protocol}://${req.get('host')}/api/v1/login`;
        const html = welcomeEmail(fullName, email, password, link, businessName);
        await sendEmail({
            email: newStaff.email,
            html: html,
            subject: subject
        });

        
         newStaff.isVerified = true;
         
        // Save the new staff member
        await newStaff.save();

        // Save the new staff member
        await newStaff.save();
        business.staff.push(newStaff);
        await business.save();

        return res.status(201).json({
             message: `You've successfully added a new staff member to the company!` ,
             data: newStaff
             });
            } catch (error) {
                return res.status(500).json({
                    message: "Internal Server Error: " + error.message,
                });
            }
        }

//Function to login a verified user
exports.logInStaff = async (req, res) => {
    try {
      const { error } = validateStaffLogin(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message
        });
      }
  
      const { email, password } = req.body;
      const staffMembers = await newStaffModel.find({ email: email.toLowerCase() });
  
      if (!staffMembers || staffMembers.length === 0) {
        return res.status(404).json({
          message: 'User not registered'
        });
      }
  
      let authenticatedStaffMember;
  
      // Iterate through each staff member with the provided email
      for (const staffMember of staffMembers) {
        const checkPassword = bcrypt.compareSync(password, staffMember.password);
        if (checkPassword) {
          authenticatedStaffMember = staffMember;
          break;
        }
      }
  
      if (!authenticatedStaffMember) {
        return res.status(401).json({
          message: 'Password is incorrect'
        });
      }
  
      const token = jwt.sign({
        companyId: authenticatedStaffMember.companyId,
        userId: authenticatedStaffMember._id,
        email: authenticatedStaffMember.email,
        role: authenticatedStaffMember.role,
      }, process.env.secret, { expiresIn: '5h' });
  
      // Construct welcome message
      let welcomeMessage = 'Welcome';
      if (authenticatedStaffMember.fullName) {
        welcomeMessage += ' ' + authenticatedStaffMember.fullName;
      } else {
        welcomeMessage += ' ' + authenticatedStaffMember.email;
      }
  
      if (authenticatedStaffMember.isVerified) {
        
        // Update the staff member's last login timestamp
        authenticatedStaffMember.lastLogin = new Date();
        
        // Save the token to the authenticated staff member
        authenticatedStaffMember.token = token;
        await authenticatedStaffMember.save();
  
        return res.status(200).json({
          message: welcomeMessage,
          data:staffMembers,
          token
        });
      } else {
        return res.status(400).json({
          message: 'Sorry, this staff is not verified yet.'
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error: ' + error.message
      });
    }
  };
  
// exports.logInStaff = async (req, res) => {
//     try {
//         const { error } = validateStaffLogin(req.body);
//         if (error) {
//             return res.status(500).json({
//                 message: error.details[0].message
//             }) 
//         } else {
//             const { email, password } = req.body;
//             const staffMember = await newStaffModel.findOne({ email: email.toLowerCase() });
          
//             if (!staffMember) {
//                 return res.status(404).json({
//                     message: 'Staff not registered'
//                 });
//             }
            

//             const checkPassword = bcrypt.compareSync(password, staffMember.password);
//             if (!checkPassword) {
//                 return res.status(401).json({
//                     message: "Password is incorrect"
//                 })
//             }
//             const token = jwt.sign({
//                 userId: staffMember._id,
//                 email: staffMember.email,
              
//             }, process.env.secret, { expiresIn: "1h" });
              
//             // Construct welcome message
//         let welcomeMessage = "Welcome";
//         if (staffMember.fullName) {
//             welcomeMessage += " " + staffMember.fullName;
//         }
       
//         if (!staffMember.fullName) {
//             welcomeMessage += " " + staffMember.email;
//         }


//             if (staffMember.isVerified === true) {
//                 res.status(200).json({
//                     message: welcomeMessage,
//                     token
//                 })
               
//                 staffMember.token = token;
//                 await staffMember.save();
//             } else {
//                 res.status(400).json({
//                     message: "Sorry user not verified yet."
//                 })
//             }
           
//         }

//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error: " + error.message,
//         });
//     }
// }

exports.changePassword = async (req, res) => {
    try {
        const { error } = validateChangePassword(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const userId = req.params.userId;
        const { newPassword, confirmPassword } = req.body;

        // Retrieve the user by userId
        const user = await newStaffModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if the new password is the same as the current password
        const isNewPasswordSameAsCurrent = bcrypt.compareSync(newPassword, user.password);
        if (isNewPasswordSameAsCurrent) {
            return res.status(400).json({
                message: "New password must be different from the current password",
            });
        }

        // Check if the new password matches the confirmation password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match",
            });
        }

        // Generate hash for the new password
        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(newPassword, salt);

        // Update the user with the new password
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
};


//Function for the user incase password is forgotten
exports.forgotPassword = async (req, res) => {
    try {
        const checkUser = await newStaffModel.findOne({ email: req.body.email });
        if (!checkUser) {
            return res.status(404).json({
                message: 'Email does not exist'
            });
        }
        else {
            const subject = 'Kindly reset your password'
            const link = `${req.protocol}://${req.get('host')}/api/v1/reset/${checkUser.id}`
            const html = resetFunc(checkUser.fullName, link)
            sendEmail({
                email: checkUser.email,
                html,
                subject
            })
            return res.status(200).json({
                message: "Kindly check your email to reset your password",
            })
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
        const userId = req.params.userId;
        const password = req.body.password;

        if (!password) {
            return res.status(400).json({
                message: "Password cannot be empty",
            });
        }
       
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const reset = await newStaffModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}

// Function to signOut a user
exports.logOut = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await newStaffModel.findById(userId)
        console.log(userId)
if(!user){
    return res.status(404).json({
        message: 'Staff not found'
    })
}

        // Update the staff member's last login timestamp
        user.lastLogout = new Date();
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

// Function to upload a Logo image
const uploadImageToCloudinary = async (profilePicture, staff) => {
    try {
        if (staff.profilePicture && staff.profilePicture.public_id) {
            return await cloudinary.uploader.upload(profilePicture.tempFilePath, {
                public_id: staff.profilePicture.public_id,
                overwrite: true
            });
        } else {
            return await cloudinary.uploader.upload(profilePicture.tempFilePath, {
                public_id: `staff_image_${staff._id}`,
                folder: "StaffTrack360"
            });
        }
    } catch (error) {
        throw new Error("Error uploading image to Cloudinary: " + error.message);
    }
  };

exports.uploadImage = async (req, res) => {
    try {
        const userId = req.params.userId;
        const staff = await newStaffModel.findById(userId);
        
        if (!staff) {
            return res.status(404).json({
                message: "staff not found in our database"
            });
        }
        
        if (!req.files || !req.files.profilePicture) {
            return res.status(400).json({ message: 'No image provided' });
        }
  
        const profilePicture = req.files.profilePicture;

        // Check if only one file is uploaded
        if (profilePicture.length > 1) {
            return res.status(400).json({
                message: "Please upload only one image file",
            });
        }
  
        const fileExtension = path.extname(profilePicture.name).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ message: 'Only image files are allowed.' });
        }
  
        let fileUploader;
        try {
            fileUploader = await uploadImageToCloudinary(profilePicture, staff);
            await fs.promises.unlink(req.files.profilePicture.tempFilePath);
        } catch (uploadError) {
            return res.status(500).json({ message: 'Error uploading  image' +uploadError});
        }
        
        if (fileUploader) {
            const staffPicture = {
                public_id: fileUploader.public_id,
                url: fileUploader.secure_url
            };
            
            const updatedStaffPicture = await newStaffModel.findByIdAndUpdate(userId, { profilePicture: staffPicture }, { new: true });
  
            return res.status(200).json({
                message: 'Profile picture uploaded successfully',
                data: updatedStaffPicture
            });
        } else {
            return res.status(500).json({ message: 'Failed to upload an image' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' + error.message });
    }
  };

  //to update profile as the admin
  exports.updateProfileAdmin = async (req, res) => {
    try {
  
        const { error } = validateUpdateStaffAdmin(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            });
        }
    else {
        const userId = req.params.userId;
        const staff = await newStaffModel.findById(userId);
        
        if (!staff || staff.length <= 0) {
            return res.status(404).json({
                message: "staff not found in our database"
            });
        }
    
      

        const data = {
            department: capitalizeFirstLetter(req.body.department) || staff.department,
            role: capitalizeFirstLetter(req.body.role)|| staff.role,
        };
       

        const updateStaff =  await newStaffModel.findByIdAndUpdate(userId, data, {new: true});
        if (!updateStaff) {
            return res.status(400).json({
                message: "Unable to update staff data"
            });
        }
        
        
         // Save the updated staff data
         await updateStaff.save();

        return res.status(200).json({
            message: "Staff data updated successfully",
            data: updateStaff
        });

    }
    }catch (error) {
        return res.status(500).json({ 
         message: 'Internal Server Error: ' + error.message });
    }
    
  };


  //to update profile(staff member)
  exports.updateProfile = async (req, res) => {
    try {
  
        const { error } = validateUpdateStaff(req.body);
        if (error) {
            return res.status(500).json({
                message: error.details[0].message
            });
        }
    else {
        const userId = req.params.userId;
        const staff = await newStaffModel.findById(userId);
        
        if (!staff || staff.length <= 0) {
            return res.status(404).json({
                message: "staff not found in our database"
            });
        }
    
      

        const data = {
            fullName: capitalizeEachWord(req.body.fullName) || staff.fullName,
            email: req.body.email || staff.email,
            phoneNumber: req.body.phoneNumber || staff.phoneNumber, 
        
        };
        
        
       

        const updateStaff =  await newStaffModel.findByIdAndUpdate(userId, data, {new: true});
        if (!updateStaff) {
            return res.status(400).json({
                message: "Unable to update staff data"
            });
        }
        
        
         // Save the updated staff data
         await updateStaff.save();

        return res.status(200).json({
            message: "Staff data updated successfully",
            data: updateStaff
        });

    }
    }catch (error) {
        return res.status(500).json({ 
         message: 'Internal Server Error: ' + error.message });
    }
    
  };


//to get all staff members
exports.getAllStaffs = async(req,res)=>{
    try {    
        const companyId = req.params.companyId
    
        const staff = await newStaffModel.find({companyId}).populate('performance');  
        if(!staff || staff.length <= 0){
            return res.status(404).json({
                message:"No staff members"
            })
        } 
        res.status(200).json({
            message:`There are ${staff.length} staff members in this company`,
            data:staff
        })                                 
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}

exports.searchStaff = async(req,res) => {
    try {
        const { query } = req.query    
        const staff = await newStaffModel.find({$text: {$search: query}})     
        if(!staff || staff.length <= 0){
            return res.status(404).json({
                message:"No staff members"
            })
        }
     
        res.status(200).json({
            message:`There are ${staff.length} members`,
            data:staff
        })                                 
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}


//to get a staff member
exports.aStaff = async(req,res)=>{
    try {
        const id = req.params.id;

        const staff = await newStaffModel.findById(id)
        if(!staff || !staff || staff.length <= 0){
            return res.status(404).json({
                message:"This staff memeber is not found in this database"
            })
        }
        res.status(200).json({
            message:"Staff memeber found in this data",
            data: staff
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



//to remove a staff from database
exports.removeStaff = async(req,res) =>{
    try {
        const id = req.params.id
        
        // find the staff
        const staffToDelete = await newStaffModel.findById(id)

        const removeStaff = await newStaffModel.findByIdAndDelete(id)

        if(!removeStaff){
            return res.status(404).json({
                message:"staff not found in this database"
            })
        }
        res.status(200).json({
            message:"staff has been removed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message,
        });
    }
}



// to get staff by department
exports.getStaffByDepartmentAndCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId; // Assuming companyId is passed as a parameter
        const department = req.params.department; // Assuming department is passed as a parameter

        // Find the company based on the provided company ID
        const company = await userModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Query the database for staff members in the specified department for the company
        const staffInDepartment = await newStaffModel.find({ companyId: companyId, department: department });

        // Check if staff members were found
        if (staffInDepartment.length === 0) {
            return res.status(404).json({ message: `No staff members found in the ${department} department for the specified company` });
        }

        return res.status(200).json({
            message: `Staff members in the ${department} department for the specified company`,
            staff: staffInDepartment
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error: " + error.message
        });
    }
}


//function to assign a role
