const express = require('express');
const router = express.Router();
const Song = require('../models/Songs'); // adjust path

// GET all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get songs' });
  }
});

// GET song by id
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get song' });
  }
});

// POST add new song
router.post('/', async (req, res) => {
  try {
    const newSong = new Song(req.body);
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add song' });
  }
});

// PATCH update song by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSong) return res.status(404).json({ error: 'Song not found' });
    res.json(updatedSong);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update song' });
  }
});

// DELETE song by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) return res.status(404).json({ error: 'Song not found' });
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete song' });
  }
});

module.exports = router;
