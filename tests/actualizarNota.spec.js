let { test, expect } = require("@playwright/test");
let authVariables = require("../helpers/authVariables");

let APIKey = authVariables.apiKey;
let APIToken = authVariables.token;
let urlBase = authVariables.APIBaseUrl;

let idTablero = "gDSmvici"; // Identificador del tablero donde se realizan los cambios
let idNota = "OVXHxZhS"; // Identificador de la nota que vamos a cambiar de lista.
let listaReceptora = "Hecho"; // Nombre de la lista que recibe la nota.

/* -------- */

test("Mover nota a una nueva lista", async function ({ request }) {
  let listas = await obtenerListas(request);
  expect(listas.status()).toBe(200);

  let listasParseadas = await listas.json();
  let listaBuscada = obtenerUnaLista(listasParseadas);

  let notaActualizada = await actualizarListaDeNota(request, listaBuscada);
  expect(notaActualizada.status()).toBe(200);
});

/* -------- */

async function obtenerListas(request) {
  return await request.get(`${urlBase}/1/boards/${idTablero}/lists?key=${APIKey}&token=${APIToken}`);
}

function obtenerUnaLista(listas) {
  let respuesta = "";
  for (let i = 0; i < listas.length && !respuesta; i++) {
    if (listas[i].name == listaReceptora) {
      respuesta = listas[i].id;
    }
  }
  return respuesta;
}

async function actualizarListaDeNota(request, lista) {
  return await request.put(`${urlBase}/1/cards/${idNota}?key=${APIKey}&token=${APIToken}`, {
    data: {
      idList: lista,
    },
  });
}
