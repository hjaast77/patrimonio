const express = require("express");
const router = express.Router();
const db = require("../models/db");
const {
  listarOficinas,
  listarOficinasAbiertas,
  listarOficinasPorPiso,
  cambiarEstadoOficina,
  cerrarOficina,
  crearOficina,
  listarAreas,
  eliminarOficina,
} = require("../controllers/oficinasController");

router.get("/", listarOficinas);
router.get("/abiertas", listarOficinasAbiertas);
router.get("/:piso", listarOficinasPorPiso);
router.put("/cambiarEstado/:id", cambiarEstadoOficina);
router.put("/cerrar/:oficina", cerrarOficina);
router.post("/crear", crearOficina);
router.get("/areas/todas", listarAreas);
router.delete("/eliminarOf/:id", eliminarOficina);
module.exports = router;
