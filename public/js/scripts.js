document.addEventListener("DOMContentLoaded", function () {
  const oficinaSelect = document.getElementById("oficinaSelect");
  const bienInput = document.getElementById("bienInput");
  const bienInputManual = document.getElementById("bienInputManual");
  const bienInputEdit = document.getElementById("bienInputEdit");
  const nombreBienContainer = document.getElementById("nombreBienContainer");
  const asignarBienButton = document.getElementById("asignarBtn");
  const cerrarUbicBtn = document.querySelector("#cerrarUbicacion");
  const mensajeEstado = document.getElementById("mensajeEstado");
  const mensajeEstadoS4 = document.getElementById("mensajeEstadoS4");
  const nav__btns = document.querySelectorAll(".nav__link");
  const radios = document.getElementsByName("nivel");
  const ubicacionesContainer = document.getElementById("ubicacionesContainer");
  const descripcionBienContainer = document.getElementById(
    "descripcionBienContainer"
  );
  const modal = document.getElementById("editModal");
  const span = document.getElementsByClassName("close")[0];
  const submitEdit = document.getElementById("submitEdit");
  let currentCod = "";

  // Elementos de pestaña Oficinas
  const selectCrearOfi = document.getElementById("radioCrearOfi");
  const selectBorrarOfi = document.getElementById("radioBorrarOfi");
  const seccionCrear = document.getElementById("sectionCrear");
  const seccionBorrar = document.getElementById("sectionBorrar");
  const inputDescOfi = document.getElementById("descOfi");
  const inputNumOfi = document.getElementById("numOfi");
  const inputAreaOfi = document.getElementById("areaOfi");
  const inputPisoOfi = document.getElementById("pisoOfi");
  const btnCrearOfi = document.getElementById("btnCrearOfi");
  const btnBorrarOfi = document.getElementById("btnBorrarOfi");
  const inputIdOfi = document.getElementById("ofiId");
  //#################################################################################
  //MODAL;
  //#################################################################################
  function openModal(cod) {
    bienInputEdit.value = "";
    currentCod = cod;
    modal.style.display = "block";
    bienInputEdit.focus();
    console.log(`codigo que llega al modal ${cod}`);
  }

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  //#################################################################################
  //LISTENERS;
  //#################################################################################

  for (const radio of radios) {
    radio.addEventListener("change", actualizarUbicaciones);
  }

  //Al cambiar de oficina llama a la funcion que recupera los bienes asignados a esa oficina
  oficinaSelect.addEventListener("change", function () {
    const idOficinaSeleccionada = oficinaSelect.value;
    limpiarCodigo();
    mostrarBienesOficina(idOficinaSeleccionada);
  });

  // Valido que el bien tenga 5 digitos (Cod_MINCYT es un numero que va desde 28011 hasta 36032 y muestro la descripcion del bien )
  bienInput.addEventListener("input", function () {
    bienInputManual.value = "";
    const codigoBien = bienInput.value;

    if (codigoBien.length !== 5) {
      nombreBienContainer.textContent = "";
      return;
    }
    mostrarDescripcionBien(codigoBien, nombreBienContainer);
  });
  bienInputManual.addEventListener("input", function () {
    bienInput.value = "";
    const codigoBien = bienInputManual.value;

    if (codigoBien.length !== 5) {
      nombreBienContainer.textContent = "";
      return;
    }
    mostrarDescripcionBien(codigoBien, nombreBienContainer);
  });

  bienInputEdit.addEventListener("input", function () {
    const codigoBien = bienInputEdit.value;

    if (codigoBien.length !== 5) {
      descripcionBienContainer.textContent = "";
      return;
    }
    mostrarDescripcionBien(codigoBien, descripcionBienContainer);
  });

  asignarBienButton.addEventListener("click", function () {
    const idOficina = oficinaSelect.value;

    const codigoBien = bienInput.value || bienInputManual.value;
    //TODO Hay que hacer que el input en el que pongo el codigo borre el contenido del otro input

    if (codigoBien.length !== 5) {
      mostrarMensaje("Por favor ingrese el código completo del bien.", "error");
      return;
    }
    bienInput.value
      ? agregarBien(idOficina, codigoBien)
      : agregarBienManual(idOficina, codigoBien);
  });

  //Abrir/Cerrar oficinas
  cerrarUbicBtn.addEventListener("click", () => {
    const idOficinaSeleccionada = oficinaSelect.value;
    if (!idOficinaSeleccionada) {
      mostrarMensaje("Seleccione una oficina antes de cerrar.", "error");
      return;
    }
    cerrarOficina(idOficinaSeleccionada);
  });

  

  //Crear Oficina
  selectCrearOfi.addEventListener("click", () => {
    seccionBorrar.style.display= "none"
    seccionCrear.style.display= "block"
    btnCrearOfi.style.display= "block"
    btnBorrarOfi.style.display= "none"
  })
  btnCrearOfi.addEventListener("click", async ()=>{
    
    descOfi = inputDescOfi.value;
    numOfi = inputNumOfi.value;
    areaOfi = inputAreaOfi.value;
    pisoOfi = inputPisoOfi.value;

    try {
      await crearOficina(descOfi,numOfi,areaOfi,pisoOfi);
        inputDescOfi.value=null;
        inputNumOfi.value=null;
        inputAreaOfi.value=null;
        inputPisoOfi.value=null;
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al Crear la Oficina.");
    }
  })

  // Borrar Oficina
  selectBorrarOfi.addEventListener("click", () => {
    seccionBorrar.style.display= "block"
    seccionCrear.style.display= "none"
    btnCrearOfi.style.display= "none"
    btnBorrarOfi.style.display= "block"
  })
  btnBorrarOfi.addEventListener("click", async ()=>{
    
    idOfi=inputIdOfi.value;

    if(idOfi == ""){
      mostrarMensajeS4("ID inválido","error")
      return;
    }

    try {
      await borrarOficina(idOfi);
        idOfi.value = null;
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al Crear la Oficina.");
    }
  })



  submitEdit.addEventListener("click", async () => {
    const newCode = bienInputEdit.value;
    console.log(currentCod);
    console.log(newCode);
    if (!newCode) {
      alert("Debe seleccionar el código de un bien similar");
      return;
    }

    try {
      await editarBien(currentCod, newCode);
      modal.style.display = "none";
      await mostrarDescripcionBien(currentCod, nombreBienContainer);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al editar el bien.");
    }
  });

  //#################################################################################
  //NAV;
  //#################################################################################
  //Oculto secciones NAV

  document.querySelector(".nav__links").addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.classList.contains("nav__link")) {
      const id = e.target.getAttribute("href");

      nav__btns.forEach((b) => {
        if (id === b.getAttribute("href")) {
          document.querySelector(b.getAttribute("href")).style.display =
            "block";
        } else {
          document.querySelector(b.getAttribute("href")).style.display = "none";
        }
      });
      if (id === "#section--2") {
        mostrarUbicaciones(); // Llamar a mostrarUbicaciones al mostrar la sección 2
      }
    }
  });

  //#################################################################################
  //AUXILIARES;
  //#################################################################################
  // Elimina contenido del select

  function actualizarUbicaciones() {
    const valorSeleccionado = document.querySelector(
      'input[name="nivel"]:checked'
    );

    if (!valorSeleccionado) {
      mostrarMensaje("Seleccione un piso.", "error");
      return;
    }

    console.log(valorSeleccionado);
    oficinaPorPiso(valorSeleccionado.value);
  }

  //Borra contenid ode Select principal
  function clearSelect() {
    oficinaSelect.innerHTML =
      '<option value="" disabled selected>Seleccione oficina</option>';
  }
  //borra el input de busqueda MINCYT y la desripcion
  function limpiarCodigo() {
    bienInput.value = "";
    nombreBienContainer.textContent = "";
  }

  function mostrarMensaje(mensaje, tipo) {
    mensajeEstado.textContent = mensaje;
    mensajeEstado.style.display = "block";
    mensajeEstado.style.color = tipo === "error" ? "red" : "green";
    setTimeout(() => {
      mensajeEstado.style.display = "none";
    }, 3000);
  }

  function mostrarMensajeS4(mensaje, tipo) {
    mensajeEstadoS4.textContent = mensaje;
    mensajeEstadoS4.style.display = "block";
    mensajeEstadoS4.style.color = tipo === "error" ? "red" : "green";
    setTimeout(() => {
      mensajeEstadoS4.style.display = "none";
    }, 3000);
  }
  //##################################################################################

  //Cargar la lista de oficinas en el select

  async function cerrarOficina(oficina) {
    try {
      const response = await fetch(`/ubicaciones/cerrar/${oficina}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      mostrarMensaje("Ubicación cerrada correctamente.", "ok");
      mostrarOficinas();
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Error al cerrar la oficina.", "error");
    }
  }

  async function mostrarOficinas() {
    clearSelect();

    try {
      const response = await fetch("/ubicaciones/abiertas");
      const data = await response.json();
      data.forEach((oficina) => {
        const option = document.createElement("option");
        option.value = oficina.id;
        option.textContent = `${oficina.nombre} - ${oficina.descripcion}`;
        oficinaSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al obtener las oficinas:", error);
      mostrarMensaje("Error al obtener las oficinas.", "error");
    }
  }

  // Funcion Crear Oficina
  async function crearOficina(descOfi, numOfi, areaOfi, pisoOfi){
    
    const areaOfiI = parseInt(areaOfi)
    const pisoOfiI = parseInt(pisoOfi)
    
    const nuevaOfi={
      descOfi:descOfi,
      numOfi:numOfi,
      areaOfi:areaOfiI,
      pisoOfi:pisoOfiI
    }
  
    try {
      const response = await fetch("/ubicaciones/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaOfi),
      });
      
      if (!response.ok) {
        throw new Error("Error al crear la oficina");
      }

      mostrarMensajeS4("Oficina creada correctamente", "success");
      
    } catch (error) {
      console.error("Error al crear la oficina:", error);
      mostrarMensajeS4("Error al crear la oficina.", "error");
    }
  }

  // Funcion Borrar Oficina
  async function borrarOficina(idOfi){
    idOfiI = parseInt(idOfi);

    const ofiId = {
      ofiIdi:idOfiI
    }

    try {
      const responseDel = await fetch("/ubicaciones/borrar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ofiId),
      });
      
      if (!responseDel.ok) {
        throw new Error("Error al eliminar la oficina");
      }

      mostrarMensajeS4("Oficina eliminada correctamente", "success");
      
    } catch (error) {
      console.error("Error al eliminar la oficina:", error);
      mostrarMensajeS4("Error al eliminar la oficina.", "error");
    }
  }

  //Listamos las ubicaciones en formato card
  async function mostrarUbicaciones() {
    try {
      const response = await fetch("/ubicaciones");
      const data = await response.json();

      ubicacionesContainer.innerHTML = ""; // Limpiar el contenedor en cada consulta porque se añadian a las existentes

      data.forEach((ubicacion) => {
        const div = document.createElement("div");
        div.className = "ubicacion-card";
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${ubicacion.nombre} - ${
          ubicacion.descripcion
        }</p>
          <p><strong>Estado:</strong> ${
            ubicacion.cerrada ? "Cerrada" : "Abierta"
          }</p>
        `;

        const toggleButton = document.createElement("button");
        toggleButton.textContent = ubicacion.cerrada ? "Abrir" : "Cerrar";
        toggleButton.className = ubicacion.cerrada
          ? "btn btn-success"
          : "btn btn-danger";
        toggleButton.addEventListener("click", function () {
          toggleEstadoUbicacion(ubicacion.id, !ubicacion.cerrada);
        });

        div.appendChild(toggleButton);
        ubicacionesContainer.appendChild(div);
      });
    } catch (error) {
      console.error("Error al obtener las ubicaciones:", error);
      mostrarMensaje("Error al obtener las ubicaciones.", "error");
    }
  }
  //recibe el piso seleccionado en los radios y muestra una lista de oficinas mas corta
  async function oficinaPorPiso(piso) {
    clearSelect();
    try {
      const response = await fetch(`/ubicaciones/${piso}`);
      const data = await response.json();
      data.forEach((oficina) => {
        const option = document.createElement("option");
        option.value = oficina.id;
        option.textContent = `${oficina.nombre} - ${oficina.descripcion}`;
        oficinaSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al obtener las oficinas:", error);
      mostrarMensaje("Error al obtener las oficinas.", "error");
    }
  }
  //vuelve a poner NULL el campo oficinas_id de la tabla bienes
  //Si un bien tiene Null en ese campo se entiende que no esta asignado
  async function eliminarAsignacion(codigoBien, idOficinaSeleccionada) {
    try {
      const response = await fetch("/bienes/eliminar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo_bien: codigoBien }),
      });

      const data = await response.json();
      mostrarMensaje("Asignación eliminada correctamente.", "ok");
      mostrarBienesOficina(idOficinaSeleccionada); // hago un reload de los bienes que estan asignados
    } catch (error) {
      console.error("Error al eliminar la asignación del bien:", error);
      mostrarMensaje("Error al eliminar la asignación del bien.", "error");
    }
  }
  //Busco en la tabla bienes todos los que oficinas_id = idOficinaSeleccionada y creo las cards
  async function mostrarBienesOficina(idOficinaSeleccionada) {
    try {
      const response = await fetch(`/bienes/bienesOf/${idOficinaSeleccionada}`);
      const data = await response.json();
      bienesAsignadosContainer.innerHTML = "";
      data.forEach((bien) => {
        const div = document.createElement("div");
        console.log(bien.cuentas_idcuentas);
        bien.cuentas_idcuentas
          ? (div.className = "bien-card")
          : (div.className = "bien-card revisar");
        div.innerHTML = `<p><strong>Código:</strong> ${bien.cod_MINCYT}</p>
                         <p><strong>Descripción:</strong> ${bien.descripcion}</p>`;
        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.className = "btn btn-danger";
        eliminarButton.addEventListener("click", function () {
          eliminarAsignacion(bien.cod_MINCYT, idOficinaSeleccionada); //creo un boton para eliminar el bien
        });

        div.appendChild(eliminarButton);
        bienesAsignadosContainer.appendChild(div);
      });
    } catch (error) {
      console.error("Error al obtener los bienes asignados:", error);
    }
  }
  //busca en la DB el cod_MINCYT y muestra la descripción
  async function mostrarDescripcionBien(cod, container) {
    try {
      const response = await fetch(`/bienes/nom/?cod=${cod}`);
      const data = await response.json();
      container.textContent = "";
      const descripcionElemento = document.createElement("span");
      descripcionElemento.textContent = data.descripcion;

      const editIcon = document.createElement("i");
      editIcon.classList.add("fa-regular", "fa-pen-to-square");
      editIcon.style.cursor = "pointer";
      editIcon.style.marginLeft = "10px";

      editIcon.addEventListener("click", () => {
        openModal(cod);
      });

      container.appendChild(descripcionElemento);
      container.appendChild(editIcon);

      // nombreBienContainer.textContent = data.descripcion;
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Error al obtener el nombre del bien.", "error");
    }
  }

  async function editarBien(codigoBienViejo, codigoBienNuevo) {
    try {
      const response = await fetch("/bienes/editar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoBienViejo,
          codigoBienNuevo,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al editar el bien");
      }

      const data = await response.json();
      return data;
      // mostrarMensaje("Asignación eliminada correctamente.", "ok");
      // mostrarBienesOficina(idOficinaSeleccionada); // hago un reload de los bienes que estan asignados
    } catch (error) {
      console.error("Error al eliminar la asignación del bien:", error);
      // mostrarMensaje("Error al eliminar la asignación del bien.", "error");
    }
  }

  async function agregarBienManual(idOficina, codigoBien) {
    if (!idOficina) {
      mostrarMensaje("Debe seleccionar una oficina primero", "error");
      return;
    }
    try {
      const response = await fetch(`/bienes/nombre/${codigoBien}`);
      const data = await response.json();

      if (!data || !data.descripcion || !data.precio) {
        throw new Error("Datos del bien incompletos");
      }

      const nuevoBien = {
        descripcion: data.descripcion,
        precio: data.precio,
        cuenta: data.cuentas_idcuentas || null,
        oficina: idOficina,
      };

      console.log(nuevoBien);

      const insertResponse = await fetch("/bienes/cargaManual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoBien),
      });

      if (!insertResponse.ok) {
        throw new Error("Error al insertar el nuevo bien en la base de datos");
      }

      mostrarMensaje("Bien agregado correctamente.", "success");
      limpiarCodigo(); //limpiamos input y descripcion
      mostrarBienesOficina(idOficina); //Relaod de los bienes de la oficina
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Error al agregar el bien.", "error");
    }
  }

  //actualizamos el campo oficinas_id de la tabla bienes con idOficina para el registro cuyo cod_MINCYT = codigoBien
  async function agregarBien(idOficina, codigoBien) {
    if (!idOficina) {
      mostrarMensaje("Debe seleccionar una oficina primero", "error");
      return;
    }
    try {
      const response = await fetch("/bienes/agregar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo_bien: codigoBien,
          id_ubicacion: idOficina,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Error al asignar el bien a la ubicación"
        );
      }

      const data = await response.json();
      mostrarMensaje(
        "El bien ha sido asignado a la ubicación correctamente.",
        "ok"
      );
      limpiarCodigo(); //limpiamos input y descripcion
      mostrarBienesOficina(idOficina); //Relaod de los bienes de la oficina
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje(error.message, "error");
    }
  }

  async function toggleEstadoUbicacion(idUbicacion, nuevoEstado) {
    try {
      const response = await fetch(
        `/ubicaciones/cambiarEstado/${idUbicacion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );
      const data = await response.json();
      mostrarMensaje("Ubicación actualizada correctamente.", "ok");
      mostrarUbicaciones();
      mostrarOficinas();
    } catch (error) {
      console.error("Error al actualizar la ubicación:", error);
      mostrarMensaje("Error al actualizar la ubicación.", "error");
    }
  }

  mostrarOficinas();
});
