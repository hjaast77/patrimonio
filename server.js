const express = require("express");
const path = require("path");

const app = express();
const bienesRouter = require("./routes/bienesRouter.js");
const oficinasRouter = require("./routes/oficinasRouter.js");
const { checkConnection } = require("./models/db");
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/bienes", bienesRouter);
app.use("/ubicaciones", oficinasRouter);

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
  checkConnection();
});
