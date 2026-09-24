/**
 * JWT es "stateless" por naturaleza, por lo que para poder invalidar un token
 * en el logout se usa una lista negra en memoria.
 *
 * NOTA para el proyecto: esto es suficiente para el alcance de este parcial.
 * En un sistema en produccion real esta lista se guardaria en Redis o en una
 * tabla de la base de datos para que sobreviva a un reinicio del servidor.
 */
const blacklist = new Set();

function agregarTokenALista(token) {
  blacklist.add(token);
}

function tokenEnLista(token) {
  return blacklist.has(token);
}

module.exports = { agregarTokenALista, tokenEnLista };
