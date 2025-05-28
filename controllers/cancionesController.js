import { getAllSongs } from '../models/cancionesModel.js';
import ytdl from 'ytdl-core';

export const getSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Error fetching songs' });
  }
};

import { insertSong } from '../models/cancionesModel.js';

export const getYoutubeInfo = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
    }
    const info = await ytdl.getInfo(url);
    const result = {
      nombre: info.videoDetails.title,
      artista: info.videoDetails.author.name,
      youtube_url: url,
      fecha: new Date()
    };
    // Save song to database
    try {
      const insertId = await insertSong(result.nombre, result.artista, result.youtube_url);
      result.id = insertId;
    } catch (dbError) {
      console.error('Error saving song to database:', dbError);
      return res.status(500).json({ error: 'Error saving song to database' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching YouTube info:', error);
    res.status(500).json({ error: 'Error fetching YouTube info' });
  }
};
