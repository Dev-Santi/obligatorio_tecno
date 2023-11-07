const {expect} = require("@playwright/test");

class Tablero {
    constructor(page) {
        this.page = page;
    }

    nombreDeLaLista = this.randomNumber() + " - Lista creada desde test FrontEnd";

    async clickBotonAgregarLista(){
        const createNewListBtn = this.page.getByTestId("list-composer-button");
        await createNewListBtn.click();
        await expect(createNewListBtn).toBeHidden();
    }

    async agregarTituloLista(title){
        const newListNameInput = this.page.getByPlaceholder("Enter list title…");
        await newListNameInput.fill(title);
        expect(await newListNameInput.inputValue()).toBe(title);
    }

    async clickBotonCrearLista(){
        const addListBtn = this.page.getByText(/^Add list$/);
        await addListBtn.click();
    }

    async verificarCreacionListaMedianteTitulo(title){
        const newList = this.page.getByLabel(title);
        expect(await newList.innerHTML()).toBe(title);
    }

    randomNumber() {
        return Math.floor(Math.random() * 1000000);
    }
}

module.exports = { Tablero };