import db from '../config/db.js';

export const getAllSongs = async () => {
  const query = 'SELECT id, titulo, artista, youtube_url FROM canciones ORDER BY created_at DESC';
  try {
    const [results] = await db.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

export const insertSong = async (titulo, artista, youtube_url) => {
  const query = 'INSERT INTO canciones (titulo, artista, youtube_url) VALUES (?, ?, ?)';
  try {
    const [result] = await db.query(query, [titulo, artista, youtube_url]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};
