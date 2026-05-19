const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const Tarea = require("../models/tarea");

router.get("/tareas", auth, async (req, res) => {
  try {

    const tareas = await Tarea.find({
  usuario: req.usuario.id
}).populate("usuario", "-password");

    res.json(tareas);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al obtener tareas"
    });

  }
});

router.get("/tareas/:id", async (req, res) => {
    try{
        const tarea = await Tarea.findById(req.params.id)
        if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    res.json(tarea);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la tarea" });
  }

});

router.put("/tareas/:id", auth, async (req, res) => {

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

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al actualizar tarea"
    });

  }

});

router.delete("/tareas/:id", auth, async (req, res) => {

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

    res.status(500).json({
      mensaje: "Error al eliminar tarea"
    });

  }

});

router.post("/tareas", auth, async (req, res) => {
  try {

    if (!req.body.titulo) {
      return res.status(400).json({
        mensaje: "El título es obligatorio"
      });
    }

    const nuevaTarea = new Tarea({
  titulo: req.body.titulo,
  usuario: req.usuario.id
});

    await nuevaTarea.save();

    res.json(nuevaTarea);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear tarea"
    });
  }
});

router.put("/tareas/:id", async (req, res) => {
  try {

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tareaActualizada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    res.json(tareaActualizada);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error en el servidor"
    });
  }
});

router.delete("/tareas/:id", async (req, res) => {
  try {

    const tareaEliminada = await Tarea.findByIdAndDelete(
      req.params.id
    );

    if (!tareaEliminada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    res.json({
      mensaje: "Tarea eliminada correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error en el servidor"
    });

  }
});

module.exports = router;


