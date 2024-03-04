const express = require('express');

const router = express.Router();

const { AddperformanceRating, viewOne, viewAll, updatePerformance, deleteScore, getPerformanceByCreatedAt, getPerformanceByCompanyId} = require('../controller/peformanceRatingController');

const { authenticate, authorizeRole, checkPremiumAccess } = require('../middleware/authentication');

//endpoint to add performance rating fora staff
router.post('/addperf/:staffId/:companyId', authenticate, authorizeRole('admin','hod',),checkPremiumAccess, AddperformanceRating);

//endpoint to view performance rating fora staff
router.get('/viewperf/:performanceID', authenticate,checkPremiumAccess,viewOne);

//endpoint to view all staff performance
router.get('/viewall/:businessId', authenticate, authorizeRole('admin',),checkPremiumAccess, viewAll);


//endpoint to update all staff performance
router.get('/updateScore/:id/:performanceId', authenticate, authorizeRole('admin','hod',), checkPremiumAccess, updatePerformance);

//endpoint to delete all staff 
router.delete('/deleteScore/:staffId/:companyId',  authenticate, authorizeRole('admin'),checkPremiumAccess,deleteScore);


//endpoint to rate staff monthly, yearly and quarterly 
router.get('/performanceperinterval/:staffId', authenticate,checkPremiumAccess,getPerformanceByCreatedAt);


//endpoint to rate all staff monthly, yearly and quarterly
router.get('/company/:companyId/performance', authenticate, authorizeRole("admin"), checkPremiumAccess,getPerformanceByCompanyId);





module.exports = router;