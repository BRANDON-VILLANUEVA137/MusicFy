import bcrypt from 'bcryptjs';
import UserModel from '../models/authUserModel.js';

const loginController = {
  login: async (req, res) => {
    const { correo, contrasena } = req.body;
      
    console.log('Datos recibidos en /api/login:', req.body);

    try {
      const user = await UserModel.findByEmail(correo);
      console.log('Usuario encontrado:', user);

      if (!user) {
        return res.status(401).json({ mensaje: 'Correo no registrado' });
      }

      const isMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (!isMatch) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }

      req.session.usuario = {
        id: user.id,
        correo: user.correo,
        id_rol: user.id_rol
      };

      // Return user role for frontend redirection
      let redirectTo = '/views/play.html';
      if (user.id_rol === 2) {
        redirectTo = '/views/admin/index.html';
      }

      res.status(200).json({ 
        mensaje: 'Login exitoso', 
        usuario: req.session.usuario,
        redirectTo
      });
    } catch (err) {
      console.error('❌ Error en login:', err);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  },

  register: async (req, res) => {
    const { nombre, correo, contrasena, id_rol } = req.body;

    try {
      const existente = await UserModel.findByEmail(correo);
      if (existente) {
        return res.status(400).json({ mensaje: 'Correo ya registrado' });
      }

      const hash = await bcrypt.hash(contrasena, 10);
      const nuevoId = await UserModel.createUser(nombre, correo, hash, id_rol);

      res.status(201).json({ mensaje: 'Usuario registrado', id: nuevoId });
    } catch (err) {
      console.error('❌ Error en registro:', err);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  }
};

export default loginController;