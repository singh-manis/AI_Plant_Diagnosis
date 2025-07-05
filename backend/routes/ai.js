const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/identify', auth, upload.single('image'), aiController.identifyPlant);
router.post('/diagnose', auth, upload.single('image'), aiController.diagnosePlant);
router.post('/care-advice', auth, aiController.getCareAdvice);
router.post('/care-schedule', auth, aiController.generateCareSchedule);
router.post('/growth-prediction', auth, aiController.predictGrowth);
router.post('/climate-care', auth, aiController.getClimateBasedCare);

module.exports = router; 