const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

// GET
router.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find().select("-password");
  res.json(usuarios);
});

router.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar usuario" });
  }
});

// POST
router.post(
  "/usuarios",

  [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio"),

    body("email")
      .isEmail()
      .withMessage("Email inválido"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener mínimo 6 caracteres")
  ],

  async (req, res) => {

    const errores = validationResult(req);

if (!errores.isEmpty()) {
  return res.status(400).json({
    errores: errores.array()
  });
}

    const { nombre, email, password } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });

if (usuarioExiste) {
  return res.status(400).json({
    mensaje: "El email ya está registrado"
  });
}

const passwordEncriptada = await bcrypt.hash(password, 10);

const nuevoUsuario = new Usuario({
  nombre,
  email,
  password: passwordEncriptada
});
  await nuevoUsuario.save();

  res.json(nuevoUsuario);
});

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(400).json({
        mensaje: "Contraseña incorrecta"
      });
    }

   const token = jwt.sign(
  { id: usuario._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }

    );

    res.json({
      mensaje: "Login exitoso",
      token
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error en el servidor"
    });

  }

});

// DELETE
router.delete("/usuarios/:id", async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Usuario eliminado de MongoDB" });
});

// PUT (Actualizar usuario)
router.put("/usuarios/:id", async (req, res) => {
  if (!req.body.nombre) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre },
      { returnDocument: 'after' }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
});

module.exports = router;
