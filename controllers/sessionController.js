//sesionController.js

const sessionController = {
  getSession: (req, res) => {
    if (req.session && req.session.usuario) {
      res.status(200).json({
        loggedIn: true,
        usuario: req.session.usuario
      });
    } else {
      res.status(200).json({
        loggedIn: false,
        usuario: null
      });
    }
  }
};

export default sessionController;
