const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('photo'), plantController.createPlant);
router.get('/', auth, plantController.getPlants);
router.get('/:id', auth, plantController.getPlantById);
router.put('/:id', auth, upload.single('photo'), plantController.updatePlant);
router.delete('/:id', auth, plantController.deletePlant);

module.exports = router; 