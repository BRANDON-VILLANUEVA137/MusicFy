import { getAllSongs } from '../models/cancionesModel.js';
import ytdl from '@distube/ytdl-core';

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
      return res.status(400).json({ error: 'URL de YouTube no válida o faltante' });
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
      console.error('Error al guardar la canción en la base de datos:', dbError);
      return res.status(500).json({ error: 'Error al guardar la canción en la base de datos' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error al obtener la información de YouTube: ', error);
    if (error.message && error.message.includes('No se pudieron extraer funciones')) {
      res.status(500).json({ error: 'Error al analizar la información del vídeo de YouTube. Inténtalo de nuevo más tarde.' });
    } else {
      res.status(500).json({ error: 'Error al obtener la información de YouTube' });
    }
  }
};
