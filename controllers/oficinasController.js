const db = require("../models/db");

const listarOficinas = async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      "SELECT * FROM oficinas ORDER BY cerrada DESC, nombre ASC;"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarOficinasAbiertas = async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      "SELECT * FROM oficinas WHERE cerrada <> 1 order by nombre"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarOficinasPorPiso = async (req, res) => {
  const piso = req.params.piso;
  let piso_id;
  if (piso === "SS") {
    piso_id = 1;
  } else if (piso === "PB") {
    piso_id = 2;
  } else if (piso === "PA") {
    piso_id = 3;
  } else {
    res.status(400).json({ error: "Piso no válido" });
    return;
  }

  try {
    const [rows] = await db.pool.execute(
      "SELECT * FROM oficinas WHERE cerrada <> 1 and pisos_id = ? order by nombre",
      [piso_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cambiarEstadoOficina = async (req, res) => {
  const idUbicacion = req.params.id;
  const nuevoEstado = req.body.estado ? 1 : 0;
  console.log(
    `Intentando cerrar oficina ${idUbicacion} con estado ${nuevoEstado}`
  );

  try {
    await db.pool.execute("UPDATE oficinas SET cerrada = ? WHERE id = ?", [
      nuevoEstado,
      idUbicacion,
    ]);
    res.status(200).json({ message: "Mensaje." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cerrarOficina = async (req, res) => {
  const oficinaId = req.params.oficina;
  console.log(`Intentando cerrar oficina ${oficinaId}`);
  try {
    await db.pool.execute("UPDATE oficinas SET cerrada = 1 WHERE id = ?", [
      oficinaId,
    ]);
    res.json({ message: `Oficina con ID ${oficinaId} cerrada` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearOficina = async (req, res) => {
  const { descOfi, numOfi, areaOfi, pisoOfi } = req.body;
  console.log(descOfi, numOfi, areaOfi, pisoOfi);
  console.log(
    `Intentando crear oficina ${descOfi} ${numOfi} ${areaOfi} ${pisoOfi}`
  );
  try {
    await db.pool.execute(
      "INSERT INTO oficinas (nombre,descripcion,area_id, pisos_id) VALUES (?,?,?,?)",
      [numOfi, descOfi, areaOfi, pisoOfi]
    );
    res.status(201).json({ message: "Oficina agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "No anda" + error.message });
  }
};

const listarAreas = async (req, res) => {
  try {
    const [rows] = await db.pool.execute("SELECT * FROM area;");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarOficina = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.pool.execute(
      "SELECT count(*) FROM bienes WHERE oficinas_id = ? ",
      [id]
    );
    const count = rows[0].count;
    if (count > 0) {
      return res.status(400).json({
        error: "La oficina tiene registros asociados y no se puede eliminar.",
      });
    }
    await db.pool.execute("DELETE FROM oficinas WHERE id = ?", [id]);
    res.status(200).json({ message: "Oficina eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la oficina:", error);
    res.status(500).json({ error: "Hubo un error al eliminar la oficina." });
  }
};

const listarTodasOficinas = async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      "SELECT * FROM oficinas ORDER BY nombre ASC;"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarOficinas,
  listarOficinasAbiertas,
  listarOficinasPorPiso,
  cambiarEstadoOficina,
  cerrarOficina,
  crearOficina,
  listarAreas,
  eliminarOficina,
  listarTodasOficinas,
};
