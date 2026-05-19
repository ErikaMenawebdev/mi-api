require("dotenv").config();
const usuariosRoutes = require("./routes/usuarios");
const conectarDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const tareasRoutes = require("./routes/tareas");


const app = express();
app.use(express.json());
app.use(cors());
app.use(tareasRoutes);
app.use(usuariosRoutes);

const Usuario = require("./models/Usuario");


conectarDB();

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});

  


