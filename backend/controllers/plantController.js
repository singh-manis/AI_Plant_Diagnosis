const Plant = require('../models/Plant');

exports.createPlant = async (req, res) => {
  try {
    const plantData = { ...req.body, user: req.user.id };
    if (req.file) {
      plantData.photoUrl = `/uploads/${req.file.filename}`;
    }
    const plant = new Plant(plantData);
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.user.id });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, user: req.user.id });
    if (!plant) return res.status(404).json({ msg: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updatePlant = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }
    const plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );
    if (!plant) return res.status(404).json({ msg: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!plant) return res.status(404).json({ msg: 'Plant not found' });
    res.json({ msg: 'Plant deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 