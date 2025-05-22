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
