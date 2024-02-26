const express = require('express');

const router = express.Router();

const { AddperformanceRating, viewOne, viewAll, updatePerformance, deleteScore, getPerformanceByCreatedAt } = require('../controller/peformanceRatingController');

const { authenticate, authorizeRole } = require('../middleware/authentication');

//endpoint to add performance rating fora staff
router.post('/addperf/:staffId/:companyId', authenticate, authorizeRole('admin','hod', 'cto', 'manager'), AddperformanceRating);

//endpoint to view performance rating fora staff
router.get('/viewperf/:performanceID', viewOne);

//endpoint to view all staff performance
router.get('/viewall/:businessId', authenticate, authorizeRole('admin',), viewAll);


//endpoint to update all staff performance
router.get('/updateScore/:id/:performanceId', authenticate, authorizeRole('admin','hod', 'cto', 'manager'), updatePerformance);

//endpoint to delete all staff 
router.delete('/deleteScore/:staffId/:companyId',  authenticate, authorizeRole('admin'),deleteScore);


//endpoint to rate staff monthly, yearly and quarterly 
router.get('/performanceperinterval/:staffId', getPerformanceByCreatedAt);




module.exports = router;