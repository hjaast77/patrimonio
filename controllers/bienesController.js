const db = require("../models/db");

//Lista los bienes de una oficina
const bienesPorOficina = async (req, res) => {
  const oficina_id = req.params.id;
  console.log(oficina_id);

  if (!oficina_id) {
    return res.status(400).json({ error: "Oficina ID no proporcionado" });
  }
  try {
    const [rows] = await db.pool.execute(
      "SELECT b.id, b.descripcion, b.cod_MINCYT, b.cuentas_idcuentas from bienes b INNER JOIN oficinas o on b.oficinas_id = o.id WHERE o.id = ?",
      [oficina_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Busca cod_MINCYT y Devuelve la descripcion. 
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

const obtenerBien2 = async (req, res) => {
  const codigo = req.query.cod;
  console.log(codigo);

  console.log("Código de bien:", codigo);
  if (!codigo) {
    return res.status(400).json({ error: "Código de bien no proporcionado" });
  }

  try {
    const [rows] = await db.pool.execute(
      "SELECT descripcion FROM bienes WHERE cod_MINCYT = ?",
      [codigo]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agregarBien = async (req, res) => {
  const { codigo_bien, id_ubicacion } = req.body;
  try {
    const [rows] = await db.pool.execute(
      "SELECT * FROM bienes WHERE cod_MINCYT = ? AND oficinas_id IS NOT Null",
      [codigo_bien]
    );
    if (rows.length > 0) {
      const [oficina] = await db.pool.execute(
        "SELECT nombre, descripcion FROM oficinas WHERE id = ?",
        [rows[0].oficinas_id]
      );

      res.status(400).json({
        error: `El bien ya está asignado a la oficina: ${oficina[0].nombre} - ${oficina[0].descripcion}`,
      });
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
      "UPDATE bienes SET oficinas_id = NULL, updated_date = NULL WHERE id = (SELECT id FROM (SELECT id FROM bienes WHERE cod_MINCYT = ?) AS temp_table)",
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
