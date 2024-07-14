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
} = require("../controllers/oficinasController");

router.get("/", listarOficinas);
router.get("/abiertas", listarOficinasAbiertas);
router.get("/:piso", listarOficinasPorPiso);
router.put("/cambiarEstado/:id", cambiarEstadoOficina);
router.put("/cerrar/:oficina", cerrarOficina);
router.post("/crear", crearOficina);
module.exports = router;
