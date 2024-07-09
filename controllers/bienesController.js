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
      "SELECT descripcion, precio, cuentas_idcuentas FROM bienes WHERE cod_MINCYT = ?",
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

const agregarManual = async (req, res) => {
  const { descripcion, precio, cuenta, oficina } = req.body;

  if (!descripcion || !precio || !oficina) {
    return res
      .status(400)
      .json({ error: "Datos incompletos para agregar el bien" });
  }

  try {
    const [rows] = await db.pool.execute(
      "SELECT MAX(cod_MINCYT) as maxCod FROM bienes"
    );
    const maxCod = rows[0].maxCod || 0;
    const nuevoCodigo = maxCod + 1;
    console.log(nuevoCodigo);
    await db.pool.execute(
      "INSERT INTO bienes (descripcion, precio, cuentas_idcuentas, oficinas_id, cod_MINCYT) VALUES (?, ?, ?, ?, ?)",
      [descripcion, precio, cuenta, oficina, nuevoCodigo]
    );

    res.status(201).json({ message: "Bien agregado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editarBien = async (req, res) => {
  const { codigoBienViejo, codigoBienNuevo } = req.body;
  try {
    await db.pool.execute(
      `UPDATE bienes AS b1 JOIN (SELECT descripcion, precio, cuentas_idcuentas FROM bienes WHERE cod_MINCYT = ?) AS b2 SET b1.descripcion = b2.descripcion, b1.precio = b2.precio, b1.cuentas_idcuentas = b2.cuentas_idcuentas WHERE b1.cod_MINCYT = ?;`,
      [codigoBienNuevo, codigoBienViejo]
    );
    res.status(200).json({ message: "Bien editado correctamente." });
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
  agregarManual,
  editarBien,
};
