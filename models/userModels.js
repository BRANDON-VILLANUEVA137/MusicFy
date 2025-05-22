import db from '../../config/db.js';

const UserModel = {
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
        return rows[0];
    },
    createUser: async (nombre, correo, contrasena, esEmpresa, id_rol = 2) => {
        // esEmpresa is not a column in usuarios, so it might be stored in perfiles or elsewhere
        // id_rol default to 2 (Usuario_Normal)
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, id_rol) VALUES (?, ?, ?, ?)',
            [nombre, correo, contrasena, id_rol]
        );
        return result.insertId;
    },
    getAllUsers: async (search = '') => {
        let query = 'SELECT id, nombre, correo, id_rol FROM usuarios';
        let params = [];
        if (search) {
            query += ' WHERE nombre LIKE ? OR correo LIKE ?';
            const searchPattern = `%${search}%`;
            params = [searchPattern, searchPattern];
        }
        const [rows] = await db.query(query, params);
        return rows;
    },
    getUserById: async (id) => {
        const [rows] = await db.query('SELECT id, nombre, correo, id_rol FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    },
    updateUser: async (id, nombre, correo, id_rol) => {
        const [result] = await db.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, id_rol = ? WHERE id = ?',
            [nombre, correo, id_rol, id]
        );
        return result.affectedRows;
    },
    deleteUser: async (id) => {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

export default UserModel;