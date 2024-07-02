La app debe permitir identificar la ubicacion de bienes dentro de un edificio. Inicialmente se desconoce la ubicación
Existen 2 tipos de bienes a identificar

1. Bienes que fueran donados por el MinCyT (~7000).
   1.1 Se dispone de un listado con codigo, descripcion y precio y cada bien tiene pegada una etiqueta con este codigo. Existe la posibilidad de que a algunos bienes se les haya despegado esta etiqueta. Ver carga manual
2. Bienes que los usuarios fueron llevando
   2.1 No hay listado, se sabe que cada bien tiene una etiqueta con XX/AAAA (x = numero, A = año ej: 14/2021)

Los bienes se encuentran disersos en el edificio.
El edificio tiene 3 pisos, 9 departamentos (sectores) a los que les pertenecen distintas oficinas (~300)

Por el momento solo se implementa la solucion con los bienes descriptosd en (1)

Metodos utilizados GET y PUT

DB

Las tablas principales son

Oficinas
id Autoincremental
nombre
descripción
area_id (fk a la tabla de areas)
pisos_id (fk a la tabla pisos)
cerrada (int 0/1 que permitirá establecer la oficina abierta/cerrada)

Bienes
id Autoincremental
descripción
precio
oficina_id (fk a tabla oficinas)
cod_SPAFE (originalmente vacío y solo para los bienes(2))
cod_MINCYT (completo con los codigos existenetes (desde 28011 al 36032) solo para bienes (1))
cuentas_idcuentas fk a la tabla cuentas

La app contara con 3 secciones (NAV???)

//ASIGNACION Metodos utilizados GET / PUT / DELETE

Obtener listados de oficinas que no se encuentren cerradas y mostrarlo en un Select

A.1 Como primer paso el usuario debe poder seleccionar una oficina a la cual empezará a asignar los bienes que encuentre en ella
Se guarda en una variable el id de oficina
A.2 Si encuentra un bien (1)
A.2.1 Ingresa el cod_MINCYT en un input, mosrando la desciprcion en pantalla (para verificar que coincida)
A.2.2 Se Guarda el valor de oficina_id en el registro antes seleccionado y se muestra en pantalla uno debajo de otro
A.2.3 Se debe poder eliminar el registro creado

A.3 Si encuentro un bien sin etiqueta
Corresponde a los bienes descriptos en (2) Por ahora no

A.4 Se debe poder cerrar una oficina

// UBICACIONES

Aca se muestran todas las oficinas (abiertas y cerradas)
Cosas a implementar
Que la lista de cards este ordenada por abierta/cerrada (un order by en la consulta creo que bastaría)
Que se pueda filtrar por piso como en la seccion asignar
Podriamos hacer uso de los metodos POST para crear una oficina y DELETE solo para borrar oficinas.
El crtiterio de borrar oficinas sería que como la lista de ubicaciones ya vino creada, muchas de ellas son ubicacioens que no nos interesaria porque no tienen bienes (ej un baño)
Sol oen estos casos hariamos uso de el metodo DELETE
Si borramos oficina hay que validar que no tenga bienes asignados previamente

// BIENES

Aca aun no pense

// AREAS

Se debe poder editar areas. Solo cambio de nombre (GET / PUT)
Opcional Crear Areas (POST)

//

