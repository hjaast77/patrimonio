document.addEventListener("DOMContentLoaded", function () {
  const oficinaSelect = document.getElementById("oficinaSelect");
  const bienInput = document.getElementById("bienInput");
  const nombreBienContainer = document.getElementById("nombreBienContainer");
  const asignarBienButton = document.getElementById("asignarBtn");
  const cerrarUbicBtn = document.querySelector("#cerrarUbicacion");
  const mensajeEstado = document.getElementById("mensajeEstado");
  const nav__btns = document.querySelectorAll(".nav__link");
  const radios = document.getElementsByName("nivel");
  const ubicacionesContainer = document.getElementById("ubicacionesContainer");

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
    const codigoBien = bienInput.value;

    if (codigoBien.length !== 5) {
      nombreBienContainer.textContent = "";
      return;
    }
    mostrarDescripcionBien(codigoBien);
  });

  asignarBienButton.addEventListener("click", function () {
    const idOficina = oficinaSelect.value;

    const codigoBien = bienInput.value;

    if (codigoBien.length !== 5) {
      mostrarMensaje("Por favor ingrese el código completo del bien.", "error");
      return;
    }
    agregarBien(idOficina, codigoBien);
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
    oficinaSelect.innerHTML = "";
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
      const response = await fetch(`/bienes/${idOficinaSeleccionada}`);
      const data = await response.json();
      bienesAsignadosContainer.innerHTML = "";
      data.forEach((bien) => {
        const div = document.createElement("div");
        div.className = "bien-card";
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
  async function mostrarDescripcionBien(cod) {
    try {
      const response = await fetch(`/bienes/nombre/${cod}`);
      const data = await response.json();
      nombreBienContainer.textContent = data.descripcion;
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Error al obtener el nombre del bien.", "error");
    }
  }

  //actualizamos el campo oficinas_id de la tabla bienes con idOficina para el registro cuyo cod_MINCYT = codigoBien
  async function agregarBien(idOficina, codigoBien) {
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
