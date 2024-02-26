const userModel = require('../Model/businessModel');
const staffModel = require('../Model/addStaffModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const authenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;
        if (!hasAuthorization) {
            return res.status(400).json({
                message: 'Invalid authorization',
            })
        }
        const token = hasAuthorization.split(" ")[1];
        if (!token) {
            return res.status(404).json({
                message: "Token not found",
            });
        }
        const decodeToken = jwt.verify(token, process.env.secret)
        let user;
        user = await userModel.findById(decodeToken.userId);
        if (!user) {
        user = await staffModel.findById(decodeToken.userId);
        }
        if (!user) {
            return res.status(404).json({
                message: "Not authorized: User not found",
            });
        }

        req.user = decodeToken;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError){
            return res.status(501).json({
                message: 'Session timeout, please login to continue',
            })
        }
        return res.status(500).json({
            error: "Authentication " + error.message,
        })        
    }
};

//authorization for admin
const admin = async(req, res, next) => {
    authenticate(req,res, async()=>{
        if(req.user.isAdmin){
            next()
        }else{
            return res.status(401).json({
                message:"User not authorized"
            })
        }
    })
}




// Middleware to check if user has required role
// const authorizeRole = (requiredRole) => (req, res, next) => {
//     const userRole = req.user.role;
//     if (userRole === requiredRole || userRole === 'hr' || userRole === 'admin') {
//       next();
//     } else {
//       return res.status(403).json({ message: 'Forbidden. You do not have the required role.' });
//     }
//   };


const authorizeRole = (role) => async (req, res, next) => {
    authenticate(req, res, async() => {
        if(role === req.user.role || req.user.role === 'hr' || req.user.role === 'admin') {
            next()
        } else {
            return res.status(401).json({
                message: "User not authorized"
            })
        }
    })
}


module.exports = {
    authenticate,
 
    authorizeRole,

}