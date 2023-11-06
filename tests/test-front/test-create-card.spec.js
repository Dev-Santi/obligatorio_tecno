import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://trello.com/');
    await page.getByTestId('bignav').getByRole('link', { name: 'Log in' }).click();
    await page.getByTestId('username').fill('tallert075@gmail.com');
    await page.getByTestId('form-login').getByRole('button', { name: 'Continuar' }).click();
    await page.getByTestId('password').fill('a4FTTjZy8v54!UN');
    await page.getByTestId('signup-submit', { name: 'Iniciar sesión' }).click();
    await page.getByRole('link', { name: 'Mi tablero de Trello ' }).click();
    await page.getByTestId('list-composer-button').click();
    await page.getByPlaceholder('Introduzca el título de la lista...').fill('test-new-list-front');
    await page.getByTestId('list-composer-add-list-button').click();
    await page.locator('li').filter({ hasText: 'test-new-list-fronttest-new-list-frontAñada una tarjeta' }).getByTestId('list-add-card-button').click();
    await page.getByTestId('list-card-composer-textarea').fill('test-new-card-front');
    await page.getByTestId('list-card-composer-add-card-button').click();
});