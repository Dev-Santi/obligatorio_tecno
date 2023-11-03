import {test, expect} from '@playwright/test';
const faker = require('faker');

// incluir los valores de autentificación
const authVariables = require('../helpers/authVariables');
const apiKey = authVariables.apiKey;
const token = authVariables.token;

/* GHERKIN SPEC
  Escenario: Crear una tarjeta en un tablero de Trello
  Dado que estoy autenticado en Trello
  Y creo una lista dentro de mi tablero
  Cuando creo una tarjeta
  Entonces la tarjeta se crea con éxito en el tablero
*/

test('Obtener información del Tablero', async ({request}) => {
    const getTablero= await request.get(
        `/1/members/me/boards?key=${apiKey}&token=${token}`
    );
    const getTableroResponse = await getTablero.json();
    // Assertions
    expect(getTablero.ok).toBeTruthy();
    expect(getTablero.status()).toBe(200);
    expect(getTableroResponse[0].id).toBeDefined();
    expect((getTableroResponse[0]).id).toBe("653c489faf3487081577ebcf");
    expect(getTableroResponse[0].closed).toBeDefined();
    expect((getTableroResponse[0]).closed).toBe(false); // Espero que el tablero esté abierto (disponible para agregarle tarjetas)
    expect(getTableroResponse[0].name).toBeDefined();
    expect((getTableroResponse[0]).name).toContain("Mi tablero de Trello");
    // Mostrar la información de los tableros del usuario por la salida estándar (se muestra en el reporte HTML)
    console.log(getTableroResponse[0]);
}); // fin del test

test('Crear una Lista y Tarjeta en el Tablero', async ({request}) => {

    // Obtener ID del tablero e ID de su creador (= mi ID de usuario en Trello)
    const getTablero = await request.get(
        `/1/members/me/boards?key=${apiKey}&token=${token}`
    );
    const getTableroResponse = await getTablero.json();
    let idTablero = getTableroResponse[0].id;
    let idUsuario = getTableroResponse[0].idMemberCreator;

    // Crear la lista en la que vamos a colocar la tarjeta
    let nombreLista = faker.lorem.words(2); // Genera un nombre random de 2 palabras
    const postLista = await request.post(`/1/boards/${idTablero}/lists?name=${nombreLista}&key=${apiKey}&token=${token}`,
        {
                headers:{
                    "Accept": "application/json" // quiero serializar a JSON la response
                }
        }); // fin de la request
        const postListaResponse = await postLista.json();
    // Assertions
    expect(postLista.ok).toBeTruthy();
    expect(postLista.status()).toBe(200);
    expect(postListaResponse.name).toBeDefined();
    expect(postListaResponse.name).toBe(nombreLista);
    expect(postListaResponse.id).toBeDefined();
    expect(postListaResponse.idBoard).toBeDefined();
    expect(postListaResponse.idBoard).toBe(idTablero);

    let idLista = postListaResponse.id;

    // Crear la tarjeta
    const nombreTarjeta = faker.lorem.words(4);
    const descTarjeta = faker.lorem.words(15);
    const postTarjeta = await request.post(`/1/cards?idList=${idLista}&key=${apiKey}&token=${token}`,
        {
            data:{
                // request payload
                "name": nombreTarjeta,
                "desc": descTarjeta,
                "pos": "top", // la posiciona a la tarjeta en la cima de la lista
                "idMembers": [idUsuario]
            },
            headers:{
                "Accept": "application/json"
            }
        }); // fin de la request
    const postTarjetaResponse = await postTarjeta.json();

    // Assertions
    expect(postTarjeta.ok).toBeTruthy();
    expect(postTarjeta.status()).toBe(200);
    expect(postTarjetaResponse.id).toBeDefined();
    expect(postTarjetaResponse.idBoard).toBeDefined();
    expect(postTarjetaResponse.idBoard).toBe(idTablero);
    expect(postTarjetaResponse.idList).toBeDefined();
    expect(postTarjetaResponse.idList).toBe(idLista);
    expect(postTarjetaResponse.idMembers).toBeDefined();
    expect((postTarjetaResponse.idMembers)[0]).toBe(idUsuario);
    expect(postTarjetaResponse.subscribed).toBeDefined();
    expect(postTarjetaResponse.subscribed).toBe(true);
    expect(postTarjetaResponse.shortUrl).toBeDefined();
    expect(postTarjetaResponse.url).toBeDefined();
    expect(postTarjetaResponse.url).toContain(postTarjetaResponse.shortUrl);

    console.log(postTarjetaResponse);

}); // fin del test