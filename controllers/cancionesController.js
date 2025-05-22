import { getAllSongs } from '../models/cancionesModel.js';

export const getSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Error fetching songs' });
  }
};
