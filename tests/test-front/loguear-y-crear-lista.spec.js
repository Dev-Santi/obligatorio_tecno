import { test, expect } from "@playwright/test";

const logInURL =
  "https://id.atlassian.com/login?application=trello&continue=https%3A%2F%2Ftrello.com%2Fauth%2Fatlassian%2Fcallback%3Fdisplay%3DeyJ2ZXJpZmljYXRpb25TdHJhdGVneSI6InNvZnQifQ%253D%253D&display=eyJ2ZXJpZmljYXRpb25TdHJhdGVneSI6InNvZnQifQ%3D%3D";

const afterLogInURL = "https://trello.com/u/tallert075/boards";
const boardURL = "https://trello.com/b/gDSmvici/mi-tablero-de-trello";
const logInEmail = "tallert075@gmail.com";
const logInPassword = "a4FTTjZy8v54!UN";
const newListName = `${randomNumber()} - Lista creada desde test FrontEnd`;

/* ------- */

test("Inicio de sesion y creación de lista de tarjetas", async function ({ page }) {
  await page.goto(logInURL);
  expect(page.url()).toBe(logInURL);

  // Log in
  const emailInput = page.getByPlaceholder("Enter your email");
  await emailInput.fill(logInEmail);
  expect(await emailInput.inputValue()).toBe(logInEmail);

  const continueBtn = page.getByText(/^Continue$/);
  await continueBtn.click();
  await expect(continueBtn).toBeHidden();

  const passwordInput = page.getByPlaceholder("Enter password");
  await passwordInput.fill(logInPassword);
  expect(await passwordInput.inputValue()).toBe(logInPassword);

  const logInBtn = page.getByText(/^Log in$/);
  await logInBtn.click();
  await page.waitForURL(afterLogInURL);
  expect(page.url()).toBe(afterLogInURL);

  //Navigating to the dashboard
  const trelloBoardCard = page.getByTitle("Mi tablero de Trello");
  await trelloBoardCard.click();
  await page.waitForURL(boardURL);
  expect(page.url()).toBe(boardURL);

  //Making a new list
  const createNewListBtn = page.getByTestId("list-composer-button");
  await createNewListBtn.click();
  await expect(createNewListBtn).toBeHidden();

  const newListNameInput = page.getByPlaceholder("Enter list title…");
  await newListNameInput.fill(newListName);
  expect(await newListNameInput.inputValue()).toBe(newListName);

  const addListBtn = page.getByText(/^Add list$/);
  await addListBtn.click();
  const newList = page.getByLabel(newListName);
  expect(await newList.innerHTML()).toMatch(newListName);
});

/* ------- */

function randomNumber() {
  return Math.floor(Math.random() * 1000000);
}
