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



const authorizeRole = (role) => async (req, res, next) => {
    authenticate(req, res, async() => {
        if(role === req.user.role || req.user.role === 'hod' || req.user.role === 'admin') {
            next()
        } else {
            return res.status(401).json({
                message: "User not authorized"
            })
        }
    })
}



// Middleware to check if a user is within the trial period
function isWithinTrialPeriod(user) {
    if (!user.createdAt) 
        return false;
    const trialPeriodInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return Date.now() - user.createdAt <= trialPeriodInMs;
}


// Middleware to check if the user has access to premium features
function checkPremiumAccess(req, res, next) {
    authenticate(req, res, async() => {
        let user;
        user = await userModel.findById(req.user.userId);
        if (!user) {
        user = await staffModel.findById(req.user.userId);
        }
        if (!user) {
            return res.status(404).json({
                message: "Not authorized: User not found",
            });
        }
    if (req.user && (req.user.isPremium  || isWithinTrialPeriod(user))) {
        // User is subscribed or within trial period, grant access
        req.user.isPremium = true; 
        next();
    } else {
        // User does  not have access to premium features
        res.status(403).json({ message: 'Premium access required' });
    }
})
}

module.exports = {
    authenticate,
    authorizeRole,
    checkPremiumAccess,
    

}