const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('photo'), diaryController.createEntry);
router.get('/', auth, diaryController.getEntries);
router.get('/plant/:plantId', auth, diaryController.getEntriesByPlant);
router.get('/:id', auth, diaryController.getEntryById);
router.put('/:id', auth, upload.single('photo'), diaryController.updateEntry);
router.delete('/:id', auth, diaryController.deleteEntry);

module.exports = router; 