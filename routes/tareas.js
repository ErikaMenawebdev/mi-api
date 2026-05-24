const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const Tarea = require("../models/tarea");

router.get("/tareas", auth, async (req, res, next) => {
  try {

    const tareas = await Tarea.find({
  usuario: req.usuario.id
}).populate("usuario", "-password");

    res.json(tareas);

  } catch (error) {

  next(error);

}
  
});

router.get("/tareas/:id", auth, async (req, res, next) => {
    try{
        const tarea = await Tarea.findById(req.params.id)
        if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    res.json(tarea);

  } catch (error) {

  next(error);

}
  

});

router.put("/tareas/:id", auth, async (req, res, next) => {

  try {

    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    if (tarea.usuario.toString() !== req.usuario.id) {
      return res.status(401).json({
        mensaje: "No autorizado"
      });
    }

    tarea.titulo = req.body.titulo || tarea.titulo;

    if (req.body.completada !== undefined) {
      tarea.completada = req.body.completada;
    }

    await tarea.save();

    res.json(tarea);

  }  catch (error) {

  next(error);

}

  

});

router.delete("/tareas/:id", auth, async (req, res, next) => {

  try {

    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    if (tarea.usuario.toString() !== req.usuario.id) {
      return res.status(401).json({
        mensaje: "No autorizado"
      });
    }

    await tarea.deleteOne();

    res.json({
      mensaje: "Tarea eliminada"
    });

  } catch (error) {

  next(error);

}

});

router.post("/tareas", auth, async (req, res, next) => {
  try {

    if (!req.body.titulo) {
      return res.status(400).json({
        mensaje: "El título es obligatorio"
      });
    }

    const nuevaTarea = new Tarea({
  titulo: req.body.titulo,
  completada: req.body.completada,
  usuario: req.usuario.id
});

    await nuevaTarea.save();

    res.json(nuevaTarea);

  } catch (error) {

  next(error);

}
});

router.put("/tareas/:id", auth, async (req, res, next) => {

  try {

    // Buscar tarea por ID
    const tarea = await Tarea.findById(req.params.id);

    // Verificar si existe
    if (!tarea) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    // Verificar propietario
    if (tarea.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No autorizado"
      });
    }

    // Actualizar tarea
    if (req.body.titulo !== undefined) {
  tarea.titulo = req.body.titulo;
}

if (req.body.completada !== undefined) {
  tarea.completada = req.body.completada;
}
    // Guardar cambios
    await tarea.save();

    // Respuesta
    res.json(tarea);

  } catch (error) {

    next(error);

  }

});

module.exports = router;


