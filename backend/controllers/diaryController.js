const DiaryEntry = require('../models/DiaryEntry');

exports.createEntry = async (req, res) => {
  try {
    const entryData = { ...req.body, user: req.user.id };
    if (req.file) {
      entryData.photoUrl = `/uploads/${req.file.filename}`;
    }
    const entry = new DiaryEntry(entryData);
    await entry.save();
    await entry.populate('plant', 'name species');
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ user: req.user.id })
      .populate('plant', 'name species')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getEntriesByPlant = async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ 
      user: req.user.id, 
      plant: req.params.plantId 
    })
      .populate('plant', 'name species')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('plant', 'name species');
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }
    const entry = await DiaryEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    ).populate('plant', 'name species');
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await DiaryEntry.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json({ msg: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 