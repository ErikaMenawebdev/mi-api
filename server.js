const express = require("express");
const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  }
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// get
// GET por ID
app.get("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.json(usuario);
});

// GET todos con filtro de nombre
app.get("/usuarios", async (req, res) => {
  try {
    const { nombre } = req.query;

    let usuarios;

    if (nombre) {
      usuarios = await Usuario.find({ nombre: nombre });
    } else {
      usuarios = await Usuario.find();
    }

    res.json(usuarios);

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// post

app.post("/usuarios", async (req, res) => {
  try {
    if (!req.body.nombre) {
      return res.status(400).json({ mensaje: "El nombre es obligatorio" });
    }

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();

    res.json({ mensaje: "Usuario guardado en MongoDB" });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// delete
app.delete("/usuarios/:id", async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Usuario eliminado" });
});

mongoose.connect("mongodb+srv://menapa444_db_user:erikamena444@cluster0.krqo4pw.mongodb.net/miapp?retryWrites=true&w=majority")
  .then(() => {
    console.log("Conectado a MongoDB");

    app.listen(3000, () => {
      console.log("Servidor en http://localhost:3000");
    });
  })
  .catch(err => console.log(err));


 