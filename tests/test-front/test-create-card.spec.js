import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://trello.com/');
    await page.getByTestId('bignav').getByRole('link', { name: 'Log in' }).click();
    await page.waitForSelector('input#username');
    await page.fill('input#username','tallert075@gmail.com');
    await page.waitForSelector('//button[@id=\'login-submit\']//span[1]');
    await page.click('//button[@id=\'login-submit\']//span[1]');
    await page.waitForSelector('input#password');
    await page.fill('input#password','a4FTTjZy8v54!UN');
    await page.waitForSelector('//button[@id=\'login-submit\']//span[1]');
    await page.click('//button[@id=\'login-submit\']//span[1]');
    await page.getByRole('link', { name: 'Mi tablero de Trello ' }).click();
    await page.waitForSelector('//button[contains(@class,\'frrHNIWnTojsww CSwccJ0PrMROzz\')]');
    await page.click('//button[contains(@class,\'frrHNIWnTojsww CSwccJ0PrMROzz\')]');
    await page.waitForSelector('//form[@class=\'vVqwaYKVgTygrk\']//textarea[1]')
    await page.fill('//form[@class=\'vVqwaYKVgTygrk\']//textarea[1]','test-new-list-front');
    await page.getByTestId('list-composer-add-list-button').click();
});

