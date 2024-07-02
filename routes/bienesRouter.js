const express = require("express");
const router = express.Router();
const db = require("../models/db");
const {
  bienesPorOficina,
  obtenerBien,
  obtenerBien2,
  agregarBien,
  eliminarBien,
} = require("../controllers/bienesController");

router.get("/bienesOf/:id", bienesPorOficina);
router.get("/nombre/:cod", obtenerBien);
router.get("/nom", obtenerBien2);
router.put("/agregar", agregarBien);
router.put("/eliminar", eliminarBien);

module.exports = router;
