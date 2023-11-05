const { test, expect } = require("@playwright/test");

let apiKey = "77c3e77d0160daa898cc6e67519d291f";
let token = "ATTAbc64b7578a2339528fc4c8614ce5c1529952f979e69bbfcbdb8f74598df30ad6CFA2A0BC";

test("Check Status", async ({ request }) => {
  const response = await request.get(`/1/members/me/boards?key=${apiKey}&token=${token}`);

  expect(response.status()).toBe(200);
});
