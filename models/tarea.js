const mongoose = require("mongoose");

const TareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },

  completada: {
    type: Boolean,
    default: false
  },

  usuario: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Usuario",
  required: true
},
});

const Tarea = mongoose.model("Tarea", TareaSchema);

module.exports = Tarea;
