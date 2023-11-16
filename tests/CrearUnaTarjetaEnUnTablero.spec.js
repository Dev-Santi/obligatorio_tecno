import { test, expect } from '@playwright/test';
const faker = require('faker');

// incluir los valores de autentificación
const authVariables = require('../helpers/authVariables');
const apiKey = authVariables.apiKey;
const token = authVariables.token;
const urlBase = authVariables.APIBaseUrl;

function verificarEstadoExitosoRequest(responseGeneral){
    expect(responseGeneral.ok).toBeTruthy();
    expect(responseGeneral.status()).toBe(200);
}

function verificarValorObtenidoEsElEsperado(obtenido, esperado){
    expect(obtenido).toBeDefined();
    expect(obtenido).toBe(esperado);
}

function verificarValorObtenidoContieneElEsperado(obtenido, esperado){
    expect(obtenido).toBeDefined();
    expect(obtenido).toContain(esperado);
}

function verificarAtributoEstaDefinido(obtenido){
    expect(obtenido).toBeDefined();
}

async function obtenerInfoTablero(request){
    const getTablero = await request.get(
        `${urlBase}/1/members/me/boards?key=${apiKey}&token=${token}`
    );
    verificarEstadoExitosoRequest(getTablero);
    return await getTablero.json();
}

async function crearLista(request, idTablero, nombreLista){
    const postLista = await request.post(
        `${urlBase}/1/boards/${idTablero}/lists?name=${nombreLista}&key=${apiKey}&token=${token}`,
        {
            headers: {
                "Accept": "application/json" // quiero serializar a JSON la response
            }
        });
    verificarEstadoExitosoRequest(postLista);
    return await postLista.json();
}

async function crearTarjeta(request, idLista, idUsuario, nombreTarjeta, descTarjeta){
    const postTarjeta = await request.post(
        `${urlBase}/1/cards?idList=${idLista}&key=${apiKey}&token=${token}`,
        {
            data: {
                // request payload
                "name": nombreTarjeta,
                "desc": descTarjeta,
                "pos": "top", // la posiciona a la tarjeta en la cima de la lista
                "idMembers": [idUsuario]
            },
            headers: {
                "Accept": "application/json"
            }
        }); // fin de la request
    verificarEstadoExitosoRequest(postTarjeta);
    return await postTarjeta.json();
}

test('Obtener información del Tablero', async ({ request }) => {
    const getTableroResponse = await obtenerInfoTablero(request);
    // Assertions
    verificarValorObtenidoEsElEsperado(getTableroResponse[0].id, "653c489faf3487081577ebcf");
    // Espero que el tablero esté abierto (disponible para agregarle tarjetas)
    verificarValorObtenidoEsElEsperado(getTableroResponse[0].closed, false);
    verificarValorObtenidoContieneElEsperado(getTableroResponse[0].name, "Mi tablero de Trello");
    // Mostrar la información del primer tablero del usuario por la salida estándar (se muestra en el reporte HTML)
    console.log(getTableroResponse[0]);
}); // fin del test

test('Crear una Lista y Tarjeta en el Tablero', async ({ request }) => {

    // Obtener ID del tablero e ID de su creador (= mi ID de usuario en Trello)
    const getTableroResponse = await obtenerInfoTablero(request);
    let idTablero = getTableroResponse[0].id;
    let idUsuario = getTableroResponse[0].idMemberCreator;

    // Crear la lista en la que vamos a colocar la tarjeta
    let nombreLista = faker.lorem.words(2); // Genera un nombre random de 2 palabras
    const postListaResponse = await crearLista(request, idTablero, nombreLista);

    // Assertions
    verificarValorObtenidoEsElEsperado(postListaResponse.name, nombreLista);
    verificarValorObtenidoEsElEsperado(postListaResponse.idBoard, idTablero);
    expect(postListaResponse.id).toBeDefined();

    let idLista = postListaResponse.id;

    // Crear la tarjeta
    const nombreTarjeta = faker.lorem.words(4);
    const descTarjeta = faker.lorem.words(15);
    const postTarjetaResponse = await crearTarjeta(request, idLista, idUsuario, nombreTarjeta, descTarjeta);

    // Assertions
    verificarAtributoEstaDefinido(postTarjetaResponse.id);
    verificarValorObtenidoEsElEsperado(postTarjetaResponse.name, nombreTarjeta);
    verificarValorObtenidoEsElEsperado(postTarjetaResponse.desc, descTarjeta);
    verificarValorObtenidoEsElEsperado(postTarjetaResponse.idBoard, idTablero);
    verificarValorObtenidoEsElEsperado(postTarjetaResponse.idList, idLista);
    verificarValorObtenidoEsElEsperado((postTarjetaResponse.idMembers)[0], idUsuario);
    verificarValorObtenidoEsElEsperado(postTarjetaResponse.subscribed, true);
    verificarAtributoEstaDefinido(postTarjetaResponse.shortUrl);
    verificarValorObtenidoContieneElEsperado(postTarjetaResponse.url, postTarjetaResponse.shortUrl);

    console.log(postTarjetaResponse);

}); // fin del test