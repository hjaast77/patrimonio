const db = require("../models/db");

const bienesPorOficina = async (req, res) => {
  const oficina_id = req.params.id;

  if (!oficina_id) {
    return res.status(400).json({ error: "Oficina ID no proporcionado" });
  }
  try {
    const [rows] = await db.pool.execute(
      "SELECT b.id, b.descripcion, b.cod_MINCYT from bienes b INNER JOIN oficinas o on b.oficinas_id = o.id WHERE o.id = ?",
      [oficina_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerBien = async (req, res) => {
  const codigoBien = req.params.cod;
  console.log("Código de bien:", codigoBien);
  if (!codigoBien) {
    return res.status(400).json({ error: "Código de bien no proporcionado" });
  }

  try {
    const [rows] = await db.pool.execute(
      "SELECT descripcion FROM bienes WHERE cod_MINCYT = ?",
      [codigoBien]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerBien2 = (req, res) => {
  const codigo = req.query.cod;
  console.log(codigo);
};

const agregarBien = async (req, res) => {
  const { codigo_bien, id_ubicacion } = req.body;
  try {
    const [rows] = await db.pool.execute(
      "SELECT * FROM bienes WHERE cod_MINCYT = ? AND oficinas_id IS NOT Null",
      [codigo_bien]
    );
    if (rows.length > 0) {
      res
        .status(400)
        .json({ error: "El bien ya está asignado a otra oficina." });
      return;
    }
    await db.pool.execute(
      "UPDATE bienes SET oficinas_id = ? WHERE cod_MINCYT = ?",
      [id_ubicacion, codigo_bien]
    );

    res.status(200).json({ message: "Bien asignado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarBien = async (req, res) => {
  const { codigo_bien } = req.body;

  try {
    await db.pool.execute(
      "UPDATE bienes SET oficinas_id = NULL WHERE id = (SELECT id FROM (SELECT id FROM bienes WHERE cod_MINCYT = ?) AS temp_table)",
      [codigo_bien]
    );
    res.status(200).json({ message: "Bien eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  bienesPorOficina,
  obtenerBien,
  obtenerBien2,
  agregarBien,
  eliminarBien,
};
