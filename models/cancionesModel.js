import db from '../config/db.js';

export const getAllSongs = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, titulo, artista, youtube_url FROM canciones ORDER BY created_at DESC';
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
