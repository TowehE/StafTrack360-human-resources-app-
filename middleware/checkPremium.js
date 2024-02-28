// Middleware to check if a user is within the trial period
function isWithinTrialPeriod(user) {
    if (!user.createdAt) 
        return false;
    const trialPeriodInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return Date.now() - user.createdAt <= trialPeriodInMs;
}



// Middleware to check if the user has access to premium features
function checkPremiumAccess(req, res, next) {
    if (req.user && (req.user.isPremium  || isWithinTrialPeriod(req.user))) {
        // User is subscribed or within trial period, grant access
        next();
    } else {
        // User does not have access to premium features
        res.status(403).json({ message: 'Premium access required' });
    }
}