const { test, expect } = require("@playwright/test");
// incluir los valores de autentificación
const authVariables = require('../helpers/authVariables');
const apiKey = authVariables.apiKey;
const token = authVariables.token;

test("Check Status", async ({ request }) => {
  const response = await request.get(
    `/1/members/me/boards?key=${apiKey}&token=${token}`
  );

  console.log(response);

  expect(response.status()).toBe(200);
});
