const {expect} = require("@playwright/test");

class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async login(username, password, uiBaseUrl) {
        // Declaración selectores de elementos UI
        const locatorBotonLoginDeLaNavbar = '//a[@data-uuid=\'MJFtCCgVhXrVl7v9HA7EH_login\']';
        const locatorUsernameField = this.page.getByPlaceholder("Enter your email");
        const locatorPasswordField = this.page.getByPlaceholder("Enter password");
        const xpathBotonContinuar = '//button[@id=\'login-submit\']//span[1]';
        const locatorBotonContinuar = this.page.getByText(/^Continue$/);

        // Ejecución del login
        await this.navegarPagina(uiBaseUrl);
        expect(this.page.url()).toBe(uiBaseUrl);
        await this.clickearBoton(locatorBotonLoginDeLaNavbar);

        await this.rellenarCampo(locatorUsernameField, username);
        expect(await locatorUsernameField.inputValue()).toBe(username);
        await this.clickearBoton(xpathBotonContinuar);
        await expect(locatorBotonContinuar).toBeHidden();

        await this.rellenarCampo(locatorPasswordField, password);
        expect(await locatorPasswordField.inputValue()).toBe(password);
        await this.clickearBoton(xpathBotonContinuar);
    }

    async navegarPagina(url){
        await this.page.goto(`${url}`);
    }

    async rellenarCampo(locator, input){
        await locator.fill(`${input}`);
    }

    async clickearBoton(selector){
        await this.page.waitForSelector(`${selector}`);
        await this.page.click(`${selector}`);
    }
}

module.exports = { LoginPage };