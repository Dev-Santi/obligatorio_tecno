import { test, expect } from "@playwright/test";
// test.use({ launchOptions: { slowMo: 2000 } })
// para ejecutar el test en slow motion, descomentar la línea anterior y comentar la línea 35 de este test

// Datos base para el test
const authVariables = require('../../helpers/authVariables');
const userEmail = authVariables.loginEmail;
const password = authVariables.loginPassword;
const uiBaseUrl = authVariables.UIBaseUrl;

// Traer las páginas del POM (Page Object Model)
const { LoginPage } = require('../../pages/Login');
const { UserDashboard } = require('../../pages/Dashboard');
const { Tablero } = require('../../pages/Tablero');

// Le quitamos el @gmail.com al correo electrónico
const username = userEmail.replace("@gmail.com", "");
const encodedUserEmail = username + "%40gmail.com";
const afterLoginUrl =
    "https://id.atlassian.com/login?application=trello&continue=https%3A%2F%2Ftrello.com%2Fauth%2Fatlassian%2Fcallback%3Fdisplay%3DeyJ2ZXJpZmljYXRpb25TdHJhdGVneSI6InNvZnQifQ%253D%253D&display=eyJ2ZXJpZmljYXRpb25TdHJhdGVneSI6InNvZnQifQ%3D%3D"
+ `&email=${encodedUserEmail}`;
const boardsUrl = `https://trello.com/u/${username}/boards`;

const boardURL = "https://trello.com/b/gDSmvici/mi-tablero-de-trello";

  test("Inicio de sesion y creación de lista de tarjetas", async function ({page}) {

    // Login
    // Instanciamos la página del Login
    const loginPage = new LoginPage(page);
    await loginPage.login(userEmail, password, uiBaseUrl);

    // User Dashboard
    const dashboardPage = new UserDashboard(page);
    await dashboardPage.estoyEnElDashboard(afterLoginUrl);

    // Navegar al tablero
    const nombreTablero = "Mi tablero de Trello";
    await dashboardPage.irAlTablero(nombreTablero, boardURL);

    // Crear una nueva lista
    const miTablero = new Tablero(page);
    await miTablero.clickBotonAgregarLista();
    await miTablero.agregarTituloLista(miTablero.nombreDeLaLista);
    await miTablero.clickBotonCrearLista();
    await miTablero.verificarCreacionListaMedianteTitulo(miTablero.nombreDeLaLista);

    await page.waitForTimeout(3000);
  })